const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BLINK_BASE = process.env.BLINK_ENV === 'production'
  ? 'https://debit.blinkpay.co.nz'
  : 'https://sandbox.debit.blinkpay.co.nz'

let cachedToken = null
let tokenExpiry  = 0

async function getBlinkToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const res = await fetch(`${BLINK_BASE}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env.BLINK_CLIENT_ID,
      client_secret: process.env.BLINK_CLIENT_SECRET,
    }).toString(),
  })

  if (!res.ok) throw new Error(`Blink auth failed: ${res.status}`)

  const data   = await res.json()
  cachedToken  = data.access_token
  tokenExpiry  = Date.now() + (data.expires_in - 300) * 1000
  return cachedToken
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const token = event.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not logged in' }) }
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session' }) }
  }

  let body
  try { body = JSON.parse(event.body || '{}') }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) } }

  const { quick_payment_id, fee_id } = body

  if (!quick_payment_id || !fee_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'quick_payment_id and fee_id required' }) }
  }

  // Verify the fee belongs to this member
  const { data: fee } = await supabase
    .from('fees')
    .select('id, member_id, paid, blink_payment_id')
    .eq('id', fee_id)
    .eq('member_id', user.id)
    .single()

  if (!fee) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Fee not found' }) }
  }

  // Already marked paid (e.g. page refreshed) — return immediately
  if (fee.paid) {
    return {
      statusCode: 200,
      body: JSON.stringify({ paid: true, status: 'AcceptedSettlementCompleted' }),
    }
  }

  // Check status with Blink
  let blinkToken
  try { blinkToken = await getBlinkToken() }
  catch { return { statusCode: 502, body: JSON.stringify({ error: 'Payment service unavailable' }) } }

  const blinkRes = await fetch(`${BLINK_BASE}/payments/v1/quick-payments/${quick_payment_id}`, {
    headers: { 'Authorization': `Bearer ${blinkToken}` },
  })

  if (!blinkRes.ok) {
    return { statusCode: 502, body: JSON.stringify({ error: 'Could not check payment status' }) }
  }

  const data    = await blinkRes.json()
  const payment = data.consent?.payments?.[0]
  const status  = payment?.status || 'Pending'

  // AcceptedSettlementInProcess = bank accepted, payment in flight (safe to mark paid)
  // AcceptedSettlementCompleted = funds fully settled
  const isPaid = status === 'AcceptedSettlementInProcess' || status === 'AcceptedSettlementCompleted'

  if (isPaid) {
    await supabase
      .from('fees')
      .update({
        paid:             true,
        paid_date:        new Date().toISOString().split('T')[0],
        blink_payment_id: quick_payment_id,
      })
      .eq('id', fee_id)
      .eq('member_id', user.id)
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paid: isPaid, status }),
  }
}

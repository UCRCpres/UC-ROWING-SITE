const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BLINK_BASE = process.env.BLINK_ENV === 'production'
  ? 'https://debit.blinkpay.co.nz'
  : 'https://sandbox.debit.blinkpay.co.nz'

// Module-level token cache — persists across warm function invocations
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

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Blink auth failed (${res.status}): ${text}`)
  }

  const data   = await res.json()
  cachedToken  = data.access_token
  tokenExpiry  = Date.now() + (data.expires_in - 300) * 1000 // Refresh 5 min early
  return cachedToken
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  // Verify the member is logged in
  const token = event.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Not logged in' }) }
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session — please log in again' }) }
  }

  let body
  try { body = JSON.parse(event.body || '{}') }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) } }

  const { fee_id, fee_type_id } = body
  const origin = 'https://ucrowing.com'

  let feeId, feeName, feeAmount

  if (fee_id) {
    // Required assigned fee — verify it belongs to this member
    const { data: fee } = await supabase
      .from('fees')
      .select('*')
      .eq('id', fee_id)
      .eq('member_id', user.id)
      .single()

    if (!fee) return { statusCode: 404, body: JSON.stringify({ error: 'Fee not found' }) }
    if (fee.paid) return { statusCode: 400, body: JSON.stringify({ error: 'This fee has already been paid' }) }

    feeId     = fee.id
    feeName   = fee.fee_name
    feeAmount = fee.amount

  } else if (fee_type_id) {
    // Optional fee
    const { data: feeType } = await supabase
      .from('fee_types')
      .select('*')
      .eq('id', fee_type_id)
      .eq('is_optional', true)
      .single()

    if (!feeType) return { statusCode: 404, body: JSON.stringify({ error: 'Fee not found' }) }

    feeName   = feeType.name
    feeAmount = feeType.amount

    // Re-use an existing unpaid record (from a previous abandoned attempt) or create a new one
    const { data: existing } = await supabase
      .from('fees')
      .select('id, paid')
      .eq('member_id', user.id)
      .eq('fee_type_id', fee_type_id)
      .single()

    if (existing?.paid) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Already paid' }) }
    }

    if (existing) {
      feeId = existing.id
    } else {
      const { data: newFee, error: insertErr } = await supabase
        .from('fees')
        .insert({
          member_id:   user.id,
          fee_type_id: fee_type_id,
          fee_name:    feeType.name,
          amount:      feeType.amount,
          due_date:    feeType.due_date || null,
          paid:        false,
        })
        .select()
        .single()

      if (insertErr) {
        return { statusCode: 500, body: JSON.stringify({ error: insertErr.message }) }
      }
      feeId = newFee.id
    }

  } else {
    return { statusCode: 400, body: JSON.stringify({ error: 'fee_id or fee_type_id required' }) }
  }

  // Get Blink access token
  let blinkToken
  try {
    blinkToken = await getBlinkToken()
  } catch (err) {
    console.error('Blink token error:', err)
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Payment service unavailable — ' + err.message }) }
  }

  // PCR fields — these appear on the bank statement
  const pcrCode = feeName.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 12)

  const blinkRes = await fetch(`${BLINK_BASE}/payments/v1/quick-payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${blinkToken}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      flow: {
        detail: {
          type:         'gateway',
          redirect_uri: `${origin}/payment-success.html`,
        },
      },
      amount: {
        currency: 'NZD',
        total:    Number(feeAmount).toFixed(2),
      },
      pcr: {
        particulars: 'UC Rowing',
        code:        pcrCode,
        reference:   'Fee payment',
      },
    }),
  })

  const payment = await blinkRes.json()

  if (!blinkRes.ok || !payment.quick_payment_id) {
    console.error('Blink quick-payment creation failed:', JSON.stringify(payment))
    return { statusCode: 502, body: JSON.stringify({ error: 'Payment setup failed' }) }
  }

  // Save the quick_payment_id so we can check status on return
  await supabase
    .from('fees')
    .update({ blink_payment_id: payment.quick_payment_id })
    .eq('id', feeId)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url:              payment.redirect_uri,
      quick_payment_id: payment.quick_payment_id,
      fee_id:           feeId,
    }),
  }
}

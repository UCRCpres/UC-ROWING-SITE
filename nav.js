// ─────────────────────────────────────────────────────────────────────────────
// nav.js — Shared navigation, footer, and login modal
//
// This file runs on every public page. Edit it once and changes appear
// everywhere automatically.
//
// HOW IT WORKS:
// Each HTML page has two placeholder divs:
//   <div id="nav-placeholder" data-active="PageName"></div>
//   <div id="footer-placeholder"></div>
// On load, this script checks if the visitor is logged in, then replaces those
// placeholders with the right nav (different links for logged-in vs logged-out),
// the footer, and a hidden login modal that pops up when needed.
//
// LOGGED OUT NAV:  Home · About · Join · Events · Gallery · Contact · Members Login
// LOGGED IN NAV:   Home · About · Join · Events · Gallery · Contact · Forms · Logout
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from './supabase.js'

// ── NAV PAGES ──────────────────────────────────────────────────────────────
// To add a page to the nav: add a new { href, label } line here.
// To remove a page: delete its line.
const basePages = [
  { href: 'index.html', label: 'Home' },
  { href: 'about.html', label: 'About' },
  { href: 'join.html',  label: 'Join' },
  { href: 'events.html', label: 'Events' },
  { href: 'news.html',   label: 'News' },
  { href: 'gallery.html', label: 'Gallery' },
  { href: 'contact.html', label: 'Contact' },
]

function buildNav(active, isLoggedIn, isAdmin = false) {
  const links = basePages.map(p => {
    const cls = p.label === active ? ' class="active"' : ''
    return `<li><a href="${p.href}"${cls}>${p.label}</a></li>`
  })

  if (isLoggedIn) {
    // Logged-in members see Fees and Forms links (gold) and a Logout button
    const feesCls  = active === 'Fees'  ? ' class="active"' : ''
    const formsCls = active === 'Forms' ? ' class="active"' : ''
    links.push(`<li><a href="fees.html"${feesCls} style="color:var(--gold);">Fees</a></li>`)
    links.push(`<li><a href="forms.html"${formsCls} style="color:var(--gold);">Forms</a></li>`)
    // Admins also see an Admin link
    if (isAdmin) {
      links.push(`<li><a href="admin.html" style="color:var(--gold);">Admin</a></li>`)
    }
    links.push(`<li><a href="#" id="nav-logout-btn" style="color:rgba(255,255,255,0.55);">Logout</a></li>`)
  } else {
    // Logged-out visitors see a gold "Members Login" link that opens the modal
    links.push(`<li><a href="#" id="nav-login-btn" style="color:var(--gold);">Members Login</a></li>`)
  }

  return `
  <nav>
    <div class="nav-inner">
      <a href="index.html" class="nav-logo"><img src="general_photos_and_logos/logo.png" alt="UC Rowing Club" style="height:38px;width:auto;display:block;"></a>
      <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links">${links.join('')}</ul>
    </div>
  </nav>`
}

function buildFooter() {
  // UPDATE EACH JANUARY: change the copyright year.
  // UPDATE if social media links change.
  return `
  <footer>
    <div class="footer-inner">
      <div>
        <div class="footer-brand"><span>UC</span> Rowing Club</div>
        <p class="footer-tagline">For students, by students.<br>Competing at the highest level since 1929.</p>
      </div>
      <div>
        <div class="footer-col-title">Connect</div>
        <ul class="footer-links">
          <li><a href="https://www.instagram.com/UCROWINGCLUB" target="_blank">Instagram</a></li>
          <li><a href="https://www.facebook.com/groups/1440492173592829" target="_blank">Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 UC Rowing Club. All rights reserved.</div>
      <div class="footer-uc">University of Canterbury</div>
    </div>
  </footer>`
}

function buildLoginModal() {
  // This modal is injected into every page's DOM so it can appear anywhere.
  // It is hidden by default (display:none) and shown by openLoginModal().
  return `
  <div id="login-modal-overlay">
    <div class="login-box">
      <button id="login-modal-close">✕</button>
      <div class="login-logo"><span>UC</span> Rowing Club</div>
      <div class="login-subtitle">Members area</div>

      <div class="tab-row">
        <button class="tab-btn active" onclick="loginSwitchTab('login', this)">Log in</button>
        <button class="tab-btn" onclick="loginSwitchTab('signup', this)">Sign up</button>
        <button class="tab-btn" onclick="loginSwitchTab('reset', this)">Reset password</button>
      </div>

      <!-- LOG IN TAB -->
      <div id="modal-tab-login" class="tab-panel active">
        <div class="error-msg" id="modal-login-error"></div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="modal-login-email" placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="modal-login-password" placeholder="••••••••">
        </div>
        <div class="spinner" id="modal-login-spinner">Logging in...</div>
        <button class="btn-primary btn-full" onclick="modalHandleLogin()">Log in</button>
      </div>

      <!-- SIGN UP TAB -->
      <div id="modal-tab-signup" class="tab-panel">
        <p style="font-family:Arial,sans-serif;font-size:12px;color:var(--gray-mid);line-height:1.6;background:var(--gray-light);border-left:3px solid var(--gold);padding:0.65rem 0.85rem;margin-bottom:1rem;">
          This account is for <strong>existing UCRC members</strong> only. Not a member yet? <a href="join.html" style="color:var(--maroon);">Join the club first</a>.
        </p>
        <div class="error-msg" id="modal-signup-error"></div>
        <div class="success-msg" id="modal-signup-success">Check your email to confirm your account, then log in.</div>
        <div class="form-group">
          <label>Full name</label>
          <input type="text" id="modal-signup-name" placeholder="Jane Smith">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="modal-signup-email" placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" id="modal-signup-phone" placeholder="021 000 0000">
        </div>
        <div class="form-group">
          <label>Student ID</label>
          <input type="text" id="modal-signup-studentid" placeholder="e.g. 12345678">
        </div>
        <div class="form-group">
          <label>Year of study</label>
          <select id="modal-signup-year">
            <option value="">Select...</option>
            <option>1st year</option>
            <option>2nd year</option>
            <option>3rd year</option>
            <option>4th year</option>
            <option>Postgraduate</option>
            <option>Staff / other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="modal-signup-password" placeholder="At least 8 characters">
        </div>
        <div class="spinner" id="modal-signup-spinner">Creating account...</div>
        <button class="btn-primary btn-full" onclick="modalHandleSignup()">Create account</button>
      </div>

      <!-- RESET PASSWORD TAB -->
      <div id="modal-tab-reset" class="tab-panel">
        <div class="error-msg" id="modal-reset-error"></div>
        <div class="success-msg" id="modal-reset-success">Password reset email sent — check your inbox.</div>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" id="modal-reset-email" placeholder="your@email.com">
        </div>
        <div class="spinner" id="modal-reset-spinner">Sending...</div>
        <button class="btn-primary btn-full" onclick="modalHandleReset()">Send reset email</button>
      </div>
    </div>
  </div>`
}

// ── MODAL OPEN / CLOSE ─────────────────────────────────────────────────────

window.openLoginModal = function() {
  const overlay = document.getElementById('login-modal-overlay')
  if (overlay) {
    overlay.style.display = 'flex'
    document.body.style.overflow = 'hidden'
  }
}

function closeLoginModal() {
  const overlay = document.getElementById('login-modal-overlay')
  if (overlay) {
    overlay.style.display = 'none'
    document.body.style.overflow = ''
  }
}

// Switches between Log in / Sign up / Reset tabs — scoped to the modal only
// so it doesn't accidentally affect any other tabs on the page.
window.loginSwitchTab = function(name, btn) {
  const modal = document.getElementById('login-modal-overlay')
  if (!modal) return
  modal.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
  modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.getElementById('modal-tab-' + name).classList.add('active')
  btn.classList.add('active')
}

// ── AUTH HANDLERS ──────────────────────────────────────────────────────────

window.modalHandleLogin = async function() {
  const email    = document.getElementById('modal-login-email').value
  const password = document.getElementById('modal-login-password').value
  const err      = document.getElementById('modal-login-error')
  const spinner  = document.getElementById('modal-login-spinner')
  err.style.display = 'none'
  spinner.style.display = 'block'

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  spinner.style.display = 'none'

  if (error) {
    err.textContent = error.message
    err.style.display = 'block'
  } else {
    // After login, always go to the Forms page
    closeLoginModal()
    window.location.href = 'forms.html'
  }
}

window.modalHandleSignup = async function() {
  const name     = document.getElementById('modal-signup-name').value
  const email    = document.getElementById('modal-signup-email').value
  const password = document.getElementById('modal-signup-password').value
  const phone     = document.getElementById('modal-signup-phone').value
  const studentId = document.getElementById('modal-signup-studentid').value.trim()
  const year      = document.getElementById('modal-signup-year').value
  const err      = document.getElementById('modal-signup-error')
  const success  = document.getElementById('modal-signup-success')
  const spinner  = document.getElementById('modal-signup-spinner')
  err.style.display = 'none'
  spinner.style.display = 'block'

  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  })
  spinner.style.display = 'none'

  if (error) {
    err.textContent = error.message
    err.style.display = 'block'
    return
  }

  // Create the member profile row in the database
  if (data.user) {
    await supabase.from('members').insert({
      id: data.user.id,
      email,
      full_name: name,
      phone,
      student_id: studentId || null,
      year_of_study: year
    })
  }
  success.style.display = 'block'
}

window.modalHandleReset = async function() {
  const email   = document.getElementById('modal-reset-email').value
  const err     = document.getElementById('modal-reset-error')
  const success = document.getElementById('modal-reset-success')
  const spinner = document.getElementById('modal-reset-spinner')
  err.style.display = 'none'
  spinner.style.display = 'block'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/index.html'
  })
  spinner.style.display = 'none'

  if (error) {
    err.textContent = error.message
    err.style.display = 'block'
  } else {
    success.style.display = 'block'
  }
}

// ── INIT ───────────────────────────────────────────────────────────────────

// Check if the visitor is logged in (reads from localStorage — no network call)
const { data: { session } } = await supabase.auth.getSession()
const isLoggedIn = !!session

// Check admin status — only runs if logged in
let isAdmin = false
if (isLoggedIn) {
  const { data: memberRow } = await supabase
    .from('members')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()
  isAdmin = memberRow?.is_admin === true
}

// Inject nav
const navEl = document.getElementById('nav-placeholder')
const active = navEl?.dataset.active || ''
if (navEl) navEl.outerHTML = buildNav(active, isLoggedIn, isAdmin)

// Inject footer
const footerEl = document.getElementById('footer-placeholder')
if (footerEl) footerEl.outerHTML = buildFooter()

// Inject the login modal into the page (hidden by default)
document.body.insertAdjacentHTML('beforeend', buildLoginModal())

// Wire up the Members Login / Logout nav buttons
document.querySelector('#nav-login-btn')?.addEventListener('click', e => {
  e.preventDefault()
  window.openLoginModal()
})

document.querySelector('#nav-logout-btn')?.addEventListener('click', async e => {
  e.preventDefault()
  await supabase.auth.signOut()
  window.location.href = 'index.html'
})

// Hamburger menu (mobile)
document.addEventListener('click', function(e) {
  const btn  = e.target.closest('.nav-hamburger')
  const link = e.target.closest('.nav-links a')
  const nav  = document.querySelector('nav')
  if (!nav) return
  if (btn) {
    const open = nav.classList.toggle('nav-open')
    btn.setAttribute('aria-expanded', open)
  } else if (link) {
    nav.classList.remove('nav-open')
  } else if (!e.target.closest('nav') && !e.target.closest('#login-modal-overlay')) {
    nav.classList.remove('nav-open')
  }
})

// Close modal: click the ✕ button or click the dark backdrop
document.addEventListener('click', e => {
  if (e.target.id === 'login-modal-close') closeLoginModal()
  if (e.target.id === 'login-modal-overlay') closeLoginModal()
})

// Keyboard shortcuts for the modal
document.addEventListener('keydown', e => {
  const overlay  = document.getElementById('login-modal-overlay')
  const isOpen   = overlay?.style.display === 'flex'
  if (!isOpen) return

  if (e.key === 'Escape') {
    closeLoginModal()
  } else if (e.key === 'Enter') {
    const activePanel = overlay.querySelector('.tab-panel.active')
    if (activePanel?.id === 'modal-tab-login')  window.modalHandleLogin()
    if (activePanel?.id === 'modal-tab-signup') window.modalHandleSignup()
    if (activePanel?.id === 'modal-tab-reset')  window.modalHandleReset()
  }
})
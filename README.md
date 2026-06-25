# UC Rowing Club Website — Handover Guide

This guide is for whoever is running the website next. You don't need to know how to code — just follow the steps here and you'll be fine. If you get stuck, open a new chat with Claude at claude.ai and paste this whole file in — it will have full context of the project.

---

## What this website is

A static website hosted for free on **Netlify**, connected to a database called **Supabase** for the members portal. All the files live in a **GitHub** repository.

**Live site:** `ucrowing.com`

**GitHub repo:** `https://github.com/UCRCpres/UC-ROWING-SITE`

---

## The three services — what they do

| Service | What it does | Website |
|---|---|---|
| **GitHub** | Stores all the website files. Edit here → site updates | github.com |
| **Netlify** | Hosts the live website. Watches GitHub and auto-deploys | netlify.com |
| **Supabase** | The members database — login, fees, forms, exec team photos | supabase.com |
| **Cloudflare** | Manages the domain DNS for ucrowing.com | cloudflare.com |

All services use the **club email** to log in. Do not use personal emails — access needs to survive the handover each year.

---

## How editing works

1. Open the file you want to change in **VS Code**
2. Make your edits and save
3. Go to the **Source Control panel** (left sidebar, branch icon)
4. Write a short message about what you changed (e.g. "Updated committee names")
5. Click the dropdown arrow next to Commit → **Commit & Push**
6. Netlify automatically rebuilds the site — takes about 30 seconds

That's it. No servers, no command line needed.

### If the build fails on Netlify
1. Go to netlify.com → your site → **Deploys**
2. Click the failed deploy to see the error message
3. It's usually a typo in the HTML — open that file in VS Code, fix it, and push again

---

## File map — what does what

| File | What it controls |
|---|---|
| `index.html` | Home page — hero photo, stats, quick links |
| `about.html` | About the club + history + notable alumni |
| `contact.html` | Contact info + exec team (managed via website edit mode) |
| `events.html` | Race calendar and regattas |
| `gallery.html` | Photo gallery |
| `join.html` | Join the club page |
| `news.html` | Club news — admins can add/edit/delete posts via edit mode |
| `fees.html` | Members-only fees page — shows outstanding fees and payment history |
| `forms.html` | Google Forms embeds (join + regatta registration) |
| `login.html` | Member login / signup (legacy fallback — login is now a modal) |
| `dashboard.html` | Legacy member dashboard — currently unused |
| `admin.html` | Admin panel for committee |
| `style.css` | All colours, fonts, spacing — edit this to change the look sitewide |
| `nav.js` | Navigation bar, footer, and login modal — edit once, updates every page |
| `supabase.js` | Supabase connection config — don't touch unless credentials change |
| `netlify.toml` | Netlify config — handles clean URLs (don't touch) |

### Photo folders

| Folder | What's in it |
|---|---|
| `general_photos_and_logos/` | Hero photo, sponsor logos, club logo, background images |
| `Profile_Pics/` | Legacy committee headshots (exec team photos are now stored in Supabase) |

---

## Things to update every year

### 1. Exec team (contact.html)

The exec team is managed directly on the website — no code editing needed.

1. Log in as an admin
2. Go to the **Contact** page
3. Click **✎ Edit page**
4. Use **✎** on each card to edit name, role, or photo
5. Use **＋ Add member** to add someone new — upload a photo and use the crop tool to frame it
6. Use **↑ ↓** to reorder, **×** to remove
7. Changes save immediately

Also update the year label — search for `2026 Committee` in `contact.html` and change it to the current year.

### 2. Events / race calendar (`events.html`)

Update the dates, venues, and results for the new season. Each event block has a date box, event name, and location — just change the text.

### 3. Homepage stats (`index.html`)

Three stats sit on the hero — active members, Hebberley Shield wins, and founded year. Update member count each season.

### 4. Sponsor logos

Sponsor logos live in `general_photos_and_logos/`. To update:
- Add the new logo file to that folder
- Find the old `<img src="general_photos_and_logos/OLDLOGO.png">` and update the filename

### 5. Hero photo (`index.html`)

The homepage background photo is `general_photos_and_logos/hero.jpg`. To replace it:
- Add your new photo to the folder, name it `hero.jpg` — this overwrites the old one
- Or name it something else and update this line in `index.html`: `background-image: url('general_photos_and_logos/hero.jpg');`

### 6. Google Forms (join + regatta registration)

The forms page embeds Google Forms. If you create new forms each year:
1. Go to the form in Google Forms → Send → `< >` embed tab → copy the iframe code
2. Open `forms.html` in VS Code
3. Find the old `<iframe src="https://docs.google.com/forms/...">` and replace it with the new one

### 7. Update this README

Update this file with the current live URL, GitHub repo link, and any new services added.

---

## How to add photos to the gallery (`gallery.html`)

1. Resize your photo first — aim for under 500KB. Use [Squoosh](https://squoosh.app) (free, in the browser)
2. Log in as admin, go to the **Gallery** page, click **✎ Edit page**
3. Click the **＋** tile to upload directly from your computer
4. Add a caption if you want, then close edit mode

---

## How to add a new page

1. Copy an existing simple page like `contact.html`
2. Rename it (e.g. `results.html`)
3. Change the content inside `<main>...</main>`
4. Update the `data-active` attribute at the top: `<div id="nav-placeholder" data-active="Results"></div>`
5. Add it to the nav in `nav.js` — find the `pages` array and add a new line:
   `{ href: 'results.html', label: 'Results' },`

---

## Colours and fonts

Everything is in `style.css`. The colour variables are at the very top:

```css
--maroon: #6B1E3E;
--gold: #E8A020;
```

Change these and every page updates automatically.

---

## Domain name

**Domain:** `ucrowing.com`
**Registered at:** Cloudflare (cloudflare.com) — login with club email
**Renews:** annually — roughly $12–15 USD/year
**DNS:** Managed by Cloudflare, pointed to Netlify

Set a calendar reminder 1 month before expiry or it will lapse and someone else can buy it. When you renew, just pay the annual fee in Cloudflare — no other action needed.

If the domain ever stops working:
1. Log into Cloudflare → `ucrowing.com` → DNS
2. Check the A record points to `75.2.60.5` and the CNAME for `www` points to the Netlify subdomain
3. Check both are set to DNS only (grey cloud), not proxied

---

## Club motto

**Bleed Maroon.**

---

## Members portal (Supabase)

*See separate Supabase handover notes for full detail.*

### What it does
Members sign up via the login modal on any page, see their fees on `fees.html`, fill in forms on `forms.html`, and admins manage everything from `admin.html`.

### At the start of each season
- Go to Supabase → Table Editor → `fees` and assign fees for all members (or use the Fees tab in the admin panel)
- Go to `form_completions` and add the forms members need to complete
- Consider archiving last year's paid fee rounds using the Archive tab in the admin panel
- Set inactive members to `is_active = false` so they stop appearing in fee assignment

### Making someone admin
Go to Admin panel → Members tab → click ⋮ next to their name → Edit member → toggle Admin on.

### Database tables

| Table | What it stores |
|---|---|
| `members` | Member profiles — name, email, phone, student ID, year of study, admin status, active status |
| `fees` | Fees assigned to each member — amount, due date, paid status, member name snapshot |
| `fee_types` | Reusable fee templates — name, description, amount, optional/required, custom amounts flag |
| `fee_archives` | Archived completed fee rounds — grouped by fee name, preserved permanently |
| `form_completions` | Forms assigned to each member — name, completed status |
| `form_tabs` | Config for the tabs on the forms page |
| `news_posts` | Club news articles |
| `events` | Club events — auto-split into upcoming/past by date |
| `gallery_photos` | Photo metadata — actual files in Supabase Storage bucket `gallery` |
| `exec_team` | Exec team members shown on the Contact page — name, role, photo URL, sort order |

### Supabase Storage buckets

| Bucket | What's in it |
|---|---|
| `gallery` | Gallery photo files |
| `exec-photos` | Exec team profile photos (cropped square JPEGs) |

---

## Blink Pay (online fee payments)

Members can pay fees online through Blink Pay (NZ internet banking). The integration runs as a Netlify serverless function.

### How it works

1. Member clicks "Pay now" on `fees.html`
2. `fees.html` calls `/.netlify/functions/create-blink-payment` with the fee ID and a Supabase auth token
3. The function verifies the member's session, fetches the fee amount, and calls the Blink Pay API to create a quick payment
4. Blink returns a `redirect_uri` — the member is sent there to complete payment via their bank
5. After payment, Blink redirects back to `payment-success.html`
6. `payment-success.html` polls the same Netlify function to confirm the payment status, then marks the fee as paid in Supabase

### Files

| File | Purpose |
|---|---|
| `netlify/functions/create-blink-payment.js` | Creates the Blink quick payment and confirms status on return |
| `payment-success.html` | Landing page after the member pays — confirms and marks fee paid |

### Environment variables (set in Netlify → Site settings → Environment variables)

| Variable | Value |
|---|---|
| `BLINK_ENV` | `sandbox` (test) or `production` (live) |
| `BLINK_CLIENT_ID` | From Blink Pay dashboard |
| `BLINK_CLIENT_SECRET` | From Blink Pay dashboard |
| `SUPABASE_URL` | `https://rdwzgpcynydkpvkhandc.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase → Settings → API → service_role key |

### Switching to production

1. Register the club at [blinkpay.co.nz](https://blinkpay.co.nz) to get production credentials
2. In Netlify → Environment variables, update `BLINK_CLIENT_ID` and `BLINK_CLIENT_SECRET` with production values
3. Change `BLINK_ENV` from `sandbox` to `production`
4. Redeploy (push any small change to trigger a new build)

**Sandbox API base:** `https://sandbox.debit.blinkpay.co.nz`
**Production API base:** `https://debit.blinkpay.co.nz`

The function caches the Blink OAuth token in memory (refreshes 5 min before expiry) to avoid rate limits on warm Lambda invocations.

---

## Accounts to hand over

| Service | Purpose | How to hand over |
|---|---|---|
| **GitHub** | All website files | Invite new president as collaborator on the repo |
| **Netlify** | Hosting | Log in via club email, hand over club email credentials |
| **Supabase** | Members database | Invite to UC Rowing Club org, give Owner role |
| **Cloudflare** | Domain DNS management | Hand over club email credentials |
| **Google** | Club Gmail + Google Forms | Hand over club email credentials |

**Always use the club email, not personal emails.** If a president uses their personal email and leaves, you lose access.

---

## Social media links

Update these in `nav.js` inside the `buildFooter()` function when handles change:

- **Instagram:** @UCROWINGCLUB
- **Facebook group:** https://www.facebook.com/groups/1440492173592829
- **Facebook page:** https://www.facebook.com/University-of-Canterbury-Rowing-Club-389128845186777

---

## If you get stuck

Open **claude.ai**, start a new chat, paste this entire README in, and describe your problem. Claude will have full context of the project and can walk you through it or write the code for you.

This website was originally built by **Sam Wilson** (President 2026). Sam knows how everything fits together and is happy to help:

- 📱 027 514 0747
- ✉️ samwilson135135@gmail.com

Bleed Maroon 🩸🩸

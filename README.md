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
| **Supabase** | The members database — login, fees, forms | supabase.com |
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
| `contact.html` | Contact info + exec team committee cards |
| `events.html` | Race calendar and regattas |
| `gallery.html` | Photo gallery |
| `join.html` | Join the club page |
| `forms.html` | Google Forms embeds (join + regatta registration) |
| `login.html` | Member login / signup |
| `dashboard.html` | Member dashboard (fees, forms status) |
| `admin.html` | Admin panel for committee |
| `style.css` | All colours, fonts, spacing — edit this to change the look sitewide |
| `nav.js` | Navigation bar and footer — edit once, updates every page |
| `supabase.js` | Supabase connection config — don't touch unless credentials change |
| `netlify.toml` | Netlify config — handles clean URLs (don't touch) |

### Photo folders

| Folder | What's in it |
|---|---|
| `general_photos_and_logos/` | Hero photo, sponsor logos, club logo, background images |
| `Profile_Pics/` | Committee headshots |

---

## Things to update every year

### 1. Committee cards (`contact.html`)

Find the section starting with `<!-- COMMITTEE -->`. Each card looks like this:

```html
<div class="committee-card">
  <div class="committee-photo"><img src="Profile_Pics/sam.jpg" alt="Sam Wilson"></div>
  <div class="committee-info">
    <div class="committee-role">President</div>
    <div class="committee-name">Sam Wilson</div>
  </div>
</div>
```

- Change the name and role to the new person
- Add their photo to the `Profile_Pics/` folder and update the `src` path
- If there's no photo yet, use the placeholder block:

```html
<div class="committee-photo">
  <div class="committee-photo-placeholder">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
  </div>
</div>
```

Also update the year label — search for `2026 Committee` and change it to the current year.

### 2. Events / race calendar (`events.html`)

Update the dates, venues, and results for the new season. Each event block has a date box, event name, and location — just change the text.

### 3. Homepage stats (`index.html`)

Three stats sit on the hero — active members, Hebberley Shield wins, and founded year. Update member count each season.

### 4. Sponsor logos

Sponsor logos live in `general_photos_and_logos/`. To update:
- Add the new logo file to that folder
- Find the old `<img src="general_photos_and_logos/OLDLOGO.png">` in `sponsors.html` and update the filename

### 5. Hero photo (`index.html`)

The homepage background photo is `general_photos_and_logos/hero.jpg`. To replace it:
- Add your new photo to the folder, name it `hero.jpg` — this overwrites the old one
- Or name it something else and update this line in `index.html`: `background-image: url('general_photos_and_logos/hero.jpg');`

### 6. Google Forms (join + regatta registration)

The forms page embeds Google Forms. If you create new forms each year:
1. Go to the form in Google Forms → Send → `< >` embed tab → copy the iframe code
2. Open `forms.html` in VS Code
3. Find the old `<iframe src="https://docs.google.com/forms/...">` and replace it with the new one

### 7. Update the README

Update this file with the current live URL, GitHub repo link, and any new services added.

---

## How to add photos to the gallery (`gallery.html`)

1. Resize your photo first — aim for under 500KB. Use [Squoosh](https://squoosh.app) (free, in the browser)
2. Add the photo to the `general_photos_and_logos/` folder in VS Code
3. Open `gallery.html` and find the gallery grid
4. Copy one of the existing blocks and update the filename:

```html
<div class="gallery-item">
  <img src="general_photos_and_logos/yourphoto.jpg" style="width:100%;height:100%;object-fit:cover;">
</div>
```

5. Save and commit

---

## How to add a committee photo

1. Get a headshot — portrait, head and shoulders works best
2. Rename it `firstname_lastname.jpg` (e.g. `sam_wilson.jpg`)
3. Drop it into the `Profile_Pics/` folder
4. In `contact.html` find that person's card and update the `src`:

```html
<img src="Profile_Pics/sam_wilson.jpg" alt="Sam Wilson">
```

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
Members sign up at `login.html`, see their fees and forms on `dashboard.html`, and admins manage everything from `admin.html`.

### At the start of each season
- Go to Supabase → Table Editor → `fees` and add fees for all members
- Go to `form_completions` and add the forms members need to complete
- Consider archiving or clearing last year's completed records

### Making someone admin
Go to Supabase → Table Editor → `members` → find their row → set `is_admin` to `true`.

### Database tables
| Table | What it stores |
|---|---|
| `members` | Member profiles — name, email, year of study, admin status |
| `fees` | Fees assigned to each member — amount, due date, paid status |
| `form_completions` | Forms assigned to each member — name, completed status |

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

Update these in `nav.js` inside the `getFooter()` function when handles change:

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

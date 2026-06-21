# UC Rowing Club Website — Project Instructions for Claude

## What this project is

This is the official website for the **University of Canterbury Rowing Club (UCRC)**, a student-run sports club based in Christchurch, New Zealand. The website is built and maintained by the club president and committee, with help from Claude.

The person giving instructions is **Sam Wilson**, current club president. Sam is not a developer — instructions will be given in plain English and Claude should handle all the code.

---

## Tech stack

| Thing | What it is | Where |
|---|---|---|
| Website files | Plain HTML, CSS, JavaScript | GitHub repo: `UCRCpres/UC-ROWING-SITE` |
| Hosting | Netlify (free) | `mellow-nasturtium-c24034.netlify.app` |
| Database + auth | Supabase (free) | Project ID: `rdwzgpcynydkpvkhandc` |
| Forms | Google Forms (embedded) | Managed via forms.html edit mode |
| Code editor | VS Code | Connected to GitHub via built-in Git |

**Deployment flow:** Edit files in VS Code → commit via Source Control panel → Netlify auto-deploys in ~30 seconds.

---

## Site structure

All files live at the root level of the repo — no subfolders.

| File | Page |
|---|---|
| `index.html` | Home page — hero photo, quick links |
| `about.html` | About the club + history + committee |
| `join.html` | Join the club — Google Form embed + code of conduct |
| `events.html` | Race calendar and regattas |
| `gallery.html` | Photo gallery |
| `contact.html` | Contact form + details |
| `news.html` | Public news page — admins can add/edit/delete posts via Edit mode |
| `forms.html` | Members-only tabbed form embeds — admins can add/edit/delete tabs via Edit mode |
| `login.html` | Standalone login page (legacy fallback — login is now a modal overlay) |
| `dashboard.html` | Legacy member dashboard — currently unused |
| `admin.html` | Admin panel — member management, fees, form requirements |
| `style.css` | All shared styles — edit this to change colours/fonts sitewide |
| `nav.js` | Shared nav, footer, and login modal — ES module, runs on every page |
| `supabase.js` | Supabase client config |

---

## Design

**Colours:**
- Primary: Maroon `#6B1E3E`
- Accent: Gold `#E8A020`
- Background: White / light grey `#F7F7F7`
- Text: Dark `#1A1A1A`

**Fonts:** Arial Narrow for headings, Arial for body, Georgia for prose.

**Style:** Clean and professional, lighter feel — not too dark. Inspired by the club logo colours.

**Club motto:** "Bleed Maroon"

---

## Members area (Supabase)

The site has a full members portal backed by Supabase.

**Database tables:**
- `members` — member profiles (id, full_name, email, phone, year_of_study, is_admin)
- `fees` — fees assigned to each member (fee_name, amount, due_date, paid, paid_date, notes)
- `form_completions` — forms assigned to each member (form_name, completed, completed_date, notes)
- `form_tabs` — config for the tabs on the forms page (tab_label, description, embed_url, embed_height, sort_order)
- `news_posts` — club news articles (title, author, post_date, body)
- `events` — club events (name, event_date, display_date, notes) — auto-split into upcoming/past by comparing event_date to today
- `gallery_photos` — photo metadata (storage_path, url, caption) — actual files stored in Supabase Storage bucket `gallery`

**How login works:**
- A "Members Login" button in the nav opens a modal overlay on any page (not a separate login page)
- After logging in, members are taken to `forms.html`
- Logging out returns them to the home page
- Admins see an extra "Admin" link in the nav (gold)

**Forms page (`forms.html`):**
- Members-only — non-logged-in visitors see a prompt to log in
- Tabs are managed via Supabase (`form_tabs` table) — not hardcoded
- Admins see an **✎ Edit page** button to enter edit mode, where they can:
  - Add tabs (＋ button)
  - Delete tabs (× on each tab, with confirmation)
  - Edit the tab name and description inline
  - Attach or remove a Google Form embed URL and height
  - Save or cancel all changes

**Admin panel (`admin.html`):**
- Only accessible to members with `is_admin = true` — others are redirected to the home page
- Page content is hidden until auth is confirmed (no flash of content)
- **Members tab:** view all members, click ⋮ to edit or delete, toggle admin status
- **Fees tab:** add fees, mark paid/unpaid
- **Forms tab:** add form requirements, mark complete/incomplete
- **Add member tab:** create a new account (person must reset their password to log in)
- Edit member modal lets you change: name, email (profile only), phone, year of study, admin status
- Delete removes the member row + their fees and form records (Supabase Auth account remains)

**Row Level Security (RLS):** enabled — members can only see their own data.

**Current admin:** Sam Wilson (`samwilson135135@gmail.com`)

**To make someone admin:** Go to Supabase → Table Editor → members → set `is_admin` to `true` for their row. Or use the toggle in the admin panel.

**To add a database column:** Go to Supabase → SQL Editor → run an `ALTER TABLE` query.

---

## How we work together

Sam describes what he wants in plain English. Claude writes the code or tells Sam exactly what to change.

**For file changes:** Claude edits the files directly. Sam commits via the Source Control panel and syncs. Netlify auto-deploys in ~30 seconds.

**For database changes:**
1. Claude provides the SQL query
2. Sam goes to Supabase → SQL Editor → pastes and runs it

**Rules for Claude:**
- Prefer targeted edits over full rewrites where possible
- Keep the maroon and gold colour scheme consistent
- Don't make the design darker — Sam prefers a lighter feel
- Placeholder content should be clearly marked so Sam knows what to replace
- When adding new database fields, always provide both the SQL and the updated code together
- The site is for a student club — keep copy friendly, not corporate
- All pages use `<script type="module" src="nav.js">` — nav.js is an ES module
- forms.html and admin.html both check auth before showing any content
- Confirmation dialogs use a custom in-page modal (not `window.confirm()`)

---

## Things still to do / planned features

- [ ] Add photo support to news posts (more complex — needs file storage)
- [ ] Add student ID field to signup form and members table
- [ ] Add more real photos to the gallery
- [ ] Update committee names on about.html
- [ ] Wire up real social media links in nav.js footer
- [ ] Set up Cloudflare email forwarding for club emails
- [ ] Buy custom domain (e.g. ucrowing.com) when ready
- [ ] Update Supabase Site URL to custom domain once purchased

---

## Handover notes (for future presidents)

The website is entirely student run. When the presidency changes:

1. Invite the new president to the Supabase organisation (supabase.com → UC Rowing Club org → Members)
2. Give them Owner role in Supabase
3. Invite them to the GitHub repo as a collaborator
4. Hand over the Netlify login (use the club email)
5. Share this file with them so they understand how everything fits together
6. Set their `is_admin` to `true` in the Supabase members table (or use the admin panel)

The club email and all service accounts should use the club email address, not a personal one, so access survives the handover each year.

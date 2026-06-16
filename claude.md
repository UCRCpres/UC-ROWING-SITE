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
| Forms | Google Forms (embedded) | Managed by the club |
| Code editor | VS Code | Connected to GitHub via built-in Git |

**Deployment flow:** Edit files in VS Code → commit via Source Control panel → Netlify auto-deploys in ~30 seconds.

---

## Site structure

All files live at the root level of the repo — no subfolders.

| File | Page |
|---|---|
| `index.html` | Home page — hero photo, quick links |
| `about.html` | About the club + history + committee |
| `training.html` | Weekly training schedule + locations |
| `events.html` | Race calendar and regattas |
| `gallery.html` | Photo gallery |
| `sponsors.html` | Sponsors + sponsorship packages |
| `forms.html` | Google Forms embeds (join + regatta registration) |
| `contact.html` | Contact form + details |
| `login.html` | Members area login / signup |
| `dashboard.html` | Member dashboard (fees + forms status) |
| `admin.html` | Admin panel for committee |
| `style.css` | All shared styles — edit this to change colours/fonts sitewide |
| `nav.js` | Shared navigation and footer — renders on every page |
| `supabase.js` | Supabase connection config |
| `hero.jpg` | Homepage hero photo |
| `logo.png` | Club logo (maroon and gold crest with crossed oars) |

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
- `members` — member profiles (name, email, phone, year of study, is_admin)
- `fees` — fees assigned to each member (fee name, amount, due date, paid status)
- `form_completions` — forms assigned to each member (form name, completed status)

**How it works:**
- Members sign up on `login.html` and get a dashboard showing their fees and form completion status
- Admins log in and see the full admin panel (`admin.html`) where they can add members, assign fees, tick off payments, and manage form requirements
- Row Level Security (RLS) is enabled — members can only see their own data

**Current admin:** Sam Wilson (`samwilson135135@gmail.com`)

**To make someone admin:** Go to Supabase → Table Editor → members → set `is_admin` to `true` for their row.

**To add a database column:** Go to Supabase → SQL Editor → run an `ALTER TABLE` query.

---

## How we work together

Sam describes what he wants in plain English. Claude writes the code or tells Sam exactly what to change.

**For file changes:**
1. Claude provides the updated file content
2. Sam opens the file in VS Code, replaces the content
3. Sam commits via the Source Control panel and syncs
4. Netlify auto-deploys

**For database changes:**
1. Claude provides the SQL query
2. Sam goes to Supabase → SQL Editor → pastes and runs it

**Rules for Claude:**
- Always write complete file content, not just snippets, unless it's a tiny targeted change
- Keep the maroon and gold colour scheme consistent
- Don't make the design darker — Sam prefers a lighter feel
- Placeholder content should be clearly marked so Sam knows what to replace
- When adding new database fields, always provide both the SQL and the updated HTML together
- The site is for a student club — keep copy friendly, not corporate

---

## Things still to do / planned features

- [ ] Add student ID field to signup form and members table
- [ ] Add more real photos to the gallery
- [ ] Update committee names on about.html
- [ ] Wire up real social media links in nav.js footer
- [ ] Add regatta registration Google Form embed to forms.html
- [ ] Update real sponsor names and logos on sponsors.html
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
6. Set their `is_admin` to `true` in the Supabase members table

The club email and all service accounts should use the club email address, not a personal one, so access survives the handover each year.

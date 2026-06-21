// ─────────────────────────────────────────────────────────────────────────────
// supabase.js — Database connection config
//
// This file connects the website to the Supabase database used for the members
// portal (login, fees, forms, admin panel).
//
// You should NOT need to change anything here unless:
//   - You create a brand new Supabase project (the URL and key would change)
//   - Supabase rotates the anon key (rare — they'll notify you)
//
// To find these values: supabase.com → your project → Settings → API
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://rdwzgpcynydkpvkhandc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd3pncGN5bnlka3B2a2hhbmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1ODM5NDQsImV4cCI6MjA5NzE1OTk0NH0.0Q_4EARBRd3J6M_xHpnX2jaRhrV13jhmJ-RLGxqQE5s'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

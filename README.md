# CredMind — Setup & Deploy

Design system: dark, minimal, Wealthsimple-inspired. Navy/black canvas,
electric blue accent used only for primary actions. Inter typeface. Custom
line-icon set (no emoji, no icon library).

Brand assets (icon, wordmark, horizontal lockup) live in `public/logo-icon.png`
and `public/logo-lockup.png`, with `app/icon.png`/`app/apple-icon.png` powering
the browser favicon and iOS home-screen icon.

## What's built

| Feature | Status | Access |
|---|---|---|
| Home (personalized dashboard) | ✅ | Public preview, personalized once logged in |
| Explore Cards (filters + accounts row) | ✅ | Public |
| Compare (self-serve card picker) | ✅ | Public |
| Card Quiz | ✅ | Public to take, login to see results |
| Card product pages (rich detail) | ✅ | Public |
| Stack Optimizer | ✅ | Public preview, gated by login overlay |
| Debt Optimizer | ✅ | Public preview, gated by login overlay |
| AI Educator | ✅ | Public preview, gated by login overlay, 5 free msgs/mo |
| Login / Signup (email + Google) | ✅ | — |
| Referral link + account/settings panel | ✅ | Login required |

Stack Optimizer, Debt Optimizer, and AI Educator no longer hard-redirect
logged-out visitors to `/login` — the page renders (blurred, non-interactive)
with a login/signup overlay on top instead (`components/GatedPreview.tsx`).
The underlying API routes still independently reject unauthenticated
requests with 401, so this is presentation-only, not a security change.

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your real values (see step 2 and 3 below), then:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 2. Supabase setup

1. Create a project at supabase.com
2. Go to **SQL Editor → New Query**, paste the entire contents of
   `supabase/schema.sql`, and run it
   - Already have a project from before? The bottom section of that file
     (starting at `HOME PAGE ADDITIONS`) is new — it adds `user_cards`
     (your stack), `watchlist` (cards you're eyeing), and
     `profiles.push_notifications`. Paste just that block into a new query
     if you don't want to re-run the whole file.
3. Go to **Authentication → Providers** → enable **Email** and **Google**
4. Go to **Authentication → URL Configuration** → add:
   - `http://localhost:3000/auth/callback` (for local dev)
   - `https://your-vercel-url.vercel.app/auth/callback` (after you deploy)
5. Go to **Settings → API** → copy these into `.env.local`:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ never expose this
     client-side — it's only used in `lib/supabase/server.ts`)

## 3. Anthropic setup

1. Get an API key at console.anthropic.com
2. Add it to `.env.local` as `ANTHROPIC_API_KEY`

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "Initial MVP"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 5. Deploy to Vercel

1. Go to vercel.com → **Add New Project** → import your GitHub repo
2. Vercel auto-detects Next.js — no config changes needed
3. Under **Environment Variables**, add the same 4 values from your
   `.env.local` (Supabase URL, anon key, service role key, Anthropic key)
4. Click **Deploy**
5. Once live, go back to Supabase's URL Configuration and add your real
   Vercel URL's `/auth/callback` (step 2.4 above)

## Card photos

Card art isn't bundled — drop images into `public/cards/{id}.png` (the id
matches each card's `id` in `data/cards.ts`, e.g. `public/cards/amex-cobalt.png`).
Until a file exists, the UI falls back to a clean placeholder block instead
of a broken-image icon (`components/CardImage.tsx`).

## What's intentionally NOT built yet (per the roadmap)

- Card data currently lives in `data/cards.ts` as a static seed (9 cards).
  Production should migrate this to the `credit_cards` Supabase table and
  fetch it via a `lib/cards.ts` helper — swap this in once you're entering
  the full 50+ card database.
- Stripe/premium upgrade flow — the chat cap currently just shows an
  "Upgrade" button with no real checkout wired up (per the "fake door"
  waitlist strategy discussed — wire this to a `waitlist_emails` insert
  first, add real Stripe once you validate demand).
- Referral system UI is wired (copy-link button in the account panel,
  reusing the `referral_code` field already in the schema) but nothing
  credits the referrer yet — that needs a webhook/trigger on approval events.
- Accounts (chequing/savings/loans/LOC/mortgages) and Resources (Help
  centre/Learn/Terms/Privacy/Licenses) are placeholder pages
  (`app/accounts/[type]`, `app/resources/[slug]`) — swap in real content or
  affiliate links whenever they're ready.
- Brevo email integration (Supabase webhook → Edge Function, discussed
  separately — not part of this scaffold).

## Design tokens reference

All colors/fonts/spacing live in `tailwind.config.ts`. To change the
accent color or any core token, edit it there once — it propagates
everywhere since every component uses the semantic class names
(`bg-accent`, `text-inkMuted`, etc.) rather than hard-coded hex values.

# Frank Playoffs — Base44 → Supabase migration

This export removes the Base44 client dependency and adds a Supabase backend layer.

## 1. Install dependencies

npm install
npm install @supabase/supabase-js

## 2. Create Supabase project

Create a free Supabase project, then open SQL Editor and run:

supabase/schema.sql

## 3. Configure environment

Copy `.env.example` to `.env.local` and set:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

## 4. Authentication

Enable Email provider in Supabase Authentication. For password reset emails,
configure the Supabase Auth redirect URL to your local/deployed site.

## 5. Admin

After creating your account, run:

update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL';

## 6. Frontend migration notes

The new files are:
- `src/lib/supabase.js`
- `src/lib/api.js`
- `supabase/schema.sql`

The old Base44 client file was removed.

Any remaining imports of `base44Client` or `@base44/sdk` in UI components should be
replaced with the functions from `src/lib/api.js` and/or `supabase`.

This package preserves the existing UI and scoring code. The `bracket` JSON column
is included so the project can support a full AFC/NFC wild-card → divisional →
conference championship → Super Bowl bracket without another database migration.

## Important

Do not put a Supabase service-role key in the browser. Only the anon/publishable key
belongs in VITE_* environment variables. Row Level Security protects user data.

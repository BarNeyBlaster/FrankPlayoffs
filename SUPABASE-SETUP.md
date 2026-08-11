# Supabase setup for Frank Playoffs

1. Create a Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. In Authentication → Providers, enable Email.
4. Put your project URL and anon/publishable key into `.env.local`:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
5. Create an account in the app.
6. Make that account an admin:
   update public.profiles set role='admin' where email='YOUR_EMAIL';
7. Run `npm install` and `npm run dev`.

For Vercel, add the two VITE_* variables in Project Settings → Environment Variables.

Never expose a Supabase service-role key in frontend code.

# Vercel deployment

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Framework: Vite.
4. Build command: npm run build.
5. Output directory: dist.
6. Add these Production environment variables:
   VITE_SUPABASE_URL=https://dqkgbaaluhamtgxdmyse.supabase.co
   VITE_SUPABASE_ANON_KEY=<your Supabase publishable/anon key>
7. Deploy.

`vercel.json` is included so client-side routes work on refresh.
Never commit `.env.local`.

# TTD Arena

TTD Arena is a coach-and-athlete workout app built with React, Vite, and Supabase.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from `.env.example` and add your Supabase values:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Production Build

Build the app with:

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Set these environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Use the default Vite settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy.

## Supabase Settings Before Launch

In Supabase Authentication settings:

- Set `Site URL` to your live app URL.
- Add your live URL to `Redirect URLs`.
- Keep local development URLs if you still test locally:
  - `http://localhost:5173`
  - `http://localhost:5173/*`
- Make sure email confirmation is enabled for athlete signup verification.

## App Notes

- Athlete signup is athlete-only.
- Coach access is restricted to the single coach account linked in `public.athletes`.
- Leaderboards support men and women sections, plus RX vs scaled ranking.
- Workouts, scores, comments, notifications, chat, avatars, and profile edits are backed by Supabase.

## Repo Notes

- Do not commit your real `.env` file.
- Use `.env.example` as the local setup template.
- The app is a static frontend; Supabase provides auth and database services.

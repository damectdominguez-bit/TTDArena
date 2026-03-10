# TTD Arena 🏋️

**Train · Track · Dominate** — A CrossFit workout tracker PWA built with React + Vite.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run in development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build locally
```bash
npm run preview
```

---

## Deploy to Vercel (Recommended — Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel auto-detects Vite — just click **Deploy**
4. Done! Your app is live at `https://your-app.vercel.app`

The PWA install prompt will appear automatically on mobile once it's on HTTPS.

---

## Deploy to Netlify (Also Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

---

## Deploy Manually (any static host)

```bash
npm run build
# Upload the contents of /dist to any static file host
```
Hosts that work: Cloudflare Pages, GitHub Pages, AWS S3 + CloudFront, Firebase Hosting.

---

## Making It a Full App (Adding a Backend)

Right now the app uses in-memory state — data resets on refresh. To make it persistent:

### Option A: Supabase (Recommended — Free tier available)
1. Create a project at [supabase.com](https://supabase.com)
2. Create tables: `users`, `workouts`, `scores`, `messages`, `comments`
3. Install: `npm install @supabase/supabase-js`
4. Replace `useState` data with Supabase queries

### Option B: Firebase Firestore
1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Install: `npm install firebase`
3. Use `onSnapshot` for real-time chat

### Suggested Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('coach', 'athlete')),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  score_type TEXT NOT NULL,
  rounds INT DEFAULT 1,
  total_score BOOLEAN DEFAULT FALSE,
  description TEXT,
  notes TEXT,
  date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  value TEXT NOT NULL,
  round_values JSONB,
  rx BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (Chat)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_id UUID REFERENCES users(id),
  to_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_id UUID REFERENCES scores(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## PWA Features

- ✅ Installable on iOS and Android ("Add to Home Screen")
- ✅ Works offline (cached assets via service worker)
- ✅ Google Fonts cached for offline use
- ✅ Full-screen standalone mode (no browser chrome)
- ✅ Orange theme color in mobile browser UI
- ✅ App icons for all device sizes

---

## Demo Credentials

| Role | Login |
|------|-------|
| Coach | PIN: `1234` |
| Athlete | `sarah@ttd.com` / `pass1234` |
| Athlete | `jake@ttd.com` / `pass1234` |
| Athlete | `maria@ttd.com` / `pass1234` |
| Athlete | `carlos@ttd.com` / `pass1234` |

---

## Project Structure

```
ttd-arena/
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── main.jsx        # React entry point
│   └── App.jsx         # Full application (components, state, styles)
├── index.html          # HTML shell with PWA meta tags
├── vite.config.js      # Vite + PWA plugin config
├── package.json
└── README.md
```

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool
- **vite-plugin-pwa** — Service worker + manifest generation
- **Workbox** — Service worker strategies (via vite-plugin-pwa)
- **Google Fonts** — Barlow Condensed, Inter, JetBrains Mono

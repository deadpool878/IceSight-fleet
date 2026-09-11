# Supabase Setup Guide for ICE·SIGHT FLEET

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New project"**
4. **Database Password:** Choose a strong password (save it!)
5. **Region:** Choose closest to your users
6. Click **"Create new project"** → Wait ~2 minutes

## Step 2: Get Your API Keys

1. In your project dashboard, go to **Settings** → **API** (gear icon, left sidebar)
2. Copy these two values:
   - **Project URL** — looks like `https://xxxxx.supabase.co`
   - **Anon (public) key** — starts with `eyJ...`

## Step 3: Create the Advisories Table

1. Go to the **SQL Editor** (left sidebar, icon looks like `>_`)
2. Paste this SQL and click **"Run"**:

```sql
CREATE TABLE advisories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  title TEXT DEFAULT 'Simulation advisory',
  ship_count INTEGER DEFAULT 0,
  iceberg_count INTEGER DEFAULT 0,
  current_day NUMERIC DEFAULT 0,
  horizon INTEGER DEFAULT 0,
  regime TEXT DEFAULT '',
  weather JSONB,
  ship_details JSONB DEFAULT '[]',
  risk_summary JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE advisories ENABLE ROW LEVEL SECURITY;

-- Users can only read their own advisories
CREATE POLICY "Users read own advisories" ON advisories
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own advisories
CREATE POLICY "Users insert own advisories" ON advisories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own advisories
CREATE POLICY "Users delete own advisories" ON advisories
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for fast queries
CREATE INDEX idx_advisories_user_id ON advisories(user_id);
CREATE INDEX idx_advisories_created_at ON advisories(created_at DESC);
```

## Step 4: Enable Authentication

1. Go to **Authentication** (left sidebar)
2. Under **Providers**, enable:
   - **Email** → Toggle ON (should be on by default)
   - **Google** → Toggle ON → Enter your Google Cloud OAuth Client ID and Secret
     - To get these: go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth 2.0 Client ID → Web application → Add `https://YOUR_PROJECT.supabase.co/auth/v1/callback` as authorized redirect URI

## Step 5: Paste Your Keys Into 3 Files

Open each file and replace the placeholder values:

### File 1: `index.html` (search for `SUPABASE_URL`)
Find:
```javascript
const SUPABASE_URL='https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY='YOUR_ANON_KEY';
```
Replace with your real values.

### File 2: `simulator.html` (search for `YOUR_PROJECT_ID.supabase.co`)
Find:
```javascript
sbClient=supabase.createClient('https://YOUR_PROJECT_ID.supabase.co','YOUR_ANON_KEY');
```
Replace with your real values.

### File 3: `view-advisory.html` (search for `YOUR_PROJECT_ID.supabase.co`)
Find:
```javascript
const sb=window.supabase.createClient('https://YOUR_PROJECT_ID.supabase.co','YOUR_ANON_KEY');
```
Replace with your real values.

## Step 6: Test It

1. Open `index.html` in browser
2. Click **"Sign In"** in the top right
3. Click **"Sign Up"** → Create account with email/password
4. Click **"Launch Simulator"**
5. Run a simulation
6. Click **"💾 Save"** (you may need to sign in again on the simulator page)
7. See it appear in **"My Advisories"** panel

---

## Troubleshooting

### "Invalid API key" error
- Make sure you're using the **anon (public)** key, not the service_role key
- Check there are no extra spaces or quotes around the values

### Sign Up doesn't send confirmation email
- In Supabase Dashboard → Authentication → Settings → Disable **"Confirm email"** for testing
- For production, keep it enabled

### "Row Level Security" error when saving
- Make sure the SQL in Step 3 ran successfully
- Check that `auth.uid()` returns your user ID (it should if you're signed in)

### CORS errors
- Supabase handles CORS automatically — if you see CORS errors, double-check your project URL

---

## Supabase Free Tier Includes

- **500 MB database** storage
- **1 GB file storage**
- **50,000 monthly active users**
- **500,000 Edge Function invocations**
- **2 GB bandwidth**
- **No credit card required**

For this project, the free tier is more than enough.

---

## Pages Using Supabase

| Page | Features |
|------|----------|
| `index.html` | Sign in, Sign up, Google OAuth, Sign out |
| `simulator.html` | Sign in, Sign up, Google OAuth, Save/Load/Delete advisories |
| `view-advisory.html` | Read advisory (public with ID) |
| `dashboard.html` | (No Supabase needed) |

---

## What Changed from Firebase

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Auth | Firebase Auth | Supabase Auth |
| Database | Firestore | PostgreSQL |
| Config | `firebase.initializeApp()` | `supabase.createClient()` |
| Sign in | `signInWithEmailAndPassword()` | `signInWithPassword()` |
| Sign up | `createUserWithEmailAndPassword()` | `signUp()` |
| Google | `signInWithPopup(GoogleAuthProvider)` | `signInWithOAuth({provider:'google'})` |
| Save data | `collection().add()` | `from().insert()` |
| Read data | `collection().where().get()` | `from().select().eq()` |
| Delete data | `collection().doc().delete()` | `from().delete().eq()` |
| SDK size | ~200 KB | ~60 KB |

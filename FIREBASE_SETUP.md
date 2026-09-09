# Firebase Setup Guide for ICE·SIGHT FLEET

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `icesight-fleet` (or any name you like)
4. Disable Google Analytics (optional) → Click **"Create project"**

### Step 2: Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Under "Sign-in providers", enable:
   - **Email/Password** → Toggle ON → Click Save
   - **Google** → Toggle ON → Select your email → Click Save

### Step 3: Create Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** → Click Next
4. Choose a location (any is fine) → Click **"Enable"**

### Step 4: Get Your Config
1. Click the **gear icon** (⚙️) next to "Project Overview" → Click **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. Enter app nickname: `icesight-web`
5. Click **"Register app"**
6. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "icesight-fleet.firebaseapp.com",
  projectId: "icesight-fleet",
  storageBucket: "icesight-fleet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Update the Config
Replace the placeholder values in these files with your actual config:

1. **`simulator.html`** — Find `const FIREBASE_CONFIG = {` (near the top of `<script>`)
2. **`index.html`** — Find `const FIREBASE_CONFIG = {` (near the bottom)
3. **`view-advisory.html`** — Find `const FIREBASE_CONFIG = {`

Replace each one with your actual config from Step 4.

### Step 6: Set Firestore Rules (Important!)
1. In Firestore Database, click **"Rules"** tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /advisories/{advisory} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

This ensures:
- Users can only read/write their own advisories
- Unauthenticated users cannot access any data
- New advisories can only be created by logged-in users

### Step 7: Deploy
1. Push your files to GitHub
2. Deploy to Vercel
3. Test by:
   - Opening the app
   - Clicking "Sign In"
   - Creating an account
   - Running a simulation
   - Clicking "Save"
   - Checking "My Advisories" panel

---

## Troubleshooting

### "Firebase: Firebase App named '[DEFAULT]' already exists"
- You're calling `firebase.initializeApp()` twice
- Make sure you only initialize once per page

### "Firebase: Permission denied"
- Check your Firestore rules (Step 6)
- Make sure the user is authenticated

### "Firebase: API key not valid"
- Double-check your config values
- Make sure you copied the entire API key

### Auth popup blocked
- Allow popups for your domain
- Or use email/password auth instead

---

## Free Tier Limits

Firebase Spark (free) plan includes:
- **Authentication**: 10,000 phone authentications/month
- **Firestore**: 1 GiB storage, 50,000 reads/day, 20,000 writes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer

This is more than enough for a hackathon or early prototype.

---

## What's Connected

| Page | Firebase Features |
|------|-------------------|
| `index.html` | Auth (Sign In/Sign Up) |
| `simulator.html` | Auth + Firestore (Save/Load Advisories) |
| `view-advisory.html` | Firestore (Read Advisory) |
| `dashboard.html` | (No Firebase yet — add later) |

---

## Next Steps (Optional)

1. **Add Google Sign-In** — Already configured, just enable in Firebase Console
2. **Add Password Reset** — Add a "Forgot Password?" link
3. **Add Email Verification** — Require email verification before saving
4. **Add Profile Page** — Let users update their name/preferences
5. **Add Advisory Sharing** — Generate a shareable link for advisories

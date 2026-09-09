// ── Firebase Configuration ──
// Replace these values with your own Firebase project config
// Create a free project at https://console.firebase.google.com
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDNyXWniH-IqeMLsLbJtjX5zV0YIAeN_zA",
  authDomain: "icesight-fleet.firebaseapp.com",
  projectId: "icesight-fleet",
  storageBucket: "icesight-fleet.firebasestorage.app",
  messagingSenderId: "133909887299",
  appId: "1:133909887299:web:3f7c4ff6e2cc9d91a797f6"
};

// ── Firebase SDK Imports (via CDN) ──
// These will be loaded dynamically
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let currentUser = null;

// ── Initialize Firebase ──
async function initFirebase() {
  if (firebaseApp) return; // Already initialized
  
  // Load Firebase SDK from CDN
  await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js');
  await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js');
  
  // Initialize
  firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
  firebaseAuth = firebase.auth();
  firebaseDb = firebase.firestore();
  
  // Listen for auth state changes
  firebaseAuth.onAuthStateChanged((user) => {
    currentUser = user;
    updateAuthUI();
  });
}

// ── Helper: Load Script ──
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ── Authentication Functions ──

// Sign up with email/password
async function signUp(email, password, displayName) {
  const credential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
  await credential.user.updateProfile({ displayName });
  return credential.user;
}

// Sign in with email/password
async function signIn(email, password) {
  const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
  return credential.user;
}

// Sign in with Google
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const credential = await firebaseAuth.signInWithPopup(provider);
  return credential.user;
}

// Sign out
async function signOut() {
  await firebaseAuth.signOut();
  currentUser = null;
  updateAuthUI();
}

// ── Firestore Functions ──

// Save an advisory
async function saveAdvisory(advisoryData) {
  if (!currentUser) throw new Error('Must be logged in to save advisories');
  
  const docRef = await firebaseDb.collection('advisories').add({
    userId: currentUser.uid,
    userEmail: currentUser.email,
    userName: currentUser.displayName || currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...advisoryData
  });
  
  return docRef.id;
}

// Get user's advisories
async function getUserAdvisories(limit = 20) {
  if (!currentUser) return [];
  
  const snapshot = await firebaseDb.collection('advisories')
    .where('userId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate()
  }));
}

// Delete an advisory
async function deleteAdvisory(advisoryId) {
  if (!currentUser) throw new Error('Must be logged in');
  await firebaseDb.collection('advisories').doc(advisoryId).delete();
}

// ── UI Update Functions ──

function updateAuthUI() {
  // Update all auth-related UI elements
  const authBtns = document.querySelectorAll('.auth-btn');
  const userMenus = document.querySelectorAll('.user-menu');
  const guestMenus = document.querySelectorAll('.guest-menu');
  
  if (currentUser) {
    authBtns.forEach(btn => {
      btn.textContent = currentUser.displayName || currentUser.email;
      btn.onclick = () => signOut();
    });
    userMenus.forEach(menu => menu.style.display = 'flex');
    guestMenus.forEach(menu => menu.style.display = 'none');
  } else {
    authBtns.forEach(btn => {
      btn.textContent = 'Sign In';
      btn.onclick = () => showAuthModal();
    });
    userMenus.forEach(menu => menu.style.display = 'none');
    guestMenus.forEach(menu => menu.style.display = 'flex');
  }
}

// ── Auth Modal ──

function showAuthModal() {
  // Create modal if it doesn't exist
  let modal = document.getElementById('authModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-content">
        <button class="auth-modal-close" onclick="closeAuthModal()">&times;</button>
        <h2>Sign In to ICE·SIGHT</h2>
        <p class="auth-modal-subtitle">Save scenarios and export advisories</p>
        
        <div id="auth-error" class="auth-error" style="display:none;"></div>
        
        <div id="auth-login-form">
          <div class="auth-field">
            <label>Email</label>
            <input type="email" id="auth-email" placeholder="captain@ship.com">
          </div>
          <div class="auth-field">
            <label>Password</label>
            <input type="password" id="auth-password" placeholder="••••••••">
          </div>
          <button class="auth-btn-primary" onclick="handleEmailSignIn()">Sign In</button>
          
          <div class="auth-divider"><span>or</span></div>
          
          <button class="auth-btn-google" onclick="handleGoogleSignIn()">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>
          
          <p class="auth-switch">Don't have an account? <a href="#" onclick="showSignUpForm(); return false;">Sign Up</a></p>
        </div>
        
        <div id="auth-signup-form" style="display:none;">
          <div class="auth-field">
            <label>Name</label>
            <input type="text" id="auth-name" placeholder="Captain Smith">
          </div>
          <div class="auth-field">
            <label>Email</label>
            <input type="email" id="auth-signup-email" placeholder="captain@ship.com">
          </div>
          <div class="auth-field">
            <label>Password</label>
            <input type="password" id="auth-signup-password" placeholder="••••••••">
          </div>
          <button class="auth-btn-primary" onclick="handleEmailSignUp()">Create Account</button>
          
          <p class="auth-switch">Already have an account? <a href="#" onclick="showLoginForm(); return false;">Sign In</a></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  modal.style.display = 'flex';
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
}

function showLoginForm() {
  document.getElementById('auth-login-form').style.display = 'block';
  document.getElementById('auth-signup-form').style.display = 'none';
  document.getElementById('auth-error').style.display = 'none';
}

function showSignUpForm() {
  document.getElementById('auth-login-form').style.display = 'none';
  document.getElementById('auth-signup-form').style.display = 'block';
  document.getElementById('auth-error').style.display = 'none';
}

function showAuthError(message) {
  const el = document.getElementById('auth-error');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

// ── Auth Handlers ──

async function handleEmailSignIn() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  try {
    await signIn(email, password);
    closeAuthModal();
  } catch (e) {
    showAuthError(e.message);
  }
}

async function handleEmailSignUp() {
  const name = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-signup-email').value;
  const password = document.getElementById('auth-signup-password').value;
  
  try {
    await signUp(email, password, name);
    closeAuthModal();
  } catch (e) {
    showAuthError(e.message);
  }
}

async function handleGoogleSignIn() {
  try {
    await signInWithGoogle();
    closeAuthModal();
  } catch (e) {
    showAuthError(e.message);
  }
}

// ── Initialize on Page Load ──
document.addEventListener('DOMContentLoaded', () => {
  // Auto-initialize Firebase
  initFirebase().catch(err => {
    console.warn('Firebase init failed:', err);
  });
});

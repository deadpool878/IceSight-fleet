// ── Supabase Configuration ──
// Replace these values with your own Supabase project config
// Create a free project at https://supabase.com

const SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_ID.supabase.co",
  anonKey: "YOUR_ANON_KEY"
};

// ── Initialize Supabase Client ──
let sbClient = null;

async function initSupabase() {
  if (sbClient) return;

  // Load Supabase SDK from CDN
  await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');

  sbClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  console.log('[Supabase] Client initialized');
  return sbClient;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

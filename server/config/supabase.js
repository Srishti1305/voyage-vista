const { createClient } = require('@supabase/supabase-js');

// SERVER-SIDE ONLY. The service key must never reach the browser or GitHub.
const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
}

module.exports = createClient(SUPABASE_URL || 'http://localhost', SUPABASE_SERVICE_KEY || 'missing', {
  auth: { persistSession: false }
});
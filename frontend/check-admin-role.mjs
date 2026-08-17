// Temporary diagnostic: verifies whether the sign-off admin account has role = admin.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const creds = Object.fromEntries(
  fs
    .readFileSync('../scripts/signoff/.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
  email: creds.ADMIN_EMAIL,
  password: creds.ADMIN_PASSWORD,
});

if (authError) {
  console.log('SIGN IN FAILED:', authError.message);
  process.exit(0);
}

console.log('Signed in OK. user id:', auth.user.id);

const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('id, full_name, role')
  .eq('id', auth.user.id)
  .single();

console.log('profile row:', profile);
console.log('profile error:', profileError?.message ?? 'none');

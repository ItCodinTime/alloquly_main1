import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.warn("Supabase URL missing. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in env.");
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Supabase service role key missing. Set SUPABASE_SERVICE_ROLE_KEY in env.");
}

export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

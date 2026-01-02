import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://agicrftneqobqpkacwig.supabase.co";
const supabaseAnonKey = "sb_publishable_MiA2P0nMwYR1xRod5RX23w_CYgu6qp8";
createClient(supabaseUrl, supabaseAnonKey);
function getSupabaseAdmin() {
  const serviceRoleKey = "sb_secret_OUsK9IWpayXapXbBEKv1Lg_-e7GpB1K";
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export { getSupabaseAdmin as g };

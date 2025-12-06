import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;
export const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON);

if (isSupabaseEnabled) {
  supabase = createClient(SUPABASE_URL!, SUPABASE_ANON!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pastikan createClient hanya dipanggil jika URL valid untuk mencegah crash saat startup
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey || '')
  : new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'auth' || prop === 'from') {
          throw new Error(
            "Konfigurasi Supabase belum lengkap. Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di panel Secrets (Settings > Secrets)."
          );
        }
        return undefined;
      }
    });

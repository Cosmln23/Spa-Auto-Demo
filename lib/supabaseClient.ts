// Supabase client configuration
// [source: README.md, secțiunea 7 "Endpointuri"]

import { createClient } from '@supabase/supabase-js';

// Client pentru server-side cu anon key (read-only pentru servicii publice)
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
);

// Client pentru server-side cu service role (pentru booking creation)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false }
  }
);

// Client pentru browser (pentru dashboard authenticated)
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

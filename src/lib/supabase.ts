import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

// Lazy initialization — o client só é criado na primeira requisição em runtime,
// não durante o build estático do Next.js.
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.\n' +
        'Configure o .env.local (dev) ou as env vars do Render (prod).',
    );
  }

  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// Alias de conveniência para uso inline nos arquivos de lib/
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

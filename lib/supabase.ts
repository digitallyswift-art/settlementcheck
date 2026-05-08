import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — client is NOT created at module load time.
// Next.js imports route modules during the build to collect page data,
// but env vars only exist at runtime. Calling createClient() here would
// crash the build with "supabaseUrl is required".
// The Proxy defers client creation until the first property access inside
// a live request handler, when env vars are actually available.

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url) throw new Error('SUPABASE_URL env var is not set')
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var is not set')
    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    const client = getClient()
    const value = (client as any)[prop as string]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

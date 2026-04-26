/** Bound how long server-side Supabase HTTP calls may hang (wrong URL, firewall, etc.). */
export const SUPABASE_HTTP_TIMEOUT_MS = 25_000;

/**
 * Drop-in `fetch` for `createClient` / `createServerClient` `global.fetch`.
 * Aborts after {@link SUPABASE_HTTP_TIMEOUT_MS} so API routes return instead of hanging.
 */
export const supabaseTimeoutFetch: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), SUPABASE_HTTP_TIMEOUT_MS);
  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(t);
  });
};

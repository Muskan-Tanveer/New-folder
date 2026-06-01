/** Railway backend URL (Vercel: set NEXT_PUBLIC_API_URL). Local: defaults to :8000 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:8000";
}

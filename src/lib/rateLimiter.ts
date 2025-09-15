// A very basic in-memory rate limiter (good for demo/dev)
// For production: use Redis, Upstash, or Supabase RLS
const rateLimitMap = new Map<string, { count: number; last: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.last > windowMs) {
    rateLimitMap.set(ip, { count: 1, last: now });
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false; // too many requests
}

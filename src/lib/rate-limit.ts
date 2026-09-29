/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * This is intentionally simple: it keeps counters in the Node.js process
 * memory, so it only protects a single running instance and resets on
 * restart/deploy. That's enough to blunt casual brute-force / cost-abuse
 * attempts on a small single-instance deployment. If this app is ever run
 * as multiple instances/serverless functions behind a load balancer, swap
 * this for a shared store (e.g. Upstash/Redis-backed rate limiting) so all
 * instances share the same counters.
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this Map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref?.();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * @param key Unique identifier for the thing being limited, e.g.
 *   `login:${ip}:${email}` or `ai-chat:${ip}`.
 * @param limit Max number of calls allowed within `windowMs`.
 * @param windowMs Length of the sliding window, in milliseconds.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterMs: 0 };
}

/** Best-effort client IP extraction for Next.js Request/NextRequest objects. */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || 'unknown';
}

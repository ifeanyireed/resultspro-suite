/**
 * ResultsPro & Scholars.ng — Unified Upstash Redis & Edge Cache Client
 *
 * Implements high-performance, fault-tolerant Redis operations for Next.js Edge,
 * Middleware, and Server Functions with automatic failover to an in-memory TTL cache.
 */

export interface RedisRateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback cache for development or when Upstash credentials are not yet set
interface FallbackEntry {
  value: any;
  expiresAt: number;
}
const memoryFallback = new Map<string, FallbackEntry>();

/**
 * Standardized namespace key builder following resultspro_redis_infrastructure.md
 * Pattern: resultspro:{env}:{service}:{tenant_scope}:{resource}:{identifier}
 */
export function buildRedisKey(
  service: 'users' | 'results' | 'classroom' | 'courses' | 'exams' | 'tutors' | 'puzzle',
  tenantScope: string,
  resource: string,
  identifier: string,
  env?: string
): string {
  const activeEnv = env || process.env.REDIS_ENV || process.env.NODE_ENV || 'production';
  const cleanScope = tenantScope ? tenantScope.toLowerCase().trim() : 'global';
  const cleanResource = resource.toLowerCase().trim();
  const cleanId = identifier.toLowerCase().trim();
  return `resultspro:${activeEnv}:${service}:${cleanScope}:${cleanResource}:${cleanId}`;
}

function getUpstashCredentials() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)?.trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)?.trim();
  return url && token ? { url, token } : null;
}

/**
 * Executes a raw Upstash REST command
 */
async function executeUpstashCommand<T = any>(command: any[]): Promise<T | null> {
  const creds = getUpstashCredentials();
  if (!creds) return null;

  try {
    const res = await fetch(`${creds.url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      // Prevent edge caching of raw Redis operations
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[Redis] Upstash returned status ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json?.result ?? null;
  } catch (err) {
    console.warn('[Redis] Upstash command failed, using fallback:', err);
    return null;
  }
}

/**
 * Get value from Redis (or memory fallback)
 */
export async function redisGet<T = any>(key: string): Promise<T | null> {
  const creds = getUpstashCredentials();

  if (creds) {
    const res = await executeUpstashCommand(['GET', key]);
    if (res !== null && res !== undefined) {
      try {
        return typeof res === 'string' ? JSON.parse(res) : (res as T);
      } catch {
        return res as T;
      }
    }
  }

  // Memory fallback
  const now = Date.now();
  const cached = memoryFallback.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }
  if (cached && cached.expiresAt <= now) {
    memoryFallback.delete(key);
  }
  return null;
}

/**
 * Set value in Redis with TTL in seconds (or memory fallback)
 */
export async function redisSet(
  key: string,
  value: any,
  ttlSeconds: number = 3600
): Promise<boolean> {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const creds = getUpstashCredentials();

  if (creds) {
    const res = await executeUpstashCommand(['SET', key, serialized, 'EX', ttlSeconds]);
    if (res === 'OK') return true;
  }

  // Always update memory fallback as local fast tier
  memoryFallback.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  return true;
}

/**
 * Delete key from Redis (and memory fallback)
 */
export async function redisDel(key: string): Promise<boolean> {
  memoryFallback.delete(key);
  const creds = getUpstashCredentials();
  if (creds) {
    await executeUpstashCommand(['DEL', key]);
  }
  return true;
}

/**
 * Atomic sliding-window rate limiter
 */
export async function redisRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RedisRateLimitResult> {
  const creds = getUpstashCredentials();
  const now = Math.floor(Date.now() / 1000);
  const reset = now + windowSeconds;

  if (creds) {
    // Pipeline INCR and EXPIRE in Upstash REST
    try {
      const res = await fetch(`${creds.url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds],
        ]),
        cache: 'no-store',
      });

      if (res.ok) {
        const json = await res.json();
        const currentCount = Number(json?.[0]?.result || 1);
        return {
          success: currentCount <= limit,
          limit,
          remaining: Math.max(0, limit - currentCount),
          reset,
        };
      }
    } catch (err) {
      console.warn('[Redis] RateLimit pipeline failed:', err);
    }
  }

  // Memory fallback rate limit
  const entry = memoryFallback.get(key);
  const currentCount = (entry && entry.expiresAt > Date.now() ? Number(entry.value) : 0) + 1;
  memoryFallback.set(key, {
    value: currentCount,
    expiresAt: Date.now() + windowSeconds * 1000,
  });

  return {
    success: currentCount <= limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
    reset,
  };
}

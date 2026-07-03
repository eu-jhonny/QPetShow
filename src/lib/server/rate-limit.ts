/**
 * Rate limiting em memória (janela deslizante simples).
 * Em produção, usar Redis (Upstash) para funcionar entre instâncias.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return { ok: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Limpeza ocasional para evitar crescimento sem limite
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }

  return { ok: true, remaining: limit - timestamps.length };
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "local";
  return `${scope}:${ip}`;
}

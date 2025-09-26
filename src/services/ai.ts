import { fetcher, HttpError } from '@/services/fetcher';
import { Activity, TransportOption } from '@/lib/trip-data';
import type { Place } from '@/lib/mock-data';
import { DEFAULT_HOTEL_IMAGE } from '@/config/images';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function getAISuggestions(location: string, interests: string[]): Promise<Activity[]> {
  return fetcher<Activity[]>(`${API_BASE}/api/ai/get-suggestions`, {
    method: 'POST',
    body: JSON.stringify({ location, interests }),
  });
}

// In-memory TTL cache for transport options within the browser session
const transportCache = new Map<string, { ts: number; data: TransportOption[] }>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function makeLegKey(from: string, to: string, interests: string[]) {
  const ints = (interests || []).map(s => (s || '').trim().toLowerCase()).sort();
  return `${from.trim().toLowerCase()}|${to.trim().toLowerCase()}|${ints.join(',')}`;
}

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

function lsKeyForTransport(k: string) {
  return `tm_tcache:${encodeURIComponent(k)}`;
}

function readLocalCache(key: string): TransportOption[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(lsKeyForTransport(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: TransportOption[] };
    if (!parsed?.ts || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeLocalCache(key: string, data: TransportOption[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(lsKeyForTransport(key), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export async function getAITransportOptions(from: string, to: string, interests: string[]): Promise<{ data: TransportOption[]; fromCache: boolean }> {
  const key = makeLegKey(from, to, interests || []);
  const now = Date.now();
  const cached = transportCache.get(key);
  if (cached && (now - cached.ts) < TTL_MS) {
    return { data: cached.data, fromCache: true };
  }
  // Try persistent cache (localStorage)
  const lsCached = readLocalCache(key);
  if (lsCached) {
    transportCache.set(key, { ts: now, data: lsCached });
    return { data: lsCached, fromCache: true };
  }

  // Basic retry with exponential backoff: 3 attempts (0ms, 600ms, 1500ms)
  const backoffs = [0, 600, 1500];
  let lastErr: unknown;
  for (let i = 0; i < backoffs.length; i++) {
    if (backoffs[i] > 0) await sleep(backoffs[i]);
    try {
      const res = await fetcher<TransportOption[]>(`${API_BASE}/api/ai/get-transport-options`, {
        method: 'POST',
        body: JSON.stringify({ from, to, interests }),
      });
      transportCache.set(key, { ts: Date.now(), data: res });
      writeLocalCache(key, res);
      return { data: res, fromCache: false };
    } catch (e) {
      lastErr = e;
      const status = (e as HttpError)?.status;
      // Retry on 429 and 5xx; otherwise break
      const retriable = status === 429 || (typeof status === 'number' && status >= 500);
      if (!retriable || i === backoffs.length - 1) {
        throw e;
      }
    }
  }
  // Should not reach here, but satisfy TS
  throw lastErr as Error;
}

// In-memory TTL cache for accommodation suggestions per location+interests
const accommodationCache = new Map<string, { ts: number; data: (Place & { isRecommended?: boolean })[] }>();

function makeAccKey(location: string, interests: string[]) {
  const ints = (interests || []).map(s => (s || '').trim().toLowerCase()).sort();
  return `${location.trim().toLowerCase()}|${ints.join(',')}`;
}

function lsKeyForAcc(k: string) {
  return `tm_accache:${encodeURIComponent(k)}`;
}

function readLocalAccCache(key: string): (Place & { isRecommended?: boolean })[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(lsKeyForAcc(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: (Place & { isRecommended?: boolean })[] };
    if (!parsed?.ts || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeLocalAccCache(key: string, data: (Place & { isRecommended?: boolean })[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(lsKeyForAcc(key), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

export async function getAIAccommodationSuggestions(location: string, interests: string[]): Promise<{ data: (Place & { isRecommended?: boolean })[]; fromCache: boolean }> {
  const key = makeAccKey(location, interests || []);
  const now = Date.now();
  const cached = accommodationCache.get(key);
  if (cached && (now - cached.ts) < TTL_MS) {
    return { data: cached.data, fromCache: true };
  }
  const lsCached = readLocalAccCache(key);
  if (lsCached) {
    accommodationCache.set(key, { ts: now, data: lsCached });
    return { data: lsCached, fromCache: true };
  }

  // Basic retry on 429/5xx similar to transport
  const backoffs = [0, 600, 1500];
  let lastErr: unknown;
  for (let i = 0; i < backoffs.length; i++) {
    if (backoffs[i] > 0) await sleep(backoffs[i]);
    try {
      const res = await fetcher<(Place & { isRecommended?: boolean })[]>(`${API_BASE}/api/ai/get-accommodation-suggestions`, {
        method: 'POST',
        body: JSON.stringify({ location, interests }),
      });
      // Force every accommodation to use the default image
      const withImages = res.map(p => ({
        ...p,
        images: [DEFAULT_HOTEL_IMAGE],
      })) as (Place & { isRecommended?: boolean })[];
      accommodationCache.set(key, { ts: Date.now(), data: withImages });
      writeLocalAccCache(key, withImages);
      return { data: withImages, fromCache: false };
    } catch (e) {
      lastErr = e;
      const status = (e as HttpError)?.status;
      const retriable = status === 429 || (typeof status === 'number' && status >= 500);
      if (!retriable || i === backoffs.length - 1) {
        throw e;
      }
    }
  }
  throw lastErr as Error;
}

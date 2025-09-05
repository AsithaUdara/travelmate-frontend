export type HttpError = Error & { status?: number; info?: unknown };

export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const err: HttpError = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    try { err.info = await res.json(); } catch { /* noop */ }
    throw err;
  }
  return res.json() as Promise<T>;
}

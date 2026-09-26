// Small wrapper around the native Fetch API.
// Throws readable errors and honours the AbortSignal that createAsyncThunk provides.
const TIMEOUT_MS = 10000;

// Aborts when the caller aborts or when the request takes too long.
function withTimeout(signal) {
  if (typeof AbortSignal.timeout !== "function") return signal;
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  if (!signal) return timeout;
  return typeof AbortSignal.any === "function" ? AbortSignal.any([signal, timeout]) : signal;
}

export async function getJSON(url, { signal, headers } = {}) {
  const response = await fetch(url, {
    signal: withTimeout(signal),
    headers: { Accept: "application/json", ...headers },
  });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.json();
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

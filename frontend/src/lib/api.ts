// Use relative /api path for local dev (works with Vite proxy)
// For Render production, set VITE_API_URL environment variable
export const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchWeather(city = "Pune") {
  const res = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Weather fetch failed: ${res.status}`);
  }
  return res.json();
}

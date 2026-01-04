export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function fetchWeather(city = "Pune") {
  const res = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || `Weather fetch failed: ${res.status}`);
  }
  return res.json();
}

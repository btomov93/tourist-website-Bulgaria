const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function requestJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

export function getPlaces() {
  return requestJson(`${BASE_URL}/places`);
}

export function getPlaceById(id) {
  return requestJson(`${BASE_URL}/places/${id}`);
}

export function getPlacesFiltered({ town, category } = {}) {
  const params = new URLSearchParams();
  if (town) params.append("town", town);
  if (category) params.append("category", category);

  const qs = params.toString();
  const url = `${BASE_URL}/places${qs ? `?${qs}` : ""}`;
  return requestJson(url);
}

export function prefetchPlace(id) {
  return fetch(`${BASE_URL}/places/${id}`).catch(() => null);
}


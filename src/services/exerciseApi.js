// ExerciseDB API client
// Usage notes:
// - Set environment variables in a `.env` or `.env.local` file at project root:
//   VITE_EXERCISEDB_BASE (optional) - base URL for the ExerciseDB API (defaults to https://exercisedb.p.rapidapi.com)
//   VITE_EXERCISEDB_KEY (optional) - X-RapidAPI-Key when using RapidAPI
//   VITE_EXERCISEDB_HOST (optional) - X-RapidAPI-Host when using RapidAPI (often exercisedb.p.rapidapi.com)
// Example .env:
// VITE_EXERCISEDB_BASE=https://exercisedb.p.rapidapi.com
// VITE_EXERCISEDB_KEY=your_rapidapi_key_here
// VITE_EXERCISEDB_HOST=exercisedb.p.rapidapi.com

const BASE = import.meta.env.VITE_EXERCISEDB_BASE || 'https://exercisedb.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_EXERCISEDB_KEY || 'a49291bdbbmsh969993937f08c84p1a7b7fjsnb2455bcbd8ac';
const API_HOST = import.meta.env.VITE_EXERCISEDB_HOST || 'exercisedb-api1.p.rapidapi.com';

async function fetchJson(path) {
  const url = `${BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  // If RapidAPI credentials are present, include them
  if (API_KEY) {
    headers['X-RapidAPI-Key'] = API_KEY;
  }
  if (API_HOST) {
    headers['X-RapidAPI-Host'] = API_HOST;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const msg = `ExerciseDB request failed: ${res.status} ${res.statusText} ${text}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const exerciseApi = {
  // Get all exercises (may be large)
  getAllExercises: async () => {
    return fetchJson('/exercises');
  },

  // Search exercises by query (API-specific)
  searchExercises: async (query) => {
    // For the endpoint: /api/v1/exercises/search?search=...
    const path = `/api/v1/exercises/search?search=${encodeURIComponent(query)}`;
    return fetchJson(path);
  },

  // Get exercise by id (some ExerciseDB instances use /exercises/exercise/{id})
  getExerciseById: async (id) => {
    // Try common patterns: /exercises/exercise/{id} then /exercises/{id}
    try {
      return await fetchJson(`/exercises/exercise/${encodeURIComponent(id)}`);
    } catch (e1) {
      return fetchJson(`/exercises/${encodeURIComponent(id)}`);
    }
  },

  // Filter by body part
  getByBodyPart: async (bodyPart) => {
    return fetchJson(`/exercises/bodyPart/${encodeURIComponent(bodyPart)}`);
  },

  // Filter by target muscle
  getByTarget: async (target) => {
    return fetchJson(`/exercises/target/${encodeURIComponent(target)}`);
  },

  // Filter by equipment
  getByEquipment: async (equipment) => {
    return fetchJson(`/exercises/equipment/${encodeURIComponent(equipment)}`);
  },

  // Search by name (client-side fallback if API doesn't provide search endpoint)
  searchByName: async (name) => {
    // Many ExerciseDB deployments don't provide a search endpoint; fetch all and filter
    const all = await exerciseApi.getAllExercises();
    const q = (name || '').toLowerCase();
    return all.filter(e => (e.name || e.gifUrl || '').toLowerCase().includes(q));
  }
};

export default exerciseApi;

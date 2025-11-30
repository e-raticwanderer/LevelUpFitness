import { useState, useEffect } from 'react';
import { exerciseApi } from '../services/exerciseApi';
import { db } from '../services/db';


// Dynamically map categories from exercises
export function mapExercise(e, idx) {
  const id = e.id || e.name || `ex-${idx}`;
  const category = (e.bodyPart || e.bodypart || e.category || 'Other').replace(/\b\w/g, c => c.toUpperCase());
  return {
    id,
    title: e.name || e.title || id,
    category,
    difficulty: e.difficulty || 'Intermediate',
    videoUrl: e.video || e.videoUrl || e.gifUrl || '',
    thumbnail: e.gifUrl || e.thumbnail || 'https://via.placeholder.com/640x360?text=No+Preview'
  };
}

export default function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const cached = sessionStorage.getItem('exercises_cache_v1');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (mounted) {
            setExercises(parsed);
            setLoading(false);
          }
        }
        // Always try to refresh in background
        const data = await exerciseApi.getAllExercises();
        const mapped = (Array.isArray(data) ? data : []).map(mapExercise);
        if (mounted) {
          setExercises(mapped);
          setLoading(false);
          sessionStorage.setItem('exercises_cache_v1', JSON.stringify(mapped));
        }
      } catch (e) {
        // Fallback to local seeded workouts
        try {
          const local = db.getWorkouts() || [];
          if (mounted) {
            setExercises(local.map(mapExercise));
            setLoading(false);
            setError(e.message || 'ExerciseDB fetch failed, using local data');
          }
        } catch (inner) {
          if (mounted) {
            setExercises([]);
            setLoading(false);
            setError(e.message || inner.message || 'Failed to load exercises');
          }
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return { exercises, loading, error };
}

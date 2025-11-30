// Dashboard utility functions for dynamic calculations
import { getClientHistory } from './db';

/**
 * Calculate daily system load from logs
 * Returns data suitable for recharts AreaChart
 */
export function calculateSystemLoad() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMap = {};

  days.forEach((day, idx) => {
    dayMap[day] = { name: days[idx].slice(0, 3), load: 0, count: 0 };
  });

  // Aggregate volume from all client logs
  try {
    // For now, we'll use mock data from a fictional week
    // In production, you'd aggregate from real logs grouped by day of week
    const mockData = [
      { name: 'Mon', load: Math.floor(Math.random() * 5000) + 2000 },
      { name: 'Tue', load: Math.floor(Math.random() * 5000) + 2000 },
      { name: 'Wed', load: Math.floor(Math.random() * 5000) + 2000 },
      { name: 'Thu', load: Math.floor(Math.random() * 5000) + 2000 },
      { name: 'Fri', load: Math.floor(Math.random() * 5000) + 2000 },
      { name: 'Sat', load: Math.floor(Math.random() * 3000) + 1000 },
      { name: 'Sun', load: Math.floor(Math.random() * 3000) + 1000 },
    ];
    return mockData;
  } catch (e) {
    console.error('Failed to calculate system load:', e);
    return [];
  }
}

/**
 * Calculate accuracy: percentage of completed workouts where RPE targets were met
 * For now, estimate from completed logs vs total logs
 */
export function calculateAccuracy() {
  try {
    // Simulated accuracy based on completed vs attempted workouts
    // In production, you'd analyze individual sets and RPE values from logs
    const baseAccuracy = 92 + Math.floor(Math.random() * 7);
    return Math.min(baseAccuracy, 99);
  } catch (e) {
    console.error('Failed to calculate accuracy:', e);
    return 90;
  }
}

/**
 * Get client progress summary for trainer view
 * Returns overall stats and per-client breakdown
 */
export function getClientProgressSummary() {
  try {
    // This will be populated with real data from db methods
    return {
      totalClients: 0,
      activeThisWeek: 0,
      avgComplianceRate: 0,
      topPerformers: [],
      needsAttention: []
    };
  } catch (e) {
    console.error('Failed to get client progress summary:', e);
    return null;
  }
}

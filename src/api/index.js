// API client layer for Waste Segregation at Source system
// Seamlessly connects to backend REST endpoints with zero-configuration mock fallback for offline/demo operation.

import {
  HOUSEHOLD_PRESETS,
  TRAY_ANALYSIS_PRESETS,
  HOUSEHOLD_HISTORY_DATA,
  ADMIN_ANALYTICS_DATA,
  DEFAULT_MUNICIPAL_POLICY
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// Memory store for mutations during session (streak, points, history, policy)
let sessionHouseholds = [...HOUSEHOLD_PRESETS];
let sessionHistory = { ...HOUSEHOLD_HISTORY_DATA };
let sessionPolicy = { ...DEFAULT_MUNICIPAL_POLICY };

/**
 * Start a collection pickup session for a household
 * Endpoint: POST /collections/start
 */
export async function startCollection({ house_id, stream, collector_id = 'COL-TRUCK-04' }) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(300);
    const collection_id = `COL-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      collection_id,
      house_id,
      stream,
      collector_id,
      started_at: new Date().toISOString()
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/collections/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ house_id, stream, collector_id })
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] /collections/start using mock data:', err.message);
    const collection_id = `COL-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      collection_id,
      house_id,
      stream,
      collector_id,
      started_at: new Date().toISOString()
    };
  }
}

/**
 * Upload & analyse tray image with Edge/AI model
 * Endpoint: POST /collections/{id}/analyse
 */
export async function analyseTray({ collection_id, house_id, stream, preset_id, image_file }) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(950);
    // Find preset or build dynamic analysis
    let result = TRAY_ANALYSIS_PRESETS.find(p => p.id === preset_id);
    if (!result) {
      // Default to high score if custom upload
      result = TRAY_ANALYSIS_PRESETS[1]; // Clean 96
    }

    // Apply mutation to household session
    updateHouseholdScoreOnAnalysis(house_id, result);

    return {
      collection_id,
      house_id,
      stream,
      ...result,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const formData = new FormData();
    if (image_file) formData.append('image', image_file);
    if (preset_id) formData.append('preset_id', preset_id);
    formData.append('house_id', house_id);
    formData.append('stream', stream);

    const res = await fetch(`${BASE_URL}/collections/${collection_id}/analyse`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`AI inference returned ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[API Fallback] /collections/analyse using preset mock:', err.message);
    let result = TRAY_ANALYSIS_PRESETS.find(p => p.id === preset_id) || TRAY_ANALYSIS_PRESETS[0];
    updateHouseholdScoreOnAnalysis(house_id, result);
    return {
      collection_id,
      house_id,
      stream,
      ...result,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Fetch household overview, current score & streak
 * Endpoint: GET /households/{id}/summary
 */
export async function getHouseholdSummary(house_id) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(250);
    const house = sessionHouseholds.find(h => h.id === house_id) || sessionHouseholds[0];
    return { ...house };
  }

  try {
    const res = await fetch(`${BASE_URL}/households/${house_id}/summary`);
    if (!res.ok) throw new Error(`Summary API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] /households/summary using local state:', err.message);
    const house = sessionHouseholds.find(h => h.id === house_id) || sessionHouseholds[0];
    return { ...house };
  }
}

/**
 * Fetch collection history logs for a household
 * Endpoint: GET /households/{id}/history
 */
export async function getHouseholdHistory(house_id) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(300);
    return sessionHistory[house_id] || sessionHistory['HH-1027'] || [];
  }

  try {
    const res = await fetch(`${BASE_URL}/households/${house_id}/history`);
    if (!res.ok) throw new Error(`History API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] /households/history using mock:', err.message);
    return sessionHistory[house_id] || sessionHistory['HH-1027'] || [];
  }
}

/**
 * Fetch Ward and city-wide compliance statistics for Admin
 * Endpoint: GET /admin/analytics
 */
export async function getAdminAnalytics() {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(350);
    return { ...ADMIN_ANALYTICS_DATA };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/analytics`);
    if (!res.ok) throw new Error(`Analytics API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] /admin/analytics using mock data:', err.message);
    return { ...ADMIN_ANALYTICS_DATA };
  }
}

/**
 * Fetch Municipal Penalty and Scoring Policy
 * Endpoint: GET /admin/policy
 */
export async function getMunicipalPolicy() {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(200);
    return { ...sessionPolicy };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/policy`);
    if (!res.ok) throw new Error(`Policy API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] /admin/policy using mock data:', err.message);
    return { ...sessionPolicy };
  }
}

/**
 * Update Municipal Policy (penalty on/off, warn_after_n, etc.)
 * Endpoint: PUT /admin/policy
 */
export async function updateMunicipalPolicy(newPolicy) {
  sessionPolicy = { ...sessionPolicy, ...newPolicy };
  if (FORCE_MOCK) {
    await simulateNetworkDelay(300);
    return { success: true, policy: sessionPolicy };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/policy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPolicy)
    });
    if (!res.ok) throw new Error(`Policy update returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] PUT /admin/policy using local update:', err.message);
    return { success: true, policy: sessionPolicy };
  }
}

// Internal helper for state mutations on analysis
function updateHouseholdScoreOnAnalysis(houseId, analysisResult) {
  const houseIdx = sessionHouseholds.findIndex(h => h.id === houseId);
  if (houseIdx !== -1) {
    const house = sessionHouseholds[houseIdx];
    const newPoints = Math.max(0, house.green_points + (analysisResult.points_delta || 0));
    let newStreak = house.current_streak;

    if (analysisResult.score >= sessionPolicy.compliant_score_min) {
      newStreak += 1;
    } else if (analysisResult.score < sessionPolicy.partial_score_min) {
      newStreak = 0;
      house.violations_count = (house.violations_count || 0) + 1;
    }

    sessionHouseholds[houseIdx] = {
      ...house,
      green_points: newPoints,
      current_streak: newStreak,
      best_streak: Math.max(house.best_streak, newStreak)
    };
  }

  // Prepend to history
  if (!sessionHistory[houseId]) {
    sessionHistory[houseId] = [];
  }
  sessionHistory[houseId] = [
    {
      collection_id: `COL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: "Just now",
      date: new Date().toISOString().split('T')[0],
      stream: analysisResult.stream || "Dry Waste",
      score: analysisResult.score,
      status: analysisResult.status,
      points_earned: analysisResult.points_delta,
      streak_count: sessionHouseholds.find(h => h.id === houseId)?.current_streak || 0,
      collector_id: "COL-TRUCK-04",
      items_count: (analysisResult.items || []).length,
      contaminants_count: (analysisResult.contaminants || []).length,
      image: analysisResult.sample_image
    },
    ...sessionHistory[houseId]
  ];
}

function simulateNetworkDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

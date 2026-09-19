// API client layer for Waste Segregation at Source system
// Connects to FastAPI backend REST endpoints (http://localhost:8000) with automatic mock fallback for offline/demo operation.

import {
  HOUSEHOLD_PRESETS,
  TRAY_ANALYSIS_PRESETS,
  HOUSEHOLD_HISTORY_DATA,
  ADMIN_ANALYTICS_DATA,
  DEFAULT_MUNICIPAL_POLICY
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Memory store for mutations during session (streak, points, history, policy)
let sessionHouseholds = [...HOUSEHOLD_PRESETS];
let sessionHistory = { ...HOUSEHOLD_HISTORY_DATA };
let sessionPolicy = { ...DEFAULT_MUNICIPAL_POLICY };

/**
 * Start a collection pickup session for a household
 */
export async function startCollection({ house_id, stream, collector_id = 'COL-TRUCK-04' }) {
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

/**
 * Upload & analyse tray image with Edge/AI model
 * Calls real FastAPI POST /api/v1/inspections/ endpoint
 */
export async function analyseTray({ collection_id, house_id, stream, preset_id, image_file }) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(500);
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

  try {
    let fileToUpload = image_file;

    // If preset_id is passed without an image_file, generate a File object for the AI engine
    if (!fileToUpload && preset_id) {
      const presetObj = TRAY_ANALYSIS_PRESETS.find(p => p.id === preset_id);
      const svgContent = presetObj?.status === 'Non-Compliant'
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#78350f"/><circle cx="150" cy="150" r="60" fill="#ef4444"/><text x="50" y="250" fill="#fff" font-size="20">CONTAMINATED</text></svg>`
        : stream.toLowerCase().includes('dry')
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#f8fafc"/><rect x="50" y="50" width="200" height="150" fill="#cbd5e1"/><text x="50" y="250" fill="#000" font-size="20">RECYCLABLE DRY</text></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#15803d"/><circle cx="150" cy="150" r="50" fill="#22c55e"/><text x="50" y="250" fill="#fff" font-size="20">ORGANIC WET</text></svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      fileToUpload = new File([blob], `${preset_id || 'sample'}.svg`, { type: 'image/svg+xml' });
    }

    if (!fileToUpload) {
      const dummySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#15803d"/></svg>`;
      const blob = new Blob([dummySvg], { type: 'image/svg+xml' });
      fileToUpload = new File([blob], 'inspection.svg', { type: 'image/svg+xml' });
    }

    const declaredStream = stream.toLowerCase().includes('dry') ? 'dry' : 'wet';

    const formData = new FormData();
    formData.append('household_id', house_id);
    formData.append('declared_waste_stream', declaredStream);
    formData.append('file', fileToUpload);

    const res = await fetch(`${BASE_URL}/api/v1/inspections/`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      throw new Error(`FastAPI inspection API returned HTTP ${res.status}`);
    }

    const respData = await res.json();

    const mappedResult = {
      collection_id: respData.inspection_id || collection_id || `COL-${Date.now()}`,
      house_id: respData.household_id || house_id,
      stream: respData.declared_waste_stream === 'wet' ? 'Wet Organic' : 'Dry Recyclables',
      score: Math.round(respData.compliance_score),
      status: respData.is_segregated ? 'Compliant Segregation' : 'Contaminated',
      confidence: respData.confidence_score || 0.95,
      contamination_pct: Math.round(100 - respData.compliance_score),
      items: (respData.detected_items || []).map(i => ({ name: i.replace('_', ' ') })),
      contaminants: respData.is_segregated
        ? []
        : [{ name: 'Mixed Contaminant', suggestion: 'Segregate organic wet waste from dry recyclables before pickup.' }],
      points_delta: respData.green_points_awarded,
      streak_delta: respData.is_segregated ? 1 : 0,
      message: respData.is_segregated
        ? 'Waste cleanly segregated according to municipal norms.'
        : 'Cross-contamination detected in declared stream.',
      sample_image: preset_id ? TRAY_ANALYSIS_PRESETS.find(p => p.id === preset_id)?.sample_image : null,
      summary: `Inspection #${respData.inspection_id} analyzed via ${respData.prediction_source || 'AI engine'}.`
    };

    updateHouseholdScoreOnAnalysis(house_id, mappedResult);
    return mappedResult;
  } catch (err) {
    console.warn('[API Fallback] /api/v1/inspections/ using mock fallback:', err.message);
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
 * Fetch household overview, current score & streak from FastAPI
 */
export async function getHouseholdSummary(house_id) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(200);
    const house = sessionHouseholds.find(h => h.id === house_id) || sessionHouseholds[0];
    return { ...house };
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/households/${encodeURIComponent(house_id)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.household_id,
        name: data.name,
        address: data.address,
        green_points: data.green_points,
        current_streak: data.streak,
        best_streak: Math.max(data.streak, 5),
        status: 'Compliant'
      };
    } else if (res.status === 404) {
      // Auto-register household if missing
      const regRes = await fetch(`${BASE_URL}/api/v1/households/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Resident (${house_id})`,
          address: 'Municipal Ward Sector 4',
          green_points: 120,
          streak: 5
        })
      });
      if (regRes.ok) {
        const data = await regRes.json();
        return {
          id: data.household_id,
          name: data.name,
          address: data.address,
          green_points: data.green_points,
          current_streak: data.streak,
          best_streak: data.streak,
          status: 'Compliant'
        };
      }
    }
    throw new Error(`Household API returned ${res.status}`);
  } catch (err) {
    console.warn('[API Fallback] /api/v1/households using local session:', err.message);
    const house = sessionHouseholds.find(h => h.id === house_id) || sessionHouseholds[0];
    return { ...house };
  }
}

/**
 * Fetch collection history logs for a household
 */
export async function getHouseholdHistory(house_id) {
  if (FORCE_MOCK) {
    await simulateNetworkDelay(250);
    return sessionHistory[house_id] || sessionHistory['HH-1027'] || [];
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/inspections/household/${encodeURIComponent(house_id)}`);
    if (res.ok) {
      const records = await res.json();
      if (Array.isArray(records) && records.length > 0) {
        return records.map(rec => ({
          collection_id: rec.inspection_id,
          timestamp: new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(rec.timestamp).toISOString().split('T')[0],
          stream: rec.declared_waste_stream === 'wet' ? 'Wet Organic' : 'Dry Recyclables',
          score: Math.round(rec.compliance_score),
          status: rec.is_segregated ? 'Compliant Segregation' : 'Contaminated',
          points_earned: rec.green_points_awarded,
          streak_count: 1,
          collector_id: 'TRUCK-04',
          items_count: (rec.detected_items || []).length,
          contaminants_count: rec.is_segregated ? 0 : 1,
          image: null
        }));
      }
    }
    throw new Error(`History API returned status ${res.status}`);
  } catch (err) {
    console.warn('[API Fallback] /api/v1/inspections/household using mock history:', err.message);
    return sessionHistory[house_id] || sessionHistory['HH-1027'] || [];
  }
}

/**
 * Fetch Ward and city-wide compliance statistics for Admin
 */
export async function getAdminAnalytics() {
  await simulateNetworkDelay(200);
  return { ...ADMIN_ANALYTICS_DATA };
}

/**
 * Fetch Municipal Penalty and Scoring Policy
 */
export async function getMunicipalPolicy() {
  await simulateNetworkDelay(150);
  return { ...sessionPolicy };
}

/**
 * Update Municipal Policy
 */
export async function updateMunicipalPolicy(newPolicy) {
  sessionPolicy = { ...sessionPolicy, ...newPolicy };
  await simulateNetworkDelay(200);
  return { success: true, policy: sessionPolicy };
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

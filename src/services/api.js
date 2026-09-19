/**
 * Reusable API Service Layer for Waste Management Platform
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

/**
 * Helper to process response and handle network / API errors cleanly.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const data = await response.json();
      if (data && data.detail) {
        if (typeof data.detail === 'string') {
          errorDetail = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Pydantic validation error array
          errorDetail = data.detail.map((err) => `${err.loc ? err.loc.join('.') : 'error'}: ${err.msg}`).join(', ');
        }
      }
    } catch {
      errorDetail = `HTTP Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return await response.json();
}

export const apiService = {
  /**
   * Health Check
   */
  async getHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      return await handleResponse(res);
    } catch (err) {
      throw new Error(`Backend Offline (${err.message})`);
    }
  },

  /**
   * Household Management APIs
   */
  async getHousehold(householdId) {
    const res = await fetch(`${BASE_URL}/api/v1/households/${encodeURIComponent(householdId)}`);
    return await handleResponse(res);
  },

  async registerHousehold({ name, address, green_points = 0, streak = 0 }) {
    const res = await fetch(`${BASE_URL}/api/v1/households/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, address, green_points, streak }),
    });
    return await handleResponse(res);
  },

  async listHouseholds() {
    const res = await fetch(`${BASE_URL}/api/v1/households/`);
    return await handleResponse(res);
  },

  /**
   * Waste Inspection APIs
   */
  async submitInspection({ householdId, declaredStream, imageFile }) {
    const formData = new FormData();
    formData.append('household_id', householdId);
    formData.append('declared_waste_stream', declaredStream);
    formData.append('file', imageFile);

    const res = await fetch(`${BASE_URL}/api/v1/inspections/`, {
      method: 'POST',
      body: formData,
    });
    return await handleResponse(res);
  },

  async getHouseholdInspections(householdId) {
    const res = await fetch(`${BASE_URL}/api/v1/inspections/household/${encodeURIComponent(householdId)}`);
    return await handleResponse(res);
  },
};

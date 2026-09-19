import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getHouseholdSummary,
  getHouseholdHistory,
  getMunicipalPolicy,
  updateMunicipalPolicy,
  analyseTray,
  startCollection
} from '../api';
import { TRAY_ANALYSIS_PRESETS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [activeHouseId, setActiveHouseId] = useState('HH-1027');
  const [householdSummary, setHouseholdSummary] = useState(null);
  const [householdHistory, setHouseholdHistory] = useState([]);
  const [policy, setPolicy] = useState(null);
  
  // Active pickup session and latest AI result
  const [pickupDraft, setPickupDraft] = useState({
    house_id: 'HH-1027',
    stream: 'Dry Waste',
    selectedPresetId: 'preset-banana-dry',
    customImage: null,
    imagePreview: TRAY_ANALYSIS_PRESETS[0].sample_image
  });
  
  // Default latest analysis result to benchmark 72/100 case
  const [lastAnalysisResult, setLastAnalysisResult] = useState({
    collection_id: 'COL-8840',
    house_id: 'HH-1027',
    stream: 'Dry Waste',
    ...TRAY_ANALYSIS_PRESETS[0],
    timestamp: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Load initial household & policy
  useEffect(() => {
    loadHouseholdData(activeHouseId);
    loadPolicy();
  }, [activeHouseId]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id === toast?.id ? null : prev));
    }, 4000);
  };

  const closeToast = () => setToast(null);

  const loadHouseholdData = async (houseId) => {
    try {
      setIsLoading(true);
      const [summary, history] = await Promise.all([
        getHouseholdSummary(houseId),
        getHouseholdHistory(houseId)
      ]);
      setHouseholdSummary(summary);
      setHouseholdHistory(history);
    } catch (err) {
      console.error('Error loading household:', err);
      showToast('Failed to load household details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPolicy = async () => {
    try {
      const pol = await getMunicipalPolicy();
      setPolicy(pol);
    } catch (err) {
      console.error('Error loading policy:', err);
    }
  };

  const switchHousehold = (houseId) => {
    setActiveHouseId(houseId);
    setPickupDraft(prev => ({ ...prev, house_id: houseId }));
    showToast(`Switched active household to ${houseId}`, 'info');
  };

  const executePickupAnalysis = async (customParams = {}) => {
    const params = { ...pickupDraft, ...customParams };
    try {
      setIsLoading(true);
      // 1. Start collection
      const startRes = await startCollection({
        house_id: params.house_id,
        stream: params.stream
      });

      // 2. Run analysis
      const analysisRes = await analyseTray({
        collection_id: startRes.collection_id,
        house_id: params.house_id,
        stream: params.stream,
        preset_id: params.selectedPresetId,
        image_file: params.customImage
      });

      setLastAnalysisResult(analysisRes);
      
      // 3. Refresh household summary & history
      await loadHouseholdData(params.house_id);

      // 4. Navigate to result view
      setActiveTab('ai-result');
      
      if (analysisRes.score >= 85) {
        showToast('Inspection Complete: Compliant! +10 Green Points earned 🎉', 'success');
      } else if (analysisRes.score >= 60) {
        showToast('Inspection Complete: Minor Contamination detected. Tip provided.', 'warning');
      } else {
        showToast('Inspection Complete: Cross-contamination flagged. Streak reset.', 'error');
      }

      return analysisRes;
    } catch (err) {
      console.error('Error executing pickup:', err);
      showToast('Error executing AI analysis', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const savePolicySettings = async (updatedPolicy) => {
    try {
      setIsLoading(true);
      const res = await updateMunicipalPolicy(updatedPolicy);
      if (res.success) {
        setPolicy(res.policy);
        showToast('Municipal policy settings updated successfully', 'success');
      }
    } catch (err) {
      console.error('Error updating policy:', err);
      showToast('Failed to save policy settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeHouseId,
        switchHousehold,
        householdSummary,
        householdHistory,
        policy,
        savePolicySettings,
        pickupDraft,
        setPickupDraft,
        lastAnalysisResult,
        executePickupAnalysis,
        isLoading,
        toast,
        showToast,
        closeToast,
        refreshHouseholdData: () => loadHouseholdData(activeHouseId)
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

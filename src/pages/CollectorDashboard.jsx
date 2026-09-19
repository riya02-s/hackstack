import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  QrCode,
  Scan,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import QrScannerModal from '../components/QrScannerModal';
import TrayImageUploader from '../components/TrayImageUploader';

export default function CollectorDashboard() {
  const {
    activeHouseId,
    householdSummary,
    pickupDraft,
    setPickupDraft,
    executePickupAnalysis,
    isLoading
  } = useApp();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [analysisStatusText, setAnalysisStatusText] = useState('');

  const wasteStreams = [
    { id: 'Dry Waste', label: 'Dry Recyclables', color: '#38bdf8', binColor: 'Blue Bin', desc: 'Paper, plastics, cardboard, cans' },
    { id: 'Wet Waste', label: 'Wet Organic', color: '#34d399', binColor: 'Green Bin', desc: 'Food waste, fruit peels, leftovers' },
    { id: 'Recyclables', label: 'Rigid / Glass / Metal', color: '#a78bfa', binColor: 'Yellow Bin', desc: 'Glass bottles, aluminum, metals' },
    { id: 'Hazardous & E-Waste', label: 'Hazardous & E-Waste', color: '#f87171', binColor: 'Red Bin', desc: 'Batteries, electronics, paint' }
  ];

  const handleSelectStream = (streamId) => {
    setPickupDraft(prev => ({ ...prev, stream: streamId }));
  };

  const handleSelectPreset = (presetId, imageUrl) => {
    setPickupDraft(prev => ({
      ...prev,
      selectedPresetId: presetId,
      imagePreview: imageUrl,
      customImage: null
    }));
  };

  const handleUploadImage = (file, previewUrl) => {
    setPickupDraft(prev => ({
      ...prev,
      customImage: file,
      imagePreview: previewUrl,
      selectedPresetId: null
    }));
  };

  const handleSubmitPickup = async () => {
    try {
      setAnalysisStatusText('1. Uploading tray frame to Edge inference...');
      setTimeout(() => {
        setAnalysisStatusText('2. Running YOLOv8 waste item bounding classifier...');
      }, 400);
      setTimeout(() => {
        setAnalysisStatusText('3. Calculating partition cross-contamination...');
      }, 750);

      await executePickupAnalysis();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Truck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              Doorstep Pickup Inspection
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={12} /> Truck #04
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> Indiranagar Ward 12
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Live Route
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsQrModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Scan size={16} />
          <span>Scan Household QR</span>
        </button>
      </div>

      {/* STEP 1: Household Active Verification */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', letterSpacing: '0.05em' }}>
            STEP 1: ACTIVE HOUSEHOLD
          </span>
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cyan-400)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <QrCode size={14} /> Change Household
          </button>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {householdSummary?.id || activeHouseId}
              </span>
              <span className="badge badge-compliant" style={{ fontSize: '0.65rem' }}>
                Active for Pickup
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
              {householdSummary?.name}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {householdSummary?.address}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                🔥 {householdSummary?.current_streak || 0}d
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                ⭐ {householdSummary?.green_points || 0}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Green Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Waste Stream Selection */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', letterSpacing: '0.05em' }}>
          STEP 2: SELECT CURRENT WASTE STREAM
        </span>
        <div className="grid-2" style={{ marginTop: '12px' }}>
          {wasteStreams.map((st) => {
            const isSelected = pickupDraft.stream === st.id;
            return (
              <div
                key={st.id}
                onClick={() => handleSelectStream(st.id)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `2px solid ${st.color}` : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{st.label}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: st.color,
                      fontWeight: 600
                    }}
                  >
                    {st.binColor}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Tray Inspection Capture */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', letterSpacing: '0.05em' }}>
          STEP 3: TRUCK TRAY CAMERA INSPECTION
        </span>
        <div style={{ marginTop: '12px' }}>
          <TrayImageUploader
            selectedPresetId={pickupDraft.selectedPresetId}
            onSelectPreset={handleSelectPreset}
            customImage={pickupDraft.customImage}
            onUploadImage={handleUploadImage}
            imagePreview={pickupDraft.imagePreview}
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          type="button"
          onClick={handleSubmitPickup}
          disabled={isLoading}
          className="btn btn-primary"
          style={{
            padding: '16px',
            fontSize: '1.05rem',
            width: '100%',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={20} className="spin-animation" />
              <span>Analyzing Tray with Edge AI...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Submit Tray & Compute Segregation Score</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>

        {isLoading && (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--cyan-400)' }}>
            {analysisStatusText}
          </div>
        )}
      </div>

      {/* QR Scanner Dialog */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onSelectId={(id) => setPickupDraft(prev => ({ ...prev, house_id: id }))}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

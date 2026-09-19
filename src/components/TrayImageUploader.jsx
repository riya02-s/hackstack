import React from 'react';
import { TRAY_ANALYSIS_PRESETS } from '../data/mockData';
import { Upload, Camera, Check, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export default function TrayImageUploader({
  selectedPresetId,
  onSelectPreset,
  customImage,
  onUploadImage,
  imagePreview
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUploadImage(file, url);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Preset Test Case Selector */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Sparkles size={14} color="var(--emerald-400)" />
          SELECT INSPECTION TEST CASE PRESET
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TRAY_ANALYSIS_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const badgeClass = preset.score >= 85 ? 'badge-compliant' : preset.score >= 60 ? 'badge-partial' : 'badge-non-compliant';
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset.id, preset.sample_image)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid var(--border-emerald)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                      {preset.title}
                    </span>
                    <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
                      {preset.score}/100
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {preset.summary}
                  </p>
                </div>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid var(--emerald-400)' : '2px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected ? 'var(--emerald-500)' : 'transparent',
                    color: '#fff'
                  }}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tray Image Preview & Upload Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#070b12',
          border: '1px solid var(--border-subtle)',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {imagePreview ? (
          <div style={{ position: 'relative', width: '100%', height: '220px' }}>
            <img
              src={imagePreview}
              alt="Waste Tray inspection"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(9, 14, 23, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                📷 Inspection Tray Camera Stream (4K Sensor)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                ACTIVE READY
              </span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Camera size={40} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.85rem' }}>No tray photo captured yet</p>
          </div>
        )}
      </div>

      {/* Custom Upload Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label
          htmlFor="tray-upload-input"
          className="btn btn-secondary"
          style={{ flex: 1, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          <Upload size={16} />
          <span>Upload Custom Tray Image</span>
        </label>
        <input
          id="tray-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

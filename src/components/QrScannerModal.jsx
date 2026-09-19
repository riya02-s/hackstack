import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOUSEHOLD_PRESETS } from '../data/mockData';
import { QrCode, Scan, X, Check, Camera, Sparkles } from 'lucide-react';

export default function QrScannerModal({ isOpen, onClose, onSelectId }) {
  const { switchHousehold } = useApp();
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    onSelectId(id);
    switchHousehold(id);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleSelect(manualId.trim().toUpperCase());
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scan size={20} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Household QR Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Viewport Simulation */}
        <div
          style={{
            position: 'relative',
            height: '220px',
            background: '#070b12',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--border-emerald)'
          }}
        >
          {/* Target Reticle corners */}
          <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '3px solid #34d399', borderLeft: '3px solid #34d399' }} />
          <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '3px solid #34d399', borderRight: '3px solid #34d399' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '3px solid #34d399', borderLeft: '3px solid #34d399' }} />
          <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '3px solid #34d399', borderRight: '3px solid #34d399' }} />

          {/* Laser scanning line */}
          <div className="scan-overlay" />

          {/* Center simulated QR code icon */}
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            <QrCode size={64} style={{ opacity: 0.6, margin: '0 auto 8px auto' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Align household bin QR code within frame
            </p>
          </div>
        </div>

        {/* Quick-Pick Registered QR Tags */}
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick-Select Test Household QR:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
            {HOUSEHOLD_PRESETS.map((hh) => (
              <button
                key={hh.id}
                type="button"
                onClick={() => handleSelect(hh.id)}
                className="btn btn-secondary"
                style={{
                  padding: '8px 6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  borderColor: hh.id === 'HH-1027' ? 'var(--border-emerald)' : 'var(--border-subtle)'
                }}
              >
                <span style={{ fontWeight: 700, color: '#fff' }}>{hh.id}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {hh.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual ID Input */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Or enter House ID (e.g. HH-1027)"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
            <Check size={16} />
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}

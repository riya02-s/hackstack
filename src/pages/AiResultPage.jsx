import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Tag,
  Info,
  Layers,
  Truck
} from 'lucide-react';
import ScoreMeter from '../components/ScoreMeter';

export default function AiResultPage() {
  const {
    lastAnalysisResult,
    householdSummary,
    setActiveTab,
    setPickupDraft
  } = useApp();

  if (!lastAnalysisResult) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <ScanLine size={48} style={{ opacity: 0.5, margin: '0 auto 16px auto', color: 'var(--text-muted)' }} />
        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>No Inspection Analysis Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
          Please perform a pickup scan from the Collector Dashboard first.
        </p>
        <button
          onClick={() => setActiveTab('collector')}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          <Truck size={16} /> Open Collector App
        </button>
      </div>
    );
  }

  const {
    house_id,
    stream,
    score,
    status,
    confidence,
    contamination_pct,
    items = [],
    contaminants = [],
    points_delta,
    streak_delta,
    message,
    sample_image,
    summary
  } = lastAnalysisResult;

  const isCompliant = score >= 85;
  const isPartial = score >= 60 && score < 85;
  const isNonCompliant = score < 60;

  const handleStartNextPickup = () => {
    setActiveTab('collector');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {house_id}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--cyan-400)',
                fontWeight: 700,
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}
            >
              {stream}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {summary || 'Inspection completed via Truck Camera & YOLOv8 classification.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleStartNextPickup}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} />
            <span>Next Pickup</span>
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Flame size={16} className="streak-flame" />
            <span>View Citizen Streak</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid-2">
        {/* Left: Score Gauge & Decision */}
        <div
          className="glass-card"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          <ScoreMeter
            score={score}
            size={180}
            strokeWidth={14}
            status={status}
            confidence={confidence}
          />

          {/* Reward/Penalty Callout Box */}
          <div
            style={{
              width: '100%',
              background: isCompliant
                ? 'rgba(16, 185, 129, 0.08)'
                : isPartial
                ? 'rgba(245, 158, 11, 0.08)'
                : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${
                isCompliant
                  ? 'var(--border-emerald)'
                  : isPartial
                  ? 'var(--border-amber)'
                  : 'var(--border-rose)'
              }`,
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                {isCompliant
                  ? '🌟 Compliant Segregation'
                  : isPartial
                  ? '⚠️ Minor Cross-Contamination'
                  : '🚫 Non-Compliant Collection'}
              </span>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: isCompliant ? '#34d399' : isPartial ? '#fbbf24' : '#f87171'
                }}
              >
                {points_delta >= 0 ? `+${points_delta}` : points_delta} Points
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {message}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '4px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <span>Contamination Level: <strong>{contamination_pct}%</strong></span>
              <span>•</span>
              <span>
                Streak Effect:{' '}
                <strong style={{ color: isCompliant ? '#34d399' : isPartial ? '#fbbf24' : '#f87171' }}>
                  {isCompliant ? '+1 Day' : isPartial ? 'Holds Current' : 'Resets to 0'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Inspection Evidence & Camera Frame */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Camera Inspection Tray Evidence
            </span>
            <span className="badge badge-compliant" style={{ fontSize: '0.65rem' }}>
              AI Tagged
            </span>
          </div>

          {/* Image Container with simulated bounding boxes */}
          <div
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '220px',
              background: '#070b12',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {sample_image && (
              <img
                src={sample_image}
                alt="AI Inspection Tray Frame"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Bounding tags overlay */}
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              🔍 YOLOv8 Waste Vision Model
            </div>
          </div>

          {/* Classified Items Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              DETECTED STREAM ITEMS ({items.length})
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {items.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <CheckCircle2 size={12} />
                  {item.name}
                </span>
              ))}
            </div>
          </div>

          {/* Flagged Cross-Contaminants (if any) */}
          {contaminants.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.08)',
                borderRadius: '8px',
                border: '1px solid var(--border-rose)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#f87171' }}>
                <AlertTriangle size={14} />
                <span>CROSS-CONTAMINANTS FLAGGED ({contaminants.length})</span>
              </div>
              {contaminants.map((contam, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: '#fff' }}>
                  <strong>{contam.name}</strong>: {contam.suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => setActiveTab('history')}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <span>View Full Collection History</span>
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <span>Open Municipal Ward Analytics</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

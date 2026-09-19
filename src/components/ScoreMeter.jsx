import React from 'react';
import { Award, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ScoreMeter({ score = 0, size = 160, strokeWidth = 12, status, confidence }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#10b981'; // Green
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let statusBadgeClass = 'badge-compliant';
  let statusText = 'Compliant (+10 Pts)';
  let StatusIcon = ShieldCheck;

  if (clampedScore < 60) {
    color = '#ef4444'; // Red
    glowColor = 'rgba(239, 68, 68, 0.4)';
    statusBadgeClass = 'badge-non-compliant';
    statusText = 'Non-compliant (-10 Pts)';
    StatusIcon = AlertCircle;
  } else if (clampedScore < 85) {
    color = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
    statusBadgeClass = 'badge-partial';
    statusText = 'Partially Compliant (+2 Pts)';
    StatusIcon = AlertTriangle;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Score progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
            {clampedScore}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            / 100
          </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className={`badge ${statusBadgeClass}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
        <StatusIcon size={14} />
        <span>{status || statusText}</span>
      </div>

      {confidence && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          AI Confidence: <strong style={{ color: '#fff' }}>{(confidence * 100).toFixed(1)}%</strong>
        </div>
      )}
    </div>
  );
}

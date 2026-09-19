import React from 'react';

export default function StatCard({ title, value, subtitle, icon, trend, color = 'emerald' }) {
  const colorMap = {
    emerald: {
      border: 'var(--border-emerald)',
      glow: 'var(--shadow-glow-emerald)',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeText: '#34d399'
    },
    amber: {
      border: 'var(--border-amber)',
      glow: 'var(--shadow-glow-amber)',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeText: '#fbbf24'
    },
    rose: {
      border: 'var(--border-rose)',
      glow: 'var(--shadow-glow-rose)',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeText: '#f87171'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.35)',
      glow: '0 0 25px rgba(6, 182, 212, 0.25)',
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      badgeText: '#22d3ee'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {title}
        </span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: scheme.badgeBg,
            color: scheme.badgeText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${scheme.border}`
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>

      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: scheme.badgeText }}>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

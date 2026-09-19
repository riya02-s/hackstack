import React from 'react';

export default function WardChart({ wards = [] }) {
  if (!wards || wards.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No ward data available.</div>;
  }

  // Sort by compliance rate descending
  const sortedWards = [...wards].sort((a, b) => b.compliance_rate - a.compliance_rate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {sortedWards.map((w) => {
        const isGood = w.compliance_rate >= 85;
        const isAverage = w.compliance_rate >= 75 && w.compliance_rate < 85;
        const barColor = isGood ? 'linear-gradient(90deg, #10b981, #34d399)' : isAverage ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)';
        const badgeColor = isGood ? 'badge-compliant' : isAverage ? 'badge-partial' : 'badge-non-compliant';

        return (
          <div key={w.ward_id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{w.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({w.ward_id})</span>
                <span className={`badge ${badgeColor}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {w.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {w.households.toLocaleString()} homes
                </span>
                <span style={{ fontWeight: 800, color: isGood ? '#34d399' : isAverage ? '#fbbf24' : '#f87171' }}>
                  {w.compliance_rate}%
                </span>
              </div>
            </div>

            {/* Progress bar container */}
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: `${w.compliance_rate}%`,
                  height: '100%',
                  background: barColor,
                  borderRadius: '4px',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React, { useState } from 'react';

export default function TrendChart({ data = [], height = 220 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}
      >
        No historical collection records found.
      </div>
    );
  }

  // Reverse chronological order for left-to-right timeline
  const points = [...data].reverse();
  const width = 600;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((item, idx) => {
    const x = paddingX + (idx / Math.max(1, points.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - (item.score / 100) * graphHeight;
    return { ...item, x, y };
  });

  // SVG Line path string
  const pathD = coords.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // SVG Area path string
  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
    : '';

  const compliantThresholdY = paddingY + graphHeight - (85 / 100) * graphHeight;
  const warningThresholdY = paddingY + graphHeight - (60 / 100) * graphHeight;

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', minWidth: '320px', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Threshold guide lines */}
        <line
          x1={paddingX}
          y1={compliantThresholdY}
          x2={width - paddingX}
          y2={compliantThresholdY}
          stroke="rgba(16, 185, 129, 0.4)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text
          x={width - paddingX + 5}
          y={compliantThresholdY + 3}
          fill="rgba(16, 185, 129, 0.7)"
          fontSize="10"
          fontWeight="600"
        >
          85+ (Reward)
        </text>

        <line
          x1={paddingX}
          y1={warningThresholdY}
          x2={width - paddingX}
          y2={warningThresholdY}
          stroke="rgba(245, 158, 11, 0.4)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />
        <text
          x={width - paddingX + 5}
          y={warningThresholdY + 3}
          fill="rgba(245, 158, 11, 0.7)"
          fontSize="10"
          fontWeight="600"
        >
          60 (Warning)
        </text>

        {/* Base Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = paddingY + graphHeight - (val / 100) * graphHeight;
          return (
            <g key={val}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
              <text x={paddingX - 8} y={y + 3} fill="var(--text-muted)" fontSize="9" textAnchor="end">
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#scoreAreaGrad)" />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {coords.map((pt, idx) => {
          const isSelected = hoveredPoint?.collection_id === pt.collection_id;
          const ptColor = pt.score >= 85 ? '#10b981' : pt.score >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <g
              key={pt.collection_id || idx}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 7 : 4.5}
                fill={ptColor}
                stroke="#0f172a"
                strokeWidth="2.5"
                style={{
                  transition: 'r 0.15s ease',
                  filter: `drop-shadow(0 0 6px ${ptColor})`
                }}
              />
              {/* Date labels at bottom */}
              <text
                x={pt.x}
                y={height - 8}
                fill="var(--text-muted)"
                fontSize="9"
                textAnchor="middle"
                fontWeight="500"
              >
                {pt.date ? pt.date.slice(5) : `P${idx + 1}`}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-light)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            pointerEvents: 'none',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ fontWeight: 700, color: '#fff' }}>
            Score: <span style={{ color: hoveredPoint.score >= 85 ? '#34d399' : hoveredPoint.score >= 60 ? '#fbbf24' : '#f87171' }}>{hoveredPoint.score}/100</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            Stream: {hoveredPoint.stream} | {hoveredPoint.timestamp}
          </div>
          <div style={{ color: 'var(--emerald-400)', fontSize: '0.75rem', fontWeight: 600 }}>
            {hoveredPoint.points_earned >= 0 ? `+${hoveredPoint.points_earned}` : hoveredPoint.points_earned} Points
          </div>
        </div>
      )}
    </div>
  );
}

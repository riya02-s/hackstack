import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOUSEHOLD_PRESETS } from '../data/mockData';
import {
  History,
  TrendingUp,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Flame,
  Award,
  Calendar,
  Layers,
  X,
  UserCheck
} from 'lucide-react';
import TrendChart from '../components/TrendChart';

export default function HouseholdHistory() {
  const {
    activeHouseId,
    switchHousehold,
    householdSummary,
    householdHistory,
    isLoading
  } = useApp();

  const [selectedStreamFilter, setSelectedStreamFilter] = useState('All');
  const [selectedEvidencePickup, setSelectedEvidencePickup] = useState(null);

  const streams = ['All', 'Dry Waste', 'Wet Waste', 'Recyclables'];

  const filteredHistory = householdHistory.filter((item) => {
    if (selectedStreamFilter !== 'All' && item.stream !== selectedStreamFilter) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Household Info Banner */}
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
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              {householdSummary?.id || activeHouseId}
            </span>
            <span className="badge badge-compliant" style={{ fontSize: '0.7rem' }}>
              {householdSummary?.tier || 'Gold Eco-Citizen'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            {householdSummary?.name}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {householdSummary?.address} • {householdSummary?.ward}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={20} className="streak-flame" />
              {householdSummary?.current_streak || 0}d
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Streak</div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
              {householdSummary?.green_points || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Green Points</div>
          </div>

          <div style={{ width: '1px', height: '32px', background: 'var(--border-subtle)' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-400)' }}>
              {householdSummary?.best_streak || 0}d
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best Streak</div>
          </div>
        </div>
      </div>

      {/* Score Trend Chart Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--emerald-400)" />
              Segregation Score Progression
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Chronological inspection scores per collection pickup. Target: 85+ for Green Rewards.
            </p>
          </div>

          {/* Quick Filter tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {streams.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStreamFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedStreamFilter === st ? 'var(--emerald-600)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedStreamFilter === st ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <TrendChart data={householdHistory} height={230} />
      </div>

      {/* Historical Collection Log Records */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--emerald-400)" />
            Past Pickup Log Records ({filteredHistory.length})
          </h3>
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            No collection history records matching filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredHistory.map((pickup, idx) => {
              const isGood = pickup.score >= 85;
              const isAvg = pickup.score >= 60 && pickup.score < 85;
              const badgeClass = isGood ? 'badge-compliant' : isAvg ? 'badge-partial' : 'badge-non-compliant';

              return (
                <div
                  key={pickup.collection_id || idx}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isGood ? 'rgba(16, 185, 129, 0.15)' : isAvg ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isGood ? '#34d399' : isAvg ? '#fbbf24' : '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}
                    >
                      {pickup.score}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                          {pickup.stream}
                        </span>
                        <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
                          {pickup.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {pickup.timestamp} • {pickup.collector_id}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: pickup.points_earned >= 0 ? '#34d399' : '#f87171'
                        }}
                      >
                        {pickup.points_earned >= 0 ? `+${pickup.points_earned}` : pickup.points_earned} Pts
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Streak: {pickup.streak_count}d
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEvidencePickup(pickup)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      <Eye size={14} />
                      <span>Evidence</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Photo Evidence Modal */}
      {selectedEvidencePickup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
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
              maxWidth: '520px',
              padding: '24px',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  Inspection Evidence - {selectedEvidencePickup.collection_id}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedEvidencePickup.timestamp} • {selectedEvidencePickup.stream}
                </p>
              </div>
              <button
                onClick={() => setSelectedEvidencePickup(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tray Image */}
            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '10px',
                overflow: 'hidden',
                background: '#070b12',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={selectedEvidencePickup.image}
                alt="Evidence Tray"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Score & Contaminants summary */}
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                fontSize: '0.82rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div>
                Score: <strong>{selectedEvidencePickup.score}/100</strong>
              </div>
              <div>
                Status: <strong>{selectedEvidencePickup.status}</strong>
              </div>
              <div>
                Contaminants: <strong>{selectedEvidencePickup.contaminants_count}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvidencePickup(null)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Close Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

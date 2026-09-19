import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAdminAnalytics } from '../api';
import {
  Building2,
  ShieldAlert,
  Settings,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Users,
  Check,
  Save,
  RotateCcw,
  Sliders
} from 'lucide-react';
import StatCard from '../components/StatCard';
import WardChart from '../components/WardChart';

export default function AdminDashboard() {
  const { policy, savePolicySettings, isLoading: isGlobalLoading } = useApp();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [localPolicy, setLocalPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (policy) {
      setLocalPolicy({ ...policy });
    }
  }, [policy]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    if (localPolicy) {
      await savePolicySettings(localPolicy);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
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
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--cyan-400)',
                fontWeight: 700,
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}
            >
              MUNICIPAL CORPORATION OF GREATER BANGALORE
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            Solid Waste Management Admin & Compliance Command
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time telemetry, automated contamination detection & city-wide incentive policy control.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <RotateCcw size={16} />
          <span>Refresh Live Stats</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-4">
        <StatCard
          title="Monitored Households"
          value={analyticsData?.overview?.total_households?.toLocaleString() || '28,450'}
          subtitle="Registered with unique QR bins"
          icon={<Users size={20} />}
          trend="99.2% onboarding rate"
          color="cyan"
        />
        <StatCard
          title="City Compliance Average"
          value={`${analyticsData?.overview?.city_compliance_rate || 82.4}%`}
          subtitle="Score 85+ across all pickups"
          icon={<ShieldCheck size={20} />}
          trend="↑ 8.6% this month"
          color="emerald"
        />
        <StatCard
          title="Landfill Diversion"
          value={`${analyticsData?.overview?.contamination_prevented_tons || 142.8} Tons`}
          subtitle="Rescued from mixed dumping"
          icon={<TrendingUp size={20} />}
          trend="94% diversion efficiency"
          color="emerald"
        />
        <StatCard
          title="Active Violation Reviews"
          value={analyticsData?.overview?.active_penalties_issued || '84'}
          subtitle="Flagged by Edge vision"
          icon={<AlertTriangle size={20} />}
          trend="Under dispute review"
          color="amber"
        />
      </div>

      {/* Main Admin Section: Ward Analytics & Policy Controls */}
      <div className="grid-2">
        {/* Left: Ward Performance Rankings */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--cyan-400)" />
              Ward-wise Compliance Ranking
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Live compliance rates computed across municipal collection routes.
            </p>
          </div>

          <WardChart wards={analyticsData?.wards || []} />
        </div>

        {/* Right: Policy & Penalty Control Panel */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--emerald-400)" />
              Municipal Policy & Penalty Switch
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Configure reward-first thresholds, educational warnings, and financial penalties.
            </p>
          </div>

          {localPolicy && (
            <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Penalty Toggle */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                    Financial Penalty System
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    If disabled, violations trigger educational warnings only.
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={localPolicy.penalty_enabled}
                    onChange={(e) => setLocalPolicy({ ...localPolicy, penalty_enabled: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <span style={{ marginLeft: '8px', fontSize: '0.85rem', fontWeight: 700, color: localPolicy.penalty_enabled ? '#34d399' : '#f87171' }}>
                    {localPolicy.penalty_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </label>
              </div>

              {/* Warning Threshold: warn_after_n */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>Grace Violations Before Penalty (warn_after_n):</span>
                  <strong style={{ color: 'var(--amber-400)' }}>{localPolicy.warn_after_n} Violations</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={localPolicy.warn_after_n}
                  onChange={(e) => setLocalPolicy({ ...localPolicy, warn_after_n: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  First {localPolicy.warn_after_n} offenses will receive educational remediation notices without fines.
                </span>
              </div>

              {/* Penalty Amount */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                  Base Violation Fine (₹ INR):
                </label>
                <input
                  type="number"
                  value={localPolicy.penalty_fine_amount}
                  onChange={(e) => setLocalPolicy({ ...localPolicy, penalty_fine_amount: parseInt(e.target.value, 10) })}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isGlobalLoading}
                className="btn btn-primary"
                style={{ padding: '12px', marginTop: '4px' }}
              >
                <Save size={16} />
                <span>Save Policy Configuration</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Repeated Contamination Watch-list */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#f87171" />
            Repeat Contamination Household Watch-list
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Households with $\ge 2$ consecutive cross-contamination incidents requiring field intervention or educational counseling.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(analyticsData?.repeat_violators || []).map((hh) => (
            <div
              key={hh.id}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid var(--border-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{hh.id}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>- {hh.name}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {hh.ward} • Last Flagged: {hh.last_violation}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-non-compliant" style={{ fontSize: '0.7rem' }}>
                  {hh.violations_count} Violations
                </span>
                <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>
                  {hh.penalty_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

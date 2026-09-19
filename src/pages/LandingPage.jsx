import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Recycle,
  Sparkles,
  Truck,
  ScanLine,
  Flame,
  Award,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function LandingPage() {
  const { setActiveTab, switchHousehold } = useApp();

  const handleStartFlow = () => {
    switchHousehold('HH-1027');
    setActiveTab('collector');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '40px 0 20px 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* Top Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--border-emerald)',
            color: 'var(--emerald-400)',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
        >
          <Sparkles size={16} />
          <span>Reward-First Compliance Framework • Smart City 2026</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
            color: '#ffffff'
          }}
        >
          Waste Segregation at Source with{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI Tray Inspection & Green Rewards
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            lineHeight: 1.6
          }}
        >
          Identify mixed waste at the exact moment of doorstep collection. Scan household QR, inspect on a partitioned truck tray with Edge AI, and reward compliant families with municipal tax rebates and Green Points.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={handleStartFlow}
            className="btn btn-primary"
            style={{ fontSize: '1rem', padding: '12px 24px' }}
          >
            <Truck size={20} />
            <span>Launch Collector Inspection Demo</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className="btn btn-secondary"
            style={{ fontSize: '1rem', padding: '12px 24px' }}
          >
            <Flame size={20} className="streak-flame" />
            <span>View Citizen Streak & Points</span>
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid-4">
        <StatCard
          title="City Compliance Rate"
          value="82.4%"
          subtitle="Across 6 Municipal Wards"
          icon={<ShieldCheck size={20} />}
          trend="↑ 14.2% since reward rollout"
          color="emerald"
        />
        <StatCard
          title="Green Points Awarded"
          value="384,920"
          subtitle="Redeemable for utility rebates"
          icon={<Award size={20} />}
          trend="+12,400 points today"
          color="amber"
        />
        <StatCard
          title="Contamination Averted"
          value="142.8 Tons"
          subtitle="Organic & dry waste rescued"
          icon={<Recycle size={20} />}
          trend="94.2% landfill diversion"
          color="cyan"
        />
        <StatCard
          title="Active City Streaks"
          value="18,420"
          subtitle="Households with 7+ days streak"
          icon={<Flame size={20} />}
          trend="Avg 8.4 days active"
          color="emerald"
        />
      </section>

      {/* Interactive 4-Step Architecture Flow */}
      <section
        className="glass-card"
        style={{
          padding: '32px 24px',
          border: '1px solid var(--border-light)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--emerald-400)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            END-TO-END WORKFLOW
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            How Source-Segregation AI Verification Works
          </h2>
        </div>

        <div className="grid-4" style={{ position: 'relative' }}>
          {/* Step 1 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--emerald-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Unique Household ID</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Each home registers and gets a QR code (e.g. <code>HH-1027</code>) affixed to its color-coded bins.
            </p>
          </div>

          {/* Step 2 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--cyan-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Truck Partition Tray</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Collector scans ID and empties the bin onto a shallow partitioned tray (Wet / Dry / Hazardous).
            </p>
          </div>

          {/* Step 3 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--amber-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Edge AI Neural Scan</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Camera captures the tray. YOLOv8 model calculates contamination % and scores compliance out of 100.
            </p>
          </div>

          {/* Step 4 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--emerald-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Rewards & Streaks</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Compliant pickup adds +10 Green Points & streak increment. 30-day streak unlocks property tax rebates.
            </p>
          </div>
        </div>
      </section>

      {/* Role Navigation Cards */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Explore Platform Modules</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Experience the system from the perspective of field collectors, households, and municipal authorities.
          </p>
        </div>

        <div className="grid-3">
          {/* Collector Module */}
          <div
            className="glass-card glass-card-interactive"
            onClick={() => setActiveTab('collector')}
            style={{
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid var(--border-emerald)'
                }}
              >
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Collector Field App
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                Simulate doorstep pickups: scan bin QR codes, choose waste stream, capture truck tray images, and trigger AI inference.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-400)', fontWeight: 600, fontSize: '0.85rem' }}>
              <span>Open Field Scanner</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Household Portal */}
          <div
            className="glass-card glass-card-interactive"
            onClick={() => setActiveTab('points')}
            style={{
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--amber-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid var(--border-amber)'
                }}
              >
                <Flame size={24} className="streak-flame" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Household Points & Streak
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                Track family streak progression, view Green Points wallet, claim utility concessions, and review educational segregation tips.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber-400)', fontWeight: 600, fontSize: '0.85rem' }}>
              <span>View Household Rewards</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Municipal Admin */}
          <div
            className="glass-card glass-card-interactive"
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid rgba(6, 182, 212, 0.35)'
                }}
              >
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Municipal Admin Dashboard
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                City ward compliance rankings, repeat-offender alerts, penalty policy switches, and landfill diversion analytics.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan-400)', fontWeight: 600, fontSize: '0.85rem' }}>
              <span>Open Admin Center</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

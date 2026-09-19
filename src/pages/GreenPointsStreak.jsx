import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BADGES_DATA, REWARDS_CATALOG } from '../data/mockData';
import {
  Flame,
  Award,
  Sparkles,
  Gift,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  TrendingUp
} from 'lucide-react';

export default function GreenPointsStreak() {
  const { householdSummary, showToast, refreshHouseholdData } = useApp();
  const [redeemedIds, setRedeemedIds] = useState([]);

  const currentStreak = householdSummary?.current_streak || 0;
  const bestStreak = householdSummary?.best_streak || 0;
  const greenPoints = householdSummary?.green_points || 0;

  // Milestone towards 30 days
  const nextMilestoneDays = 30;
  const milestoneProgressPct = Math.min(100, Math.round((currentStreak / nextMilestoneDays) * 100));

  const handleRedeem = (reward) => {
    if (greenPoints < reward.points_required) {
      showToast(`Insufficient Green Points. You need ${reward.points_required - greenPoints} more points.`, 'warning');
      return;
    }
    setRedeemedIds(prev => [...prev, reward.id]);
    showToast(`Successfully redeemed "${reward.title}"! Voucher applied to municipal account.`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner: Streak & Wallet Hero Cards */}
      <div className="grid-2">
        {/* Streak Flame Card */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid var(--border-amber)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                CITIZEN STREAK TRACKER
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span className="streak-flame" style={{ fontSize: '2.4rem' }}>🔥</span>
                <div>
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                    {currentStreak}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#fbbf24', fontWeight: 700, marginLeft: '4px' }}>
                    Days Active
                  </span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-partial" style={{ fontSize: '0.7rem' }}>
                Best: {bestStreak} Days
              </span>
            </div>
          </div>

          {/* 30-Day Rebate Milestone Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span>Target: 30-Day Property Tax Rebate</span>
              <strong style={{ color: '#fbbf24' }}>{currentStreak} / 30 Days ({milestoneProgressPct}%)</strong>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '5px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${milestoneProgressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                  borderRadius: '5px',
                  transition: 'width 0.8s ease'
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Each clean segregation pickup (+10 pts) extends your streak. Keep it going to unlock tier rebates!
          </p>
        </div>

        {/* Green Points Wallet Card */}
        <div
          className="glass-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid var(--border-emerald)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-400)', textTransform: 'uppercase' }}>
                GREEN POINTS BALANCE
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {greenPoints}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--emerald-400)', fontWeight: 700 }}>
                  Pts
                </span>
              </div>
            </div>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--emerald-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={24} />
            </div>
          </div>

          {/* Scoring Rules Explanation */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
              fontSize: '0.75rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#34d399' }}>85–100</div>
              <div style={{ color: 'var(--text-muted)' }}>+10 Pts (Streak +1)</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#fbbf24' }}>60–84</div>
              <div style={{ color: 'var(--text-muted)' }}>+2 Pts (Holds)</div>
            </div>
            <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#f87171' }}>&lt;60</div>
              <div style={{ color: 'var(--text-muted)' }}>-10 Pts (Reset)</div>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Redeemable for municipal water credits, composting units, and property tax concessions.
          </p>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--amber-400)" />
            Citizen Eco Badges & Milestones
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Gamified achievements unlocked through disciplined source segregation.
          </p>
        </div>

        <div className="grid-4">
          {BADGES_DATA.map((badge) => {
            return (
              <div
                key={badge.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: badge.unlocked ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  border: badge.unlocked ? '1px solid var(--border-emerald)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  opacity: badge.unlocked ? 1 : 0.75
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                  {badge.unlocked ? (
                    <span className="badge badge-compliant" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle2 size={10} /> Unlocked
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{badge.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                    {badge.description}
                  </p>
                </div>

                {!badge.unlocked && badge.progress !== undefined && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Progress</span>
                      <span>{badge.progress} / {badge.max_progress}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                      <div
                        style={{
                          width: `${(badge.progress / badge.max_progress) * 100}%`,
                          height: '100%',
                          background: 'var(--emerald-400)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Marketplace */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={18} color="var(--emerald-400)" />
            Municipal Green Rewards Marketplace
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Trade your accumulated Green Points for certified city utility rebates and sustainable home products.
          </p>
        </div>

        <div className="grid-2">
          {REWARDS_CATALOG.map((item) => {
            const isRedeemed = redeemedIds.includes(item.id);
            const canAfford = greenPoints >= item.points_required;

            return (
              <div
                key={item.id}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
                        {item.title}
                      </span>
                      {item.popular && (
                        <span className="badge badge-partial" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px' }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
                      ⭐ {item.points_required} Points Required
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRedeem(item)}
                  disabled={isRedeemed}
                  className={`btn ${isRedeemed ? 'btn-secondary' : canAfford ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    opacity: isRedeemed ? 0.6 : 1
                  }}
                >
                  {isRedeemed ? (
                    <>
                      <CheckCircle2 size={14} /> Redeemed
                    </>
                  ) : (
                    'Claim Reward'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

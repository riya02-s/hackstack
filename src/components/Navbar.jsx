import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOUSEHOLD_PRESETS } from '../data/mockData';
import {
  Recycle,
  Truck,
  ScanLine,
  History,
  Flame,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    activeHouseId,
    switchHousehold,
    householdSummary
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHouseDropdownOpen, setIsHouseDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: <Recycle size={18} /> },
    { id: 'collector', label: 'Collector App', icon: <Truck size={18} /> },
    { id: 'ai-result', label: 'AI Inspection', icon: <ScanLine size={18} /> },
    { id: 'history', label: 'Household History', icon: <History size={18} /> },
    { id: 'points', label: 'Points & Streak', icon: <Flame size={18} /> },
    { id: 'admin', label: 'Admin Analytics', icon: <Building2 size={18} /> }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(9, 14, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              color: 'white'
            }}
          >
            <Recycle size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Sort<span style={{ color: 'var(--emerald-400)' }}>Right</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-400)',
                  fontWeight: 700,
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                AI SOURCE
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Reward-First Compliance</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Active Household Pill & Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Active Household dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsHouseDropdownOpen(!isHouseDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-emerald)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 8px #34d399'
                }}
              />
              <span style={{ fontWeight: 700, color: 'var(--emerald-400)' }}>{activeHouseId}</span>
              {householdSummary && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '12px',
                    color: '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}
                >
                  <Flame size={12} className="streak-flame" />
                  {householdSummary.current_streak}d
                </span>
              )}
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu */}
            {isHouseDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                  zIndex: 2000
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  SWITCH DEMO HOUSEHOLD
                </div>
                {HOUSEHOLD_PRESETS.map((hh) => (
                  <div
                    key={hh.id}
                    onClick={() => {
                      switchHousehold(hh.id);
                      setIsHouseDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: activeHouseId === hh.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      border: activeHouseId === hh.id ? '1px solid var(--border-emerald)' : '1px solid transparent',
                      marginBottom: '4px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{hh.id}</span>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                        🔥 {hh.current_streak}d | ⭐ {hh.green_points} pts
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {hh.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === item.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeTab === item.id ? 'var(--emerald-400)' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Embedded CSS for responsive navbar toggle */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

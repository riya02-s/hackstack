import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import CollectorDashboard from './pages/CollectorDashboard';
import AiResultPage from './pages/AiResultPage';
import HouseholdHistory from './pages/HouseholdHistory';
import GreenPointsStreak from './pages/GreenPointsStreak';
import AdminDashboard from './pages/AdminDashboard';

function MainLayout() {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'collector':
        return <CollectorDashboard />;
      case 'ai-result':
        return <AiResultPage />;
      case 'history':
        return <HouseholdHistory />;
      case 'points':
        return <GreenPointsStreak />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main className="main-content">
        {renderActivePage()}
      </main>

      <Toast />

      {/* Global Footer */}
      <footer
        style={{
          background: 'rgba(5, 8, 15, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 20px',
          marginTop: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>SortRight AI</span>
            <span>•</span>
            <span>Waste Segregation at Source (Reward-First Compliance Framework)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
              Edge AI Telemetry: Online
            </span>
            <span>Person 3: Frontend & Analytics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

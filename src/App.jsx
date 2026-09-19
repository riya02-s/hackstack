import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiService } from './services/api';
import './App.css';

import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import CollectorDashboard from './pages/CollectorDashboard';
import AiResultPage from './pages/AiResultPage';
import HouseholdHistory from './pages/HouseholdHistory';
import GreenPointsStreak from './pages/GreenPointsStreak';
import AdminDashboard from './pages/AdminDashboard';

// Direct Inspector Portal Component (Preserves single-page workflow)
function DirectInspectorPortal() {
  const [backendHealth, setBackendHealth] = useState({ online: false, checking: true, details: null });

  const [householdIdInput, setHouseholdIdInput] = useState('');
  const [household, setHousehold] = useState(null);
  const [householdLoading, setHouseholdLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', address: '', green_points: 0, streak: 0 });

  const [isScanningQR, setIsScanningQR] = useState(false);
  const [qrScannerError, setQrScannerError] = useState(null);
  const qrScannerRef = useRef(null);

  const [inspectionHistory, setInspectionHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const [wasteStream, setWasteStream] = useState('wet');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(null);

  const [alert, setAlert] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setBackendHealth((prev) => ({ ...prev, checking: true }));
    try {
      const data = await apiService.getHealth();
      setBackendHealth({ online: true, checking: false, details: data });
    } catch (err) {
      setBackendHealth({ online: false, checking: false, details: err.message });
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 6000);
  };

  const loadInspectionHistory = async (householdId) => {
    if (!householdId) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const records = await apiService.getHouseholdInspections(householdId);
      setInspectionHistory(records);
    } catch (err) {
      setHistoryError(err.message);
      setInspectionHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLookup = async (idToSearch) => {
    const searchId = idToSearch || householdIdInput.trim();
    if (!searchId) {
      showAlert('error', 'Please enter a Household ID or scan a QR code.');
      return;
    }

    setHouseholdLoading(true);
    setAlert(null);
    try {
      const data = await apiService.getHousehold(searchId);
      setHousehold(data);
      setHouseholdIdInput(data.household_id);
      showAlert('success', `Household "${data.name}" loaded successfully.`);
      loadInspectionHistory(data.household_id);
    } catch (err) {
      setHousehold(null);
      setInspectionHistory([]);
      showAlert('error', err.message);
    } finally {
      setHouseholdLoading(false);
    }
  };

  useEffect(() => {
    let html5QrcodeScanner = null;
    if (isScanningQR) {
      setQrScannerError(null);
      const timer = setTimeout(() => {
        try {
          html5QrcodeScanner = new Html5Qrcode("qr-reader");
          qrScannerRef.current = html5QrcodeScanner;

          html5QrcodeScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
              let cleanId = decodedText.trim();
              if (cleanId.includes("household_id=")) {
                cleanId = cleanId.split("household_id=")[1].split("&")[0];
              }
              if (qrScannerRef.current) {
                qrScannerRef.current
                  .stop()
                  .catch(() => {})
                  .then(() => {
                    setIsScanningQR(false);
                    handleLookup(cleanId);
                  });
              }
            },
            () => {}
          ).catch((err) => {
            setQrScannerError(`Camera Access Failed: ${err.message || 'Please check camera permissions.'}`);
          });
        } catch (e) {
          setQrScannerError(`Scanner error: ${e.message}`);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (qrScannerRef.current) {
          qrScannerRef.current.stop().catch(() => {});
          qrScannerRef.current = null;
        }
      };
    }
  }, [isScanningQR]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.address) {
      showAlert('error', 'Name and address are required fields.');
      return;
    }

    setHouseholdLoading(true);
    try {
      const created = await apiService.registerHousehold(regForm);
      setHousehold(created);
      setHouseholdIdInput(created.household_id);
      setShowRegisterModal(false);
      setRegForm({ name: '', address: '', green_points: 0, streak: 0 });
      showAlert('success', `Registered household "${created.name}" (ID: ${created.household_id})`);
      loadInspectionHistory(created.household_id);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setHouseholdLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const handleQuickSelectHousehold = async (preset) => {
    setHouseholdLoading(true);
    try {
      const data = await apiService.getHousehold(preset.id);
      setHousehold(data);
      setHouseholdIdInput(data.household_id);
      showAlert('success', `Loaded Household: ${data.name}`);
      loadInspectionHistory(data.household_id);
    } catch {
      try {
        const created = await apiService.registerHousehold({
          name: preset.name,
          address: preset.address,
          green_points: preset.points,
          streak: preset.streak,
        });
        setHousehold(created);
        setHouseholdIdInput(created.household_id);
        showAlert('success', `Registered Demo Household: ${created.name}`);
        loadInspectionHistory(created.household_id);
      } catch (err) {
        showAlert('error', err.message);
      }
    } finally {
      setHouseholdLoading(false);
    }
  };

  const handleSelectSampleImage = (type) => {
    let svgContent = '';
    let filename = '';
    if (type === 'wet') {
      filename = 'organic_wet_waste.svg';
      setWasteStream('wet');
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#15803d"/>
        <circle cx="100" cy="120" r="40" fill="#22c55e"/>
        <path d="M150 180 Q180 120 220 190 T260 210" fill="none" stroke="#86efac" stroke-width="12"/>
        <text x="30" y="270" font-family="sans-serif" font-size="18" fill="#ffffff" font-weight="bold">CLEAN ORGANIC WET</text>
      </svg>`;
    } else if (type === 'dry') {
      filename = 'recyclable_dry_waste.svg';
      setWasteStream('dry');
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#f8fafc"/>
        <rect x="40" y="40" width="220" height="150" fill="#cbd5e1" stroke="#94a3b8" stroke-width="6"/>
        <circle cx="150" cy="115" r="30" fill="#38bdf8"/>
        <text x="25" y="260" font-family="sans-serif" font-size="18" fill="#0f172a" font-weight="bold">CLEAN RECYCLABLE DRY</text>
      </svg>`;
    } else {
      filename = 'contaminated_mixed_waste.svg';
      setWasteStream('wet');
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect width="300" height="300" fill="#78350f"/>
        <rect x="50" y="50" width="120" height="100" fill="#cbd5e1"/>
        <circle cx="200" cy="180" r="50" fill="#ef4444"/>
        <text x="25" y="270" font-family="sans-serif" font-size="18" fill="#fef08a" font-weight="bold">CONTAMINATED MIXED</text>
      </svg>`;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const file = new File([blob], filename, { type: 'image/svg+xml' });
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    showAlert('success', `Loaded Demo Sample Photo: ${filename}`);
  };

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();

    const targetHouseholdId = householdIdInput.trim();
    if (!targetHouseholdId) {
      showAlert('error', 'Please enter or select a Household ID before submitting.');
      return;
    }

    if (!selectedFile) {
      showAlert('error', 'Please upload or select a waste inspection photo.');
      return;
    }

    setInspecting(true);
    setAlert(null);
    setInspectionResult(null);

    try {
      const result = await apiService.submitInspection({
        householdId: targetHouseholdId,
        declaredStream: wasteStream,
        imageFile: selectedFile,
      });

      setInspectionResult(result);
      showAlert(
        'success',
        `Inspection #${result.inspection_id} completed! Compliance: ${result.compliance_score}% | Points: +${result.green_points_awarded}`
      );

      try {
        const updatedHousehold = await apiService.getHousehold(targetHouseholdId);
        setHousehold(updatedHousehold);
      } catch {
        // Ignore if household refresh fails
      }

      loadInspectionHistory(targetHouseholdId);
    } catch (err) {
      showAlert('error', err.message || 'Inspection submission failed.');
    } finally {
      setInspecting(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">🌱</span>
          <div>
            <h1>EcoClean Portal</h1>
            <p className="subtitle">Smart Waste Management & Segregation Portal</p>
          </div>
        </div>

        <div className={`health-badge ${backendHealth.online ? 'online' : 'offline'}`}>
          <span className="dot"></span>
          <span>
            {backendHealth.checking
              ? 'Connecting...'
              : backendHealth.online
              ? 'Backend API Connected'
              : 'Backend Offline'}
          </span>
          {!backendHealth.online && !backendHealth.checking && (
            <button className="retry-btn" onClick={checkHealth}>
              Retry
            </button>
          )}
        </div>
      </header>

      {alert && (
        <div className={`alert-banner alert-${alert.type}`}>
          <span className="alert-icon">{alert.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="alert-text">{alert.message}</span>
          <button className="alert-close" onClick={() => setAlert(null)}>
            ✕
          </button>
        </div>
      )}

      <main className="main-content">
        <section className="card-section">
          <div className="card-header">
            <h2>🔍 Household Lookup & QR Scanner</h2>
            <p>Scan a QR code or enter a household ID to inspect waste and record points.</p>
          </div>

          <div className="lookup-bar">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Household ID (e.g. hh_12345)"
                value={householdIdInput}
                onChange={(e) => setHouseholdIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleLookup()}
                disabled={householdLoading}
              >
                {householdLoading ? 'Searching...' : 'Lookup'}
              </button>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setIsScanningQR(true)}
              disabled={householdLoading}
            >
              📷 Scan QR with Camera
            </button>

            <button
              className="btn btn-outline"
              onClick={() => setShowRegisterModal(!showRegisterModal)}
            >
              ➕ {showRegisterModal ? 'Close Form' : 'Register New Household'}
            </button>
          </div>

          <div className="preset-bar">
            <span className="preset-label">Quick Select Demo Household:</span>
            <button
              className="chip-btn"
              onClick={() =>
                handleQuickSelectHousehold({
                  id: 'hh_singla_01',
                  name: 'Singla Residence',
                  address: '123 Eco Green Way, Sector 4',
                  points: 120,
                  streak: 5,
                })
              }
            >
              🏠 Singla Residence
            </button>
            <button
              className="chip-btn"
              onClick={() =>
                handleQuickSelectHousehold({
                  id: 'hh_green_02',
                  name: 'Green Villa Demo',
                  address: '45 Solar Avenue, Ward 2',
                  points: 60,
                  streak: 2,
                })
              }
            >
              🏡 Green Villa
            </button>
            <button
              className="chip-btn"
              onClick={() =>
                handleQuickSelectHousehold({
                  id: 'hh_society_03',
                  name: 'Eco Heights Society',
                  address: '789 Recycling Tower, Ward 9',
                  points: 200,
                  streak: 10,
                })
              }
            >
              🏢 Eco Heights
            </button>
          </div>

          {isScanningQR && (
            <div className="qr-modal-overlay">
              <div className="qr-modal-card">
                <div className="qr-modal-header">
                  <h3>📷 Camera QR Code Scanner</h3>
                  <button className="modal-close-btn" onClick={() => setIsScanningQR(false)}>
                    ✕
                  </button>
                </div>
                <div className="qr-modal-body">
                  <p className="qr-instruction">Point device camera at a household QR code</p>
                  <div id="qr-reader" className="qr-viewport"></div>
                  {qrScannerError && <div className="qr-error-box">⚠️ {qrScannerError}</div>}
                </div>
                <div className="qr-modal-footer">
                  <button className="btn btn-outline" onClick={() => setIsScanningQR(false)}>
                    Cancel Scan
                  </button>
                </div>
              </div>
            </div>
          )}

          {showRegisterModal && (
            <form className="register-form" onSubmit={handleRegisterSubmit}>
              <h3>Register New Household</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Resident / Household Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Singla Residence"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123 Eco Green Way, Sector 4"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Initial Green Points</label>
                  <input
                    type="number"
                    min="0"
                    value={regForm.green_points}
                    onChange={(e) => setRegForm({ ...regForm, green_points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-field">
                  <label>Streak (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={regForm.streak}
                    onChange={(e) => setRegForm({ ...regForm, streak: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={householdLoading}>
                {householdLoading ? 'Registering...' : 'Save Household'}
              </button>
            </form>
          )}

          {household && (
            <div className="household-profile-card">
              <div className="profile-main">
                <div className="profile-avatar">🏠</div>
                <div>
                  <div className="profile-id">ID: {household.household_id}</div>
                  <h3 className="profile-name">{household.name}</h3>
                  <div className="profile-address">📍 {household.address}</div>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-box points">
                  <span className="stat-label">Green Points</span>
                  <span className="stat-value">🌿 {household.green_points}</span>
                </div>
                <div className="stat-box streak">
                  <span className="stat-label">Segregation Streak</span>
                  <span className="stat-value">🔥 {household.streak} Days</span>
                </div>
              </div>

              <div className="history-container">
                <h4 className="history-title">📜 Inspection History</h4>

                {historyLoading && <div className="history-status">Loading past inspection records...</div>}

                {historyError && (
                  <div className="history-status error-text">⚠️ Failed to load history: {historyError}</div>
                )}

                {!historyLoading && !historyError && inspectionHistory.length === 0 && (
                  <div className="history-empty">No past inspection records found for this household yet.</div>
                )}

                {!historyLoading && inspectionHistory.length > 0 && (
                  <div className="history-list">
                    {inspectionHistory.map((rec) => (
                      <div
                        key={rec.inspection_id}
                        className={`history-item ${rec.is_segregated ? 'item-pass' : 'item-fail'}`}
                      >
                        <div className="history-item-header">
                          <span className={`status-pill ${rec.is_segregated ? 'pill-success' : 'pill-danger'}`}>
                            {rec.is_segregated ? 'Clean' : 'Contaminated'} ({rec.declared_waste_stream.toUpperCase()})
                          </span>
                          <span className="history-time">{new Date(rec.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="history-item-body">
                          <div>
                            <strong>Score:</strong> {rec.compliance_score}% | <strong>Points:</strong> +{rec.green_points_awarded} 🌿
                          </div>
                          <div className="history-tags">
                            {rec.detected_items.map((item, idx) => (
                              <span key={idx} className="mini-tag">
                                {item.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="card-section">
          <div className="card-header">
            <h2>📸 AI Waste Inspection</h2>
            <p>Upload a photo of the waste stream to evaluate segregation compliance and award green points.</p>
          </div>

          <form className="inspection-form" onSubmit={handleInspectionSubmit}>
            <div className="form-row">
              <div className="form-field flex-1">
                <label>Target Household ID *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter or select Household ID"
                  value={householdIdInput}
                  onChange={(e) => setHouseholdIdInput(e.target.value)}
                />
              </div>

              <div className="form-field flex-1">
                <label>Declared Waste Stream *</label>
                <div className="stream-selector">
                  <button
                    type="button"
                    className={`stream-btn ${wasteStream === 'wet' ? 'active wet' : ''}`}
                    onClick={() => setWasteStream('wet')}
                  >
                    🍏 Wet Waste (Organic)
                  </button>
                  <button
                    type="button"
                    className={`stream-btn ${wasteStream === 'dry' ? 'active dry' : ''}`}
                    onClick={() => setWasteStream('dry')}
                  >
                    📦 Dry Waste (Recyclable)
                  </button>
                </div>
              </div>
            </div>

            <div className="preset-bar">
              <span className="preset-label">Demo Sample Photos:</span>
              <button
                type="button"
                className="chip-btn chip-green"
                onClick={() => handleSelectSampleImage('wet')}
              >
                🍏 Clean Organic (Wet)
              </button>
              <button
                type="button"
                className="chip-btn chip-blue"
                onClick={() => handleSelectSampleImage('dry')}
              >
                📦 Clean Recyclable (Dry)
              </button>
              <button
                type="button"
                className="chip-btn chip-red"
                onClick={() => handleSelectSampleImage('dirty')}
              >
                ⚠️ Contaminated Mix
              </button>
            </div>

            <div className="form-field">
              <label>Waste Inspection Photo *</label>
              <div className="upload-dropzone">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="waste-file-input"
                  onChange={handleFileChange}
                />
                <label htmlFor="waste-file-input" className="dropzone-label">
                  {imagePreview ? (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Waste Upload Preview" className="image-preview" />
                      <span className="change-img-text">Click to change photo</span>
                    </div>
                  ) : (
                    <div className="dropzone-prompt">
                      <span className="upload-icon">📷</span>
                      <span>Click or drag image to upload waste photo</span>
                      <span className="subtext">Supports PNG, JPG, JPEG</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={inspecting || !backendHealth.online}
            >
              {inspecting ? 'Analyzing Image with AI...' : 'Submit Waste Inspection'}
            </button>
          </form>

          {inspectionResult && (
            <div className={`result-card ${inspectionResult.is_segregated ? 'result-clean' : 'result-contaminated'}`}>
              <div className="result-header">
                <div>
                  <div className="badge-row">
                    <span className={`status-pill ${inspectionResult.is_segregated ? 'pill-success' : 'pill-danger'}`}>
                      {inspectionResult.is_segregated ? 'Clean & Segregated' : 'Contaminated'}
                    </span>
                    <span className={`status-pill ${inspectionResult.needs_review ? 'pill-warning' : 'pill-info'}`}>
                      {inspectionResult.needs_review ? '⚠️ Needs Manual Review' : '✨ Verified Automated'}
                    </span>
                  </div>
                  <h3>Inspection #{inspectionResult.inspection_id}</h3>
                  <div className="timestamp">🕒 {new Date(inspectionResult.timestamp).toLocaleString()}</div>
                </div>

                <div className="points-award-box">
                  <span className="award-label">Points Awarded</span>
                  <span className="award-value">+{inspectionResult.green_points_awarded} 🌿</span>
                </div>
              </div>

              <div className="result-body">
                <div className="meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">🎯 AI Confidence Score</span>
                    <span className="meta-value">
                      {Math.round((inspectionResult.confidence_score || 0.95) * 100)}%
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">🏷️ Categorized Stream</span>
                    <span className="meta-value uppercase">{inspectionResult.waste_category || 'wet'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⚙️ Engine Source</span>
                    <span className="meta-value">{inspectionResult.prediction_source || 'image_content_analyzer_v1'}</span>
                  </div>
                </div>

                <div className="score-section">
                  <div className="score-header">
                    <span>Compliance Score</span>
                    <span className="score-percent">{inspectionResult.compliance_score}%</span>
                  </div>
                  <div className="score-bar-bg">
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${inspectionResult.compliance_score}%`,
                        backgroundColor: inspectionResult.compliance_score > 70 ? '#10b981' : '#ef4444',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="items-section">
                  <span className="section-label">AI Detected Items:</span>
                  <div className="item-tags">
                    {inspectionResult.detected_items.map((item, idx) => (
                      <span key={idx} className="item-tag">
                        🏷️ {item.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Main Layout Router Component
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
      case 'portal':
        return <DirectInspectorPortal />;
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
            <span>Backend & Frontend Integrated</span>
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

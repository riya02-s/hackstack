import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, closeToast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon" size={20} color="#34d399" />;
      case 'warning':
        return <AlertTriangle className="toast-icon" size={20} color="#fbbf24" />;
      case 'error':
        return <AlertCircle className="toast-icon" size={20} color="#f87171" />;
      default:
        return <Info className="toast-icon" size={20} color="#38bdf8" />;
    }
  };

  const borderClass = {
    success: 'var(--border-emerald)',
    warning: 'var(--border-amber)',
    error: 'var(--border-rose)',
    info: 'var(--border-light)'
  }[toast.type] || 'var(--border-subtle)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${borderClass}`,
        borderRadius: '12px',
        padding: '12px 18px',
        color: '#f8fafc',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {getIcon()}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
      <button
        onClick={closeToast}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px'
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

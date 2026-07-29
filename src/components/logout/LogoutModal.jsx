import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X, CheckCircle } from 'lucide-react';

export default function LogoutModal({ onClose }) {
  const [phase, setPhase] = useState('confirm'); // confirm | loading | success
  const navigate = useNavigate();

  const handleLogout = () => {
    setPhase('loading');
    setTimeout(() => {
      setPhase('success');
      setTimeout(() => navigate('/'), 1500);
    }, 2000);
  };

  return (
    <div className="lg-modal-overlay" onClick={phase === 'confirm' ? onClose : undefined}>
      <div className="lg-modal" onClick={e => e.stopPropagation()}>

        {phase === 'confirm' && (
          <>
            <div className="lg-modal-icon-wrap">
              <div className="lg-modal-icon"><LogOut size={24} /></div>
            </div>
            <div className="lg-modal-body">
              <div className="lg-modal-title">Confirm Logout</div>
              <p className="lg-modal-msg">
                Are you sure you want to securely log out of FleetGuard?<br />
                Your current session will be terminated.
              </p>
              <div className="lg-modal-footer">
                <button className="lg-btn lg-btn-ghost" onClick={onClose}>
                  <X size={14} /> Cancel
                </button>
                <button className="lg-btn lg-btn-danger" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'loading' && (
          <div className="lg-spinner-wrap">
            <div className="lg-spinner" />
            <div className="lg-spinner-text">Securely logging you out…</div>
          </div>
        )}

        {phase === 'success' && (
          <div className="lg-success-wrap">
            <div className="lg-success-icon"><CheckCircle size={26} /></div>
            <div className="lg-success-title">Logged Out Successfully</div>
            <div className="lg-success-sub">You have been securely logged out. Redirecting…</div>
          </div>
        )}

      </div>
    </div>
  );
}

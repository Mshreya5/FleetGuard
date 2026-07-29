import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserCircle2, Settings, Bell, LogOut,
  X, CheckCircle,
} from 'lucide-react';
import './ProfileDropdown.css';

const USER = {
  name:    'Kiran Shree',
  role:    'Fleet Manager',
  email:   'kiran.shree@fleetguard.io',
  initials:'KS',
};

const MENU_ITEMS = [
  { icon: UserCircle2, label: 'View Profile',       to: '/profile' },
  { icon: Settings,    label: 'Account Settings',   to: '/profile' },
  { icon: Bell,        label: 'Notifications',      to: '/notifications' },
];

/* ── Toast ───────────────────────────────────────────── */
function Toast({ message }) {
  return (
    <div className="pd-toast">
      <div className="pd-toast-icon"><CheckCircle size={13} /></div>
      {message}
    </div>
  );
}

/* ── Logout Modal ────────────────────────────────────── */
function LogoutModal({ onClose, onConfirm }) {
  const [phase, setPhase] = useState('confirm');

  const handleConfirm = () => {
    setPhase('loading');
    setTimeout(() => {
      setPhase('success');
      setTimeout(onConfirm, 1200);
    }, 1800);
  };

  return (
    <div className="pd-modal-overlay" onClick={phase === 'confirm' ? onClose : undefined}>
      <div className="pd-modal" onClick={e => e.stopPropagation()}>

        {phase === 'confirm' && (
          <>
            <div className="pd-modal-icon-wrap">
              <div className="pd-modal-icon"><LogOut size={24} /></div>
            </div>
            <div className="pd-modal-body">
              <div className="pd-modal-title">Confirm Logout</div>
              <p className="pd-modal-msg">
                Are you sure you want to securely log out of FleetGuard?
              </p>
              <div className="pd-modal-footer">
                <button className="pd-btn pd-btn-ghost" onClick={onClose}>
                  <X size={14} /> Cancel
                </button>
                <button className="pd-btn pd-btn-danger" onClick={handleConfirm}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'loading' && (
          <div className="pd-spinner-wrap">
            <div className="pd-spinner" />
            <div className="pd-spinner-text">Securely logging you out…</div>
          </div>
        )}

        {phase === 'success' && (
          <div className="pd-success-wrap">
            <div className="pd-success-icon"><CheckCircle size={24} /></div>
            <div className="pd-success-title">Logged Out Successfully</div>
            <div className="pd-success-sub">Redirecting to home…</div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Profile Dropdown ────────────────────────────────── */
export default function ProfileDropdown() {
  const [open,       setOpen]       = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [showToast,  setShowToast]  = useState(false);
  const wrapRef  = useRef(null);
  const navigate = useNavigate();

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openLogout = () => { setOpen(false); setShowModal(true); };

  const handleLogoutConfirmed = () => {
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 2000);
  };

  return (
    <>
      <div className="pd-wrap" ref={wrapRef}>
        <button
          className={`pd-trigger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Profile menu"
        >
          {USER.initials}
        </button>

        {open && (
          <div className="pd-dropdown">
            {/* User info */}
            <div className="pd-user-header">
              <div className="pd-avatar-wrap">
                <div className="pd-user-avatar">{USER.initials}</div>
                <span className="pd-online-dot" />
              </div>
              <div className="pd-user-info">
                <div className="pd-user-name">{USER.name}</div>
                <div className="pd-user-role">{USER.role}</div>
                <div className="pd-user-email">{USER.email}</div>
              </div>
            </div>

            {/* Menu items */}
            <div className="pd-menu">
              {MENU_ITEMS.map(({ icon: Icon, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="pd-menu-item"
                  onClick={() => setOpen(false)}
                >
                  <div className="pd-menu-item-icon"><Icon size={15} /></div>
                  {label}
                </Link>
              ))}

              <div className="pd-divider" />

              <button className="pd-menu-item logout" onClick={openLogout}>
                <div className="pd-menu-item-icon"><LogOut size={15} /></div>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <LogoutModal
          onClose={() => setShowModal(false)}
          onConfirm={handleLogoutConfirmed}
        />
      )}

      {showToast && <Toast message="Successfully logged out." />}
    </>
  );
}

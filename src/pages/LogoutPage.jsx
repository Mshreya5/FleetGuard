import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Monitor, Clock, Activity, Layers,
  Home, BarChart2, Wrench, FileText, Users,
  Shield, Bell, LogOut, Menu, UserCircle2,
  RefreshCw, XCircle, AlertTriangle,
} from 'lucide-react';
import SessionCard          from '../components/logout/SessionCard';
import ActiveSessionsTable  from '../components/logout/ActiveSessionsTable';
import LogoutModal          from '../components/logout/LogoutModal';
import SessionHistory       from '../components/logout/SessionHistory';
import SecurityInfo         from '../components/logout/SecurityInfo';
import NotificationBell     from '../components/notifications/NotificationBell';
import './LogoutPage.css';

/* ── Mock Data ───────────────────────────────────────── */
const CURRENT_USER = {
  name:      'Kiran Shree',
  role:      'Fleet Manager',
  email:     'kiran.shree@fleetguard.io',
  browser:   'Chrome 126',
  os:        'Windows 11',
  ip:        '192.168.1.20',
  loginTime: '29 Jul 2026, 09:30 AM',
  status:    'Active',
};

const INITIAL_SESSIONS = [
  { id: 1, device: 'Windows Laptop', deviceType: 'laptop', os: 'Windows 11',  browser: 'Chrome 126',  location: 'Bengaluru', loginTime: 'Today 09:30 AM',  status: 'Active', isCurrent: true  },
  { id: 2, device: 'Android Phone',  deviceType: 'phone',  os: 'Android 14',  browser: 'Chrome 126',  location: 'Bengaluru', loginTime: 'Yesterday 06:00 PM', status: 'Active', isCurrent: false },
  { id: 3, device: 'iPad Tablet',    deviceType: 'tablet', os: 'iPadOS 17',   browser: 'Safari 17',   location: 'Chennai',   loginTime: '2 days ago',        status: 'Expired', isCurrent: false },
];

const NAV_ITEMS = [
  { icon: Home,      label: 'Dashboard',     to: '/' },
  { icon: Truck,     label: 'Vehicles',      to: '/vehicles' },
  { icon: Users,     label: 'Drivers',       to: '/drivers' },
  { icon: Wrench,    label: 'Maintenance',   to: '/maintenance' },
  { icon: FileText,  label: 'Documents',     to: '/documents' },
  { icon: BarChart2, label: 'Reports',       to: '/reports' },
  { icon: Shield,    label: 'Audit Logs',    to: '/audit-logs' },
  { icon: Bell,      label: 'Notifications', to: '/notifications' },
  { icon: LogOut,    label: 'Logout',        to: '/logout', active: true },
];

/* ── Page ────────────────────────────────────────────── */
export default function LogoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [sessions,    setSessions]    = useState(INITIAL_SESSIONS);
  const [hasSession]                  = useState(true);

  const activeSessions = sessions.filter(s => s.status === 'Active').length;

  const endSession = (id) => setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Expired' } : s));

  const endOtherSessions = () =>
    setSessions(prev => prev.map(s => s.isCurrent ? s : { ...s, status: 'Expired' }));

  const refreshSessions = () => setSessions(INITIAL_SESSIONS);

  return (
    <div className="lg-shell">
      {/* Mobile toggle */}
      <button className="lg-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
        <Menu size={18} />
      </button>

      {/* Sidebar */}
      <aside className={`lg-sidebar${sidebarOpen ? ' open' : ''}`}>
        <Link to="/" className="lg-sidebar-logo" onClick={() => setSidebarOpen(false)}>
          <div className="lg-sidebar-logo-icon"><Truck size={17} color="#fff" /></div>
          <span className="lg-sidebar-logo-text">Fleet<span>Guard</span></span>
        </Link>

        <div className="lg-sidebar-section">Main Menu</div>
        <nav className="lg-sidebar-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              className={`lg-nav-item${active ? ' active' : ''}${label === 'Logout' ? ' danger' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>

        <div className="lg-sidebar-footer">
          <button className="lg-nav-item danger" onClick={() => setShowModal(true)}>
            <LogOut size={16} /> Sign Out Now
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="lg-topbar">
        <div className="lg-topbar-left">
          <LogOut size={18} color="#ef4444" />
          <span className="lg-topbar-title">Logout &amp; Session Management</span>
        </div>
        <div className="lg-topbar-right">
          <NotificationBell />
          <Link to="/profile" className="lg-topbar-btn">
            <UserCircle2 size={18} />
          </Link>
          <div className="lg-avatar">KS</div>
        </div>
      </header>

      {/* Main */}
      <main className="lg-main">

        {!hasSession ? (
          /* ── Empty State ── */
          <div className="lg-surface">
            <div className="lg-empty">
              <div className="lg-empty-icon"><Monitor size={32} color="#94a3b8" /></div>
              <div className="lg-empty-title">No active sessions found.</div>
              <div className="lg-empty-sub">You are not currently logged in to any device.</div>
              <Link to="/" className="lg-btn lg-btn-primary" style={{ marginTop: 8, textDecoration: 'none' }}>
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <div className="lg-page-header">
              <h1 className="lg-page-title">Logout &amp; Session Management</h1>
              <p className="lg-page-subtitle">Manage your active sessions and securely sign out of FleetGuard.</p>
            </div>

            {/* Summary Cards */}
            <div className="lg-cards-grid">
              <SessionCard
                icon={Monitor} label="Current Session" value="Active"
                colorClass="green" cardClass="green-card"
                badge={{ text: 'Active Session', color: 'green' }}
              />
              <SessionCard
                icon={Clock} label="Login Time" value="09:30 AM"
                colorClass="blue" cardClass="blue-card"
              />
              <SessionCard
                icon={Activity} label="Last Activity" value="2 min ago"
                colorClass="amber" cardClass="amber-card"
              />
              <SessionCard
                icon={Layers} label="Active Devices" value={`${activeSessions} Active`}
                colorClass="purple" cardClass="purple-card"
              />
            </div>

            {/* Content Grid */}
            <div className="lg-content-grid">

              {/* Left Column */}
              <div className="lg-left-col">

                {/* Current Session Info */}
                <div className="lg-surface">
                  <div className="lg-surface-header">
                    <div className="lg-surface-title"><Monitor size={15} /> Current Session</div>
                    <span className="lg-status-badge active">
                      <span className="lg-status-dot" /> Active Session
                    </span>
                  </div>
                  <div className="lg-surface-body">
                    <div className="lg-session-grid">
                      {[
                        { label: 'User Name',       value: CURRENT_USER.name,      full: false },
                        { label: 'Role',            value: CURRENT_USER.role,      full: false },
                        { label: 'Email',           value: CURRENT_USER.email,     full: true  },
                        { label: 'Browser',         value: CURRENT_USER.browser,   full: false },
                        { label: 'Operating System',value: CURRENT_USER.os,        full: false },
                        { label: 'IP Address',      value: CURRENT_USER.ip,        full: false, mono: true },
                        { label: 'Login Time',      value: CURRENT_USER.loginTime, full: false },
                        { label: 'Status',          value: CURRENT_USER.status,    full: false },
                      ].map(f => (
                        <div key={f.label} className={`lg-session-field${f.full ? ' full' : ''}`}>
                          <div className="lg-field-label">{f.label}</div>
                          {f.label === 'Status' ? (
                            <div className="lg-field-value">
                              <span className="lg-status-badge active">
                                <span className="lg-status-dot" /> Active
                              </span>
                            </div>
                          ) : (
                            <div className={`lg-field-value${f.mono ? ' mono' : ''}`}>{f.value}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Sessions Table */}
                <div className="lg-surface">
                  <div className="lg-surface-header">
                    <div className="lg-surface-title"><Layers size={15} /> Active Sessions</div>
                  </div>
                  <ActiveSessionsTable sessions={sessions} onEndSession={endSession} />
                  <div className="lg-actions-bar">
                    <button className="lg-btn lg-btn-ghost" onClick={refreshSessions}>
                      <RefreshCw size={14} /> Refresh Sessions
                    </button>
                    <button className="lg-btn lg-btn-amber" onClick={endOtherSessions}>
                      <XCircle size={14} /> End Other Sessions
                    </button>
                    <button className="lg-btn lg-btn-danger" onClick={() => setShowModal(true)}>
                      <LogOut size={14} /> Logout Current Session
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="lg-right-col">
                <SecurityInfo />
                <SessionHistory />

                {/* Quick Logout Card */}
                <div className="lg-surface">
                  <div className="lg-surface-header">
                    <div className="lg-surface-title"><AlertTriangle size={15} /> Quick Actions</div>
                  </div>
                  <div className="lg-surface-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="lg-btn lg-btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(true)}>
                      <LogOut size={15} /> Logout Now
                    </button>
                    <Link to="/" className="lg-btn lg-btn-ghost" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                      <Home size={15} /> Return to Home
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* Logout Modal */}
      {showModal && <LogoutModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Bell, Home, BarChart2, Wrench, FileText,
  Users, Shield, Menu, UserCircle2,
  CheckCheck, XCircle, BellOff, Zap,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationFilter from '../components/notifications/NotificationFilter';
import NotificationBell from '../components/notifications/NotificationBell';
import { ACTION_TEMPLATES } from '../data/notificationData';
import './Notifications.css';

const NAV_ITEMS = [
  { icon: Home,      label: 'Dashboard',     to: '/' },
  { icon: Truck,     label: 'Vehicles',      to: '/vehicles' },
  { icon: Users,     label: 'Drivers',       to: '/drivers' },
  { icon: Wrench,    label: 'Maintenance',   to: '/maintenance' },
  { icon: FileText,  label: 'Documents',     to: '/documents' },
  { icon: BarChart2, label: 'Reports',       to: '/reports' },
  { icon: Shield,    label: 'Audit Logs',    to: '/audit-logs' },
  { icon: Bell,      label: 'Notifications', to: '/notifications', active: true },
];

const MOCK_ACTIONS = Object.keys(ACTION_TEMPLATES);

export default function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead, deleteOne, clearAll, addFromAction } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [priority, setPriority]       = useState('All');
  const [mockAction, setMockAction]   = useState(MOCK_ACTIONS[0]);
  const [mockMeta, setMockMeta]       = useState('TN-01-AB-1234');

  const filtered = useMemo(() => notifications.filter(n => {
    if (search    && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && n.category !== category) return false;
    if (priority !== 'All' && n.priority !== priority) return false;
    return true;
  }), [notifications, search, category, priority]);

  const unreadFiltered = filtered.filter(n => !n.read).length;

  return (
    <div className="nc-shell">
      {/* Mobile sidebar toggle */}
      <button className="nc-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
        <Menu size={18} />
      </button>

      {/* Sidebar */}
      <aside className={`nc-sidebar${sidebarOpen ? ' open' : ''}`}>
        <Link to="/" className="nc-sidebar-logo" onClick={() => setSidebarOpen(false)}>
          <div className="nc-sidebar-logo-icon"><Truck size={17} color="#fff" /></div>
          <span className="nc-sidebar-logo-text">Fleet<span>Guard</span></span>
        </Link>

        <div className="nc-sidebar-section">Main Menu</div>
        <nav className="nc-sidebar-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link key={label} to={to} className={`nc-nav-item${active ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon size={16} />
              {label}
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="nc-nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="nc-sidebar-footer">
          <div style={{ fontSize: '11px', color: '#334155', padding: '0 12px', textAlign: 'center' }}>Use profile menu to logout</div>
        </div>
      </aside>

      {/* Topbar */}
      <header className="nc-topbar">
        <div className="nc-topbar-left">
          <Bell size={18} color="#3b82f6" />
          <span className="nc-topbar-title">Notification Center</span>
          {unreadCount > 0 && <span className="nc-topbar-badge">{unreadCount} unread</span>}
        </div>
        <div className="nc-topbar-right">
          <NotificationBell />
          <Link to="/profile" className="nc-topbar-btn" style={{ textDecoration: 'none' }}>
            <UserCircle2 size={18} />
          </Link>
          <div className="nc-avatar">KS</div>
        </div>
      </header>

      {/* Main */}
      <main className="nc-main">
        <div className="nc-page-header">
          <div>
            <h1 className="nc-page-title">Notification Center</h1>
            <p className="nc-page-subtitle">Stay updated on all fleet events, compliance alerts, and system activity.</p>
          </div>
          {/* Mock action trigger */}
          <div className="nc-mock-bar">
            <span className="nc-mock-label"><Zap size={13} /> Simulate Action</span>
            <select className="nc-mock-select" value={mockAction} onChange={e => setMockAction(e.target.value)}>
              {MOCK_ACTIONS.map(a => <option key={a}>{a}</option>)}
            </select>
            <input className="nc-mock-input" value={mockMeta} onChange={e => setMockMeta(e.target.value)} placeholder="e.g. TN-01-AB-1234" />
            <button className="nc-btn nc-btn-primary nc-btn-sm" onClick={() => addFromAction(mockAction, mockMeta)}>
              <Zap size={13} /> Fire
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="nc-summary-strip">
          {[
            { label: 'Total',    value: notifications.length, color: '#3b82f6' },
            { label: 'Unread',   value: unreadCount,          color: '#ef4444' },
            { label: 'Critical', value: notifications.filter(n => n.priority === 'Critical').length, color: '#ef4444' },
            { label: 'High',     value: notifications.filter(n => n.priority === 'High').length,     color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="nc-summary-chip">
              <span className="nc-summary-val" style={{ color: s.color }}>{s.value}</span>
              <span className="nc-summary-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="nc-surface">
          <NotificationFilter
            search={search} setSearch={setSearch}
            category={category} setCategory={setCategory}
            priority={priority} setPriority={setPriority}
          />

          {/* Bulk actions */}
          <div className="nc-bulk-bar">
            <span className="nc-bulk-info">{filtered.length} result{filtered.length !== 1 ? 's' : ''}{unreadFiltered > 0 ? ` · ${unreadFiltered} unread` : ''}</span>
            <div className="nc-bulk-actions">
              <button className="nc-btn nc-btn-ghost nc-btn-sm" onClick={markAllRead}><CheckCheck size={13} /> Mark All Read</button>
              <button className="nc-btn nc-btn-ghost nc-btn-sm" onClick={clearAll}><XCircle size={13} /> Clear All</button>
            </div>
          </div>

          {/* List */}
          <div className="nc-list">
            {filtered.length === 0 ? (
              <div className="nc-empty">
                <div className="nc-empty-icon"><BellOff size={28} color="#94a3b8" /></div>
                <div className="nc-empty-title">No notifications found</div>
                <div className="nc-empty-sub">Try adjusting your filters or search query.</div>
              </div>
            ) : (
              filtered.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onRead={markRead}
                  onDelete={deleteOne}
                  showDetail
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

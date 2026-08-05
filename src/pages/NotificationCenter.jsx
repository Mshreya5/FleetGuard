import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, UserCircle2, CheckCheck, XCircle, BellOff,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationFilter from '../components/notifications/NotificationFilter';
import './Notifications.css';

export default function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead, deleteOne, clearAll } = useNotifications();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');

  const filtered = useMemo(() => notifications.filter((n) => {
    if (user && user.role === 'Fleet Manager') {
      if (!['Fleet', 'Compliance', 'System', 'General'].includes(n.category)) return false;
    } else if (user && user.role === 'Driver') {
      if (!['Assignment', 'Driver', 'Personal', 'General'].includes(n.category)) return false;
    } else if (user && user.role === 'Service Center') {
      if (!['Maintenance', 'Service', 'System', 'General'].includes(n.category)) return false;
    }

    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !(n.message || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All' && n.category !== category) return false;
    if (priority !== 'All' && n.priority !== priority) return false;
    return true;
  }), [notifications, search, category, priority, user]);

  const unreadFiltered = filtered.filter((n) => !n.read).length;
  const userInitials = (user?.name || user?.email || 'User').slice(0, 2).toUpperCase();

  return (
    <div className="nc-shell" style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Topbar without notification bell */}
      <header className="nc-topbar" style={{ position: 'sticky', top: 0, zIndex: 100, marginLeft: 0, width: '100%' }}>
        <div className="nc-topbar-left">
          <Bell size={18} color="#3b82f6" />
          <span className="nc-topbar-title">Notification Center</span>
          {unreadCount > 0 && <span className="nc-topbar-badge">{unreadCount} unread</span>}
        </div>
        <div className="nc-topbar-right">
          <Link to="/profile" className="nc-topbar-btn" style={{ textDecoration: 'none' }}>
            <UserCircle2 size={18} />
          </Link>
          <div className="nc-avatar">{userInitials}</div>
        </div>
      </header>

      {/* Main Content without left sidebar */}
      <main className="nc-main" style={{ flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div className="nc-page-header">
          <div>
            <h1 className="nc-page-title">Notification Center</h1>
            <p className="nc-page-subtitle">Stay updated on all fleet events, compliance alerts, and system activity.</p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="nc-summary-strip">
          {[
            { label: 'Total', value: notifications.length, color: '#3b82f6' },
            { label: 'Unread', value: unreadCount, color: '#ef4444' },
            { label: 'Critical', value: notifications.filter((n) => n.priority === 'Critical').length, color: '#ef4444' },
            { label: 'High', value: notifications.filter((n) => n.priority === 'High').length, color: '#f59e0b' },
          ].map((s) => (
            <div key={s.label} className="nc-summary-chip">
              <span className="nc-summary-val" style={{ color: s.color }}>{s.value}</span>
              <span className="nc-summary-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter & List */}
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
              filtered.map((n) => (
                <NotificationCard
                  key={n.id || n._id}
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

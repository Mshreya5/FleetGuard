import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Clock, AlertTriangle, Users,
  Search, RotateCcw, Filter,
  X, Eye, Shield, ChevronLeft, ChevronRight, UserCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuditLog.css';

const ROLES = ['All Roles', 'Admin', 'Fleet Manager', 'Driver', 'Service Center'];
const ACTIONS = ['All Actions', 'Login', 'Logout', 'Vehicle Registered', 'Vehicle Updated', 'Vehicle Deleted', 'Driver Assigned', 'Compliance Updated', 'Document Uploaded', 'Service Logged', 'Override Created'];
const PER_PAGE = 10;

function roleClass(role) {
  if (role === 'Admin') return 'admin';
  if (role === 'Driver') return 'driver';
  if (role === 'Service Center') return 'service';
  return '';
}

function statusBadge(status) {
  const map = { Success: 'success', Failed: 'failed', Warning: 'warning', Info: 'info' };
  return map[status] || 'info';
}

function initials(name) {
  if (!name) return 'US';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function SummaryCard({ icon: Icon, label, value, trend, trendDir, colorClass, cardClass }) {
  return (
    <div className={`al-card ${cardClass}`}>
      <div className={`al-card-icon ${colorClass}`}><Icon size={22} /></div>
      <div className="al-card-info">
        <div className="al-card-value">{value}</div>
        <div className="al-card-label">{label}</div>
        {trend && <div className={`al-card-trend ${trendDir}`}>{trend}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cls = statusBadge(status);
  return (
    <span className={`al-badge al-badge-${cls}`}>
      <span className="al-badge-dot-sm" />
      {status}
    </span>
  );
}

function DetailModal({ log, onClose }) {
  if (!log) return null;
  const fields = [
    { label: 'Event ID', value: log.id, full: false },
    { label: 'Timestamp', value: log.ts, full: false },
    { label: 'User', value: log.user, full: false },
    { label: 'Role', value: log.role, full: false },
    { label: 'Action', value: log.action, full: false },
    { label: 'Module', value: log.module, full: false },
    { label: 'Status', value: log.status, full: false },
    { label: 'IP Address', value: log.ip, full: false },
    { label: 'Browser', value: log.browser, full: false },
    { label: 'Operating System', value: log.os, full: false },
    { label: 'Previous Value', value: log.prev, full: true },
    { label: 'New Value', value: log.next, full: true },
    { label: 'Reason', value: log.reason, full: true },
  ];
  return (
    <div className="al-modal-overlay" onClick={onClose}>
      <div className="al-modal" onClick={(e) => e.stopPropagation()}>
        <div className="al-modal-header">
          <div className="al-modal-title"><Eye size={16} /> Event Details</div>
          <button className="al-modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="al-modal-body">
          <div className="al-modal-grid">
            {fields.map((f) => (
              <div key={f.label} className={`al-modal-field${f.full ? ' full' : ''}`}>
                <div className="al-modal-field-label">{f.label}</div>
                <div className={`al-modal-field-value${f.label === 'IP Address' || f.label === 'Event ID' ? ' mono' : ''}`}>
                  {f.label === 'Status' ? <StatusBadge status={f.value} /> : f.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuditLog() {
  const { user } = useAuth();
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage] = useState(1);
  const [apiLogs, setApiLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: '', role: 'All Roles', action: 'All Actions', date: '' });
  const [applied, setApplied] = useState({ search: '', role: 'All Roles', action: 'All Actions', date: '' });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const queryParams = new URLSearchParams();
      if (applied.search) queryParams.append('search', applied.search);
      if (applied.role && applied.role !== 'All Roles') queryParams.append('role', applied.role);
      if (applied.action && applied.action !== 'All Actions') queryParams.append('action', applied.action);
      if (applied.date) queryParams.append('date', applied.date);
      queryParams.append('page', page);
      queryParams.append('limit', PER_PAGE);

      const res = await fetch(`/api/audit-logs?${queryParams.toString()}`, { headers });
      const data = await res.json();

      if (data.success) {
        setApiLogs(data.logs || []);
        setTotalCount(data.total || 0);
        setTodayCount(data.todayCount || 0);
        setFailedCount(data.failedCount || 0);
        setActiveUsersCount(data.activeUsers || 0);
      }
    } catch {
      // Silent error catch for periodic polling
    } finally {
      setLoading(false);
    }
  }, [applied, page]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const totalPages = Math.ceil(totalCount / PER_PAGE) || 1;

  const applyFilters = () => { setApplied({ ...filters }); setPage(1); };
  const resetFilters = () => {
    const d = { search: '', role: 'All Roles', action: 'All Actions', date: '' };
    setFilters(d);
    setApplied(d);
    setPage(1);
  };
  const setF = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const userInitials = (user?.name || user?.email || 'User').slice(0, 2).toUpperCase();

  return (
    <div className="al-shell" style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Top Navbar without notification bell */}
      <header className="al-topbar" style={{ position: 'sticky', top: 0, zIndex: 100, marginLeft: 0, width: '100%' }}>
        <div className="al-topbar-left">
          <Shield size={18} color="#3b82f6" />
          <span className="al-topbar-title">Audit Logs</span>
        </div>
        <div className="al-topbar-right">
          <Link to="/profile" className="al-topbar-btn" style={{ textDecoration: 'none' }}>
            <UserCircle2 size={18} />
          </Link>
          <div className="al-avatar">{userInitials}</div>
        </div>
      </header>

      {/* Main Content without left sidebar */}
      <main className="al-main" style={{ flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div className="al-page-header">
          <h1 className="al-page-title">Audit Logs</h1>
          <p className="al-page-subtitle">Track all important user actions and system events for security and compliance.</p>
        </div>

        {/* Summary Cards */}
        <div className="al-cards-grid">
          <SummaryCard icon={ClipboardList} label="Total Logs" value={totalCount} trend="Dynamic MongoDB Count" trendDir="up" colorClass="blue" cardClass="blue-card" />
          <SummaryCard icon={Clock} label="Today's Activities" value={todayCount} trend="Recorded Today" trendDir="up" colorClass="green" cardClass="green-card" />
          <SummaryCard icon={AlertTriangle} label="Failed Actions" value={failedCount} trend="Security Alerts" trendDir="down" colorClass="red" cardClass="red-card" />
          <SummaryCard icon={Users} label="Active Users" value={activeUsersCount} trend="Unique System Actors" trendDir="up" colorClass="amber" cardClass="amber-card" />
        </div>

        {/* Content Row */}
        <div className="al-content-row" style={{ gridTemplateColumns: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div className="al-surface">
              {/* Filter Bar */}
              <div className="al-filter-bar">
                <div className="al-filter-group">
                  <label className="al-filter-label">Search User</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="al-filter-input" style={{ paddingLeft: 30 }} placeholder="Search by user…" value={filters.search} onChange={(e) => setF('search', e.target.value)} />
                  </div>
                </div>
                <div className="al-filter-group">
                  <label className="al-filter-label">Role</label>
                  <select className="al-filter-select" value={filters.role} onChange={(e) => setF('role', e.target.value)}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="al-filter-group">
                  <label className="al-filter-label">Action</label>
                  <select className="al-filter-select" value={filters.action} onChange={(e) => setF('action', e.target.value)}>
                    {ACTIONS.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="al-filter-group" style={{ maxWidth: 160 }}>
                  <label className="al-filter-label">Date</label>
                  <input type="date" className="al-filter-input" value={filters.date} onChange={(e) => setF('date', e.target.value)} />
                </div>
                <div className="al-filter-actions">
                  <button className="al-btn al-btn-ghost" onClick={resetFilters}><RotateCcw size={13} /> Reset</button>
                  <button className="al-btn al-btn-primary" onClick={applyFilters}><Filter size={13} /> Apply</button>
                </div>
              </div>

              {/* Table */}
              {loading && apiLogs.length === 0 ? (
                <div className="al-empty">
                  <div className="al-empty-title">Loading audit logs from MongoDB...</div>
                </div>
              ) : apiLogs.length === 0 ? (
                <div className="al-empty">
                  <div className="al-empty-icon"><ClipboardList size={28} color="#94a3b8" /></div>
                  <div className="al-empty-title">No audit records found.</div>
                  <div className="al-empty-sub">Try performing an action in the app to generate real audit logs.</div>
                  <button className="al-btn al-btn-ghost" onClick={resetFilters}><RotateCcw size={13} /> Reset Filters</button>
                </div>
              ) : (
                <div className="al-table-wrap">
                  <table className="al-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>Status</th>
                        <th>IP Address</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiLogs.map((log) => (
                        <tr key={log.id || log._id}>
                          <td className="al-ts">{log.ts}</td>
                          <td>
                            <div className="al-user-cell">
                              <div className="al-user-avatar">{initials(log.user)}</div>
                              {log.user}
                            </div>
                          </td>
                          <td><span className={`al-role ${roleClass(log.role)}`}>{log.role}</span></td>
                          <td>{log.action}</td>
                          <td style={{ color: '#94a3b8' }}>{log.module}</td>
                          <td><StatusBadge status={log.status} /></td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8' }}>{log.ip}</td>
                          <td><button className="al-link" onClick={() => setSelectedLog(log)}>View Details</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalCount > PER_PAGE && (
                <div className="al-pagination">
                  <span className="al-pagination-info">
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount} records
                  </span>
                  <div className="al-pagination-btns">
                    <button className="al-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} className={`al-page-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="al-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}

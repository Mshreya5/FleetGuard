import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, ClipboardList, Clock, AlertTriangle, Users,
  Search, RotateCcw, Filter, Download, FileText, Printer,
  X, Eye, CheckCircle, XCircle, AlertCircle, Info,
  Home, BarChart2, Wrench, Bell, Shield, LogOut,
  ChevronLeft, ChevronRight, Menu, UserCircle2,
  CheckCheck, Wrench as WrenchIcon, FileCheck,
} from 'lucide-react';
import './AuditLog.css';

/* ── Static Data ─────────────────────────────────────── */
const LOGS = [
  { id: 'EVT-001', ts: '29 Jul 2026 09:12 AM', user: 'Kiran Shree', role: 'Fleet Manager', action: 'Vehicle Registered', module: 'Vehicle Registry', status: 'Success', ip: '192.168.1.20', browser: 'Chrome 126', os: 'Windows 11', prev: 'N/A', next: 'TN-01-AB-1234 added', reason: 'New vehicle onboarding' },
  { id: 'EVT-002', ts: '29 Jul 2026 10:04 AM', user: 'Admin',       role: 'Admin',         action: 'User Login',         module: 'Authentication',  status: 'Success', ip: '192.168.1.10', browser: 'Firefox 127', os: 'Ubuntu 22.04', prev: 'Logged out', next: 'Session started', reason: 'Routine login' },
  { id: 'EVT-003', ts: '29 Jul 2026 11:18 AM', user: 'Driver001',   role: 'Driver',        action: 'Assignment Override Attempt', module: 'Driver Assignment', status: 'Failed', ip: '192.168.1.55', browser: 'Safari 17', os: 'iOS 17', prev: 'Route A', next: 'Route B (blocked)', reason: 'Unauthorized override' },
  { id: 'EVT-004', ts: '29 Jul 2026 11:45 AM', user: 'Kiran Shree', role: 'Fleet Manager', action: 'Compliance Updated', module: 'Compliance',       status: 'Success', ip: '192.168.1.20', browser: 'Chrome 126', os: 'Windows 11', prev: 'Expired', next: 'Valid till Dec 2026', reason: 'Annual renewal' },
  { id: 'EVT-005', ts: '29 Jul 2026 12:30 PM', user: 'ServiceTech', role: 'Service Center', action: 'Service Logged',   module: 'Maintenance',     status: 'Success', ip: '192.168.1.88', browser: 'Edge 126', os: 'Windows 10', prev: 'Pending', next: 'Completed', reason: 'Scheduled service' },
  { id: 'EVT-006', ts: '29 Jul 2026 01:15 PM', user: 'Admin',       role: 'Admin',         action: 'Document Uploaded', module: 'Documents',       status: 'Success', ip: '192.168.1.10', browser: 'Firefox 127', os: 'Ubuntu 22.04', prev: 'None', next: 'Insurance_2026.pdf', reason: 'Document update' },
  { id: 'EVT-007', ts: '29 Jul 2026 02:00 PM', user: 'Driver002',   role: 'Driver',        action: 'Logout',            module: 'Authentication',  status: 'Info',    ip: '192.168.1.60', browser: 'Chrome 126', os: 'Android 14', prev: 'Active session', next: 'Session ended', reason: 'End of shift' },
  { id: 'EVT-008', ts: '29 Jul 2026 02:45 PM', user: 'Kiran Shree', role: 'Fleet Manager', action: 'Vehicle Updated',   module: 'Vehicle Registry', status: 'Warning', ip: '192.168.1.20', browser: 'Chrome 126', os: 'Windows 11', prev: 'Diesel', next: 'CNG', reason: 'Fuel type correction' },
  { id: 'EVT-009', ts: '29 Jul 2026 03:30 PM', user: 'Driver001',   role: 'Driver',        action: 'Driver Assigned',   module: 'Driver Assignment', status: 'Success', ip: '192.168.1.55', browser: 'Safari 17', os: 'iOS 17', prev: 'Unassigned', next: 'Route C', reason: 'New assignment' },
  { id: 'EVT-010', ts: '29 Jul 2026 04:10 PM', user: 'Admin',       role: 'Admin',         action: 'Override Created',  module: 'Compliance',      status: 'Warning', ip: '192.168.1.10', browser: 'Firefox 127', os: 'Ubuntu 22.04', prev: 'Blocked', next: 'Allowed (override)', reason: 'Emergency dispatch' },
];

const TIMELINE = [
  { icon: CheckCheck, type: 'success', action: 'Driver Assigned',     user: 'Driver001',   time: '10 minutes ago' },
  { icon: AlertCircle, type: 'warning', action: 'Compliance Updated', user: 'Kiran Shree', time: '30 minutes ago' },
  { icon: WrenchIcon,  type: 'info',    action: 'Service Logged',     user: 'ServiceTech', time: '1 hour ago' },
  { icon: XCircle,     type: 'danger',  action: 'Override Attempt',   user: 'Driver001',   time: '2 hours ago' },
  { icon: FileCheck,   type: 'success', action: 'Document Uploaded',  user: 'Admin',       time: '3 hours ago' },
];

const NAV_ITEMS = [
  { icon: Home,          label: 'Dashboard',    to: '/' },
  { icon: Truck,         label: 'Vehicles',     to: '/vehicles' },
  { icon: Users,         label: 'Drivers',      to: '/drivers' },
  { icon: Wrench,        label: 'Maintenance',  to: '/maintenance' },
  { icon: FileText,      label: 'Documents',    to: '/documents' },
  { icon: BarChart2,     label: 'Reports',      to: '/reports' },
  { icon: Shield,        label: 'Audit Logs',   to: '/audit-logs', active: true },
  { icon: Bell,          label: 'Alerts',       to: '/alerts' },
];

const ROLES    = ['All Roles', 'Admin', 'Fleet Manager', 'Driver', 'Service Center'];
const ACTIONS  = ['All Actions', 'Login', 'Logout', 'Vehicle Added', 'Vehicle Updated', 'Vehicle Deleted', 'Driver Assigned', 'Compliance Updated', 'Document Uploaded', 'Service Logged', 'Override Created'];
const PER_PAGE = 6;

/* ── Helpers ─────────────────────────────────────────── */
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
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* ── Sub-components ──────────────────────────────────── */
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
    { label: 'Event ID',       value: log.id,      full: false },
    { label: 'Timestamp',      value: log.ts,      full: false },
    { label: 'User',           value: log.user,    full: false },
    { label: 'Role',           value: log.role,    full: false },
    { label: 'Action',         value: log.action,  full: false },
    { label: 'Module',         value: log.module,  full: false },
    { label: 'Status',         value: log.status,  full: false },
    { label: 'IP Address',     value: log.ip,      full: false },
    { label: 'Browser',        value: log.browser, full: false },
    { label: 'Operating System', value: log.os,    full: false },
    { label: 'Previous Value', value: log.prev,    full: true  },
    { label: 'New Value',      value: log.next,    full: true  },
    { label: 'Reason',         value: log.reason,  full: true  },
  ];
  return (
    <div className="al-modal-overlay" onClick={onClose}>
      <div className="al-modal" onClick={e => e.stopPropagation()}>
        <div className="al-modal-header">
          <div className="al-modal-title"><Eye size={16} /> Event Details</div>
          <button className="al-modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="al-modal-body">
          <div className="al-modal-grid">
            {fields.map(f => (
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

function ActivityTimeline() {
  return (
    <div className="al-surface">
      <div className="al-surface-header">
        <div className="al-surface-title"><Clock size={15} /> Recent Activity</div>
      </div>
      <div className="al-timeline">
        {TIMELINE.map((item, i) => (
          <div key={i} className="al-tl-item">
            <div className="al-tl-line-wrap">
              <div className={`al-tl-dot ${item.type}`}><item.icon size={14} /></div>
              {i < TIMELINE.length - 1 && <div className="al-tl-connector" />}
            </div>
            <div className="al-tl-content">
              <div className="al-tl-action">{item.action}</div>
              <div className="al-tl-user">{item.user}</div>
              <div className="al-tl-meta">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────── */
export default function AuditLog() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [page, setPage]               = useState(1);

  const [filters, setFilters] = useState({ search: '', role: 'All Roles', action: 'All Actions', date: '' });
  const [applied, setApplied] = useState({ search: '', role: 'All Roles', action: 'All Actions', date: '' });

  const filtered = useMemo(() => LOGS.filter(l => {
    const s = applied.search.toLowerCase();
    if (s && !l.user.toLowerCase().includes(s)) return false;
    if (applied.role !== 'All Roles' && l.role !== applied.role) return false;
    if (applied.action !== 'All Actions' && !l.action.toLowerCase().includes(applied.action.toLowerCase())) return false;
    return true;
  }), [applied]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const applyFilters  = () => { setApplied({ ...filters }); setPage(1); };
  const resetFilters  = () => { const d = { search: '', role: 'All Roles', action: 'All Actions', date: '' }; setFilters(d); setApplied(d); setPage(1); };
  const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const todayCount   = LOGS.filter(l => l.status === 'Success').length;
  const failedCount  = LOGS.filter(l => l.status === 'Failed').length;
  const activeUsers  = [...new Set(LOGS.map(l => l.user))].length;

  return (
    <div className="al-shell">
      {/* Sidebar toggle (mobile) */}
      <button className="al-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
        <Menu size={18} />
      </button>

      {/* Sidebar */}
      <aside className={`al-sidebar${sidebarOpen ? ' open' : ''}`}>
        <Link to="/" className="al-sidebar-logo" onClick={() => setSidebarOpen(false)}>
          <div className="al-sidebar-logo-icon"><Truck size={17} color="#fff" /></div>
          <span className="al-sidebar-logo-text">Fleet<span>Guard</span></span>
        </Link>

        <div className="al-sidebar-section">Main Menu</div>
        <nav className="al-sidebar-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, to, active }) => (
            <Link key={label} to={to} className={`al-nav-item${active ? ' active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <div style={{ fontSize: '11px', color: '#334155', padding: '0 12px', textAlign: 'center' }}>Use profile menu to logout</div>
        </div>
      </aside>

      {/* Top Navbar */}
      <header className="al-topbar">
        <div className="al-topbar-left">
          <Shield size={18} color="#3b82f6" />
          <span className="al-topbar-title">Audit Logs</span>
        </div>
        <div className="al-topbar-right">
          <button className="al-topbar-btn">
            <Bell size={16} />
            <span className="al-badge-dot" />
          </button>
          <Link to="/profile" className="al-topbar-btn" style={{ textDecoration: 'none' }}>
            <UserCircle2 size={18} />
          </Link>
          <div className="al-avatar">KS</div>
        </div>
      </header>

      {/* Main */}
      <main className="al-main">
        <div className="al-page-header">
          <h1 className="al-page-title">Audit Logs</h1>
          <p className="al-page-subtitle">Track all important user actions and system events for security and compliance.</p>
        </div>

        {/* Summary Cards */}
        <div className="al-cards-grid">
          <SummaryCard icon={ClipboardList} label="Total Logs"        value={LOGS.length}  trend="↑ 12 this week" trendDir="up"   colorClass="blue"  cardClass="blue-card" />
          <SummaryCard icon={Clock}         label="Today's Activities" value={todayCount}   trend="↑ 5 since yesterday" trendDir="up" colorClass="green" cardClass="green-card" />
          <SummaryCard icon={AlertTriangle} label="Failed Actions"    value={failedCount}  trend="↓ 2 from last week" trendDir="down" colorClass="red"   cardClass="red-card" />
          <SummaryCard icon={Users}         label="Active Users"      value={activeUsers}  trend="↑ 1 new today"  trendDir="up"   colorClass="amber" cardClass="amber-card" />
        </div>

        {/* Content Row */}
        <div className="al-content-row">
          {/* Left: Filter + Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="al-surface">
              {/* Filter Bar */}
              <div className="al-filter-bar">
                <div className="al-filter-group">
                  <label className="al-filter-label">Search User</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input className="al-filter-input" style={{ paddingLeft: 30 }} placeholder="Search by user…" value={filters.search} onChange={e => setF('search', e.target.value)} />
                  </div>
                </div>
                <div className="al-filter-group">
                  <label className="al-filter-label">Role</label>
                  <select className="al-filter-select" value={filters.role} onChange={e => setF('role', e.target.value)}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="al-filter-group">
                  <label className="al-filter-label">Action</label>
                  <select className="al-filter-select" value={filters.action} onChange={e => setF('action', e.target.value)}>
                    {ACTIONS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="al-filter-group" style={{ maxWidth: 160 }}>
                  <label className="al-filter-label">Date</label>
                  <input type="date" className="al-filter-input" value={filters.date} onChange={e => setF('date', e.target.value)} />
                </div>
                <div className="al-filter-actions">
                  <button className="al-btn al-btn-ghost" onClick={resetFilters}><RotateCcw size={13} /> Reset</button>
                  <button className="al-btn al-btn-primary" onClick={applyFilters}><Filter size={13} /> Apply</button>
                </div>
              </div>

              {/* Export Bar */}
              <div className="al-export-bar">
                <span className="al-export-label">Export:</span>
                <button className="al-btn al-btn-sm al-btn-success"><Download size={12} /> CSV</button>
                <button className="al-btn al-btn-sm al-btn-danger"><FileText size={12} /> PDF</button>
                <button className="al-btn al-btn-sm al-btn-ghost"><Printer size={12} /> Print</button>
              </div>

              {/* Table */}
              {paginated.length === 0 ? (
                <div className="al-empty">
                  <div className="al-empty-icon"><ClipboardList size={28} color="#94a3b8" /></div>
                  <div className="al-empty-title">No audit records found.</div>
                  <div className="al-empty-sub">Try adjusting your filters or search query.</div>
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
                      {paginated.map(log => (
                        <tr key={log.id}>
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
              {filtered.length > PER_PAGE && (
                <div className="al-pagination">
                  <span className="al-pagination-info">
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} records
                  </span>
                  <div className="al-pagination-btns">
                    <button className="al-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={14} /></button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} className={`al-page-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button className="al-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Timeline */}
          <ActivityTimeline />
        </div>
      </main>

      {/* Detail Modal */}
      {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}

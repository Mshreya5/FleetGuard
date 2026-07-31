const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'compliance', label: 'Fleet Compliance Report' },
  { id: 'expiries', label: 'Upcoming Expiry Report' },
  { id: 'overdue', label: 'Overdue Compliance Report' },
  { id: 'service-cost', label: 'Service Cost Summary' },
  { id: 'users', label: 'Manage User Accounts' },
  { id: 'override-logs', label: 'Override Logs' },
  { id: 'alert-settings', label: 'Configure Alert Days' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'report', label: 'Fleet Summary Report' },
];

const Sidebar = ({ activeView, onNavigate, isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">FG</div>
          <div>
            <h3>FleetGuard</h3>
            <p>Admin Console</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose(); }}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

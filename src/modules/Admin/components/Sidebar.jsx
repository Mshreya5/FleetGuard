const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'compliance', label: 'Fleet Compliance Report' },
  { id: 'expiries', label: 'Upcoming Expiry Report' },
];

const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <aside className="sidebar">
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
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

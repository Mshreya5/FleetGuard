import React from 'react';
import './fleetManager.css';

const Sidebar = ({ activeView, onNavigate }) => {
  const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'vehicle-registration', label: 'Vehicle Registration' },
    { id: 'vehicle-list', label: 'Vehicle List' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">FG</div>
        <span>Fleet Guard</span>
      </div>

      <nav className="sidebar-nav" aria-label="Fleet Manager navigation">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={`sidebar-btn ${activeView === link.id ? 'active' : ''}`}
            onClick={() => onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

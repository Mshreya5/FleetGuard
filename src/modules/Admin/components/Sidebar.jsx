import React from 'react';
import {
  FiLayout,
  FiShield,
  FiAlertTriangle,
  FiAlertCircle,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiSliders,
  FiBell,
  FiBarChart2
} from 'react-icons/fi';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: FiLayout },
  { id: 'compliance', label: 'Fleet Compliance Report', Icon: FiShield },
  { id: 'expiries', label: 'Upcoming Expiry Report', Icon: FiAlertTriangle },
  { id: 'overdue', label: 'Overdue Compliance Report', Icon: FiAlertCircle },
  { id: 'service-cost', label: 'Service Cost Summary', Icon: FiDollarSign },
  { id: 'users', label: 'Manage User Accounts', Icon: FiUsers },
  { id: 'override-logs', label: 'Override Logs', Icon: FiFileText },
  { id: 'alert-settings', label: 'Configure Alert Days', Icon: FiSliders },
  { id: 'notifications', label: 'Notifications', Icon: FiBell },
  { id: 'report', label: 'Fleet Summary Report', Icon: FiBarChart2 },
];

const Sidebar = ({ activeView, onNavigate, isOpen, onClose }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        style={{
          display: isOpen ? 'block' : 'none',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 105
        }}
      />
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '240px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 110,
          paddingTop: '16px'
        }}
      >
        <div>
          <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>
              FleetGuard
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ADMIN CONSOLE
            </div>
          </div>

          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              const ItemIcon = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#3b82f6' : 'transparent',
                    color: isActive ? '#ffffff' : '#f1f5f9',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <ItemIcon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

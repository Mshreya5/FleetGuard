import React from 'react';
import {
  LayoutDashboard,
  ListOrdered,
  FileText,
  Gauge,
  CircleDollarSign,
  CalendarClock,
  History,
  ClipboardList,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/servicecenter/dashboard' },
  { label: 'Service Queue', icon: ListOrdered, path: '/servicecenter/queue' },
  { label: 'Service Log', icon: FileText, path: '/servicecenter/log' },
  { label: 'Update Vehicle Mileage', icon: Gauge, path: '/servicecenter/update-mileage' },
  { label: 'Record Service Cost', icon: CircleDollarSign, path: '/servicecenter/record-cost' },
  { label: 'Next Service Schedule', icon: CalendarClock, path: '/servicecenter/next-schedule' },
  { label: 'Service History', icon: History, path: '/servicecenter/service-history' },
  { label: 'Add Historical Records', icon: ClipboardList, path: '/servicecenter/add-history' },
  { label: 'Complete Service', icon: CheckCircle2, path: '/servicecenter/complete-service' },
  { label: 'Maintenance Risk Level', icon: ShieldAlert, path: '/servicecenter/maintenance-risk' },
];

export default function Sidebar({ activeItem, onSelectItem }) {
  return (
    <aside
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
            SERVICE CENTER
          </div>
        </div>

        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectItem(item.label, item.path)}
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
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

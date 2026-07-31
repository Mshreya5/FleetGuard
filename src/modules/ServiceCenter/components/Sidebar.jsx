import React from 'react';
import { LayoutDashboard, ListOrdered, FileText, Gauge, CircleDollarSign, CalendarClock, History, ClipboardList, CheckCircle2, ShieldAlert } from 'lucide-react';
import styles from '../ServiceCenterDashboard.module.css';

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
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>FleetGuard</div>
      <div className={styles.sidebarLabel}>Service Center</div>

      <nav className={styles.navList}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;

          return (
            <button
              key={item.label}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => onSelectItem(item.label, item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

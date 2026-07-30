import React from 'react';
import { LayoutDashboard, ListOrdered, FileText } from 'lucide-react';
import styles from '../ServiceCenterDashboard.module.css';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/servicecenter/dashboard' },
  { label: 'Service Queue', icon: ListOrdered, path: '/servicecenter/queue' },
  { label: 'Service Log', icon: FileText, path: '/servicecenter/log' },
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

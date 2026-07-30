import React from 'react';
import { PlusCircle, Users, ListChecks } from 'lucide-react';
import styles from '../ServiceCenterDashboard.module.css';

const actions = [
  { label: 'Add Service Request', icon: PlusCircle },
  { label: 'Assign Mechanic', icon: Users },
  { label: 'View Service Queue', icon: ListChecks },
];

export default function QuickActions() {
  return (
    <section className={styles.panelCompact}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <p className={styles.sectionSubtitle}>Common service center tasks for the day.</p>
        </div>
      </div>

      <div className={styles.actionList}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} type="button" className={styles.actionButton}>
              <Icon size={18} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

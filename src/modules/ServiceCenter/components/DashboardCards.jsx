import React from 'react';
import { Wrench, CheckCircle2, CircleDollarSign, Clock } from 'lucide-react';
import styles from '../ServiceCenterDashboard.module.css';

const icons = {
  primary: Clock,
  accent: Wrench,
  success: CheckCircle2,
  revenue: CircleDollarSign,
};

export default function DashboardCards({ metrics }) {
  return (
    <div className={styles.cardGrid}>
      {metrics.map((item) => {
        const Icon = icons[item.tone] || Clock;
        return (
          <article key={item.title} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={`${styles.metricIcon} ${styles[item.tone] || styles.primary}`}>
                <Icon size={18} />
              </span>
              <span className={styles.metricTitle}>{item.title}</span>
            </div>
            <div className={styles.metricValue}>{item.value}</div>
          </article>
        );
      })}
    </div>
  );
}

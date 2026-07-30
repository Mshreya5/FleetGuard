import React from 'react';
import { ArrowUpRight, Wrench, CheckCircle2, CircleDollarSign } from 'lucide-react';
import styles from '../ServiceCenterDashboard.module.css';

const icons = {
  primary: ArrowUpRight,
  accent: Wrench,
  success: CheckCircle2,
};

export default function DashboardCards({ metrics }) {
  return (
    <div className={styles.cardGrid}>
      {metrics.map((item) => {
        const Icon = icons[item.tone] || CircleDollarSign;
        return (
          <article key={item.title} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <span className={`${styles.metricIcon} ${styles[item.tone]}`}>
                <Icon size={18} />
              </span>
              <span className={styles.metricTitle}>{item.title}</span>
            </div>
            <div className={styles.metricValue}>{item.value}</div>
            <p className={styles.metricSubtitle}>{item.subtitle}</p>
          </article>
        );
      })}
    </div>
  );
}

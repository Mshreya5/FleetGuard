import React from 'react';
import styles from '../ServiceCenterDashboard.module.css';

export default function RecentActivity({ activities }) {
  return (
    <section className={styles.panelCompact}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Recent Activities</h2>
          <p className={styles.sectionSubtitle}>Latest updates from the workshop floor.</p>
        </div>
      </div>

      <div className={styles.activityList}>
        {activities.map((item) => (
          <article key={item.id} className={styles.activityItem}>
            <div className={styles.activityDot} />
            <div>
              <p className={styles.activityTitle}>{item.title}</p>
              <p className={styles.activityDetail}>{item.detail}</p>
              <span className={styles.activityTime}>{item.time}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

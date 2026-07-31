import React from 'react';
import styles from '../ServiceCenterDashboard.module.css';

export default function RecentActivity({ activities }) {
  if (!activities.length) {
    return (
      <section className={styles.panelCompact}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <p className={styles.sectionSubtitle} style={{ marginTop: 12 }}>No recent activity.</p>
      </section>
    );
  }

  return (
    <section className={styles.panelCompact}>
      <h2 className={styles.sectionTitle}>Recent Activity</h2>
      <div className={styles.activityList} style={{ marginTop: 12 }}>
        {activities.map((item) => (
          <article key={item.id} className={styles.activityItem}>
            <div className={styles.activityDot} />
            <div>
              <p className={styles.activityTitle}>{item.title}</p>
              <p className={styles.activityDetail}>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import React from 'react';
import styles from '../ServiceCenterDashboard.module.css';

export default function UpcomingServicesTable({ services }) {
  return (
    <section className={styles.tableCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Upcoming Services</h2>
          <p className={styles.sectionSubtitle}>Planned maintenance jobs for the next few days.</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Owner Name</th>
              <th>Service Type</th>
              <th>Scheduled Date</th>
              <th>Mechanic</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={`${service.vehicleNumber}-${service.scheduledDate}`}>
                <td>{service.vehicleNumber}</td>
                <td>{service.ownerName}</td>
                <td>{service.serviceType}</td>
                <td>{service.scheduledDate}</td>
                <td>{service.mechanic}</td>
                <td>
                  <span className={`${styles.badge} ${service.status === 'In Progress' ? styles.statusInProgress : service.status === 'Pending' ? styles.priorityMedium : styles.statusWaiting}`}>
                    {service.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

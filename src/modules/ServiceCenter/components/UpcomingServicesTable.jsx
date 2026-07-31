import React from 'react';
import styles from '../ServiceCenterDashboard.module.css';

export default function UpcomingServicesTable({ services }) {
  return (
    <section className={styles.tableCard}>
      <h2 className={styles.sectionTitle} style={{ marginBottom: 14 }}>Upcoming Services</h2>
      {services.length === 0 ? (
        <p className={styles.sectionSubtitle}>No upcoming services.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Owner</th>
                <th>Service Type</th>
                <th>Scheduled Date</th>
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
      )}
    </section>
  );
}

import React from 'react';
import styles from '../ServiceCenterDashboard.module.css';

const priorityClass = {
  Low: styles.priorityLow,
  Medium: styles.priorityMedium,
  High: styles.priorityHigh,
};

const statusClass = {
  Waiting: styles.statusWaiting,
  'In Service': styles.statusInService,
  Completed: styles.statusCompleted,
};

export default function VehicleQueueTable({ vehicles }) {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Vehicles waiting</h2>
          <p className={styles.sectionSubtitle}>Current queue for inspections and maintenance.</p>
        </div>
        <span className={styles.tableHint}>Updated 5 min ago</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Owner Name</th>
              <th>Vehicle Number</th>
              <th>Service Type</th>
              <th>Priority</th>
              <th>Arrival Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.owner}</td>
                <td>{vehicle.vehicleNo}</td>
                <td>{vehicle.serviceType}</td>
                <td>
                  <span className={`${styles.badge} ${priorityClass[vehicle.priority]}`}>{vehicle.priority}</span>
                </td>
                <td>{vehicle.arrivalTime}</td>
                <td>
                  <span className={`${styles.badge} ${statusClass[vehicle.status]}`}>{vehicle.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import styles from '../ServiceCenterDashboard.module.css';

const priorityClass = {
  Low: styles.priorityLow,
  Medium: styles.priorityMedium,
  High: styles.priorityHigh,
};

const statusClass = {
  Waiting: styles.statusWaiting,
  'In Progress': styles.statusInProgress,
  Completed: styles.statusCompleted,
};

export default function QueueTable({ vehicles }) {
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((item) => {
      const matchesSearch = [item.vehicleNumber, item.ownerBranch, item.vehicleModel, item.issue]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPriority = priority === 'All' || item.priority === priority;
      const matchesStatus = status === 'All' || item.status === status;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [priority, search, status, vehicles]);

  return (
    <section className={styles.tableCard}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Service Queue</h2>
          <p className={styles.sectionSubtitle}>Detailed list of active and upcoming service requests.</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input className={styles.filterInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicles, owner, issue..." />
        <select className={styles.filterSelect} value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select className={styles.filterSelect} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Waiting">Waiting</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Owner/Branch</th>
              <th>Vehicle Model</th>
              <th>Current Mileage</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((item) => (
              <tr key={item.vehicleNumber}>
                <td>{item.vehicleNumber}</td>
                <td>{item.ownerBranch}</td>
                <td>{item.vehicleModel}</td>
                <td>{item.currentMileage}</td>
                <td>{item.issue}</td>
                <td><span className={`${styles.badge} ${priorityClass[item.priority]}`}>{item.priority}</span></td>
                <td><span className={`${styles.badge} ${statusClass[item.status]}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

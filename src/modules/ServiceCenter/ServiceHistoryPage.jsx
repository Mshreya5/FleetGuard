import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import styles from './ServiceCenterDashboard.module.css';

export default function ServiceHistoryPage() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchHistory = async (activePage = page) => {
    try {
      const response = await axios.get('/api/service-center/extensions/history', {
        params: { search, status, page: activePage, limit },
      });
      const data = response.data;
      const items = Array.isArray(data) ? data : (data?.records || []);
      setRecords(items);
      setTotal(data?.total || items.length || 0);
    } catch (error) {
      console.error('Unable to fetch service history', error);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeRecords = Array.isArray(records) ? records : [];
  const filteredCount = useMemo(() => Math.ceil(total / limit) || 1, [total]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilter = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service History</h1>
          <p className={styles.pageSubtitle}>Review prior maintenance work, costs, and completion status.</p>
        </div>
      </header>

      <section className={styles.tableCard}>
        <div className={styles.filterBar}>
          <input className={styles.filterInput} value={search} onChange={handleSearch} placeholder="Search by vehicle or mechanic" />
          <select className={styles.filterSelect} value={status} onChange={handleFilter}>
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Mechanic</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {safeRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                    No service history records found matching your filters.
                  </td>
                </tr>
              ) : (
                safeRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date || record.createdAt).toLocaleDateString()}</td>
                    <td>{record.vehicle || record.vehicleNumber}</td>
                    <td>{record.mechanic || record.technician || 'Service Tech'}</td>
                    <td>₹{Number(record.cost || 0).toLocaleString()}</td>
                    <td><span className={`${styles.badge} ${styles.statusCompleted}`}>{record.status || 'Completed'}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.formActions} style={{ justifyContent: 'space-between', marginTop: '12px' }}>
          <button className={styles.secondaryButton} disabled={page === 1} onClick={() => { const nextPage = page - 1; setPage(nextPage); fetchHistory(nextPage); }}>Previous</button>
          <span className={styles.sectionSubtitle}>Page {page} of {filteredCount}</span>
          <button className={styles.secondaryButton} disabled={page >= filteredCount} onClick={() => { const nextPage = page + 1; setPage(nextPage); fetchHistory(nextPage); }}>Next</button>
        </div>
      </section>
    </>
  );
}

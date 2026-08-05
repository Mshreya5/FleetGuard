import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QueueTable from './components/QueueTable';
import styles from './ServiceCenterDashboard.module.css';

export default function ServiceQueue() {
  const [queueItems, setQueueItems] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await axios.get('/api/service-center/queue');
        const data = response.data;
        const items = Array.isArray(data) ? data : (data?.queue || []);
        setQueueItems(items);
      } catch (error) {
        console.error('Unable to load queue data', error);
      }
    };

    fetchQueue();
  }, []);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service Queue</h1>
          <p className={styles.pageSubtitle}>Monitor vehicle service requests with search and filtering tools.</p>
        </div>
      </header>

      <QueueTable vehicles={queueItems} />
    </>
  );
}

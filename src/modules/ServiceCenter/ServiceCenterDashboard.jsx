import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardCards from './components/DashboardCards';
import RecentActivity from './components/RecentActivity';
import UpcomingServicesTable from './components/UpcomingServicesTable';
import styles from './ServiceCenterDashboard.module.css';

export default function ServiceCenterDashboard() {
  const [summaryCards, setSummaryCards] = useState([]);
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/service-center/dashboard');
        const { stats, recentActivities, upcomingServices } = response.data;

        setSummaryCards([
          { title: 'Vehicles Waiting', value: stats.vehiclesWaiting, tone: 'primary' },
          { title: 'In Service', value: stats.vehiclesInService, tone: 'accent' },
          { title: 'Completed Today', value: stats.completedToday, tone: 'success' },
          { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, tone: 'revenue' },
        ]);

        setUpcomingServices(upcomingServices || []);
        setRecentActivities(recentActivities || []);
      } catch (error) {
        console.error('Unable to load dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service Dashboard</h1>
          <p className={styles.pageSubtitle}>Track workshop performance, upcoming service jobs, and recent service activity from a single view.</p>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(59,130,246,0.16)', border: '1px solid rgba(59,130,246,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>SC</div>
      </header>

      <DashboardCards metrics={summaryCards} />

      <div className={styles.contentGrid}>
        <div className={styles.mainPanel}>
          <UpcomingServicesTable services={upcomingServices} />
        </div>
        <div className={styles.sidePanel}>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </>
  );
}

import React from 'react';
import DashboardCards from './components/DashboardCards';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import UpcomingServicesTable from './components/UpcomingServicesTable';
import styles from './ServiceCenterDashboard.module.css';

const summaryCards = [
  { title: 'Vehicles Waiting', value: '24', subtitle: 'Vehicles awaiting inspection', tone: 'primary' },
  { title: 'Vehicles In Service', value: '11', subtitle: 'Repairs currently in progress', tone: 'accent' },
  { title: 'Completed Today', value: '38', subtitle: 'Service orders finished today', tone: 'success' },
  { title: 'Total Revenue', value: '$18,240', subtitle: 'Revenue from completed services', tone: 'primary' },
  { title: 'Upcoming Services', value: '12', subtitle: 'Jobs scheduled for tomorrow', tone: 'accent' },
];

const upcomingServices = [
  { vehicleNumber: 'KA 01 AB 2345', ownerName: 'Maya Chen', serviceType: 'Oil Change', scheduledDate: '2026-07-30', mechanic: 'Ravi Kumar', status: 'Scheduled' },
  { vehicleNumber: 'KA 05 CD 1189', ownerName: 'Arjun Rao', serviceType: 'Brake Service', scheduledDate: '2026-07-30', mechanic: 'Suresh Nair', status: 'In Progress' },
  { vehicleNumber: 'KA 12 EF 7742', ownerName: 'Neha Singh', serviceType: 'Battery Replacement', scheduledDate: '2026-07-31', mechanic: 'Kiran Das', status: 'Scheduled' },
  { vehicleNumber: 'KA 22 GH 4410', ownerName: 'Sameer Khan', serviceType: 'Tyre Rotation', scheduledDate: '2026-07-31', mechanic: 'Jayanth Rao', status: 'Pending' },
  { vehicleNumber: 'KA 34 IJ 6612', ownerName: 'Priya Desai', serviceType: 'Engine Diagnostics', scheduledDate: '2026-08-01', mechanic: 'Arun Bhat', status: 'Scheduled' },
];

const recentActivities = [
  { id: 1, title: 'Brake inspection completed', detail: 'Vehicle KA 05 CD 1189 was cleared for dispatch.', time: '10 mins ago' },
  { id: 2, title: 'Mechanic reassigned', detail: 'Ravi Kumar took over the oil change request.', time: '23 mins ago' },
  { id: 3, title: 'Service request logged', detail: 'New tyre rotation job received for KA 22 GH 4410.', time: '38 mins ago' },
  { id: 4, title: 'Mileage recorded', detail: 'Vehicle KA 01 AB 2345 reached 18,320 km.', time: '1 hr ago' },
  { id: 5, title: 'Parts approved', detail: 'Battery parts were approved for next shift.', time: '2 hrs ago' },
  { id: 6, title: 'Maintenance note added', detail: 'Engine diagnostics report uploaded successfully.', time: '3 hrs ago' },
];

export default function ServiceCenterDashboard() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Service Center</p>
          <h1 className={styles.pageTitle}>Service Dashboard</h1>
          <p className={styles.pageSubtitle}>Track workshop performance, upcoming service jobs, and recent service activity from a single view.</p>
        </div>
        <div className={styles.headerBadge}>Live operations overview</div>
      </header>

      <DashboardCards metrics={summaryCards} />

      <div className={styles.contentGrid}>
        <div className={styles.mainPanel}>
          <QuickActions />
          <UpcomingServicesTable services={upcomingServices} />
        </div>

        <div className={styles.sidePanel}>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ServiceCenterDashboard from './ServiceCenterDashboard';
import ServiceQueue from './ServiceQueue';
import ServiceLogForm from './ServiceLogForm';
import Sidebar from './components/Sidebar';
import styles from './ServiceCenterDashboard.module.css';

function getActiveItem(pathname) {
  if (pathname.includes('/servicecenter/queue')) return 'Service Queue';
  if (pathname.includes('/servicecenter/log')) return 'Service Log';
  return 'Dashboard';
}

export default function ServiceCenterModule() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectItem = (label, path) => {
    if (label === 'Dashboard') {
      navigate('/servicecenter/dashboard');
      return;
    }

    navigate(path);
  };

  return (
    <div className={styles.dashboardShell}>
      <Sidebar activeItem={getActiveItem(location.pathname)} onSelectItem={handleSelectItem} />

      <main className={styles.mainContent}>
        <Routes>
          <Route path="/dashboard" element={<ServiceCenterDashboard />} />
          <Route path="/queue" element={<ServiceQueue />} />
          <Route path="/log" element={<ServiceLogForm />} />
          <Route path="*" element={<Navigate to="/servicecenter/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

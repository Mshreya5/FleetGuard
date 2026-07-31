import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ServiceCenterDashboard from './ServiceCenterDashboard';
import ServiceQueue from './ServiceQueue';
import ServiceLogForm from './ServiceLogForm';
import UpdateVehicleMileage from './UpdateVehicleMileage';
import RecordServiceCost from './RecordServiceCost';
import NextServiceSchedule from './NextServiceSchedule';
import ServiceHistoryPage from './ServiceHistoryPage';
import AddHistoricalRecords from './AddHistoricalRecords';
import CompleteService from './CompleteService';
import MaintenanceRiskLevel from './MaintenanceRiskLevel';
import Sidebar from './components/Sidebar';
import styles from './ServiceCenterDashboard.module.css';

function getActiveItem(pathname) {
  if (pathname.includes('/servicecenter/queue')) return 'Service Queue';
  if (pathname.includes('/servicecenter/log')) return 'Service Log';
  if (pathname.includes('/servicecenter/update-mileage')) return 'Update Vehicle Mileage';
  if (pathname.includes('/servicecenter/record-cost')) return 'Record Service Cost';
  if (pathname.includes('/servicecenter/next-schedule')) return 'Next Service Schedule';
  if (pathname.includes('/servicecenter/service-history')) return 'Service History';
  if (pathname.includes('/servicecenter/add-history')) return 'Add Historical Records';
  if (pathname.includes('/servicecenter/complete-service')) return 'Complete Service';
  if (pathname.includes('/servicecenter/maintenance-risk')) return 'Maintenance Risk Level';
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
          <Route path="dashboard" element={<ServiceCenterDashboard />} />
          <Route path="queue" element={<ServiceQueue />} />
          <Route path="log" element={<ServiceLogForm />} />
          <Route path="update-mileage" element={<UpdateVehicleMileage />} />
          <Route path="record-cost" element={<RecordServiceCost />} />
          <Route path="next-schedule" element={<NextServiceSchedule />} />
          <Route path="service-history" element={<ServiceHistoryPage />} />
          <Route path="add-history" element={<AddHistoricalRecords />} />
          <Route path="complete-service" element={<CompleteService />} />
          <Route path="maintenance-risk" element={<MaintenanceRiskLevel />} />
          <Route path="*" element={<Navigate to="/servicecenter/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

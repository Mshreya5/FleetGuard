import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectItem = (label, path) => {
    if (label === 'Dashboard') {
      navigate('/servicecenter/dashboard');
      return;
    }
    navigate(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
      <Sidebar activeItem={getActiveItem(location.pathname)} onSelectItem={handleSelectItem} />

      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100% - 240px)' }}>
        {/* Standardized Master Top Navbar */}
        <header style={{
          minHeight: '64px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.5px' }}>
              FleetGuard
            </span>
            <span style={{ color: '#334155' }}>|</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
              Service Center
            </span>
          </div>

          <div style={{ flex: '1 1 200px', maxWidth: '360px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search vehicle, queue, service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '20px',
                padding: '8px 16px 8px 36px',
                color: '#f1f5f9',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              SC
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px', backgroundColor: '#0f172a' }}>
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
    </div>
  );
}

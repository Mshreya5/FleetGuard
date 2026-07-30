import { useMemo, useState } from 'react';
import './styles/adminDashboard.css';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardCards from './components/DashboardCards';
import FleetComplianceReport from './components/FleetComplianceReport';
import UpcomingExpiryReport from './components/UpcomingExpiryReport';
import NotificationPanel from './components/NotificationPanel';

const dashboardSummary = {
  totalVehicles: 120,
  totalDrivers: 45,
  fleetManagers: 8,
  vehiclesUnderMaintenance: 12,
  compliantVehicles: 95,
  nonCompliantVehicles: 25,
  upcomingExpiries: 14,
  notifications: 18,
};

const fleetComplianceData = [
  {
    registrationNumber: 'KA01AB1234',
    insurance: 'Valid',
    pollution: 'Valid',
    fitness: 'Valid',
    overall: 'Compliant',
  },
  {
    registrationNumber: 'TN09CD7788',
    insurance: 'Expired',
    pollution: 'Valid',
    fitness: 'Valid',
    overall: 'Non-Compliant',
  },
  {
    registrationNumber: 'MH12XY4567',
    insurance: 'Valid',
    pollution: 'Expiring Soon',
    fitness: 'Valid',
    overall: 'Non-Compliant',
  },
  {
    registrationNumber: 'KL07EF2345',
    insurance: 'Valid',
    pollution: 'Valid',
    fitness: 'Expired',
    overall: 'Non-Compliant',
  },
];

const upcomingExpiryData = [
  {
    registrationNumber: 'KA01AB1234',
    documentType: 'Insurance',
    expiryDate: '12 Aug 2026',
    daysRemaining: 5,
    status: 'Expired Soon',
  },
  {
    registrationNumber: 'TN09CD7788',
    documentType: 'Pollution Certificate',
    expiryDate: '18 Aug 2026',
    daysRemaining: 11,
    status: 'Expiring Soon',
  },
  {
    registrationNumber: 'MH12XY4567',
    documentType: 'Fitness Certificate',
    expiryDate: '22 Aug 2026',
    daysRemaining: 15,
    status: 'Valid',
  },
];

const recentNotifications = [
  'Insurance for KA01AB1234 expires in 5 days.',
  'Vehicle TN09CD7788 requires compliance renewal.',
  'Driver Rahul assigned vehicle MH12XY4567.',
  'Service completed for KL07EF2345.',
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('all');

  const filteredCompliance = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return fleetComplianceData.filter((vehicle) =>
      vehicle.registrationNumber.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const filteredExpiries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return upcomingExpiryData.filter((item) => {
      const matchesSearch = item.registrationNumber.toLowerCase().includes(term);
      const matchesFilter =
        expiryFilter === 'all' ||
        item.documentType.toLowerCase() === expiryFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [expiryFilter, searchTerm]);

  return (
    <div className="admin-dashboard">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <div className="admin-main">
        <TopNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <main className="admin-content">
          {activeView === 'dashboard' && (
            <>
              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Fleet Operations</p>
                    <h2>Admin Dashboard</h2>
                  </div>
                  <p className="muted">Enterprise fleet health overview</p>
                </div>
                <DashboardCards summary={dashboardSummary} />
              </section>

              <section className="grid-layout">
                <FleetComplianceReport vehicles={filteredCompliance} searchTerm={searchTerm} />
                <NotificationPanel notifications={recentNotifications} />
              </section>

              <section className="section-block">
                <UpcomingExpiryReport
                  expiries={filteredExpiries}
                  searchTerm={searchTerm}
                  selectedFilter={expiryFilter}
                  onFilterChange={setExpiryFilter}
                />
              </section>
            </>
          )}

          {activeView === 'compliance' && (
            <FleetComplianceReport vehicles={filteredCompliance} searchTerm={searchTerm} />
          )}

          {activeView === 'expiries' && (
            <UpcomingExpiryReport
              expiries={filteredExpiries}
              searchTerm={searchTerm}
              selectedFilter={expiryFilter}
              onFilterChange={setExpiryFilter}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

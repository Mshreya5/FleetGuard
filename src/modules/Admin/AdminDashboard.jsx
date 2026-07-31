import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './styles/adminDashboard.css';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardCards from './components/DashboardCards';
import FleetComplianceReport from './components/FleetComplianceReport';
import UpcomingExpiryReport from './components/UpcomingExpiryReport';
import NotificationPanel from './components/NotificationPanel';
import OverdueComplianceReport from './components/OverdueComplianceReport';
import ServiceCostSummary from './components/ServiceCostSummary';
import ManageUsers from './components/ManageUsers';
import OverrideLogs from './components/OverrideLogs';
import AlertSettingsPage from './components/AlertSettingsPage';
import AdminNotifications from './components/AdminNotifications';
import FleetSummaryReport from './components/FleetSummaryReport';

const defaultSummary = {
  totalVehicles: 0,
  totalDrivers: 0,
  fleetManagers: 0,
  vehiclesUnderMaintenance: 0,
  compliantVehicles: 0,
  nonCompliantVehicles: 0,
  upcomingExpiries: 0,
};

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [dashboardSummary, setDashboardSummary] = useState(defaultSummary);
  const [fleetComplianceData, setFleetComplianceData] = useState([]);
  const [upcomingExpiryData, setUpcomingExpiryData] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [dashboardResponse, complianceResponse, expiryResponse] = await Promise.all([
          axios.get('/api/admin/dashboard'),
          axios.get('/api/admin/compliance'),
          axios.get('/api/admin/upcoming-expiry'),
        ]);

        if (!isMounted) return;

        const summary = dashboardResponse.data?.summary || {};
        setDashboardSummary({ ...defaultSummary, ...summary });
        setFleetComplianceData(complianceResponse.data?.vehicles || []);
        setUpcomingExpiryData(expiryResponse.data?.expiries || []);
        setRecentNotifications(dashboardResponse.data?.notifications || []);
      } catch {
        if (isMounted) {
          setError('Unable to load fleet data from the backend. Please verify the API server and database connection.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const filteredCompliance = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return fleetComplianceData.filter((vehicle) =>
      vehicle.registrationNumber.toLowerCase().includes(term)
    );
  }, [fleetComplianceData, searchTerm]);

  const filteredExpiries = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return upcomingExpiryData.filter((item) => {
      const matchesSearch = item.registrationNumber.toLowerCase().includes(term);
      const matchesFilter =
        expiryFilter === 'all' ||
        item.documentType.toLowerCase() === expiryFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [expiryFilter, searchTerm, upcomingExpiryData]);

  const standaloneViews = {
    overdue: <OverdueComplianceReport />,
    'service-cost': <ServiceCostSummary />,
    users: <ManageUsers />,
    'override-logs': <OverrideLogs />,
    'alert-settings': <AlertSettingsPage />,
    notifications: <AdminNotifications />,
    report: <FleetSummaryReport />,
  };

  if (standaloneViews[activeView]) {
    return (
      <div className="admin-dashboard">
        <Sidebar activeView={activeView} onNavigate={setActiveView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="admin-main">
          <TopNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onMenuToggle={() => setSidebarOpen(true)} />
          <main className="admin-content">
            <section className="section-block">
              {standaloneViews[activeView]}
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Sidebar activeView={activeView} onNavigate={setActiveView} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <TopNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onMenuToggle={() => setSidebarOpen(true)} />

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
                {loading ? (
                  <p className="muted">Loading dashboard data from the backend...</p>
                ) : error ? (
                  <p className="muted">{error}</p>
                ) : (
                  <DashboardCards summary={dashboardSummary} />
                )}
              </section>

              <section className="grid-layout">
                <FleetComplianceReport
                  vehicles={filteredCompliance}
                  searchTerm={searchTerm}
                  loading={loading}
                  error={error}
                />
                <NotificationPanel
                  notifications={recentNotifications}
                  loading={loading}
                  error={error}
                />
              </section>

              <section className="section-block">
                <UpcomingExpiryReport
                  expiries={filteredExpiries}
                  searchTerm={searchTerm}
                  selectedFilter={expiryFilter}
                  onFilterChange={setExpiryFilter}
                  loading={loading}
                  error={error}
                />
              </section>
            </>
          )}

          {activeView === 'compliance' && (
            <FleetComplianceReport
              vehicles={filteredCompliance}
              searchTerm={searchTerm}
              loading={loading}
              error={error}
            />
          )}

          {activeView === 'expiries' && (
            <UpcomingExpiryReport
              expiries={filteredExpiries}
              searchTerm={searchTerm}
              selectedFilter={expiryFilter}
              onFilterChange={setExpiryFilter}
              loading={loading}
              error={error}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

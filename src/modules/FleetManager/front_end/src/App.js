import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import NotificationToast from './components/NotificationToast';

import DashboardPage from './pages/DashboardPage';
import VehicleRegistrationPage from './pages/VehicleRegistrationPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import CompliancePage from './pages/CompliancePage';
import AssignVehiclePage from './pages/AssignVehiclePage';
import ExpiryPage from './pages/ExpiryPage';
import { FleetManagerProvider } from './context/FleetManagerContext';
import './index.css';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const getTabFromPath = (path) => {
        const cleanPath = path.replace('/fleetmanager', '').replace('/FleetManager/front_end/DashboardPage', '');
        if (cleanPath.startsWith('/registration')) return 'registration';
        if (cleanPath.startsWith('/vehicles')) return 'list';
        if (cleanPath.startsWith('/details')) return 'details';
        if (cleanPath.startsWith('/compliance')) return 'compliance';
        if (cleanPath.startsWith('/assign')) return 'assign';
        if (cleanPath.startsWith('/expiry')) return 'expiry';
        return 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        setActiveTab(getTabFromPath(location.pathname));
    }, [location.pathname]);

    const handleTabSelect = (tabId) => {
        setActiveTab(tabId);
        setMobileSidebarOpen(false);
        const basePath = location.pathname.startsWith('/fleetmanager') ? '/fleetmanager' : '';
        switch (tabId) {
            case 'dashboard': navigate(`${basePath}/`); break;
            case 'registration': navigate(`${basePath}/registration`); break;
            case 'list': navigate(`${basePath}/vehicles`); break;
            case 'details': navigate(`${basePath}/details`); break;
            case 'compliance': navigate(`${basePath}/compliance`); break;
            case 'assign': navigate(`${basePath}/assign`); break;
            case 'expiry': navigate(`${basePath}/expiry`); break;
            default: navigate(`${basePath}/`); break;
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 4000);
    };

    const handleGlobalSearch = (query) => {
        setGlobalSearchQuery(query);
        if (activeTab !== 'list') {
            handleTabSelect('list');
        }
    };

    return (
        <FleetManagerProvider>
            <div className="fm-main-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
                <Sidebar
                    activeTab={activeTab}
                    onTabSelect={handleTabSelect}
                    selectedVehicleId={selectedVehicleId}
                    mobileOpen={mobileSidebarOpen}
                    onCloseMobile={() => setMobileSidebarOpen(false)}
                />

                <div className="fm-main-wrapper" style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100% - 240px)' }}>
                    <TopNavbar
                        onSearchChange={handleGlobalSearch}
                        globalSearchQuery={globalSearchQuery}
                        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    />

                    <main className="fm-main-body" style={{ flex: 1, padding: '24px', backgroundColor: '#0f172a' }}>
                        <Routes>
                            <Route path="/" element={
                                <DashboardPage
                                    onNavigate={handleTabSelect}
                                    onSelectVehicle={setSelectedVehicleId}
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/dashboard" element={
                                <DashboardPage
                                    onNavigate={handleTabSelect}
                                    onSelectVehicle={setSelectedVehicleId}
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/registration" element={
                                <VehicleRegistrationPage
                                    onNavigate={handleTabSelect}
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/vehicles" element={
                                <VehicleListPage
                                    onNavigate={handleTabSelect}
                                    onSelectVehicle={setSelectedVehicleId}
                                    onUploadClick={(v) => {
                                        setSelectedVehicleId(v._id || v.id);
                                        handleTabSelect('compliance');
                                    }}
                                    showToast={showToast}
                                    globalSearchQuery={globalSearchQuery}
                                />
                            } />
                            <Route path="/details" element={
                                <VehicleDetailsPage
                                    vehicleId={selectedVehicleId}
                                    onBack={() => handleTabSelect('list')}
                                    onEdit={(v) => {
                                        if (v) setSelectedVehicleId(v._id || v.id);
                                        handleTabSelect('list');
                                    }}
                                    onAssignDriver={(v) => {
                                        if (v) setSelectedVehicleId(v._id || v.id);
                                        handleTabSelect('assign');
                                    }}
                                    onUploadDoc={(v) => {
                                        if (v) setSelectedVehicleId(v._id || v.id);
                                        handleTabSelect('compliance');
                                    }}
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/compliance" element={
                                <CompliancePage
                                    selectedVehicleId={selectedVehicleId}
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/assign" element={
                                <AssignVehiclePage
                                    showToast={showToast}
                                />
                            } />
                            <Route path="/expiry" element={
                                <ExpiryPage
                                    onNavigate={handleTabSelect}
                                    onSelectVehicle={setSelectedVehicleId}
                                    showToast={showToast}
                                />
                            } />
                        </Routes>
                    </main>
                </div>

                <NotificationToast
                    toast={toast}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            </div>
        </FleetManagerProvider>
    );
}

export default App;
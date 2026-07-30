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
import { COLORS } from './utils/styles';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const getTabFromPath = (path) => {
        if (path.startsWith('/registration')) return 'registration';
        if (path.startsWith('/vehicles')) return 'list';
        if (path.startsWith('/details')) return 'details';
        if (path.startsWith('/compliance')) return 'compliance';
        if (path.startsWith('/assign')) return 'assign';
        if (path.startsWith('/expiry')) return 'expiry';
        return 'dashboard';
    };

    const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    useEffect(() => {
        setActiveTab(getTabFromPath(location.pathname));
    }, [location.pathname]);

    const handleTabSelect = (tabId) => {
        setActiveTab(tabId);
        switch (tabId) {
            case 'dashboard': navigate('/'); break;
            case 'registration': navigate('/registration'); break;
            case 'list': navigate('/vehicles'); break;
            case 'details': navigate('/details'); break;
            case 'compliance': navigate('/compliance'); break;
            case 'assign': navigate('/assign'); break;
            case 'expiry': navigate('/expiry'); break;
            default: navigate('/'); break;
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
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: COLORS.background,
            color: COLORS.text,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            <Sidebar
                activeTab={activeTab}
                onTabSelect={handleTabSelect}
                selectedVehicleId={selectedVehicleId}
            />

            <div style={{
                flex: 1,
                marginLeft: '240px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <TopNavbar
                    onSearchChange={handleGlobalSearch}
                    globalSearchQuery={globalSearchQuery}
                />

                <main style={{
                    flex: 1,
                    padding: '24px',
                    backgroundColor: COLORS.background
                }}>
                    <Routes>
                        <Route path="/" element={
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
                                    setSelectedVehicleId(v._id);
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
                                    setSelectedVehicleId(v._id);
                                    handleTabSelect('list');
                                }}
                                onUploadDoc={(v) => {
                                    setSelectedVehicleId(v._id);
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
    );
}

export default App;
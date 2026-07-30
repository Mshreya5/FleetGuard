import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import Loader from '../components/Loader';
import { getDashboardSummary } from '../services/api';

const DashboardPage = ({ onNavigate, onSelectVehicle, showToast }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadSummary = async () => {
        setLoading(true);
        try {
            const data = await getDashboardSummary();
            setSummary(data);
        } catch (err) {
            showToast(err.message || 'Failed to fetch dashboard summary', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    if (loading) return <Loader message="Loading fleet dashboard metrics..." />;

    return (
        <div>
            <DashboardCards
                summaryData={summary}
                onNavigate={onNavigate}
                onSelectVehicle={onSelectVehicle}
            />
        </div>
    );
};

export default DashboardPage;

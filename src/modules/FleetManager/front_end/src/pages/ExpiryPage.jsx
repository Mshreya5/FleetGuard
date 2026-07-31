import React, { useState, useEffect } from 'react';
import ExpiryTable from '../components/ExpiryTable';
import Loader from '../components/Loader';
import { getUpcomingExpiries } from '../services/api';

const ExpiryPage = ({ onNavigate, onSelectVehicle, showToast }) => {
    const [expiries, setExpiries] = useState([]);
    const [daysFilter, setDaysFilter] = useState(30);
    const [loading, setLoading] = useState(true);

    const loadExpiries = async () => {
        setLoading(true);
        try {
            const data = await getUpcomingExpiries(daysFilter);
            setExpiries(data.expirations || []);
        } catch (err) {
            showToast(err.message || 'Failed to load upcoming expiries', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpiries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [daysFilter]);

    if (loading) return <Loader message={`Calculating document expiries for next ${daysFilter} days...`} />;

    return (
        <div>
            <ExpiryTable
                expiries={expiries}
                daysFilter={daysFilter}
                onFilterDaysChange={setDaysFilter}
                onViewVehicle={(id) => {
                    onSelectVehicle(id);
                    onNavigate('details');
                }}
            />
        </div>
    );
};

export default ExpiryPage;

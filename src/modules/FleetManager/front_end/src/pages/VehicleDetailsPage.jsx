import React, { useState, useEffect } from 'react';
import VehicleDetailsCard from '../components/VehicleDetailsCard';
import Loader from '../components/Loader';
import { getVehicleById } from '../services/api';

const VehicleDetailsPage = ({ vehicleId, onBack, onEdit, onUploadDoc, showToast }) => {
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadVehicle = async () => {
        if (!vehicleId) return;
        setLoading(true);
        try {
            const data = await getVehicleById(vehicleId);
            setVehicleData(data);
        } catch (err) {
            showToast(err.message || 'Failed to fetch vehicle details', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleId]);

    if (!vehicleId) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>No vehicle selected. Please select a vehicle from the list.</p>
                <button onClick={onBack} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Go to Vehicle List
                </button>
            </div>
        );
    }

    if (loading) return <Loader message="Loading vehicle information & compliance..." />;

    return (
        <div>
            <VehicleDetailsCard
                vehicleData={vehicleData}
                onBack={onBack}
                onEdit={onEdit}
                onUploadDoc={onUploadDoc}
            />
        </div>
    );
};

export default VehicleDetailsPage;

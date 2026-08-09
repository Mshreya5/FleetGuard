import React, { useState, useEffect } from 'react';
import VehicleDetailsCard from '../components/VehicleDetailsCard';
import Loader from '../components/Loader';
import { getVehicleById } from '../services/api';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const VehicleDetailsPage = ({ vehicleId, onBack, onEdit, onAssignDriver, onUploadDoc, showToast }) => {
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!vehicleId) return;

        let isMounted = true;
        setLoading(true);
        setError(null);

        getVehicleById(vehicleId)
            .then(data => {
                if (isMounted) {
                    setVehicleData(data);
                }
            })
            .catch(err => {
                if (isMounted) {
                    const msg = err.message || 'Failed to fetch vehicle details';
                    setError(msg);
                    if (showToast) showToast(msg, 'danger');
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [vehicleId, showToast]);

    if (!vehicleId) {
        return (
            <div style={{ ...COMMON_STYLES.card, textAlign: 'center', padding: '48px 24px', maxWidth: '600px', margin: '40px auto' }}>
                <h3 style={{ ...COMMON_STYLES.heading, marginBottom: '8px' }}>No vehicle selected.</h3>
                <p style={{ ...COMMON_STYLES.subheading, marginBottom: '24px' }}>
                    Please select a vehicle from the list to view its complete details and compliance status.
                </p>
                <button onClick={onBack} style={COMMON_STYLES.buttonPrimary}>
                    Go to Vehicle List
                </button>
            </div>
        );
    }

    if (loading) return <Loader message="Loading vehicle details from backend..." />;

    if (error) {
        return (
            <div style={{ ...COMMON_STYLES.card, textAlign: 'center', padding: '48px 24px', maxWidth: '600px', margin: '40px auto' }}>
                <h3 style={{ ...COMMON_STYLES.heading, color: COLORS.danger, marginBottom: '8px' }}>
                    Unable to fetch vehicle details
                </h3>
                <p style={{ ...COMMON_STYLES.subheading, marginBottom: '24px' }}>
                    {error}
                </p>
                <button onClick={onBack} style={COMMON_STYLES.buttonSecondary}>
                    Go to Vehicle List
                </button>
            </div>
        );
    }

    return (
        <div>
            <VehicleDetailsCard
                vehicleData={vehicleData}
                onBack={onBack}
                onEdit={onEdit}
                onAssignDriver={onAssignDriver}
                onUploadDoc={onUploadDoc}
            />
        </div>
    );
};

export default VehicleDetailsPage;

import React from 'react';
import VehicleRegistrationForm from '../components/VehicleRegistrationForm';

const VehicleRegistrationPage = ({ onNavigate, showToast }) => {
    return (
        <div>
            <VehicleRegistrationForm
                onSuccess={() => onNavigate('list')}
                showToast={showToast}
            />
        </div>
    );
};

export default VehicleRegistrationPage;

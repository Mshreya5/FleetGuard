import React, { useState } from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import { useFleetManager } from '../context/FleetManagerContext';

const FUEL_TYPES = ["Diesel", "Petrol", "Electric", "Hybrid", "CNG"];
const VEHICLE_TYPES = ["Truck", "Van", "Sedan", "SUV", "Bus", "Trailer"];
const BRANCHES = ["North Hub", "South Terminal", "East Depot", "West Station", "Central HQ"];

const VehicleRegistrationForm = ({ onSuccess, showToast }) => {
    const { addVehicle, loadData } = useFleetManager();
    const initialFormState = {
        registrationNumber: '',
        model: '',
        brand: '',
        branch: BRANCHES[0],
        manufacturingYear: new Date().getFullYear(),
        mileage: '0',
        fuelType: 'Diesel',
        vehicleType: 'Truck'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.registrationNumber.trim()) {
            newErrors.registrationNumber = 'Registration Number is required';
        } else if (!/^[A-Z0-9- ]+$/i.test(formData.registrationNumber.trim())) {
            newErrors.registrationNumber = 'Invalid registration number format';
        }

        if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.branch.trim()) newErrors.branch = 'Branch is required';

        const year = Number(formData.manufacturingYear);
        const currentYear = new Date().getFullYear();
        if (!year || year < 1990 || year > currentYear + 1) {
            newErrors.manufacturingYear = `Enter a valid year (1990 - ${currentYear + 1})`;
        }

        const mileage = Number(formData.mileage);
        if (isNaN(mileage) || mileage < 0) {
            newErrors.mileage = 'Mileage cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await addVehicle({
                ...formData,
                registrationNumber: formData.registrationNumber.trim().toUpperCase(),
                manufacturingYear: Number(formData.manufacturingYear),
                mileage: Number(formData.mileage)
            });

            await loadData();
            if (showToast) showToast('Vehicle registered successfully in MongoDB', 'success');
            handleReset();
            if (onSuccess) onSuccess();
        } catch (err) {
            if (showToast) showToast(err.message || 'Failed to register vehicle', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={COMMON_STYLES.card}>
            <div style={{ marginBottom: '20px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px' }}>
                <h2 style={COMMON_STYLES.heading}>FG-FM-02: Vehicle Registration</h2>
                <p style={COMMON_STYLES.subheading}>Fill in details to add a new transport asset to MongoDB</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {/* Registration Number */}
                    <div>
                        <label style={COMMON_STYLES.label}>Registration Number *</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            placeholder="e.g. KA-01-EA-1005"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            style={{
                                ...COMMON_STYLES.input,
                                borderColor: errors.registrationNumber ? COLORS.danger : COLORS.border
                            }}
                        />
                        {errors.registrationNumber && (
                            <span style={{ fontSize: '11px', color: COLORS.danger, marginTop: '4px', display: 'block' }}>
                                {errors.registrationNumber}
                            </span>
                        )}
                    </div>

                    {/* Brand */}
                    <div>
                        <label style={COMMON_STYLES.label}>Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            placeholder="e.g. Volvo, Mercedes, Tata"
                            value={formData.brand}
                            onChange={handleChange}
                            style={{
                                ...COMMON_STYLES.input,
                                borderColor: errors.brand ? COLORS.danger : COLORS.border
                            }}
                        />
                        {errors.brand && (
                            <span style={{ fontSize: '11px', color: COLORS.danger, marginTop: '4px', display: 'block' }}>
                                {errors.brand}
                            </span>
                        )}
                    </div>

                    {/* Model */}
                    <div>
                        <label style={COMMON_STYLES.label}>Model *</label>
                        <input
                            type="text"
                            name="model"
                            placeholder="e.g. FH16, Actros, Prima"
                            value={formData.model}
                            onChange={handleChange}
                            style={{
                                ...COMMON_STYLES.input,
                                borderColor: errors.model ? COLORS.danger : COLORS.border
                            }}
                        />
                        {errors.model && (
                            <span style={{ fontSize: '11px', color: COLORS.danger, marginTop: '4px', display: 'block' }}>
                                {errors.model}
                            </span>
                        )}
                    </div>

                    {/* Branch Location */}
                    <div>
                        <label style={COMMON_STYLES.label}>Branch Location *</label>
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            style={COMMON_STYLES.select}
                        >
                            {BRANCHES.map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    {/* Manufacturing Year */}
                    <div>
                        <label style={COMMON_STYLES.label}>Manufacturing Year *</label>
                        <input
                            type="number"
                            name="manufacturingYear"
                            value={formData.manufacturingYear}
                            onChange={handleChange}
                            style={{
                                ...COMMON_STYLES.input,
                                borderColor: errors.manufacturingYear ? COLORS.danger : COLORS.border
                            }}
                        />
                        {errors.manufacturingYear && (
                            <span style={{ fontSize: '11px', color: COLORS.danger, marginTop: '4px', display: 'block' }}>
                                {errors.manufacturingYear}
                            </span>
                        )}
                    </div>

                    {/* Mileage */}
                    <div>
                        <label style={COMMON_STYLES.label}>Current Mileage (km) *</label>
                        <input
                            type="number"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleChange}
                            style={{
                                ...COMMON_STYLES.input,
                                borderColor: errors.mileage ? COLORS.danger : COLORS.border
                            }}
                        />
                        {errors.mileage && (
                            <span style={{ fontSize: '11px', color: COLORS.danger, marginTop: '4px', display: 'block' }}>
                                {errors.mileage}
                            </span>
                        )}
                    </div>

                    {/* Fuel Type */}
                    <div>
                        <label style={COMMON_STYLES.label}>Fuel Type</label>
                        <select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleChange}
                            style={COMMON_STYLES.select}
                        >
                            {FUEL_TYPES.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    {/* Vehicle Type */}
                    <div>
                        <label style={COMMON_STYLES.label}>Vehicle Type</label>
                        <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            style={COMMON_STYLES.select}
                        >
                            {VEHICLE_TYPES.map(vt => (
                                <option key={vt} value={vt}>{vt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Form Buttons */}
                <div style={{
                    display: 'flex',
                    justify: 'flex-end',
                    gap: '12px',
                    marginTop: '12px',
                    borderTop: `1px solid ${COLORS.border}`,
                    paddingTop: '16px'
                }}>
                    <button
                        type="button"
                        onClick={handleReset}
                        style={COMMON_STYLES.buttonSecondary}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            ...COMMON_STYLES.buttonPrimary,
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Saving to MongoDB...' : 'Save Vehicle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleRegistrationForm;
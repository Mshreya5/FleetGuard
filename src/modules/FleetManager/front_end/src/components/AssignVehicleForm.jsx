import React, { useState } from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import { assignVehicle } from '../services/api';

const AssignVehicleForm = ({ availableVehicles = [], onAssignSuccess, showToast }) => {
    const [vehicleId, setVehicleId] = useState('');
    const [driverName, setDriverName] = useState('');
    const [assignedDate, setAssignedDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vehicleId) {
            showToast('Please select an available vehicle to assign', 'danger');
            return;
        }
        if (!driverName.trim()) {
            showToast('Please enter the driver name', 'danger');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await assignVehicle({
                vehicleId,
                driverName: driverName.trim(),
                assignedDate,
                notes
            });
            showToast(res.message || 'Vehicle assigned successfully in MongoDB', 'success');
            setVehicleId('');
            setDriverName('');
            setNotes('');
            if (onAssignSuccess) onAssignSuccess();
        } catch (err) {
            showToast(err.message || 'Failed to assign vehicle', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={COMMON_STYLES.card}>
            <div style={{ marginBottom: '20px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '12px' }}>
                <h2 style={COMMON_STYLES.heading}>FG-FM-09: Vehicle Assignment</h2>
                <p style={COMMON_STYLES.subheading}>Assign available fleet vehicles to designated drivers and update status in MongoDB</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                    {/* Available Vehicles Dropdown */}
                    <div>
                        <label style={COMMON_STYLES.label}>Available Vehicle *</label>
                        <select
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            style={COMMON_STYLES.select}
                        >
                            <option value="">-- Select Available Vehicle --</option>
                            {availableVehicles.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.registrationNumber} - {v.brand} {v.model} ({v.branch})
                                </option>
                            ))}
                        </select>
                        {availableVehicles.length === 0 && (
                            <span style={{ fontSize: '11px', color: COLORS.accent, marginTop: '4px', display: 'block' }}>
                                No vehicles currently available for assignment.
                            </span>
                        )}
                    </div>

                    {/* Driver Name Input */}
                    <div>
                        <label style={COMMON_STYLES.label}>Driver Name *</label>
                        <input
                            type="text"
                            placeholder="Enter assigned driver's full name"
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            style={COMMON_STYLES.input}
                        />
                    </div>

                    {/* Assignment Date */}
                    <div>
                        <label style={COMMON_STYLES.label}>Assignment Date *</label>
                        <input
                            type="date"
                            value={assignedDate}
                            onChange={(e) => setAssignedDate(e.target.value)}
                            style={COMMON_STYLES.input}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label style={COMMON_STYLES.label}>Assignment Notes / Route Details</label>
                    <textarea
                        rows="3"
                        placeholder="Specify route, destination, or assignment instructions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ ...COMMON_STYLES.input, resize: 'vertical' }}
                    />
                </div>

                {/* Action Row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
                    <button
                        type="submit"
                        disabled={isSubmitting || availableVehicles.length === 0}
                        style={{
                            ...COMMON_STYLES.buttonPrimary,
                            opacity: (isSubmitting || availableVehicles.length === 0) ? 0.6 : 1
                        }}
                    >
                        {isSubmitting ? 'Assigning Vehicle...' : 'Confirm Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignVehicleForm;

import React, { useState, useEffect } from 'react';
import AssignVehicleForm from '../components/AssignVehicleForm';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { getVehicles, getAssignments, unassignVehicle } from '../services/api';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const AssignVehiclePage = ({ showToast }) => {
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAssignData = async () => {
        setLoading(true);
        try {
            const vData = await getVehicles({ status: 'Available', limit: 100 });
            setAvailableVehicles(vData.vehicles || []);

            const aData = await getAssignments();
            setAssignments(aData || []);
        } catch (err) {
            showToast(err.message || 'Failed to load assignment data', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUnassign = async (vehicleId, regNum) => {
        try {
            await unassignVehicle(vehicleId);
            showToast(`Vehicle ${regNum} returned to available pool`, 'success');
            loadAssignData();
        } catch (err) {
            showToast(err.message || 'Failed to unassign vehicle', 'danger');
        }
    };

    if (loading) return <Loader message="Loading vehicles and driver assignment database..." />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AssignVehicleForm
                availableVehicles={availableVehicles}
                onAssignSuccess={loadAssignData}
                showToast={showToast}
            />

            {/* Active Assignments Table */}
            <div style={COMMON_STYLES.card}>
                <div style={{ marginBottom: '16px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                    <h3 style={COMMON_STYLES.heading}>Active & Past Vehicle Assignments</h3>
                    <p style={COMMON_STYLES.subheading}>Real-time driver assignments stored in MongoDB</p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={COMMON_STYLES.tableHeader}>Registration</th>
                                <th style={COMMON_STYLES.tableHeader}>Assigned Driver</th>
                                <th style={COMMON_STYLES.tableHeader}>Assigned Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Return Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Status</th>
                                <th style={COMMON_STYLES.tableHeader}>Notes</th>
                                <th style={{ ...COMMON_STYLES.tableHeader, textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ ...COMMON_STYLES.tableCell, textAlign: 'center', padding: '24px' }}>
                                        No vehicle assignments recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map(a => (
                                    <tr key={a._id}>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '700', color: COLORS.primary }}>
                                            {a.registrationNumber}
                                        </td>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '600' }}>{a.driverName}</td>
                                        <td style={COMMON_STYLES.tableCell}>{new Date(a.assignedDate).toLocaleDateString()}</td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            {a.returnDate ? new Date(a.returnDate).toLocaleDateString() : 'In Operation'}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={a.status} />
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>{a.notes || '-'}</td>
                                        <td style={{ ...COMMON_STYLES.tableCell, textAlign: 'right' }}>
                                            {a.status === 'Active' && (
                                                <button
                                                    onClick={() => handleUnassign(a.vehicleId?._id || a.vehicleId, a.registrationNumber)}
                                                    style={{ ...COMMON_STYLES.buttonSecondary, padding: '4px 10px', fontSize: '12px' }}
                                                >
                                                    Return Vehicle
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignVehiclePage;

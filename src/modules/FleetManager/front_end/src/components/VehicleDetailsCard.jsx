import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import StatusBadge from './StatusBadge';

const API_SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const COMPLIANCE_ITEMS = [
    { typeKey: "INSURANCE", label: "Insurance", altKeys: ["Insurance", "INSURANCE"] },
    { typeKey: "INSPECTION", label: "Inspection Certificate", altKeys: ["Inspection Certificate", "INSPECTION", "Fitness Certificate", "FITNESS"] },
    { typeKey: "POLLUTION", label: "Pollution Certificate", altKeys: ["Pollution Certificate", "POLLUTION", "PUC"] }
];

const VehicleDetailsCard = ({ vehicleData, onBack, onEdit, onAssignDriver, onUploadDoc }) => {
    if (!vehicleData || !vehicleData.vehicle) return null;

    const { vehicle, complianceDocs = [], assignmentHistory = [] } = vehicleData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Page Header */}
            <div className="fm-responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={COMMON_STYLES.heading}>
                        Vehicle Details – {vehicle.registrationNumber}
                    </h2>
                    <p style={COMMON_STYLES.subheading}>
                        Complete technical specifications, compliance certificates, and driver assignment records
                    </p>
                </div>
                <button onClick={onBack} style={COMMON_STYLES.buttonSecondary}>
                    ← Back to Vehicle List
                </button>
            </div>

            {/* Grid layout: Specs & Compliance */}
            <div className="fm-responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Vehicle Specifications Card (11 Fields) */}
                <div style={COMMON_STYLES.card}>
                    <h3 style={{ ...COMMON_STYLES.heading, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                        Vehicle Information
                    </h3>
                    <div className="fm-responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                        <div>
                            <span style={COMMON_STYLES.label}>Registration Number</span>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: COLORS.primary }}>
                                {vehicle.registrationNumber}
                            </span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Compliance Status</span>
                            <StatusBadge status={vehicle.complianceSummary?.overallStatus || vehicle.status || 'Valid'} />
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Vehicle Model</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.model || 'N/A'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Vehicle Brand</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.brand || 'N/A'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Vehicle Type</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.vehicleType || 'Truck'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Branch</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.branch || 'Central Depot'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Manufacturing Year</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.manufacturingYear || 'N/A'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Current Mileage</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.mileage?.toLocaleString() ?? 0} km</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Assigned Driver</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: vehicle.assignedDriver && vehicle.assignedDriver !== 'Unassigned' ? COLORS.success : COLORS.muted }}>
                                {vehicle.assignedDriver || 'Unassigned'}
                            </span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Fuel Type</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.fuelType || 'Diesel'}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Registration Date</span>
                            <span style={{ fontSize: '13px', color: COLORS.muted }}>
                                {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compliance Certificates Card */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                        <h3 style={COMMON_STYLES.heading}>Compliance Section</h3>
                        <button onClick={() => onUploadDoc && onUploadDoc(vehicle)} style={{ ...COMMON_STYLES.buttonSecondary, padding: '4px 10px', fontSize: '12px' }}>
                            + Upload Doc
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                        {COMPLIANCE_ITEMS.map(item => {
                            const foundDoc = complianceDocs.find(d =>
                                item.altKeys.some(k => k.toLowerCase() === (d.documentType || '').toLowerCase())
                            );

                            const docNum = foundDoc?.documentNumber || foundDoc?._id || 'DOC-PENDING';
                            const expiry = foundDoc?.expiryDate ? new Date(foundDoc.expiryDate).toLocaleDateString() : 'Not Set';
                            const status = foundDoc ? foundDoc.status : 'Expired';

                            return (
                                <div key={item.typeKey} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    backgroundColor: COLORS.background,
                                    borderRadius: '6px',
                                    border: `1px solid ${COLORS.border}`
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: COLORS.text }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '12px', color: COLORS.muted }}>
                                            Document / Certificate #: <span style={{ color: COLORS.text, fontWeight: '600' }}>{docNum}</span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: COLORS.muted }}>
                                            Expiry Date: <span style={{ color: COLORS.text }}>{expiry}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <StatusBadge status={status} />
                                        {foundDoc?.filePath && foundDoc.filePath !== '#' && (
                                            <a
                                                href={`${API_SERVER_URL}${foundDoc.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '12px', color: COLORS.primary, textDecoration: 'none', fontWeight: '600' }}
                                            >
                                                View Document →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Assignment & Driver History */}
            <div style={COMMON_STYLES.card}>
                <h3 style={{ ...COMMON_STYLES.heading, marginBottom: '12px' }}>Assignment & Service History</h3>
                {assignmentHistory.length === 0 ? (
                    <p style={{ fontSize: '13px', color: COLORS.muted }}>No assignment history recorded for this vehicle.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                        <thead>
                            <tr>
                                <th style={COMMON_STYLES.tableHeader}>Driver Name</th>
                                <th style={COMMON_STYLES.tableHeader}>Assigned Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Return Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Status</th>
                                <th style={COMMON_STYLES.tableHeader}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentHistory.map(a => (
                                <tr key={a._id}>
                                    <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '600' }}>{a.driverName}</td>
                                    <td style={COMMON_STYLES.tableCell}>{new Date(a.assignedDate).toLocaleDateString()}</td>
                                    <td style={COMMON_STYLES.tableCell}>
                                        {a.returnDate ? new Date(a.returnDate).toLocaleDateString() : 'Active Assignment'}
                                    </td>
                                    <td style={COMMON_STYLES.tableCell}>
                                        <StatusBadge status={a.status} />
                                    </td>
                                    <td style={COMMON_STYLES.tableCell}>{a.notes || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Actions Bar (4 Buttons) */}
            <div className="fm-responsive-actions" style={{
                ...COMMON_STYLES.card,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                flexWrap: 'wrap'
            }}>
                <button onClick={onBack} style={COMMON_STYLES.buttonSecondary}>
                    Back to Vehicle List
                </button>
                <button onClick={() => onEdit && onEdit(vehicle)} style={COMMON_STYLES.buttonSecondary}>
                    Edit Vehicle
                </button>
                <button onClick={() => onAssignDriver && onAssignDriver(vehicle)} style={COMMON_STYLES.buttonSecondary}>
                    Assign Driver
                </button>
                <button onClick={() => onUploadDoc && onUploadDoc(vehicle)} style={COMMON_STYLES.buttonPrimary}>
                    Upload Compliance Documents
                </button>
            </div>
        </div>
    );
};

export default VehicleDetailsCard;

import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import StatusBadge from './StatusBadge';

const API_SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const VehicleDetailsCard = ({ vehicleData, onBack, onEdit, onUploadDoc }) => {
    if (!vehicleData || !vehicleData.vehicle) return null;

    const { vehicle, complianceDocs = [], assignmentHistory = [] } = vehicleData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={COMMON_STYLES.heading}>
                        FG-FM-04: Vehicle Details – {vehicle.registrationNumber}
                    </h2>
                    <p style={COMMON_STYLES.subheading}>
                        Complete operational overview, compliance documents, and driver history
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onBack} style={COMMON_STYLES.buttonSecondary}>
                        ← Back to List
                    </button>
                    <button onClick={() => onEdit(vehicle)} style={COMMON_STYLES.buttonPrimary}>
                        Edit Vehicle
                    </button>
                </div>
            </div>

            {/* Grid layout: Specs & Compliance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Vehicle Specs Card */}
                <div style={COMMON_STYLES.card}>
                    <h3 style={{ ...COMMON_STYLES.heading, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                        Vehicle Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                        <div>
                            <span style={COMMON_STYLES.label}>Registration Number</span>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: COLORS.primary }}>
                                {vehicle.registrationNumber}
                            </span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Status</span>
                            <StatusBadge status={vehicle.status} />
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Brand</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.brand}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Model</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.model}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Branch Location</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.branch}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Manufacturing Year</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.manufacturingYear}</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Current Mileage</span>
                            <span style={{ fontSize: '14px', color: COLORS.text }}>{vehicle.mileage?.toLocaleString() ?? 0} km</span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Assigned Driver</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: vehicle.assignedDriver !== 'Unassigned' ? COLORS.success : COLORS.muted }}>
                                {vehicle.assignedDriver || 'Unassigned'}
                            </span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Created Date</span>
                            <span style={{ fontSize: '13px', color: COLORS.muted }}>
                                {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div>
                            <span style={COMMON_STYLES.label}>Updated Date</span>
                            <span style={{ fontSize: '13px', color: COLORS.muted }}>
                                {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compliance Documents Card */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                        <h3 style={COMMON_STYLES.heading}>Compliance Documents</h3>
                        <button onClick={() => onUploadDoc(vehicle)} style={{ ...COMMON_STYLES.buttonSecondary, padding: '4px 10px', fontSize: '12px' }}>
                            + Upload Doc
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                        {["Insurance", "Pollution Certificate", "Fitness Certificate", "RC"].map(docType => {
                            const foundDoc = complianceDocs.find(d => d.documentType === docType);

                            return (
                                <div key={docType} style={{
                                    display: 'flex',
                                    justify: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 14px',
                                    backgroundColor: COLORS.background,
                                    borderRadius: '6px',
                                    border: `1px solid ${COLORS.border}`
                                }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: COLORS.text }}>{docType}</div>
                                        {foundDoc ? (
                                            <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '2px' }}>
                                                Expires: {new Date(foundDoc.expiryDate).toLocaleDateString()} | File: {foundDoc.originalName}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '11px', color: COLORS.danger, marginTop: '2px' }}>
                                                No document uploaded yet
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <StatusBadge status={foundDoc ? foundDoc.status : 'Missing'} />
                                        {foundDoc && (
                                            <a
                                                href={`${API_SERVER_URL}${foundDoc.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '12px', color: COLORS.primary, textDecoration: 'none' }}
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Operational & Assignment History */}
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
        </div>
    );
};

export default VehicleDetailsCard;

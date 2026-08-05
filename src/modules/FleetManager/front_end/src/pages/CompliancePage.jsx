import React, { useState, useEffect } from 'react';
import ComplianceCard from '../components/ComplianceCard';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { getVehicles, getComplianceStatus } from '../services/api';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const API_SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const CompliancePage = ({ showToast, selectedVehicleId }) => {
    const [vehicles, setVehicles] = useState([]);
    const [complianceData, setComplianceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const vData = await getVehicles({ limit: 100 });
            setVehicles(vData.vehicles || []);

            const cData = await getComplianceStatus();
            setComplianceData(cData);
        } catch (err) {
            showToast(err.message || 'Failed to load compliance status', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loader message="Loading compliance records and file data..." />;

    const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Upload Form */}
            <ComplianceCard
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onUploadSuccess={loadData}
                showToast={showToast}
            />

            {/* FG-FM-08: Compliance Status System Overview */}
            <div style={COMMON_STYLES.card}>
                <div style={{ marginBottom: '16px', borderBottom: `1px solid ${COLORS.border}`, paddingBottom: '10px' }}>
                    <h3 style={COMMON_STYLES.heading}>FG-FM-08: Compliance Status Overview</h3>
                    <p style={COMMON_STYLES.subheading}>Automatically calculated document validity, expiring soon, and expired colored badges</p>
                </div>

                {/* Summary Badges Header */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ padding: '12px 20px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: `1px solid ${COLORS.success}`, borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: COLORS.muted, display: 'block' }}>Valid Documents</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: COLORS.success }}>
                            {complianceData?.summary?.valid || 0}
                        </span>
                    </div>
                    <div style={{ padding: '12px 20px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: `1px solid ${COLORS.accent}`, borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: COLORS.muted, display: 'block' }}>Expiring Soon (30 Days)</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: COLORS.accent }}>
                            {complianceData?.summary?.expiringSoon || 0}
                        </span>
                    </div>
                    <div style={{ padding: '12px 20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${COLORS.danger}`, borderRadius: '8px' }}>
                        <span style={{ fontSize: '12px', color: COLORS.muted, display: 'block' }}>Expired Documents</span>
                        <span style={{ fontSize: '24px', fontWeight: '800', color: COLORS.danger }}>
                            {complianceData?.summary?.expired || 0}
                        </span>
                    </div>
                </div>

                {/* Document Records Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={COMMON_STYLES.tableHeader}>Vehicle Registration</th>
                                <th style={COMMON_STYLES.tableHeader}>Document Type</th>
                                <th style={COMMON_STYLES.tableHeader}>Filename</th>
                                <th style={COMMON_STYLES.tableHeader}>Issue Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Expiry Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Badge Status</th>
                                <th style={{ ...COMMON_STYLES.tableHeader, textAlign: 'right' }}>File Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!complianceData?.documents || complianceData.documents.length === 0) ? (
                                <tr>
                                    <td colSpan="7" style={{ ...COMMON_STYLES.tableCell, textAlign: 'center', padding: '24px' }}>
                                        No uploaded compliance documents found in MongoDB.
                                    </td>
                                </tr>
                            ) : (
                                complianceData.documents.map(doc => (
                                    <tr key={doc._id}>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '700', color: COLORS.primary }}>
                                            {doc.registrationNumber || doc.vehicleId?.registrationNumber || 'N/A'}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>{doc.documentType}</td>
                                        <td style={COMMON_STYLES.tableCell}>{doc.originalName}</td>
                                        <td style={COMMON_STYLES.tableCell}>{new Date(doc.issueDate).toLocaleDateString()}</td>
                                        <td style={COMMON_STYLES.tableCell}>{new Date(doc.expiryDate).toLocaleDateString()}</td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={doc.status} />
                                        </td>
                                        <td style={{ ...COMMON_STYLES.tableCell, textAlign: 'right' }}>
                                            <a
                                                href={doc.filePath?.startsWith('data:') ? doc.filePath : `${API_SERVER_URL}${doc.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ ...COMMON_STYLES.buttonSecondary, textDecoration: 'none', padding: '4px 10px', fontSize: '12px' }}
                                            >
                                                View File
                                            </a>
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

export default CompliancePage;

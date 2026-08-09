import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import StatusBadge from './StatusBadge';

const DashboardCards = ({ summaryData, onNavigate, onSelectVehicle }) => {
    if (!summaryData) return null;

    const { cards, recentlyAddedVehicles = [] } = summaryData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Metric Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
            }}>
                {/* Total Vehicles */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' }}>
                        Total Vehicles
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: COLORS.text, marginTop: '8px' }}>
                        {cards?.totalVehicles ?? 0}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.primary, marginTop: '6px', cursor: 'pointer' }} onClick={() => onNavigate('list')}>
                        View all fleet vehicles →
                    </div>
                </div>

                {/* Assigned Vehicles */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' }}>
                        Assigned Vehicles
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: COLORS.accent, marginTop: '8px' }}>
                        {cards?.assignedVehicles ?? 0}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '6px' }}>
                        On active operational routes
                    </div>
                </div>

                {/* Available Vehicles */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' }}>
                        Available Vehicles
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: COLORS.success, marginTop: '8px' }}>
                        {cards?.availableVehicles ?? 0}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.success, marginTop: '6px', cursor: 'pointer' }} onClick={() => onNavigate('assign')}>
                        Assign a vehicle →
                    </div>
                </div>

                {/* Expiring Documents */}
                <div style={COMMON_STYLES.card}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.muted, textTransform: 'uppercase' }}>
                        Expiring Documents
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: COLORS.danger, marginTop: '8px' }}>
                        {cards?.expiringDocuments ?? 0}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.danger, marginTop: '6px', cursor: 'pointer' }} onClick={() => onNavigate('expiry')}>
                        Review expiries →
                    </div>
                </div>
            </div>

            {/* Compliance Summary & Quick Actions Cards */}
            <div className="fm-responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Compliance Summary */}
                <div style={COMMON_STYLES.card}>
                    <h3 style={COMMON_STYLES.heading}>Compliance Summary</h3>
                    <p style={COMMON_STYLES.subheading}>Status breakdown across all uploaded fleet documents</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: COLORS.background, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                            <span style={{ fontSize: '13px', color: COLORS.text }}>Valid Compliance</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: COLORS.success }}>{cards?.complianceSummary?.valid ?? 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: COLORS.background, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                            <span style={{ fontSize: '13px', color: COLORS.text }}>Expiring Soon (30 Days)</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: COLORS.accent }}>{cards?.complianceSummary?.expiringSoon ?? 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: COLORS.background, borderRadius: '6px', border: `1px solid ${COLORS.border}` }}>
                            <span style={{ fontSize: '13px', color: COLORS.text }}>Expired / Missing Documents</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: COLORS.danger }}>{cards?.complianceSummary?.expired ?? 0}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Management Shortcuts */}
                <div style={COMMON_STYLES.card}>
                    <h3 style={COMMON_STYLES.heading}>Fleet Operations</h3>
                    <p style={COMMON_STYLES.subheading}>Quick actions for transport staff officer</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                        <button onClick={() => onNavigate('registration')} style={{ ...COMMON_STYLES.buttonPrimary, padding: '14px', flexDirection: 'column', height: '90px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>+</span>
                            <span>Register Vehicle</span>
                        </button>
                        <button onClick={() => onNavigate('assign')} style={{ ...COMMON_STYLES.buttonSecondary, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>→</span>
                            <span>Assign Vehicle</span>
                        </button>
                        <button onClick={() => onNavigate('compliance')} style={{ ...COMMON_STYLES.buttonSecondary, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>↑</span>
                            <span>Upload Document</span>
                        </button>
                        <button onClick={() => onNavigate('expiry')} style={{ ...COMMON_STYLES.buttonSecondary, padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>!</span>
                            <span>Expiry Tracker</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recently Added Vehicles List */}
            <div style={COMMON_STYLES.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                        <h3 style={COMMON_STYLES.heading}>Recently Added Vehicles</h3>
                        <p style={COMMON_STYLES.subheading}>Latest additions to the transport fleet</p>
                    </div>
                    <button onClick={() => onNavigate('list')} style={COMMON_STYLES.buttonSecondary}>
                        View All
                    </button>
                </div>

                {recentlyAddedVehicles.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: COLORS.muted }}>
                        No vehicles added yet. Click "Register Vehicle" to add one.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={COMMON_STYLES.tableHeader}>Registration</th>
                                    <th style={COMMON_STYLES.tableHeader}>Brand & Model</th>
                                    <th style={COMMON_STYLES.tableHeader}>Branch</th>
                                    <th style={COMMON_STYLES.tableHeader}>Status</th>
                                    <th style={COMMON_STYLES.tableHeader}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentlyAddedVehicles.map(v => (
                                    <tr key={v._id}>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '700', color: COLORS.primary }}>
                                            {v.registrationNumber}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            {v.brand} {v.model}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            {v.branch}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={v.status} />
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <button
                                                onClick={() => {
                                                    onSelectVehicle(v._id);
                                                    onNavigate('details');
                                                }}
                                                style={{ ...COMMON_STYLES.buttonSecondary, padding: '4px 10px', fontSize: '12px' }}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCards;
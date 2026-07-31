import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import StatusBadge from './StatusBadge';

const ExpiryTable = ({ expiries = [], daysFilter = 30, onFilterDaysChange, onViewVehicle }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={COMMON_STYLES.card}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div>
                        <h2 style={COMMON_STYLES.heading}>FG-FM-10: Upcoming Document Expiries</h2>
                        <p style={COMMON_STYLES.subheading}>
                            Compliance documents requiring renewal sorted by nearest expiry date
                        </p>
                    </div>

                    {/* Filter Buttons for 30 days, 15 days, 7 days */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={COMMON_STYLES.label}>Alert Days:</span>
                        <input
                            type="number"
                            value={daysFilter}
                            onChange={(e) => onFilterDaysChange(Number(e.target.value) || 30)}
                            style={{ ...COMMON_STYLES.input, width: '80px', padding: '6px 10px', fontSize: '12px' }}
                            min="1"
                        />
                        {[30, 15, 7].map(d => (
                            <button
                                key={d}
                                onClick={() => onFilterDaysChange(d)}
                                style={{
                                    ...COMMON_STYLES.buttonSecondary,
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    backgroundColor: daysFilter === d ? COLORS.primary : 'transparent',
                                    color: daysFilter === d ? '#ffffff' : COLORS.text,
                                    borderColor: daysFilter === d ? COLORS.primary : COLORS.border
                                }}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expiries Table */}
            <div style={{ ...COMMON_STYLES.card, padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={COMMON_STYLES.tableHeader}>Registration</th>
                                <th style={COMMON_STYLES.tableHeader}>Brand & Model</th>
                                <th style={COMMON_STYLES.tableHeader}>Branch</th>
                                <th style={COMMON_STYLES.tableHeader}>Document Type</th>
                                <th style={COMMON_STYLES.tableHeader}>Expiry Date</th>
                                <th style={COMMON_STYLES.tableHeader}>Days Left</th>
                                <th style={COMMON_STYLES.tableHeader}>Status</th>
                                <th style={{ ...COMMON_STYLES.tableHeader, textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expiries.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ ...COMMON_STYLES.tableCell, textAlign: 'center', padding: '32px' }}>
                                        No document expiries found within the next {daysFilter} days.
                                    </td>
                                </tr>
                            ) : (
                                expiries.map(exp => (
                                    <tr key={exp._id}>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '700', color: COLORS.primary }}>
                                            {exp.registrationNumber}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>{exp.brand} {exp.model}</td>
                                        <td style={COMMON_STYLES.tableCell}>{exp.branch}</td>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '600' }}>{exp.documentType}</td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            {new Date(exp.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td style={{
                                            ...COMMON_STYLES.tableCell,
                                            fontWeight: '700',
                                            color: exp.daysRemaining < 0 ? COLORS.danger : exp.daysRemaining <= 15 ? COLORS.accent : COLORS.text
                                        }}>
                                            {exp.daysRemaining < 0 ? `${Math.abs(exp.daysRemaining)} days ago` : `${exp.daysRemaining} days`}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={exp.status} />
                                        </td>
                                        <td style={{ ...COMMON_STYLES.tableCell, textAlign: 'right' }}>
                                            <button
                                                onClick={() => onViewVehicle(exp.vehicleId)}
                                                style={{ ...COMMON_STYLES.buttonSecondary, padding: '5px 10px', fontSize: '12px' }}
                                            >
                                                View Vehicle
                                            </button>
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

export default ExpiryTable;

import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';
import StatusBadge from './StatusBadge';
import Pagination from './Pagination';
import SearchBar from './SearchBar';

const VehicleTable = ({
    vehicles = [],
    total = 0,
    page = 1,
    pages = 1,
    search = "",
    statusFilter = "All",
    onSearchChange,
    onStatusFilterChange,
    onPageChange,
    onViewDetails,
    onEditVehicle,
    onDeleteClick,
    onUploadClick
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SearchBar
                search={search}
                onSearchChange={onSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={onStatusFilterChange}
            />

            <div style={{ ...COMMON_STYLES.card, padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={COMMON_STYLES.tableHeader}>Registration</th>
                                <th style={COMMON_STYLES.tableHeader}>Brand</th>
                                <th style={COMMON_STYLES.tableHeader}>Model</th>
                                <th style={COMMON_STYLES.tableHeader}>Branch</th>
                                <th style={COMMON_STYLES.tableHeader}>Year</th>
                                <th style={COMMON_STYLES.tableHeader}>Mileage</th>
                                <th style={COMMON_STYLES.tableHeader}>Assigned Driver</th>
                                <th style={COMMON_STYLES.tableHeader}>Status</th>
                                <th style={COMMON_STYLES.tableHeader}>Compliance</th>
                                <th style={{ ...COMMON_STYLES.tableHeader, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ ...COMMON_STYLES.tableCell, textAlign: 'center', padding: '32px' }}>
                                        No vehicles match the search/filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map(v => (
                                    <tr key={v._id}>
                                        <td style={{ ...COMMON_STYLES.tableCell, fontWeight: '700', color: COLORS.primary }}>
                                            {v.registrationNumber}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>{v.brand}</td>
                                        <td style={COMMON_STYLES.tableCell}>{v.model}</td>
                                        <td style={COMMON_STYLES.tableCell}>{v.branch}</td>
                                        <td style={COMMON_STYLES.tableCell}>{v.manufacturingYear || 'N/A'}</td>
                                        <td style={COMMON_STYLES.tableCell}>{v.mileage?.toLocaleString() ?? 0} km</td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            {v.assignedDriver && v.assignedDriver !== 'Unassigned' ? (
                                                <span style={{ color: COLORS.text, fontWeight: '600' }}>{v.assignedDriver}</span>
                                            ) : (
                                                <span style={{ color: COLORS.muted }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={v.status} />
                                        </td>
                                        <td style={COMMON_STYLES.tableCell}>
                                            <StatusBadge status={v.complianceSummary?.overallStatus || 'Expired'} />
                                        </td>
                                        <td style={{ ...COMMON_STYLES.tableCell, textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                <button
                                                    onClick={() => onViewDetails(v._id)}
                                                    title="View Vehicle Details"
                                                    style={{ ...COMMON_STYLES.buttonSecondary, padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => onEditVehicle(v)}
                                                    title="Edit Vehicle"
                                                    style={{ ...COMMON_STYLES.buttonSecondary, padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onUploadClick(v)}
                                                    title="Upload Compliance Docs"
                                                    style={{ ...COMMON_STYLES.buttonSecondary, padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    Doc
                                                </button>
                                                <button
                                                    onClick={() => onDeleteClick(v)}
                                                    title="Delete Vehicle"
                                                    style={{ ...COMMON_STYLES.buttonDanger, padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    Del
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default VehicleTable;

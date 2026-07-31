import React from 'react';
import { COLORS, COMMON_STYLES } from '../utils/styles';

const SearchBar = ({ search, onSearchChange, statusFilter, onStatusFilterChange }) => {
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            padding: '16px'
        }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search Registration, Brand, Model, Branch..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={COMMON_STYLES.input}
                />
            </div>

            {/* Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ ...COMMON_STYLES.label, marginBottom: 0 }}>Filter Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    style={{ ...COMMON_STYLES.select, width: '180px' }}
                >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Valid">Valid Compliance</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired Compliance</option>
                </select>
            </div>
        </div>
    );
};

export default SearchBar;

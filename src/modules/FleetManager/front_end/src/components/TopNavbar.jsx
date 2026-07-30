import React, { useState } from 'react';
import { COLORS } from '../utils/styles';
import { FiSearch, FiBell } from 'react-icons/fi';

const TopNavbar = ({ onSearchChange, globalSearchQuery = "", unreadCount = 3 }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const notificationsList = [
        { id: 1, title: 'Document Expiring', message: 'Vehicle KA-01-EA-1002 Insurance expires in 5 days', type: 'warning' },
        { id: 2, title: 'Vehicle Assigned', message: 'Truck KA-01-EA-1001 assigned to John Doe', type: 'info' },
        { id: 3, title: 'Expired Document', message: 'Vehicle KA-01-EA-1004 Pollution certificate expired', type: 'danger' }
    ];

    return (
        <header style={{
            height: '64px',
            backgroundColor: COLORS.card,
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: COLORS.primary, letterSpacing: '0.5px' }}>
                    FleetGuard
                </span>
                <span style={{ color: COLORS.border }}>|</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>
                    Fleet Manager
                </span>
            </div>

            <div style={{ width: '320px', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search registration, brand, branch..."
                    value={globalSearchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        backgroundColor: COLORS.background,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '20px',
                        padding: '8px 16px 8px 36px',
                        color: COLORS.text,
                        fontSize: '13px',
                        outline: 'none'
                    }}
                />
                <FiSearch
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: COLORS.muted,
                        fontSize: '14px'
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.text,
                        fontSize: '18px',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <FiBell size={18} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            backgroundColor: COLORS.danger,
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '16px',
                            height: '16px',
                            fontSize: '10px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div style={{
                        position: 'absolute',
                        top: '44px',
                        right: '120px',
                        width: '320px',
                        backgroundColor: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                        zIndex: 200,
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}`, fontWeight: '700', fontSize: '13px', color: COLORS.text }}>
                            Notifications
                        </div>
                        <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            {notificationsList.map(n => (
                                <div key={n.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${COLORS.border}` }}>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: n.type === 'danger' ? COLORS.danger : n.type === 'warning' ? COLORS.accent : COLORS.primary }}>
                                        {n.title}
                                    </div>
                                    <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>
                                        {n.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* User Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '16px' }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: COLORS.primary,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px'
                    }}>
                        FM
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: COLORS.text }}>Staff Officer</span>
                        <span style={{ fontSize: '11px', color: COLORS.muted }}>Transport Branch</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
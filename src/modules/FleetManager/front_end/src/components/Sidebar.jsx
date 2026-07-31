import React from 'react';
import { COLORS } from '../utils/styles';
import {
    FiLayout,
    FiPlusSquare,
    FiList,
    FiFileText,
    FiShield,
    FiUserCheck,
    FiAlertTriangle
} from 'react-icons/fi';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: FiLayout },
    { id: 'registration', label: 'Vehicle Registration', Icon: FiPlusSquare },
    { id: 'list', label: 'Vehicle List', Icon: FiList },
    { id: 'details', label: 'Vehicle Details', Icon: FiFileText },
    { id: 'compliance', label: 'Compliance', Icon: FiShield },
    { id: 'assign', label: 'Assign Vehicle', Icon: FiUserCheck },
    { id: 'expiry', label: 'Upcoming Expiry', Icon: FiAlertTriangle }
];

const Sidebar = ({ activeTab, onTabSelect, mobileOpen = false, onCloseMobile }) => {
    return (
        <>
            <div
                className={`fm-sidebar-overlay ${mobileOpen ? 'open' : ''}`}
                onClick={onCloseMobile}
            />
            <aside
                className={`fm-sidebar ${mobileOpen ? 'open' : ''}`}
                style={{
                    width: '240px',
                    backgroundColor: COLORS.card,
                    borderRight: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 110,
                    paddingTop: '16px'
                }}
            >
                <div>
                    <div style={{ padding: '0 20px 20px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: COLORS.primary }}>
                            FleetGuard
                        </div>
                        <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Enterprise Suite
                        </div>
                    </div>

                    <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map(item => {
                            const isActive = activeTab === item.id;
                            const ItemIcon = item.Icon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onTabSelect(item.id);
                                        if (onCloseMobile) onCloseMobile();
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: isActive ? COLORS.primary : 'transparent',
                                        color: isActive ? '#ffffff' : COLORS.text,
                                        fontSize: '13px',
                                        fontWeight: isActive ? '700' : '500',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <ItemIcon size={16} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
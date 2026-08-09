import React from 'react';
import { COLORS } from '../utils/styles';
import { FiSearch, FiMenu } from 'react-icons/fi';

const TopNavbar = ({ onSearchChange, globalSearchQuery = "", onToggleMobileSidebar }) => {
    return (
        <header style={{
            minHeight: '64px',
            backgroundColor: COLORS.card,
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            gap: '12px',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={onToggleMobileSidebar}
                    className="fm-mobile-toggle-btn"
                    style={{
                        background: 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '6px',
                        color: COLORS.text,
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    aria-label="Toggle Menu"
                >
                    <FiMenu size={18} />
                </button>
                <span style={{ fontSize: '18px', fontWeight: '800', color: COLORS.primary, letterSpacing: '0.5px' }}>
                    FleetGuard
                </span>
                <span style={{ color: COLORS.border }}>|</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>
                    Fleet Manager
                </span>
            </div>

            <div style={{ flex: '1 1 200px', maxWidth: '360px', position: 'relative' }}>
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
                        outline: 'none',
                        boxSizing: 'border-box'
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* User Profile Avatar Only */}
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
            </div>
        </header>
    );
};

export default TopNavbar;
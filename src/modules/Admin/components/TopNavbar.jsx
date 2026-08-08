import React from 'react';
import { FiSearch, FiMenu } from 'react-icons/fi';

const TopNavbar = ({ searchTerm, setSearchTerm, onMenuToggle }) => {
  return (
    <header style={{
      minHeight: '64px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
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
          onClick={onMenuToggle}
          className="admin-mobile-toggle-btn"
          style={{
            background: 'transparent',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f1f5f9',
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
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.5px' }}>
          FleetGuard
        </span>
        <span style={{ color: '#334155' }}>|</span>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
          Admin
        </span>
      </div>

      <div style={{ flex: '1 1 200px', maxWidth: '360px', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search registration, user, document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '20px',
            padding: '8px 16px 8px 36px',
            color: '#f1f5f9',
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
            color: '#94a3b8',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '14px'
        }}>
          AD
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

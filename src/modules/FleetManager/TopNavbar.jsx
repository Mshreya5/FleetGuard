import React from 'react';
import './fleetManager.css';
import SearchBar from './SearchBar';

const TopNavbar = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="topbar">
      <div className="topbar-title">Fleet Manager</div>

      <div className="topbar-actions">
        <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search vehicles" />
        <button type="button" className="icon-button" aria-label="Notifications">
          🔔
        </button>
        <div className="profile-chip">
          <div className="avatar">JS</div>
          <div>
            <div style={{ fontWeight: 600 }}>John Smith</div>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Operations Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

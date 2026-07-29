import React from 'react';
import './fleetManager.css';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <label className="search-box" aria-label="Search vehicles">
      <span className="search-icon">🔎</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
};

export default SearchBar;

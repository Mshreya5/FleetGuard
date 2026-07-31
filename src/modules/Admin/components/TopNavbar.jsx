import SearchBar from './SearchBar';

const TopNavbar = ({ searchTerm, setSearchTerm, onMenuToggle }) => {
  return (
    <header className="top-navbar">
      <button
        className="sidebar-toggle"
        type="button"
        aria-label="Open menu"
        onClick={onMenuToggle}
      >
        ☰
      </button>

      <div className="navbar-brand-block">
        <h1>FleetGuard</h1>
        <span>Operations Control Center</span>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="navbar-actions">
        <button className="icon-button profile-pill" type="button" aria-label="Admin profile" style={{ color: "#3b82f6" }}>
          AP
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;

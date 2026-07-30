import SearchBar from './SearchBar';

const TopNavbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-brand-block">
        <h1>FleetGuard</h1>
        <span>Operations Control Center</span>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="navbar-actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          🔔
        </button>
        <button className="icon-button profile-pill" type="button" aria-label="Admin profile">
          AP
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;

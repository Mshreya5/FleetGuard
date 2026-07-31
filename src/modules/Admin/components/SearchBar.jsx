const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <label className="search-bar">
      <span>⌕</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by registration number"
      />
    </label>
  );
};

export default SearchBar;

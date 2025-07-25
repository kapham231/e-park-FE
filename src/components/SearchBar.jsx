import "./css/SearchBar.css";

const SearchBar = ({ placeholder }) => {
  return (
    <form class="search-container">
      <label for="default-search">Search</label>
      <div class="search-input-container">
        <div class="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          placeholder={placeholder || "Search..."}
          required
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;

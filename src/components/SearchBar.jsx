import './css/SearchBar.css'

const SearchBar = ({ placeholder }) => {
  return (
    <form className='search-container'>
      <label htmlFor='default-search'>Search</label>
      <div className='search-input-container'>
        <div className='search-icon'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
        <input type='search' id='default-search' placeholder={placeholder || 'Search...'} required />
        <button type='submit'>Search</button>
      </div>
    </form>
  )
}

export default SearchBar

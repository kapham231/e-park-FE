import { useState } from 'react'
import './css/SearchBar.css'

const SearchBar = ({ placeholder, onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <form className='search-container' onSubmit={handleSubmit}>
      <label htmlFor='default-search'>Search</label>
      <div className='search-input-container'>
        <div className='search-icon'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' strokeWidth='2'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
        <input
          type='search'
          id='default-search'
          placeholder={placeholder || 'Search...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type='submit'>Search</button>
      </div>
    </form>
  )
}

export default SearchBar

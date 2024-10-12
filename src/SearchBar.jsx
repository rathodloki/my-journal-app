import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative mb-8">
    <input
      type="text"
      placeholder="Search"
      className="w-full p-2 pl-10 rounded-md border border-gray-300"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
  </div>
);

export default SearchBar;
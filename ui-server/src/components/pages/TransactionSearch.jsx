// src/components/TransactionSearch.jsx

import React, { useState } from 'react';

function TransactionSearch({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchText, filterCategory, startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col md:flex-row md:items-end gap-4">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700">Search</label>
        <input 
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search transactions"
          className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700">Category</label>
        <input 
          type="text"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Category"
          className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700">Start Date</label>
        <input 
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700">End Date</label>
        <input 
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button 
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Search
      </button>
    </form>
  );
}

export default TransactionSearch;

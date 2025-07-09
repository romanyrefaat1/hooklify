// _components/Pagination.js
import React from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {} 
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span className="px-3 py-1 bg-orange-500 text-white rounded">
          {currentPage}
        </span>
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
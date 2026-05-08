import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="h-8 w-8 rounded-sm border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        &lt;
      </button>
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-sm bg-[#8B2323] px-2 text-sm font-semibold text-white">
        {page}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="h-8 w-8 rounded-sm border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;

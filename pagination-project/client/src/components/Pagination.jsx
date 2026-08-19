import React from 'react'

const Pagination = ({
  currentPage, totalPages, hasNextPage, hasPrevPage, onPageChange
}) => {
  return (
    <div className='mt-8 flex items-center justify-center gap-2'>

      <button onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className='rounded bg-gray-800 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50'  
      >
        Previous
      </button>

      {
        Array.from({length: totalPages}, (_, index) => {
          const pageNumber = index + 1;

          return (
            <button key={pageNumber} onClick={() => onPageChange(pageNumber)}
              className={`rounded px-4 py-2 ${currentPage === pageNumber ? "bg-blue-600" : "bg-white text-gray-800"}`}
            >
              {pageNumber}
            </button>
          )
        })
      }

      <button onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className='rounded bg-gray-800 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50'  
      >
        Next
      </button>
      
    </div>
  )
}

export default Pagination

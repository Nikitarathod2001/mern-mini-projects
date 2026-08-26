import React from 'react'

const EmptyNotes = () => {
  return (
    <div className='flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center'>

      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl'>
        📝
      </div>

      <h2 className='mt-5 text-lg font-semibold text-gray-900'>
        No notes yet
      </h2>

      <p className='mt-2 max-w-sm text-sm leading-6 text-gray-500'>
        Create your first note and start organizing your thoughts.
      </p>

      <button type='button'
        className='mt-5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700'
      >
        + Create your first note
      </button>
      
    </div>
  )
}

export default EmptyNotes

import React from 'react'

const NoteActions = ({isPinned}) => {
  return (
    <div className='flex items-center gap-1'>

      {/* Pin */}
      <button type='button'
        className='rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900'
        aria-label={isPinned ? "Unpin" : "Pin"}
      >
        {
          isPinned ? "⭐" : "☆"
        }
      </button>

      {/* Edit */}
      <button type='button'
        className='rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900'
        aria-label='Edit note'
        title='Edit'
      >
        ✏️
      </button>

      {/* Delete */}
      <button type='button'
        className='rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-600'
        aria-label='Delete note'
        title='Delete'
      >
        🗑️
      </button>
      
    </div>
  )
}

export default NoteActions

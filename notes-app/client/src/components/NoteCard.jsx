import React from 'react';
import NoteActions from './NoteActions';

const NoteCard = ({note}) => {
  return (
    <article className='group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>

      {/* Header */}
      <div className='flex items-start justify-between gap-3'>

        <button type='button'
          className='text-left'
        >

          <h2 className='line-clamp-2 font-semibold text-gray-900'>
            {note.title}
          </h2>

        </button>

        {
          note.isPinned && (
            <span className='shrink-0 text-sm'
              title='Pinned'
            >
              ⭐
            </span>
          )
        }

      </div>

      {/* Content */}
      <button type='button'
        className='mt-3 flex-1 text-left'
      >

        <p className='line-clamp-4 text-sm leading-6 text-gray-500'>
          {note.content}
        </p>

      </button>

      {/* Footer */}
      <div className='mt-5 flex items-center justify-between gap-3'>

        <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
          {note.category}
        </span>

        <span className='text-xs text-gray-400'>
          {
            new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        </span>

      </div>

      {/* Actions */}
      <div className='mt-4 border-t border-gray-100 pt-3'>

        <NoteActions isPinned={note.isPinned}/>

      </div>

    </article>
  )
}

export default NoteCard

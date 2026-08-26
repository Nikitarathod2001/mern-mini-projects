import React from 'react'

const NoteCard = ({note}) => {
  return (
    <article className='group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>

      {/* Header */}
      <div className='flex items-start justify-between gap-3'>

        <h2 className='line-clamp-2 font-semibold text-gray-900'>
          {note.title}
        </h2>

        <button className='shrink-0 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-gray-900'>
          :
        </button>

      </div>

      {/* Content */}
      <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-500'>
        {note.content}
      </p>

      {/* Footer */}
      <div className='mt-5 flex items-center justify-between'>

        <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
          {note.category}
        </span>

        <span className='text-xs text-gray-400'>
          {note.date}
        </span>

      </div>

    </article>
  )
}

export default NoteCard

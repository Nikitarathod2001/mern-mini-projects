import React from 'react';
import { Link } from 'react-router-dom';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NoteCard = ({note}) => {
  return (
    <article className={`group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${note.isPinned ? "border-gray-400" : "border-gray-200"}`}>

      {/* Header */}
      <div className='flex items-start justify-between gap-3'>

        <Link to={`/notes/${note._id}`}
          className='text-left'
        >

          <h2 className='line-clamp-2 font-semibold text-gray-900'>
            {note.title}
          </h2>

        </Link>

        {
          note.isPinned && (
            <span className='shrink-0 text-sm text-red-900'
              title='Pinned'
            >
              <FontAwesomeIcon icon={faThumbtack}/>
            </span>
          )
        }

      </div>

      {/* Content */}
      <Link to={`/notes/${note._id}`}
        className='mt-3 flex-1 text-left'
      >

        <p className='line-clamp-4 text-sm leading-6 text-gray-500'>
          {note.content}
        </p>

      </Link>

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
      {/* <div className='mt-4 border-t border-gray-100 pt-3'>

        <NoteActions isPinned={note.isPinned}/>

      </div> */}

    </article>
  )
}

export default NoteCard

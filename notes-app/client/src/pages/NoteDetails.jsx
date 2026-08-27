import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";

import { getNoteById } from '../services/noteService';
import EditNoteModel from '../components/EditNoteModel';

const NoteDetails = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setEditShowModal] = useState(false);

  const handleNoteUpdated = (updatedNote) => {
    setNote(updatedNote);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {

        setLoading(true);
        const data = await getNoteById(id);
        setNote(data.note);
        
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load note"
        );

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  if(loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>

        <p className='text-sm text-gray-500'>
          Loading note...
        </p>

      </div>
    );
  }

  if(!note) {
    return null;
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50'>

        {/* Header */}
        <header className='border-b border-gray-200 bg-white'>

          <div className='mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-6'>

            <Link to="/"
              className='text-sm font-medium text-gray-600 hover:text-gray-900'
            >
              ← Back to Notes
            </Link>

            <div className='flex items-center gap-2'>

              <button type='button'
                onClick={() => setEditShowModal(true)}
                className='rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100'
              >
                Edit
              </button>

              <button type='button'
                className='rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50'
              >
                Delete
              </button>

            </div>

          </div>

        </header>

        {/* Note */}
        <main className='mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12'>

          <article className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10'>

            {/* Category + Pin */}
            <div className='flex items-center justify-between gap-4'>

              <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>
                {note.category}
              </span>

              {
                note.isPinned && (
                  <span className='text-sm text-gray-500'>
                    ⭐ Pinned
                  </span>
                )
              }

            </div>

            {/* Title */}
            <h1 className='mt-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl'>
              {note.title}
            </h1>

            {/* Date */}
            <p className='mt-3 text-sm text-gray-400'>

              Created{" "}
              {
                new Date(note.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }
                )
              }

            </p>

            {/* Divider */}
            <div className='my-8 border-t border-gray-100'/>

            {/* Content */}
            <div className='whitespace-pre-wrap text-base leading-8 text-gray-700'>
              {note.content}
            </div>

          </article>

        </main>
        
      </div>

      {
        showEditModal && (
          <EditNoteModel
            note={note}
            onClose={() => setEditShowModal(false)}
            onNoteUpdated={handleNoteUpdated}
          />
        )
      }
    </>
  )
}

export default NoteDetails

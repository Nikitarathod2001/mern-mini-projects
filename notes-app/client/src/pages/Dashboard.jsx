import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import EmptyNotes from '../components/EmptyNotes';
import NoteForm from '../components/NoteForm';
import { getNotes } from '../services/noteService';
import toast from 'react-hot-toast';

const Dashboard = () => {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleNoteCreated = (newNote) => {
    setNotes((prevNotes) => [
      newNote,
      ...prevNotes,
    ]);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {

        setLoading(true);
        const data = await getNotes();
        setNotes(data.notes);
        
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load notes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>

      <Navbar/>

      <div className='flex'>

        <Sidebar/>

        <main className='min-w-0 flex-1 p-4 md:p-6'>

          {/* Page header */}
          <div className='mb-6 flex items-center justify-between gap-4'>

            <div>

              <h1 className='text-2xl font-bold text-gray-900'>
                My Notes
              </h1>

              <p className='mt-1 text-sm text-gray-500'>
                Keep your thoughts organized.
              </p>

            </div>

            <button type='button'
              onClick={() => setShowNoteForm(true)} 
              className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 active:scale-95'>
              + New Note
            </button>

          </div>

          {/* Notes */}
          {
            loading ? (
              <div className='flex min-h-80 items-center justify-center'>

                <div className='text-sm text-gray-500'>
                  Loading notes...
                </div>

              </div>
            ) : notes.length > 0 ? (
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>

                {
                  notes.map((note) => (
                    <NoteCard key={note._id} note={note}/>
                  ))
                }

              </div>
            ) : (
              <EmptyNotes/>
            )
          }

          <button type='button'
            onClick={() => setShowNoteForm(true)}
            className='fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-2xl text-white shadow-lg transition hover:bg-gray-700 active:scale-95 md:hidden'
            aria-label='Create new note'
          >
            +
          </button>

        </main>

      </div>

      {
        showNoteForm && (
          <NoteForm 
            onClose={() => setShowNoteForm(false)}
            onNoteCreated={handleNoteCreated}
          />
        )
      }
      
    </div>
  )
}

export default Dashboard

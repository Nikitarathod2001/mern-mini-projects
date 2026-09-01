import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import EmptyNotes from '../components/EmptyNotes';
import NoteForm from '../components/NoteForm';
import { getNotes } from '../services/noteService';
import toast from 'react-hot-toast';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const categories = [
  "All",
  "Personal",
  "Work",
  "Study",
  "Ideas",
  "Projects",
  "Todo",
  "Important",
  "Other",
];

const Dashboard = () => {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleNoteCreated = (newNote) => {
    setNotes((prevNotes) => [
      newNote,
      ...prevNotes,
    ]);
  };

  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch = note.title.toLowerCase().includes(searchText) || note.content.toLowerCase().includes(searchText);

    const matchesCategory = 
      selectedCategory === "All" ? true : selectedCategory === "Pinned"
        ? note.isPinned : note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

        <Sidebar selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
        />

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

              <div className='mt-6 flex flex-col gap-3 md:flex-row'>

                {/* Search */}
                <div className='relative flex-1'>

                  <input type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search notes...'
                    className='w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100'
                  />

                  <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'>
                    <FontAwesomeIcon icon={faSearch}/>
                  </span>

                </div>

              </div>

            </div>

            <button type='button'
              onClick={() => setShowNoteForm(true)} 
              className='rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600 active:scale-95 cursor-pointer'>
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
            ) : filteredNotes.length > 0 ? (
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>

                {
                  filteredNotes.map((note) => (
                    <NoteCard key={note._id} note={note}/>
                  ))
                }

              </div>
            ) : notes.length === 0 ? (
              <EmptyNotes setShowNoteForm={setShowNoteForm}/>
            ) : (
              <div className='flex min-h-80 flex-col items-center justify-center text-center'>

                <div className='text-4xl'>
                  <FontAwesomeIcon icon={faSearch}/>
                </div>

                <h2 className='mt-4 text-lg font-semibold text-gray-900'>
                  No notes found
                </h2>

                <p className='mt-1 text-sm text-gray-500'>
                  Try changing your search or category filter.
                </p>

                <button type='button'
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className='mt-5 rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-100 cursor-pointer'
                >
                  Clear Filters
                </button>

              </div>
            )
          }

          <button type='button'
            onClick={() => setShowNoteForm(true)}
            className='fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-2xl text-white shadow-lg transition hover:bg-orange-600 active:scale-95 md:hidden cursor-pointer'
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

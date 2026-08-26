import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {

  const notes = [
    {
      id: 1,
      title: "Learn React Hooks",
      content:
        "Study useState, useEffect, useContext and custom hooks.",
      category: "Study",
      date: "Aug 26",
    },
    {
      id: 2,
      title: "MERN Notes App",
      content:
        "Build a user-friendly notes application using MongoDB, Express, React and Node.js.",
      category: "Projects",
      date: "Aug 25",
    },
    {
      id: 3,
      title: "Shopping List",
      content:
        "Milk, bread, vegetables, fruits and other groceries.",
      category: "Personal",
      date: "Aug 24",
    },
    {
      id: 4,
      title: "Interview Preparation",
      content:
        "Practice JavaScript, React, Node.js and MongoDB interview questions.",
      category: "Work",
      date: "Aug 23",
    },
  ];

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

            <button className='rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700'>
              + New Note
            </button>

          </div>

          {/* Notes */}
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>

            {
              notes.map((note) => (
                <NoteCard key={note.id} note={note}/>
              ))
            }

          </div>

        </main>

      </div>
      
    </div>
  )
}

export default Dashboard

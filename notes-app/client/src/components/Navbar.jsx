import React from 'react'

const Navbar = () => {
  return (
    <header className='border-b border-gray-200 bg-white'>

      <div className='flex h-16 items-center justify-between px-4 md:px-6'>

        {/* Logo */}
        <div className='flex items-center gap-2'>

          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white'>
            📝
          </div>

          <h1 className='text-lg font-bold text-gray-900'>
            Notes App
          </h1>

        </div>

        {/* Search */}
        <div className='hidden w-full max-w-md md:block'>

          <input type="text" 
            placeholder='Search notes...'
            className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none transition focus:border-gray-400 focus:bg-white'
          />

        </div>

        {/* Profile */}
        <button className='flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100'>

          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold'>
            N
          </div>

          <span className='hidden text-sm font-medium md:block'>
            User
          </span>

        </button>

      </div>

    </header>
  )
}

export default Navbar

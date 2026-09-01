import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const userInitial = user?.name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className='border-b border-gray-200 bg-white'>

      <div className='flex h-16 items-center justify-between px-4 md:px-6'>

        {/* Logo */}
        <div className='flex items-center gap-2'>

          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white'>
            📝
          </div>

          <h1 className='text-base font-bold text-slate-900 sm:text-lg'>
            Notes<span className='text-orange-500'>Nest</span>
          </h1>

        </div>

        {/* Profile */}
        <div className='relative'>

          <button onClick={() => setShowMenu((prev) => !prev)} 
            className='flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 cursor-pointer'>

            <div className='flex h-8 w-8 items-center justify-center rounded-full text-orange-600 bg-gray-200 text-sm font-semibold'>
              {userInitial}
            </div>

            <span className='text-xs text-gray-500'>
              ▾
            </span>

          </button>

          {
            showMenu && (
              <>

                <div onClick={() => setShowMenu(false)}
                  className='fixed inset-0 z-40'  
                />

                <div className='absolute right-0 top-12 z-50 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg'>

                  <button onClick={handleLogout}
                    className='w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer'
                  >
                    Logout
                  </button>

                </div>

              </>
            )
          }

        </div>

      </div>

    </header>
  )
}

export default Navbar

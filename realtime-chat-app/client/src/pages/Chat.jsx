import React from 'react';
import {useAuth} from "../context/AuthContext";
import api from "../services/api";
import { useState } from 'react';
import { useEffect } from 'react';

const Chat = () => {

  const {user, logout} = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await api.get("/users");

        setUsers(response.data.users);
        
      } catch (error) {
        console.error("Failed to fetch users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((item) => 
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gray-100'>

      <div className='max-w-6xl mx-auto p-6'>

        <div className='flex justify-between items-center mb-6'>

          <div>
            <h1 className='text-2xl font-bold'>
              Welcome, {user?.username}
            </h1>

            <p className='text-gray-500'>
              Select someone to start chatting
            </p>
          </div>

          <button onClick={logout}
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg'
          >
            Logout
          </button>

        </div>

        <div className='bg-white rounded-xl shadow-md p-4'>

          <h2 className='text-xl font-semibold mb-4'>
            Users
          </h2>

          <input type="text" 
            placeholder='Search users...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full border rounded-lg px-4 py-3 mb-4'
          />

          <div className='space-y-2'>

            { 
              filteredUsers.map((item) => (
                <div key={item._id}
                  onClick={() => setSelectedUser(item)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedUser?._id === item._id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                  }`}
                >

                  <h3 className='font-semibold'>
                    {item.username}
                  </h3>

                  <p className='text-sm text-gray-500'>
                    {item.email}
                  </p>

                </div>
              ))
            }

          </div>

        </div>

        {
          selectedUser && (
            <div className='mt-6 bg-white p-6 rounded-xl shadow-md'>

              <h2 className='text-xl font-bold'>
                Selected User
              </h2>

              <p className='mt-2'>
                {selectedUser.username}
              </p>

              <p className='text-gray-500'>
                {selectedUser.email}
              </p>

            </div>
          )
        }

      </div>
      
    </div>
  )
}

export default Chat

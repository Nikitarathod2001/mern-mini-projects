import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  useEffect(() => {

    const getProfile = async () => {
      try {

        const token = localStorage.getItem("token");

        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        setUser(response.data.user);
        
      } catch (error) {
        setMessage("Unable to load profile");
      }
    }

    getProfile();

  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-8'>

      <div className='mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg'>

        <div className='flex items-center justify-between'>

          <h1 className='text-3xl font-bold'>
            Dashboard
          </h1>

          <button onClick={handleLogout}
            className='rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700'
          >
            Logout
          </button>

        </div>

        {
          user ? (
            <div className='space-y-2'>

              <p>
                <strong>Name: </strong>
                {user.name}
              </p>

              <p>
                <strong>Email: </strong>
                {user.email}
              </p>

              <p>
                <strong>Role: </strong>
                {user.role}
              </p>

            </div>
          ) : (
            <p>
              {message || "Loading..."}
            </p>
          )
        }

      </div>
      
    </div>
  )
}

export default Dashboard

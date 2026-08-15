import React from 'react';
import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

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
        setMessage(error.response?.data?.message || "Unable to load profile");
      }
    }

    getProfile();

  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-8'>

      <div className='mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg'>

        <h1 className='mb-6 text-3xl font-bold'>
          Dashboard
        </h1>

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

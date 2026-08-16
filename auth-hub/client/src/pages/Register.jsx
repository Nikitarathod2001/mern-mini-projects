import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/auth/register", formData);

      toast.success("Registration Successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>

      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-lg'>

        <h1 className='mb-6 text-center text-3xl font-bold'>
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>

          <input type="text" 
            name="name"
            placeholder='Enter your name'
            value={formData.name}
            onChange={handleChange}
            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
          />

          <input type="email" 
            name="email"
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
          />

          <input type="password" 
            name="password"
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
          />

          <button type='submit'
            className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700'
          >
            Register
          </button>

        </form>

      </div>
      
    </div>
  )
}

export default Register

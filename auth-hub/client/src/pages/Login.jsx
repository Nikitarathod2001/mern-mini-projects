import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {

  const [formData, setFormData] = useState({
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

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful!");

      setFormData({
        email: "",
        password: "",
      });
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>

      <div className='w-full max-w-md rounded-xl bg-white p-8 shadow-lg'>

        <h1 className='mb-6 text-center text-3xl font-bold'>
          Login
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>

          <input type="email" 
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
          />

          <input type="password" 
            name='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            className='w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500'
          />

          <button type='submit'
            className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blu-700'
          >
            Login
          </button>

        </form>

      </div>
      
    </div>
  )
}

export default Login

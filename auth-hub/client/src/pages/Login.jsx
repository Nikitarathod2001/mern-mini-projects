import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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

      navigate("/dashboard");
      
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

        <button type='button'
          onClick={() => {
            window.location.href = "http://localhost:5000/api/auth/google";
          }}
          className='mt-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50'
        >
          Continue with Google
        </button>

      </div>
      
    </div>
  )
}

export default Login

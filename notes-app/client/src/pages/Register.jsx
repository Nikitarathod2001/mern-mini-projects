import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { registerUser } from '../services/authService';

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    if(formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {

      setLoading(true);

      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user);

      toast.success("Account created successfully");

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      navigate("/dashbaord");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>

      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8'>

        <div className='mb-8 text-center'>

          <h1 className='text-2xl font-bold text-gray-900'>
            Create Account
          </h1>

          <p className='mt-2 text-sm text-gray-500'>
            Start organizing your notes
          </p>

        </div>

        <form onSubmit={handleSubmit}
          className='space-y-5'
        >

          <div>

            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Name
            </label>

            <input type="text" 
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Your name'
              className='w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-400'
            />

          </div>

          <div>

            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Email
            </label>

            <input type="email" 
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Your email'
              className='w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-400'
            />

          </div>

          <div>

            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Password
            </label>

            <input type="password" 
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Your password'
              className='w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-400'
            />

          </div>

          <button type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-700 disabled:opacity-50'
          >
            {
              loading ? "Creating account..." : "Create Account"
            }
          </button>

        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>

          Already have an account?{" "}
          <Link to="/"
            className='font-medium text-gray-900 hover:underline'
          >
            Login
          </Link>

        </p>

      </div>
      
    </div>
  )
}

export default Register

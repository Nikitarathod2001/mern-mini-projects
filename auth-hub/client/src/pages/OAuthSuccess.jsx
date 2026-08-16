import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const OAuthSuccess = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if(!token) {
      toast.error("Authentication failed");
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);
    toast.success("Google login successful");
    navigate("/dashboard", {replace: true});

  }, [searchParams, navigate]);

  return (
    <div className='flex min-h-screen items-center justify-center'>

      <p className='text-lg font-semibold'>
        Completing Google login...
      </p>
      
    </div>
  )
}

export default OAuthSuccess

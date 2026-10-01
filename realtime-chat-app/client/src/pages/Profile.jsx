import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {

  const navigate = useNavigate();
  const {user, setUser} = useAuth();

  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");

  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");

  const [selectedFile, setSelectedFile] = useState(null);
  const[loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setBio(user?.bio || "");
    setProfilePicture(user?.profilePicture || "");
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Store file for upload
    setSelectedFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setProfilePicture(previewUrl);
};

  const handleSave = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("bio", bio);

      if(selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await api.patch("/users/profile", formData);

      setUser(response.data.user);
      setSelectedFile(null);

      toast.success("Profile updated successfully");
      navigate("/chat");
      
    } catch (error) {
      console.error("Update profile error: ", error);

      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center'>

      <div className='w-full max-w-xl bg-white min-h-screen'>

        {/* Header */}
        <div className='flex items-center gap-4 px-5 py-4 border-b'>

          <button onClick={() => navigate("/chat")}
            className='text-gray-700'  
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>

          <h1 className='text-lg font-semibold'>
            My Profile
          </h1>

        </div>

        <form onSubmit={handleSave} className='p-6'>

          {/* Profile Picture */}
          <div className='flex flex-col items-center mb-8'>

            <div className='relative'>

              <img src={profilePicture} alt="" 
              className='w-28 h-28 rounded-full object-cover border-4 border-gray-100'
              />

              <button type='button'
                onClick={() => fileInputRef.current?.click()}
                className='absolute bottom-0 right-0 w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center'
              >
                <FontAwesomeIcon icon={faCamera}/>
              </button>

            </div>

            <input type="file" 
              ref={fileInputRef}
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />

            <p className='text-xs text-gray-500 mt-3'>
              JPG, PNG or other image Max 5MB
            </p>

          </div>

          {/* First Name */}
          <div className='mb-4'>

            <label className='block text-sm font-medium mb-1'>
              First Name
            </label>

            <input type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className='w-full border rounded-lg px-3 py-2 outline-none'
              maxLength={30}
              required
            />

          </div>

          {/* Last Name */}
          <div className='mb-4'>

            <label className='block text-sm font-medium mb-1'>
              Last Name
            </label>

            <input type="text" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className='w-full border rounded-lg px-3 py-2 outline-none'
              maxLength={30}
              required
            />

          </div>

          {/* Username */}
          <div className='mb-4'>

            <label className='block text-sm font-medium mb-1'>
              Username
            </label>

            <input type="text" 
              value={user?.username || ""}
              disabled
              className='w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500'
            />

          </div>

          {/* Bio */}
          <div className='mb-6'>

            <label className='block text-sm font-medium mb-1'>
              About
            </label>

            <textarea value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={150}
              placeholder='Tell something about yourself...'
              className='w-full border rounded-lg px-3 py-2 resize-none outline-none'
            />

            <p className='text-xs text-gray-400 text-right mt-1'>
              {bio.length}/150
            </p>

          </div>

          {/* Save */}
          <button type='submit'
            disabled={loading}
            className='w-full bg-teal-800 text-white py-2.5 rounded-lg font-medium disabled:opacity-50'
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
      
    </div>
  )
}

export default Profile

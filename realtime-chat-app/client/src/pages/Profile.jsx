import React, {useEffect, useRef, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera, faUser } from '@fortawesome/free-solid-svg-icons';
import {useNavigate, useParams} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {

  const navigate = useNavigate();
  const {user, setUser} = useAuth();

  const {userId} = useParams();
  const isOwnProfile = !userId;

  const fileInputRef = useRef(null);

  const [profileUser, setProfileUser] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const [profilePicture, setProfilePicture] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const[loading, setLoading] = useState(false);


  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if(!userId) {
        setProfileUser(user);
        return;
      }

      try {

        setProfileLoading(true);

        const response = await api.get(`/users/${userId}`);

        setProfileUser(response.data.user);
        
      } catch (error) {
        console.error("Get profile error: ", error);

        toast.error(error.response?.data?.message || "Failed to load profile");

        navigate("/chat");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [userId, user, navigate]);

  // Set Profile Data
  useEffect(() => {
    setFirstName(profileUser?.firstName || "");
    setLastName(profileUser?.lastName || "");
    setBio(profileUser?.bio || "");
    setProfilePicture(profileUser?.profilePicture || "");
  }, [profileUser]);

  // Image Selection
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

  // Save own profile
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
      setProfileUser(response.data.user);
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

  // Loading State
  if(profileLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>

        <p className='text-gray-500'>
          Loading profile...
        </p>

      </div>
    );
  }

  // Other user profile
  if(!isOwnProfile) {
    return (
      <div className='min-h-screen bg-gray-100 flex justify-center'>

        <div className='w-full max-w-xl min-h-screen bg-white'>

          {/* Header */}
          <div className='flex items-center gap-4 px-5 py-4 border-b'>

            <button onClick={() => navigate("/chat")}
              className='text-gray-700 hover:text-gray-900 cursor-pointer'  
            >
              <FontAwesomeIcon icon={faArrowLeft}/>
            </button>

            <h1 className='text-lg font-semibold'>
              Profile
            </h1>

          </div>

          {/* Profile */}
          <div className='flex flex-col items-center px-6 py-10'>

            {/* Profile picture */}
            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm'>

              {
                profileUser?.profilePicture ? (
                  <img src={profileUser.profilePicture} alt={profileUser.username} 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-200 flex items-center justify-center'>

                    <FontAwesomeIcon icon={faUser}
                      className='text-4xl text-gray-400'
                    />

                  </div>
                )
              }

            </div>

            {/* Name */}
            <h2 className='text-xl font-semibold mt-5'>
              {
                profileUser?.firstName || profileUser?.lastName ?
                `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`.trim()
                : "User"
              }
            </h2>

            {/* Username */}
            <p className='text-gray-500 mt-1'>
              @{profileUser?.username}
            </p>

            {/* About */}
            <div className='w-full mt-8'>

              <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                About
              </h3>

              <div className='bg-gray-50 border rounded-xl p-4'>

                <p className='text-gray-600 text-sm leading-relaxed'>
                  {
                    profileUser?.bio || "This user hasn't added a bio yet."
                  }
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center'>

      <div className='w-full max-w-xl bg-white min-h-screen'>

        {/* Header */}
        <div className='flex items-center gap-4 px-5 py-4 border-b'>

          <button onClick={() => navigate("/chat")}
            className='text-gray-700 hover:text-gray-900 cursor-pointer'  
          >
            <FontAwesomeIcon icon={faArrowLeft}/>
          </button>

          <h1 className='text-lg font-semibold'>
            Edit Profile
          </h1>

        </div>

        <form onSubmit={handleSave} className='p-6'>

          {/* Profile Picture */}
          <div className='flex flex-col items-center mb-8'>

            <div className='relative'>

              <div className='w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100'>

                {
                  profilePicture ? (
                    <img src={profilePicture} alt="Profile"
                    className='w-full h-full object-cover' 
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-200 flex items-center justify-center'>

                      <FontAwesomeIcon icon={faUser}
                        className='text-3xl text-gray-400'
                      />

                    </div>
                  )
                }

              </div>

              {/* Camera */}
              <button type='button'
                onClick={() => fileInputRef.current?.click()}
                className='absolute bottom-0 right-0 w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900'
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
            />

          </div>

          {/* Username */}
          <div className='mb-4'>

            <label className='block text-sm font-medium mb-1'>
              Username
            </label>

            <input type="text" 
              value={profileUser?.username || ""}
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

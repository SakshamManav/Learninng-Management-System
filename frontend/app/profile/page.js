"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeUser, userProfileInfo, updateUserProfile, updateUserProfileImage } from '../redux/UserSlice';
import Navbar from '../components/Navbar';

export default function Profile() {
  const dispatch = useDispatch();
  const {user, loading, profileInfo } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateType, setUpdateType] = useState(''); // 'success' or 'error'
  const [isImageUploading, setIsImageUploading] = useState(false); // Add this state for image upload

  useEffect(() => {
    console.log('Dispatching userProfileInfo...');
        dispatch(userProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    setEditedUser(profileInfo);
  }, [profileInfo, loading]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      setUpdateMessage('');
      
      // Prepare data for update (only the fields we want to update)
      const updateData = {
        name: editedUser?.name || null,
        bio: editedUser?.bio || null,
        contact: editedUser?.contact || null,
        social_links: editedUser?.social_links || null
      };
      
      console.log('Saving user data:', updateData);
      
      // Dispatch the update action
      const result = await dispatch(updateUserProfile(updateData));
      
      if (updateUserProfile.fulfilled.match(result)) {
        console.log('Profile updated successfully');


        await dispatch(userProfileInfo());
        setIsEditing(false);
        setUpdateMessage('Profile updated successfully!');
        setUpdateType('success');
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setUpdateMessage('');
          setUpdateType('');
        }, 3000);
      } else {
        console.error('Update failed:', result.payload);
        setUpdateMessage(result.payload || 'Failed to update profile');
        setUpdateType('error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setUpdateMessage('An unexpected error occurred');
      setUpdateType('error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(profileInfo); // Changed from user to profileInfo
    setIsEditing(false);
  };

  const handleAddSocial = () => {
    if (newSocialPlatform && newSocialUrl) {
      const updatedSocials = {
        ...editedUser?.social_links,
        [newSocialPlatform]: newSocialUrl
      };
      
      setEditedUser(prev => ({
        ...prev,
        social_links: updatedSocials
      }));
      
      setNewSocialPlatform('');
      setNewSocialUrl('');
      setShowAddSocial(false);
    }
  };

  const handleRemoveSocial = (platform) => {
    const updatedSocials = { ...editedUser?.social_links };
    delete updatedSocials[platform];
    
    setEditedUser(prev => ({
      ...prev,
      social_links: updatedSocials
    }));
  };

  const handleImageUpload = async (file) => {
    try {
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const result = await dispatch(updateUserProfileImage(formData));
      
      if (updateUserProfileImage.fulfilled.match(result)) {
        // Refresh profile info to get updated image
        await dispatch(userProfileInfo());
        
        // Show success message
        setUpdateMessage('Profile image updated successfully!');
        setUpdateType('success');
        setTimeout(() => {
          setUpdateMessage('');
          setUpdateType('');
        }, 3000);
      } else {
        setUpdateMessage('Failed to update profile image');
        setUpdateType('error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUpdateMessage('Error uploading image');
      setUpdateType('error');
    } finally {
      setIsImageUploading(false);
    }
  };

  const getAvailablePlatforms = () => {
    const allPlatforms = ['instagram', 'twitter', 'linkedin', 'github'];
    const existingPlatforms = Object.keys(editedUser?.social_links || {});
    return allPlatforms.filter(platform => !existingPlatforms.includes(platform));
  };

  const getSocialIcon = (platform) => {
    const icons = {
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      linkedin: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      github: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    };
    return icons[platform] || null;
  };

  const getPlatformColor = (platform) => {
    const colors = {
      instagram: 'text-pink-600',
      twitter: 'text-blue-400',
      linkedin: 'text-blue-700',
      github: 'text-gray-800'
    };
    return colors[platform] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    {updateMessage && (
  <div className={`mt-4 p-4 rounded-lg ${
    updateType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
  }`}>
    <div className="flex items-center gap-2">
      {updateType === 'success' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      <span className="font-medium">{updateMessage}</span>
    </div>
  </div>
)}
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
       
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-gray-800 bg-opacity-20"></div>
            {/* Edit Button */}
            <div className="absolute top-6 right-6 ">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-black px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Side - Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative -mt-20 mb-6">
                  <div className="w-40 h-40 rounded-full border-6 border-white shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden group cursor-pointer relative">
                    {profileInfo?.profile_Picture ? (
                      <img 
                        src={profileInfo?.profile_Picture}
                        alt="Profile" 
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <svg className="w-20 h-20 text-white transition-all duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      {isImageUploading ? (
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-xs">Uploading...</p>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-xs font-medium">Change Photo</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file size (5MB limit)
                          if (file.size > 5 * 1024 * 1024) {
                            setUpdateMessage('Image size must be less than 5MB');
                            setUpdateType('error');
                            return;
                          }
                          
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            setUpdateMessage('Please select a valid image file');
                            setUpdateType('error');
                            return;
                          }
                          
                          handleImageUpload(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                      disabled={isImageUploading}
                    />
                  </div>
                  
                  {/* Verification Badge */}
                  {profileInfo?.isVerified && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Alternative Upload Button (Optional - for clearer UX) */}
                <div className="text-center mb-4">
                  <button
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    disabled={isImageUploading}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center gap-1 mx-auto disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v16z" />
                    </svg>
                    {isImageUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>

                {/* Role Badge */}
                <div className="text-center">
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                    profileInfo?.role === 'seller' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {profileInfo?.role === 'seller' ? '🎓 Instructor' : '📚 Student'}
                  </span>
                </div>
              </div>

              {/* Right Side - User Information */}
              <div className="flex-1 space-y-6 mt-6 lg:mt-0">
                
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Basic Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name - Changed from Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedUser?.name || ''}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        />
                      ) : (
                        <p className="text-gray-800 bg-white p-3 rounded-lg border">{profileInfo?.name || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Username - Display only (not editable) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 bg-gray-100 p-3 rounded-lg border flex-1">@{profileInfo?.username || 'Not set'}</p>
                        <div className="text-gray-400" title="Username cannot be changed">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Email - Keep as is */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 bg-white p-3 rounded-lg border flex-1">{profileInfo?.email || 'Not provided'}</p>
                        {profileInfo?.isVerified && (
                          <div className="text-green-600" title="Verified Email">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact - Keep as is */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="contact"
                          value={editedUser?.contact || ''}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        />
                      ) : (
                        <p className="text-gray-800 bg-white p-3 rounded-lg border">{profileInfo?.contact || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Provider */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Provider</label>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {profileInfo?.provider ? profileInfo?.provider.charAt(0).toUpperCase() : 'L'}
                          </span>
                        </div>
                        <p className="text-gray-800 capitalize">{profileInfo?.provider || 'Local'}</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    About Me
                  </h3>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editedUser?.bio || ''}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Tell us about yourself..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                    />
                  ) : (
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">
                        {profileInfo?.bio || 'No bio provided yet. Click edit to add information about yourself.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Links - Updated Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Social Links
                    </h3>
                    
                    {/* Add Social Button - Only show in edit mode and if there are available platforms */}
                    {isEditing && getAvailablePlatforms().length > 0 && (
                      <button
                        onClick={() => setShowAddSocial(true)}
                        className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Social Link
                      </button>
                    )}
                  </div>

                  {/* Existing Social Links */}
                  {(profileInfo?.social_links || editedUser?.social_links) && Object.keys(profileInfo?.social_links || editedUser?.social_links || {}).length > 0 ? (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {Object.entries(isEditing ? (editedUser?.social_links || {}) : (profileInfo?.social_links || {})).map(([platform, url]) => (
                        <div
                          key={platform}
                          className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border hover:shadow-md transition-shadow group"
                        >
                          <div className={getPlatformColor(platform)}>
                            {getSocialIcon(platform)}
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => {
                                  const updatedSocials = {
                                    ...editedUser?.social_links,
                                    [platform]: e.target.value
                                  };
                                  setEditedUser(prev => ({
                                    ...prev,
                                    social_links: updatedSocials
                                  }));
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                placeholder={`Enter your ${platform} URL`}
                              />
                              <button
                                onClick={() => handleRemoveSocial(platform)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
                            >
                              <span className="capitalize font-medium">{platform}</span>
                              <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No social links added yet</p>
                      {isEditing && (
                        <p className="text-gray-400 text-sm mt-1">Click {"Add Social Link"} to get started</p>
                      )}
                    </div>
                  )}

                  {/* Add Social Link Form */}
                  {showAddSocial && isEditing && (
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-purple-300 mt-4">
                      <h4 className="font-medium text-gray-800 mb-3">Add Social Link</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                          <select
                            value={newSocialPlatform}
                            onChange={(e) => setNewSocialPlatform(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                          >
                            <option value="">Choose a platform</option>
                            {getAvailablePlatforms().map(platform => (
                              <option key={platform} value={platform}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={newSocialUrl}
                            onChange={(e) => setNewSocialUrl(e.target.value)}
                            placeholder={`Enter your ${newSocialPlatform} profile URL`}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddSocial}
                            disabled={!newSocialPlatform || !newSocialUrl}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Link
                          </button>
                          <button
                            onClick={() => {
                              setShowAddSocial(false);
                              setNewSocialPlatform('');
                              setNewSocialUrl('');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Status */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Status
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Email Verification</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          profileInfo?.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profileInfo?.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Account Type</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                          {profileInfo?.role || 'Student'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </button>
           
          </div>
        </div>
      </div>
    </div>
    
    
    </>
  );
}

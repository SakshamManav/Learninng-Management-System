"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser } from '../redux/UserSlice';
import Link from 'next/link';
// import img from 'next/img';

export default function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.user);
  const profileDropdownRef = useRef(null);
  
  const {
    logout,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
  } = useAuth0();

  useEffect(() => {
    setIsClient(true);
    dispatch(initializeUser());
  }, [dispatch]);

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handle_login() {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: "http://localhost:3000/auth-callback",
      },
    });
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: "http://localhost:3000" } });
    localStorage.removeItem("authToken");
    localStorage.removeItem('user');
    localStorage.removeItem("auth0_User");
    localStorage.removeItem("localToken");
    localStorage.removeItem('courses')
    setIsLoggedin(false);
    setIsProfileDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side - Logo and Categories */}
          <div className="flex items-center space-x-8 flex-shrink-0">
            <Link className="flex items-center" href={'/'}>
              <img src='/logo2.png' alt='eduKnow' className='h-[200px] w-[200px]' />
            </Link>
            <div className="hidden lg:block">
              <Link href={`/customer`} className="text-gray-700 hover:text-purple-600 px-3 py-2 transition-colors font-medium">
                Course
              </Link>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right side - Navigation and Auth */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              {user.role === 'seller' ? (
                <button className="text-gray-700 hover:text-purple-600 px-3 py-2 transition-colors font-medium">
                  Teach on EduPlatform
                </button>
              ) : (
                <button className="text-gray-700 hover:text-purple-600 px-3 py-2 transition-colors font-medium">
                  My learning
                </button>
              )}
            </div>

            {/* Authentication */}
            {isClient && localStorage.getItem('localToken') ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {user.profile_Picture ? (
                    <img 
                      src={user.profile_Picture} 
                      alt="Profile" 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          {user.profile_Picture ? (
                            <img 
                              src={user.profile_Picture} 
                              alt="Profile" 
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.username || user.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user.role || 'Student'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="px-4 py-3 space-y-2">
                      {user.email && (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="text-sm text-gray-600">{user.email}</span>
                        </div>
                      )}
                      
                      {user.contact && (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-sm text-gray-600">{user.contact}</span>
                        </div>
                      )}

                      {user.bio && (
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 leading-relaxed">{user.bio}</p>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="border-t border-gray-100">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>View Profile</span>
                      </button>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>Settings</span>
                      </button>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Help</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  className="px-4 py-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  onClick={handle_login}
                >
                  Log In
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  onClick={handle_login}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white"
                />
                <button 
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              {/* Mobile Menu Items */}
              <Link href={`/course`} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded">
                Courses
              </Link>
              {user.role === 'seller' ? (
                <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded">
                  Teach on EduPlatform
                </button>
              ) : (
                <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded">
                  My learning
                </button>
              )}
              
              {/* Mobile Authentication */}
              <div className="pt-2 border-t border-gray-200">
                {isClient && localStorage.getItem('localToken') ? (
                  <div className="space-y-3">
                    {/* Mobile Profile Info */}
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        {user.profile_Picture ? (
                          <img 
                            src={user.profile_Picture} 
                            alt="Profile" 
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.username || user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role || 'Student'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 text-gray-700 hover:text-purple-600 font-medium border border-gray-300 rounded transition-colors"
                      onClick={() => {
                        handle_login();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Log In
                    </button>
                    <button
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      onClick={() => {
                        handle_login();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

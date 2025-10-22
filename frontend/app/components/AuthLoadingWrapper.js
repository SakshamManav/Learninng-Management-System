"use client";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initializeUser } from '../redux/UserSlice';

export default function AuthLoadingWrapper({ children }) {
  const { isInitialized } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  // Show loading until auth is checked
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
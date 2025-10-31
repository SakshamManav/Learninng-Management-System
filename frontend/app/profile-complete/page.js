"use client";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { signupUser } from "../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProfileComplete() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const isLoggedin = useSelector((state) => state.user.isLoggedin);
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState({
    name: "", // ✅ Added name field
    username: "",
    role: "customer",
    contact: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Store token in localStorage on mount if authenticated
  useEffect(() => {
    async function setToken() {
      if (isAuthenticated && !isLoading) {
        const token = await getAccessTokenSilently({
          audience: "https://learningmanagementsystem-api",
          scope: "openid profile email",
        });
        console.log(token);
      }
    }
    setToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // ✅ Auto-populate name from Auth0 user data
  useEffect(() => {
    if (user?.name && !form.name) {
      setForm(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, [user, form.name]);

  useEffect(() => {
    if (localStorage.getItem('localToken')) {
      router.push("/");
    }
  }, [router]);

  function validateForm() {
    const newErrors = {};
    
    // ✅ Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters.";
    }
    
    if (form.username.length < 7 || form.username.length > 20) {
      newErrors.username = "Username must be 7-20 characters.";
    }
    if (form.bio.length < 10 || form.bio.length > 150) {
      newErrors.bio = "Bio must be 10-150 characters.";
    }
    if (form.contact && !/^\+?[\d\s\-\(\)]+$/.test(form.contact)) {
      newErrors.contact = "Please enter a valid contact number.";
    }
    return newErrors;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        let provider = "";
        let provider_Id = "";
        if (user && user.sub) {
          const parts = user.sub.split("|");
          provider = parts[0];
          provider_Id = parts[1];
        }
        const formData = {
          ...form,
          name: form.name.trim(), // ✅ Trim whitespace
          provider,
          provider_Id,
          email: user?.email || "",
        };
        const token = localStorage.getItem('authToken');
        const signup_result = await dispatch(signupUser({ data: formData, token }));
        
        if (signup_result?.payload?.token) {
          localStorage.setItem('localToken', signup_result.payload.token);
          // Small delay to ensure token is stored
          setTimeout(() => {
            router.push('/');
          }, 100);
        } else {
          console.log(signup_result.payload);
          setErrors({ submit: "Registration failed. Please try again." });
        }
      } catch (error) {
        console.error("Signup error:", error);
        setErrors({ submit: "An error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220%200%2060%2060%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2314B8A6%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%223%22 cy=%223%22 r=%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600">Just a few more details to get you started on your learning journey</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Profile Setup</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            {/* ✅ Name Field - Added first */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-300'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-300'
                  }`}
                  placeholder="Choose a unique username"
                  required
                  minLength={7}
                  maxLength={20}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role *
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-300 transition-all appearance-none bg-white"
                >
                  <option value="customer">🎓 Student - I want to learn</option>
                  <option value="seller">👨‍🏫 Instructor - I want to teach</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">✓ Verified from your OAuth account</p>
            </div>

            {/* Contact Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                    errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.contact}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio *
              </label>
              <div className="relative">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none ${
                    errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-300'
                  }`}
                  rows={4}
                  placeholder="Tell us a bit about yourself, your interests, and what you hope to achieve..."
                  required
                  minLength={10}
                  maxLength={150}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {form.bio.length}/150
                </div>
              </div>
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.bio}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              By completing your profile, you agree to our{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
  </div>
    </>
  );
}

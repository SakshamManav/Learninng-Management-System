"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourses,
  intiializeCourses,
  clearError,
  checkUserEnrollmentToCourse,
  enrollUser,
} from "../redux/CourseSlice";

import Link from "next/link";

export default function CustomerPage() {
  const { courses, loading, error, isInitialized, isEnrolled } = useSelector(
    (state) => state.course
  );

  const { user, profileInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = profileInfo?.role || user?.role || "customer";

  useEffect(() => {
    // console.log(profileInfo)
    console.log("User data:", user);
    console.log("Profile info:", profileInfo);
    console.log("Detected role:", userRole);
  }, [user, profileInfo, userRole]);

  useEffect(() => {
    // console.log(userRole)
    dispatch(clearError());
    dispatch(getAllCourses());
  }, [dispatch, userRole]);

  
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CourseCard = ({ course }) => (
    <Link href={`/customer/course/${course.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="relative h-48">
          <img
            src={course.thumbnail || "/api/placeholder/300/200"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {course.level || "All Levels"}
          </div>
          {/* Category badge */}
          <div className="absolute bottom-3 left-3 bg-red-700/90 text-white px-2 py-1 rounded text-xs font-medium">
            {course.category || "General"}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-700 transition-colors">
            {course.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3">
            Instructor : {course.instructor_name}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Duration
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-gray-900">
                ₹ {course.price || "0"}
              </span>
            </div>

            {(() => {
              console.log("Rendering button for role:", userRole); // Debug log

              if (userRole === "seller") {
                return (
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview Only
                  </div>
                );
              } else if (userRole === "customer") {
                return (
                  <button className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                    Enroll Now
                  </button>
                );
              } else {
                return (
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium">
                    Login to Enroll
                  </button>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {userRole === "seller"
                ? "Browse Courses"
                : userRole === "customer"
                ? "Discover Your Next Course"
                : "Welcome to Our Platform"}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {userRole === "seller"
                ? "Explore courses and get inspiration for your next creation"
                : userRole === "customer"
                ? "Explore courses and start learning today"
                : "Please log in to access all features"}
            </p>

            <div className="mb-6">
              <p className="text-lg text-red-100">
                {courses.length} courses available
              </p>
            </div>

            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button className="absolute right-2 top-2 bg-red-700 text-white p-3 rounded-full hover:bg-red-800 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Search Results (${filteredCourses.length})`
                : "All Courses"}
            </h2>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Failed to load courses</p>
              <button
                onClick={() => dispatch(getAllCourses())}
                className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {/* No Courses Found */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "No courses available"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourseOfSeller } from '../redux/CourseSlice';
export default function SellerHomepage() {
  const {currentSellerCourse} = useSelector((state)=> state.course)
  const {user} = useSelector((state)=> state.user)
  const dispatch = useDispatch();
  // const sellerId = localStorage.getItem('user')
  useEffect(() => {
    console.log(user.id)
    dispatch(getAllCourseOfSeller(user.id))
    // console.log(currentSellerCourse);
  }, [dispatch]);

  useEffect(() => {
    console.log(currentSellerCourse);
  }, [currentSellerCourse]);
  // Mock data for your courses
  const courses = [
    { 
      id: 1, 
      title: "React Complete Course", 
      students: 234, 
      revenue: 5680, 
      rating: 4.8,
      status: "Published",
      thumbnail: "/api/placeholder/300/200",
      description: "Complete React course with hooks, context, and modern practices"
    },
    { 
      id: 2, 
      title: "JavaScript Mastery", 
      students: 189, 
      revenue: 4730, 
      rating: 4.6,
      status: "Published",
      thumbnail: "/api/placeholder/300/200",
      description: "Master JavaScript from basics to advanced concepts"
    },
    { 
      id: 3, 
      title: "Node.js Backend Development", 
      students: 156, 
      revenue: 3120, 
      rating: 4.9,
      status: "Draft",
      thumbnail: "/api/placeholder/300/200",
      description: "Build scalable backend applications with Node.js"
    },
    { 
      id: 4, 
      title: "Vue.js Fundamentals", 
      students: 0, 
      revenue: 0, 
      rating: 0,
      status: "Draft",
      image: "/api/placeholder/300/200"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Create, manage, and publish your courses</p>
        </div>

        {/* Your Courses Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSellerCourse.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 relative">
                  <img src={course.thumbnail} className='w-full h-full object-cover' alt={course.title} />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium flex items-center">
                        {course.rating > 0 ? (
                          <>
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {course.rating}
                          </>
                        ) : (
                          'No ratings'
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-red-700 text-white px-3 py-2 rounded text-sm hover:bg-red-800 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create New Course Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Create New Course</h2>
            <p className="text-gray-600 mt-1">Start creating your new course by filling out the basic information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Course Creation Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your course title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe what students will learn in this course"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option>Select category</option>
                      <option>Programming</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Marketing</option>
                      <option>Photography</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors font-medium">
                  Create Course
                </button>
              </div>
              
              {/* Course Creation Tips */}
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Tips for Creating a Great Course</h3>
                <ul className="space-y-3 text-sm text-red-800">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Choose a clear, descriptive title that tells students exactly what they will learn
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Write a compelling description that highlights the key benefits and outcomes
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Research similar courses to set a competitive but fair price
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Select the most appropriate category to help students find your course
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

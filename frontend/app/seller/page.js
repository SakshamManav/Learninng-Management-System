"use client";
import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function SellerHomepage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const stats = {
    totalStudents: 1247,
    totalRevenue: 15420,
    totalCourses: 8,
    avgRating: 4.7
  };

  const recentSales = [
    { id: 1, course: "React Complete Course", student: "John Doe", amount: 89, date: "2024-10-20" },
    { id: 2, course: "JavaScript Mastery", student: "Jane Smith", amount: 79, date: "2024-10-19" },
    { id: 3, course: "Node.js Backend", student: "Mike Johnson", amount: 99, date: "2024-10-18" },
  ];

  const courses = [
    { 
      id: 1, 
      title: "React Complete Course", 
      students: 234, 
      revenue: 5680, 
      rating: 4.8,
      status: "Published",
      image: "/api/placeholder/300/200"
    },
    { 
      id: 2, 
      title: "JavaScript Mastery", 
      students: 189, 
      revenue: 4730, 
      rating: 4.6,
      status: "Published",
      image: "/api/placeholder/300/200"
    },
    { 
      id: 3, 
      title: "Node.js Backend", 
      students: 156, 
      revenue: 3120, 
      rating: 4.9,
      status: "Published",
      image: "/api/placeholder/300/200"
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
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses and track your success</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['dashboard', 'courses', 'analytics', 'earnings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Sales */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Sales</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentSales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{sale.course}</p>
                          <p className="text-sm text-gray-500">by {sale.student}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${sale.amount}</p>
                          <p className="text-sm text-gray-500">{sale.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Create New Course
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    View All Students
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Download Reports
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Manage Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Create New Course
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500"></div>
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
                        <span>Students:</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">${course.revenue}</span>
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
                      <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors">
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
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics</h2>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500">Analytics dashboard coming soon...</p>
              <p className="text-sm text-gray-400 mt-2">Track your course performance, student engagement, and revenue trends.</p>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Earnings</h2>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500">Detailed earnings report coming soon...</p>
              <p className="text-sm text-gray-400 mt-2">View your earnings breakdown, payment history, and payout schedule.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

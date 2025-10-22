"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses, intiializeCourses } from '../redux/CourseSlice';

export default function CustomerPage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const {courses, loading, error, isInitialized} = useSelector((state)=>state.course)
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(intiializeCourses());
  }, [dispatch]);

  

  const [categories, setCategories] = useState([
    {
      name: 'Development',
      courses: 1250,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Business',
      courses: 980,
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'IT & Software',
      courses: 760,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Design',
      courses: 650,
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'Marketing',
      courses: 540,
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Lifestyle',
      courses: 420,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Photography',
      courses: 380,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Music',
      courses: 290,
      color: 'from-indigo-500 to-indigo-600'
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Mock featured courses data - replace with API call
    setFeaturedCourses([
      {
        id: 1,
        title: "Complete Web Development Bootcamp 2024",
        instructor: "John Doe",
        rating: 4.8,
        students: 25000,
        price: 89.99,
        originalPrice: 199.99,
        image: "/api/placeholder/300/200",
        category: "Development",
        level: "Beginner",
        duration: "42 hours",
        bestseller: true
      },
      {
        id: 2,
        title: "React JS - Complete Course for Beginners",
        instructor: "Jane Smith",
        rating: 4.7,
        students: 18000,
        price: 79.99,
        originalPrice: 179.99,
        image: "/api/placeholder/300/200",
        category: "Development",
        level: "Intermediate",
        duration: "32 hours",
        bestseller: false
      },
      {
        id: 3,
        title: "Digital Marketing Masterclass 2024",
        instructor: "Mike Johnson",
        rating: 4.6,
        students: 12000,
        price: 69.99,
        originalPrice: 149.99,
        image: "/api/placeholder/300/200",
        category: "Marketing",
        level: "Beginner",
        duration: "28 hours",
        bestseller: true
      },
      {
        id: 4,
        title: "UI/UX Design Complete Guide",
        instructor: "Sarah Wilson",
        rating: 4.9,
        students: 15000,
        price: 94.99,
        originalPrice: 199.99,
        image: "/api/placeholder/300/200",
        category: "Design",
        level: "All Levels",
        duration: "36 hours",
        bestseller: false
      },
      {
        id: 5,
        title: "Python for Data Science and Machine Learning",
        instructor: "Dr. Alex Chen",
        rating: 4.8,
        students: 22000,
        price: 99.99,
        originalPrice: 219.99,
        image: "/api/placeholder/300/200",
        category: "Development",
        level: "Intermediate",
        duration: "45 hours",
        bestseller: true
      },
      {
        id: 6,
        title: "Business Strategy and Leadership",
        instructor: "Robert Brown",
        rating: 4.5,
        students: 8500,
        price: 74.99,
        originalPrice: 164.99,
        image: "/api/placeholder/300/200",
        category: "Business",
        level: "Advanced",
        duration: "24 hours",
        bestseller: false
      }
    ]);
  }, []);

  const filteredCourses = featuredCourses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{course.category}</span>
        </div>
        {course.bestseller && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Bestseller
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/20 text-white px-2 py-1 rounded text-xs">
          {course.level}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">{course.instructor}</p>
        
        <div className="flex items-center mb-3">
          <span className="text-yellow-500 font-bold mr-1">{course.rating}</span>
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < Math.floor(course.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-gray-500 text-sm">({course.students.toLocaleString()})</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-900">${course.price}</span>
            <span className="text-gray-500 line-through text-sm">${course.originalPrice}</span>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => (
    <div 
      className={`bg-gradient-to-br ${category.color} p-6 rounded-xl text-white cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}
      onClick={() => setSelectedCategory(category.name)}
    >
      <div className="mb-4">
        <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
      <p className="text-white/80">{category.courses} courses</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Next Course</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Explore thousands of courses across various categories and start learning today
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-gray-900 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button className="absolute right-2 top-2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600">Choose from our most popular course categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'All' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Courses
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.name 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
              </h2>
              <p className="text-gray-600">{filteredCourses.length} courses found</p>
            </div>
            
            {/* Sort Dropdown */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
          
          {/* Load More Button */}
          {filteredCourses.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors">
                Load More Courses
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-purple-100">
            Get notified about new courses and special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

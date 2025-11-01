"use client";
import React, { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { getSpecificCourseById, enrollUser, checkUserEnrollmentToCourse } from '@/app/redux/CourseSlice';
import Image from 'next/image';

export default function Payment({ params }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { currentCourse, enrollmentLoading, isEnrolled } = useSelector((state) => state.course);
  const { user, profileInfo } = useSelector((state) => state.user);
  
  //  Get user role
  const userRole = profileInfo?.role || user?.role || "guest";
  
  const [paymentStep, setPaymentStep] = useState(1); // 1: Payment, 2: Processing, 3: Success
  const [processingTime, setProcessingTime] = useState(3);

  //  Get course details and check enrollment when component mounts
  useEffect(() => {
    if (courseId) {
      dispatch(getSpecificCourseById(courseId));
      // Only check enrollment for customers
      if (userRole === 'customer') {
        dispatch(checkUserEnrollmentToCourse(courseId));
      }
    }
  }, [courseId, dispatch, userRole]);

  //  Direct enrollment without form validation
  const handleDirectPayment = async () => {
    setPaymentStep(2);
    
    // Simulate payment processing
    const timer = setInterval(() => {
      setProcessingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSuccessfulPayment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle successful payment and enrollment
  const handleSuccessfulPayment = async () => {
    try {
      // Enroll user in the course
      await dispatch(enrollUser(courseId)).unwrap();
      setPaymentStep(3);
    } catch (error) {
      console.error('Enrollment failed:', error);
      setPaymentStep(1);
    }
    window.location.reload();
  };

  // Calculate totals
  const coursePrice = parseFloat(currentCourse?.price || 0);
  const tax = coursePrice * 0.18; // 18% GST
  const total = coursePrice + tax;

  //  Loading state
  if (!currentCourse?.title) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700"></div>
        </div>
      </div>
    );
  }

  //  Restrict access for non-customers
  if (userRole !== 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            {userRole === 'seller' ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Cannot Purchase Course</h2>
                <p className="text-gray-600 mb-6">
                  As an <strong>instructor</strong>, you cannot purchase courses. You can only create and sell courses.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Your Role</span>
                    <span className="font-semibold text-orange-600"> Instructor</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Permissions</span>
                    <span className="text-blue-600 font-semibold">Create & Sell Courses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Course Access</span>
                    <span className="text-gray-600 font-semibold">Preview Only</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/seller">
                    <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                      Go to Instructor Dashboard
                    </button>
                  </Link>
                  <Link href={`/customer/course/${courseId}`}>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Preview Course Content
                    </button>
                  </Link>
                  <Link href="/customer">
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Browse All Courses
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
                <p className="text-gray-600 mb-6">
                  You need to <strong>login as a customer</strong> to purchase this course.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Current Status</span>
                    <span className="font-semibold text-gray-500">👤 Guest User</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Required Role</span>
                    <span className="text-green-600 font-semibold">🛍️ Customer</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Course Price</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Login to Purchase
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="w-full border border-blue-300 bg-blue-50 text-blue-700 py-3 px-6 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                      Create Customer Account
                    </button>
                  </Link>
                  <Link href={`/customer/course/${courseId}`}>
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Preview Course Content
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  //  If customer is already enrolled, show enrollment status
  if (isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Already Enrolled!</h2>
            <p className="text-gray-600 mb-6">
              You are already enrolled in <strong>{currentCourse.title}</strong>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Course</span>
                <span className="font-semibold">{currentCourse.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-semibold"> Enrolled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Access</span>
                <span className="text-blue-600 font-semibold">Full Access</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href={`/customer/course/${courseId}`}>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Continue Learning
                </button>
              </Link>
              <Link href="/customer">
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Browse More Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Processing Step
  if (paymentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h2>
            <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
            <div className="text-3xl font-bold text-blue-600">{processingTime}s</div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - processingTime) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Step
  if (paymentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Congratulations! You have successfully enrolled in <strong>{currentCourse.title}</strong>
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Course</span>
                <span className="font-semibold">{currentCourse.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm">TXN{Date.now()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href={`/customer/course/${courseId}`}>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Start Learning
                </button>
              </Link>
              <Link href="/customer">
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Browse More Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //  Payment Form - Only accessible to customers
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Enroll in Course</h1>
            <p className="mt-2 opacity-90">Complete your enrollment with one click</p>
            {/*  Show customer badge */}
            <div className="mt-2 flex items-center space-x-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                 Customer Account
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            
            {/* Course Details */}
            <div>
              <div className="flex items-center space-x-4 mb-6 p-6 bg-gray-50 rounded-lg">
                <Image
                  src={currentCourse.thumbnail || "/api/placeholder/120/80"}
                  alt={currentCourse.title}
                  width={100}
                  height={100}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{currentCourse.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{currentCourse.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span> {currentCourse.category}</span>
                    <span> {currentCourse.level}</span>
                    <span> {currentCourse.language}</span>
                  </div>
                </div>
              </div>

              {/* What You'll Get */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  What you will get
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full lifetime access to course content
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access to all video lectures
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Downloadable resources and materials
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mobile and tablet access
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Course Price</span>
                    <span className="font-semibold">₹{coursePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/*  Simple Pay Button - Only for customers */}
                <button
                  onClick={handleDirectPayment}
                  disabled={enrollmentLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {enrollmentLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Enroll Now - Pay ₹${total.toLocaleString()}`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure & Instant Enrollment</span>
                  </div>
                  
                  <Link href={`/customer/course/${courseId}`}>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      ← Back to Course Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

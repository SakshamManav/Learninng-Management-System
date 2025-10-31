"use client";
import React, { use, useEffect, useState } from "react";
import {
  getSpecificCourseById,
  getAllSectionsOfCourse,
  getAllVideosInfoOfACourse,
  clearCurrentCourse
} from "@/app/redux/CourseSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function CourseDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const { currentCourse, courseSection, loading, error, courseVideoInfo } = useSelector(
    (state) => state.course
  );
  const dispatch = useDispatch();

  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Clear previous course data when courseId changes
    dispatch(clearCurrentCourse());
    
    // Fetch new course data
    dispatch(getSpecificCourseById(courseId));
    dispatch(getAllSectionsOfCourse(courseId));
    dispatch(getAllVideosInfoOfACourse(courseId));
  }, [courseId, dispatch])
  
  useEffect(() => {
    console.log('Current Course ID:', currentCourse?.id, 'URL Course ID:', parseInt(courseId));
    console.log('Course Sections:', courseSection);
    console.log('Course Videos:', courseVideoInfo);
  }, [currentCourse, courseSection, courseVideoInfo, courseId]);

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Expand all sections
  const expandAll = () => {
    const allExpanded = {};
    courseSection.forEach((section) => {
      allExpanded[section.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  // Collapse all sections
  const collapseAll = () => {
    setExpandedSections({});
  };

  // Add this function before your component's return statement
  const groupVideosBySection = () => {
    if (!courseVideoInfo || courseVideoInfo.length === 0) return {};
    
    const groupedVideos = {};
    
    courseVideoInfo.forEach(video => {
      const sectionId = video.section_id;
      
      if (!groupedVideos[sectionId]) {
        groupedVideos[sectionId] = [];
      }
      
      groupedVideos[sectionId].push(video);
    });
    
    // Sort videos within each section by position
    Object.keys(groupedVideos).forEach(sectionId => {
      groupedVideos[sectionId].sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    
    return groupedVideos;
  };

  // Add this inside your component, after the state declarations
  const videosBySection = groupVideosBySection();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCourse || !currentCourse.title) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Course Info */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20 shadow-lg">
                  {currentCourse.category}
                </span>
                <span className="bg-red-500/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-red-300/30 shadow-lg">
                  {currentCourse.level}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {currentCourse.title}
              </h1>

              <p className="text-xl mb-6 text-red-100">
                {currentCourse.description}
              </p>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center text-red-100">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Instructor: {currentCourse.instructor_name}
                </div>
                <div className="flex items-center text-red-100">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 009 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {currentCourse.language}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">
                  ₹{parseFloat(currentCourse.price).toLocaleString()}
                </div>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 hover:text-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20">
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={currentCourse.thumbnail}
                  alt={currentCourse.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <button className="w-full bg-white/90 text-gray-900 py-3 rounded-lg font-semibold hover:bg-white transition-colors flex items-center justify-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Preview Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Content/Sections */}
              <div className="bg-gray-300 rounded-xl shadow-sm border p-8 ">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black">
                    Course Content
                  </h2>
                  {courseSection && courseSection.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={expandAll}
                        className="text-sm text-gray-700 hover:text-gray-800 font-semibold bg-red-50 px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition-all duration-200"
                      >
                        Expand All
                      </button>
                      <span className="text-gray-300 mx-2">|</span>
                      <button
                        onClick={collapseAll}
                        className="text-sm text-gray-600 hover:text-gray-700 font-semibold bg-red-50 px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition-all duration-200"
                      >
                        Collapse All
                      </button>
                    </div>
                  )}
                </div>                  <div className="space-y-2">
                    {courseSection && courseSection.length > 0 ? courseSection.map((section, index) => (
                     
                      <div
                        key={section.id}

                        className="border border-red-200 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-5 text-left bg-gradient-to-r from-red-50 to-red-50 hover:from-red-100 hover:to-red-100 transition-all duration-300 rounded-t-xl border-b border-red-200"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-gray-900 min-w-[2rem] bg-red-100 px-2 py-1 rounded-md">
                              {index + 1}.
                            </span>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">
                                {section.title || `Section ${index + 1}`}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {section.videos
                                  ? `${section.videos.length} videos`
                                  : "No videos"}
                                {section.total_duration &&
                                  ` • ${section.total_duration}`}
                              </p>
                            </div>
                          </div>

                          {/* Expand/Collapse Icon */}
                          <svg
                            className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                              expandedSections[section.id] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Section Content (Videos) */}
                        {expandedSections[section.id] && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {videosBySection[section.id] && videosBySection[section.id].length > 0 ? (
                              <div className="p-4 space-y-3">
                                {videosBySection[section.id].map((video, videoIndex) => (
                                  
                                  <div
                                    key={video.id}
                                    className="flex items-center space-x-4 p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer group"
                                  >
                                    {/* Video Thumbnail/Icon */}
                                    <div className="flex-shrink-0 relative">
                                      {video.mime_type && video.mime_type.startsWith('image/') ? (
                                        // If it's an image (thumbnail)
                                        <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                          <img 
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/${video.video_url}`}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                          />
                                          {/* Play button overlay */}
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                        </div>
                                      ) : (
                                        // Video icon for actual video files
                                        <div className="w-16 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                      
                                      {/* Video number badge */}
                                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {video.position || videoIndex + 1}
                                      </div>
                                    </div>

                                    {/* Video Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <Link href={`/customer/course/${courseId}/video/${video.id}`} className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-700 transition-colors">
                                          {video.title || `Video ${videoIndex + 1}`}
                                        </Link>
                                        
                                        {/* Preview badge */}
                                        {video.is_preview && (
                                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                            Preview
                                          </span>
                                        )}
                                      </div>
                                      
                                     
                                      
                                      {/* Resources indicator */}
                                      {video.resources && (
                                        <div className="mt-1">
                                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            📎 Resources Available
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex-shrink-0 flex items-center space-x-2">
                                      {video.is_preview ? (
                                        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700 transition-colors">
                                          Watch Free
                                        </button>
                                      ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-6 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium">No videos in this section yet</p>
                                <p className="text-xs text-gray-400 mt-1">Videos will appear here once they are uploaded</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Course Sections Yet</h3>
                        <p className="text-gray-500 text-sm">This course does not have any sections or content uploaded yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Check back later for course content!</p>
                      </div>
                    )}
                  </div>

                  {/* Course Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {courseSection ? courseSection.length : 0}
                        </div>
                        <div className="text-sm text-gray-500">Sections</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {courseVideoInfo ? courseVideoInfo.length : 0}
                        </div>
                        <div className="text-sm text-gray-500">Videos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentCourse.level || "All"}
                        </div>
                        <div className="text-sm text-gray-500">Level</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {currentCourse.language || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">Language</div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* What You'll Learn */}
              <div className="bg-gray-300 rounded-2xl shadow-lg border-2 border-red-100 p-8 hover:shadow-xl transition-all duration-300">
                <h2 className="text-3xl font-bold text-black mb-6 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  What you will learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCourse.what_you_will_learn &&
                  Array.isArray(currentCourse.what_you_will_learn) ? (
                    currentCourse.what_you_will_learn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-black">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {currentCourse.what_you_will_learn}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-300 rounded-xl shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Requirements
                </h2>
                <div className="space-y-3">
                  {currentCourse.requirements &&
                  Array.isArray(currentCourse.requirements) ? (
                    currentCourse.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-black">{requirement}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {currentCourse.requirements}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-300 rounded-2xl shadow-lg border-2 border-red-100 p-8 hover:shadow-xl transition-all duration-300">
                <h2 className="text-3xl font-bold text-black mb-6 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About this course
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {currentCourse.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 ">
              {/* Course Info Card */}
              <div className="bg-gray-800 rounded-2xl shadow-xl border-2 border-red-100 p-8 sticky top-6 hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl text-white font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text ">
                  ₹{parseFloat(currentCourse.price).toLocaleString()}
                </div>

                <button className="w-full bg-gradient-to-r from-white to-gray-50 text-black py-4 rounded-xl font-bold text-lg hover:from-green-400 hover:to-green-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mb-4">
                  Enroll Now
                </button>

                <button className="w-full border-2 bg-white border-red-300 text-black py-3 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 hover:text-black transition-all duration-300 mb-6">
                  Add to Wishlist
                </button>

                <div className="space-y-4 text-white">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-blue-100">Level</span>
                    <span className="font-medium capitalize">
                      {currentCourse.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-blue-100">Language</span>
                    <span className="font-medium">
                      {currentCourse.language}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-blue-100">Category</span>
                    <span className="font-medium">
                      {currentCourse.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-blue-100">Last Updated</span>
                    <span className="font-medium">
                      {new Date(currentCourse.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

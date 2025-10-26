"use client"
import React, { use, useEffect, useState } from 'react'
import { clearCurrentCourse, getASpecificVideo, getAllSectionsOfCourse, getAllVideosInfoOfACourse } from '@/app/redux/CourseSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';


export default function VideoPage({params}) {
  const unwrappedParams = use(params);
  const { currentVideoUrl, currentVideoInfo, courseSection, courseVideoInfo, loading } = useSelector((state) => state.course);
  const courseId = unwrappedParams.id;
  const videoId = unwrappedParams.videoId;
  const dispatch = useDispatch();
  
  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    dispatch(clearCurrentCourse());
    dispatch(getASpecificVideo({courseId, videoId}));
    
    // Also fetch course sections and all videos for the sidebar
    dispatch(getAllSectionsOfCourse(courseId));
    dispatch(getAllVideosInfoOfACourse(courseId));
  }, [dispatch, courseId, videoId]);

  useEffect(() => {
    console.log('Current Video URL:', currentVideoUrl);
    console.log('Current Video Info:', currentVideoInfo);
  }, [currentVideoUrl, currentVideoInfo]);

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Group videos by section
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

  const videosBySection = groupVideosBySection();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          
          {/* Left Side - Video Player (70%) */}
          <div className="flex-[0.7] flex flex-col">
            {/* Video Player Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl flex-1">
              <div className="relative w-full h-full">
                {currentVideoUrl ? (
                  <video
                    src={currentVideoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={currentVideoInfo?.thumbnail_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-lg">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Video Title and Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {currentVideoInfo?.title || 'Video Title'}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                {currentVideoInfo?.duration && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{currentVideoInfo.duration}</span>
                  </div>
                )}
                
                {currentVideoInfo?.size && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>{(currentVideoInfo.size / (1024 * 1024)).toFixed(1)} MB</span>
                  </div>
                )}
                
                {currentVideoInfo?.position && (
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                    Video {currentVideoInfo.position}
                  </span>
                )}
                
                {currentVideoInfo?.is_preview && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Free Preview
                  </span>
                )}
              </div>
              
              {/* Back to Course Button */}
              <div className="flex items-center space-x-4">
                <Link 
                  href={`/customer/course/${courseId}`}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Course</span>
                </Link>
                
                {currentVideoInfo?.resources && (
                  <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                    📎 Download Resources
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Side - Course Sections (30%) */}
          <div className="flex-[0.3] bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
              <h2 className="text-xl font-bold text-teal-800">Course Content</h2>
              <p className="text-sm text-gray-600 mt-1">
                {courseSection ? courseSection.length : 0} sections • {courseVideoInfo ? courseVideoInfo.length : 0} videos
              </p>
            </div>
            
            <div className="overflow-y-auto h-full pb-6">
              {courseSection && courseSection.length > 0 ? (
                <div className="space-y-2 p-4">
                  {courseSection.map((section, index) => (
                    <div key={section.id} className="border border-teal-200 rounded-lg">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-teal-50 transition-colors rounded-t-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {section.title || `Section ${index + 1}`}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {videosBySection[section.id] ? `${videosBySection[section.id].length} videos` : 'No videos'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Expand/Collapse Icon */}
                        <svg
                          className={`w-4 h-4 text-teal-600 transition-transform duration-200 ${
                            expandedSections[section.id] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Section Videos */}
                      {expandedSections[section.id] && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          {videosBySection[section.id] && videosBySection[section.id].length > 0 ? (
                            <div className="p-2 space-y-1">
                              {videosBySection[section.id].map((video, videoIndex) => (
                                <Link
                                  key={video.id}
                                  href={`/customer/course/${courseId}/video/${video.id}`}
                                  className={`block p-3 rounded-lg transition-colors text-sm ${
                                    video.id === parseInt(videoId)
                                      ? 'bg-teal-100 border-2 border-teal-500'
                                      : 'hover:bg-white border border-transparent hover:border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                      video.id === parseInt(videoId)
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {video.position || videoIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-medium truncate ${
                                        video.id === parseInt(videoId) ? 'text-teal-900' : 'text-gray-900'
                                      }`}>
                                        {video.title}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-1">
                                        {video.duration && (
                                          <span className="text-xs text-gray-500">{video.duration}</span>
                                        )}
                                        {video.is_preview && (
                                          <span className="bg-green-100 text-green-700 text-xs px-1 py-0.5 rounded">
                                            Free
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {video.id === parseInt(videoId) && (
                                      <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              <p className="text-xs">No videos in this section</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500 text-sm">No course sections available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

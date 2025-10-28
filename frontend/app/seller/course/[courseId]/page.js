"use client"
import React, { use, useEffect, useState } from 'react'
import { getSpecificCourseById, clearCurrentCourse, getAllSectionsOfCourse, getAllVideosInfoOfACourse, createCourseSection, createCourseVideo } from '@/app/redux/CourseSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SellerCourse({params}) {
    const unwrappedParams = use(params);
    const courseId = unwrappedParams.courseId;
    const {currentCourse, courseSection, courseVideoInfo} = useSelector((state)=> state.course);
    const dispatch = useDispatch();
    const [activeSection, setActiveSection] = useState('description');
    const [isEditing, setIsEditing] = useState(false);
    const [expandedSections, setExpandedSections] = useState(new Set());
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSection, setNewSection] = useState({
        course_id: courseId,
        title: '',
        position: ''
    });
    const [showAddVideo, setShowAddVideo] = useState(false);
    const [newVideo, setNewVideo] = useState({
        course_id: courseId,
        section_id: '',
        title: '',
        description: '',
        position: '',
        video_file: null
    });

    useEffect(() => {
        // Clears previous course data when courseId changes
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
        console.log('New Section State:', newSection);
    }, [currentCourse, courseSection, courseVideoInfo, courseId, newSection]);


    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {

        setIsEditing(false);
    };

    const toggleSectionExpansion = (sectionId) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };


    const getVideosForSection = (sectionId) => {
        return courseVideoInfo?.filter(video => video.section_id === sectionId) || [];
    };

    const handleAddSection = () => {
        setShowAddSection(true);
    };

    const handleCancelAddSection = () => {
        setShowAddSection(false);
        setNewSection({
            course_id: courseId,
            title: '',
            position: ''
        });
    };

    const handleSectionInputChange = (e) => {
        const { name, value } = e.target;
        setNewSection(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitSection = () => {
        const sectionData = {
            ...newSection,
            course_id: courseId
        };
        console.log('New section with course_id:', sectionData);
        console.log('CourseId from URL:', courseId);
        dispatch(createCourseSection(sectionData));
        setNewSection({
            course_id: courseId,
            title: '',
            position: ''
        });
        setShowAddSection(false);
    };

    const handleAddVideo = () => {
        setShowAddVideo(true);
    };

    const handleCancelAddVideo = () => {
        setShowAddVideo(false);
        setNewVideo({
            course_id: courseId,
            section_id: '',
            title: '',
            description: '',
            position: '',
            video_file: null
        });
    };

    const handleVideoInputChange = (e) => {
        const { name, value } = e.target;
        setNewVideo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        setNewVideo(prev => ({
            ...prev,
            video_file: file
        }));
    };

    const handleSubmitVideo = () => {
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('section_id', newVideo.section_id);
        formData.append('title', newVideo.title);
        formData.append('description', newVideo.description);
        formData.append('position', newVideo.position);
        if (newVideo.video_file) {
            formData.append('video', newVideo.video_file);
        }

        console.log('Video FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, ':', value instanceof File ? value.name : value);
        }

        // Uncomment when you have the Redux action ready
        // dispatch(createCourseVideo(formData));
        
        setNewVideo({
            course_id: courseId,
            section_id: '',
            title: '',
            description: '',
            position: '',
            video_file: null
        });
        setShowAddVideo(false);
    };

    // Add useEffect to update course_id when courseId changes
    useEffect(() => {
        setNewVideo(prev => ({
            ...prev,
            course_id: courseId
        }));
    }, [courseId]);

    const course = currentCourse;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-800 text-white">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-sky-100 text-lg mb-4 leading-relaxed">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="bg-white text-black px-3 py-1 rounded-full text-sm">
                                    {course.level}
                                </span>
                                <span className="bg-white text-black px-3 py-1 rounded-full text-sm">
                                    {course.language}
                                </span>
                                <span className="text-2xl font-bold text-white">
                                    ${course.price}
                                </span>
                            </div>
                        </div>
                        
                        {/* Course Thumbnail */}
                        {course.thumbnail && (
                            <div className="ml-8">
                                <img 
                                    src={course.thumbnail} 
                                    alt={course.title}
                                    className="w-48 h-32 object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Edit Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleEdit}
                            className="bg-amber-500 hover:bg-amber-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {isEditing ? 'Cancel Edit' : 'Edit Course'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm border-b border-sky-200">
                <div className="max-w-6xl mx-auto px-6">
                    <nav className="flex space-x-8">
                        {['description', 'sections', 'videos'].map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                                    activeSection === section
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-gray-500 hover:text-sky-600 hover:border-sky-300'
                                }`}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Description Section */}
                {activeSection === 'description' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Course Details</h2>
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* What You'll Learn */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">What You will Learn</h3>
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            rows="6"
                                            defaultValue={course.what_you_will_learn?.join('\n')}
                                        />
                                    ) : (
                                        <ul className="space-y-3">
                                            {course.what_you_will_learn?.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))}

                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Requirements</h3>
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    {isEditing ? (
                                        <textarea
                                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                            rows="6"
                                            defaultValue={course.requirements?.join('\n')}
                                        />
                                    ) : (
                                        <ul className="space-y-3">
                                            {course.requirements?.map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                                    </svg>
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Course Info */}
                        <div className="mt-8 grid md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg text-center border">
                                <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded text-center focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                        defaultValue={course.category}
                                    />
                                ) : (
                                    <p className="text-gray-600">{course.category}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg text-center border">
                                <h4 className="font-semibold text-gray-700 mb-2">Level</h4>
                                {isEditing ? (
                                    <select className="w-full p-2 border border-gray-300 rounded text-center focus:border-sky-500 focus:ring-2 focus:ring-sky-200" defaultValue={course.level}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-600 capitalize">{course.level}</p>
                                )}
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg text-center border">
                                <h4 className="font-semibold text-gray-700 mb-2">Price</h4>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded text-center focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                                        defaultValue={course.price}
                                    />
                                ) : (
                                    <p className="text-gray-600">${course.price}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sections Tab */}
                {activeSection === 'sections' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Course Sections</h2>
                            <button 
                                onClick={handleAddSection}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Section
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {courseSection?.length > 0 ? (
                                courseSection.map((section, index) => (
                                    <div key={section.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                                        {/* Section Header */}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <button
                                                            onClick={() => toggleSectionExpansion(section.id)}
                                                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <svg 
                                                                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                                                                    expandedSections.has(section.id) ? 'rotate-90' : ''
                                                                }`} 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                        <h3 className="text-lg font-semibold text-gray-700">
                                                            Section {index + 1}: {section.title}
                                                        </h3>
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                            {getVideosForSection(section.id).length} videos
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 ml-8">{section.description}</p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Videos List */}
                                        {expandedSections.has(section.id) && (
                                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-medium text-gray-700">Videos in this section</h4>
                                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded-lg transition-colors duration-200 flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Add Video
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    {getVideosForSection(section.id).length > 0 ? (
                                                        getVideosForSection(section.id).map((video, videoIndex) => (
                                                            <div key={video.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="w-12 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="font-medium text-gray-800">{video.title}</h5>
                                                                            <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                                                                            <span className="text-xs text-gray-500">Video {videoIndex + 1}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors duration-200">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                                                                            </svg>
                                                                        </button>
                                                                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <div className="text-gray-400 mb-2">
                                                                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-gray-500">No videos in this section yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No sections added yet</p>
                                    <p className="text-gray-400">Create your first section to organize your course content</p>
                                </div>
                            )}
                        </div>

                        {/* Add New Section Form */}
                        {showAddSection && (
                            <div className="mt-6 bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Section</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newSection.title}
                                            onChange={handleSectionInputChange}
                                            placeholder="Enter section title"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                                        />
                                    </div>
                                    
                                    

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="number"
                                            name="position"
                                            value={newSection.position}
                                            onChange={handleSectionInputChange}
                                            placeholder="Enter position (e.g., 1, 2, 3...)"
                                            min="1"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleSubmitSection}
                                            disabled={!newSection.title || !newSection.position}
                                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Section
                                        </button>
                                        <button
                                            onClick={handleCancelAddSection}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Videos Tab */}
                {activeSection === 'videos' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Course Videos</h2>
                            <button 
                                onClick={handleAddVideo}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0v12a2 2 0 002 2h6a2 2 0 002-2V4" />
                                </svg>
                                Upload Video
                            </button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courseVideoInfo?.length > 0 ? (
                                courseVideoInfo.map((video, index) => (
                                    <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15" />
                                            </svg>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-700 mb-2">{video.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Video {index + 1}</span>
                                                <div className="flex gap-2">
                                                    <button className="p-1 text-amber-600 hover:bg-amber-50 rounded">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">No videos uploaded yet</p>
                                    <p className="text-gray-400">Upload your first video to start building your course</p>
                                </div>
                            )}
                        </div>

                        {/* Add New Video Form */}
                        {showAddVideo && (
                            <div className="mt-6 bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload New Video</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Section
                                        </label>
                                        <select
                                            name="section_id"
                                            value={newVideo.section_id}
                                            onChange={handleVideoInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                        >
                                            <option value="">Choose a section</option>
                                            {courseSection?.map((section) => (
                                                <option key={section.id} value={section.id}>
                                                    {section.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Video Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newVideo.title}
                                            onChange={handleVideoInputChange}
                                            placeholder="Enter video title"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Position
                                        </label>
                                        <input
                                            type="number"
                                            name="position"
                                            value={newVideo.position}
                                            onChange={handleVideoInputChange}
                                            placeholder="Enter position (e.g., 1, 2, 3...)"
                                            min="1"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Video File
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoFileChange}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label htmlFor="video-upload" className="cursor-pointer">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="text-sm text-gray-600">
                                                        {newVideo.video_file ? (
                                                            <span className="text-purple-600 font-medium">{newVideo.video_file.name}</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-purple-600 font-medium">Click to upload</span> or drag and drop
                                                            </>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI (MAX. 500MB)</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleSubmitVideo}
                                            disabled={!newVideo.section_id || !newVideo.title || !newVideo.position || !newVideo.video_file}
                                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            Upload Video
                                        </button>
                                        <button
                                            onClick={handleCancelAddVideo}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

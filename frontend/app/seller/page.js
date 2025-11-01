"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourseOfSeller,
  createCourseDescription,
} from "../redux/CourseSlice";
import Link from "next/link";
import Image from "next/image";

export default function SellerHomepage() {
  const { currentSellerCourse, loading } = useSelector((state) => state.course);
  const { user, profileInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ✅ Get user role
  const userRole = profileInfo?.role || user?.role || "guest";

  // Course form state
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: "",
    language: "English",
    instructor_id: user?.id || "",
    what_you_will_learn: [""],
    requirements: [""],
    thumbnail: null,
  });

  // Add state for image preview
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    console.log(user.id);
    dispatch(getAllCourseOfSeller(user.id));
  }, [dispatch]);

  useEffect(() => {
    console.log(currentSellerCourse);
  }, [currentSellerCourse]);

  // Update instructor_id when user data is available
  useEffect(() => {
    if (user?.id) {
      setCourseData((prev) => ({
        ...prev,
        instructor_id: user.id,
      }));
    }
  }, [user]);

  // Restrict access for non-sellers
  if (userRole !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {userRole === "customer" ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Access Denied
                </h2>
                <p className="text-gray-600 mb-6">
                  As a <strong>customer</strong>, you cannot access the
                  instructor dashboard. This area is only for course
                  instructors.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Your Role</span>
                    <span className="font-semibold text-blue-600">
                      {" "}
                      Customer
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Permissions</span>
                    <span className="text-green-600 font-semibold">
                      Browse & Enroll in Courses
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Instructor Access</span>
                    <span className="text-red-600 font-semibold">
                      Not Available
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/customer">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Browse Courses
                    </button>
                  </Link>
                  <Link href="/customer/my-enrollments">
                    <button className="w-full border border-blue-300 bg-blue-50 text-blue-700 py-3 px-6 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                      My Enrolled Courses
                    </button>
                  </Link>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-3">
                      To become an instructor create new account as seller or
                      teacher.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Login Required
                </h2>
                <p className="text-gray-600 mb-6">
                  You need to <strong>login as an instructor</strong> to access
                  the course management dashboard.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Current Status</span>
                    <span className="font-semibold text-gray-500">
                      Guest User
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Required Role</span>
                    <span className="text-orange-600 font-semibold">
                      Instructor
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Access Level</span>
                    <span className="font-semibold">
                      Create & Manage Courses
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login">
                    <button className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                      Login as Instructor
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="w-full border border-orange-300 bg-orange-50 text-orange-700 py-3 px-6 rounded-lg font-semibold hover:bg-orange-100 transition-colors">
                      Create Instructor Account
                    </button>
                  </Link>
                  <Link href="/customer">
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Browse Courses as Student
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle array inputs (what_you_will_learn, requirements)
  const handleArrayInputChange = (index, value, field) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  // Add new array item
  const addArrayItem = (field) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Remove array item
  const removeArrayItem = (index, field) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();

    // Add basic course data
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("category", courseData.category);
    formData.append("level", courseData.level);
    formData.append("price", parseFloat(courseData.price));
    formData.append("language", courseData.language);
    formData.append("instructor_id", courseData.instructor_id);

    const cleanedWhatYouWillLearn = courseData.what_you_will_learn.filter(
      (item) => item.trim() !== ""
    );
    const cleanedRequirements = courseData.requirements.filter(
      (item) => item.trim() !== ""
    );

    formData.append(
      "what_you_will_learn",
      JSON.stringify(cleanedWhatYouWillLearn)
    );
    formData.append("requirements", JSON.stringify(cleanedRequirements));

    // Add thumbnail file if exists
    if (courseData.thumbnail) {
      formData.append("thumbnail", courseData.thumbnail);
    }

    console.log("FormData prepared for submission");

    const result = dispatch(createCourseDescription(formData));
    console.log(result);
  };

  // Main seller dashboard - Only accessible to sellers
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Create, manage, and publish your courses
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                Instructor
              </span>
            </div>
          </div>
        </div>

        {/* Your Courses Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Courses ({currentSellerCourse.length})
            </h2>
          </div>

          {currentSellerCourse.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first course to start sharing your knowledge with
                students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSellerCourse.map((course) => (
                <Link
                  href={`/seller/course/${course.id}`}
                  key={course.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 relative">
                    <Image
                      height={100}
                      width={100}
                      src={course.thumbnail}
                      className="w-full h-full object-cover"
                      alt={course.title}
                    />
                  </div>
                  <div className="p-6 bg-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-black">
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm text-black">
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium"> ₹ {course.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-medium flex items-center">
                          {course.rating > 0 ? (
                            <>
                              <svg
                                className="w-4 h-4 text-yellow-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {course.rating}
                            </>
                          ) : (
                            "No ratings"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create New Course Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b bg-gray-900 border-gray-200">
            <h2 className="text-2xl font-semibold text-white">
              Create New Course
            </h2>
            <p className="text-white mt-1">
              Fill out the course details to create your new course
            </p>
          </div>

          <form onSubmit={handleCreateCourse} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Complete JavaScript Masterclass 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe what students will learn in this course and what makes it valuable..."
                    required
                  ></textarea>
                </div>

                {/* Course Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Thumbnail *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          height={100}
                          width={100}
                          src={imagePreview}
                          alt="Course thumbnail preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setCourseData((prev) => ({
                              ...prev,
                              thumbnail: null,
                            }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="99.99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={courseData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Photography">Photography</option>
                      <option value="Music">Music</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Language">Language</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      name="level"
                      value={courseData.level}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all levels">All Levels</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      name="language"
                      value={courseData.language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Mandarin">Mandarin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Learning Outcomes & Requirements */}
              <div className="space-y-6">
                {/* What You Will Learn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What Students Will Learn *
                  </label>
                  <div className="space-y-2">
                    {courseData.what_you_will_learn.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayInputChange(
                              index,
                              e.target.value,
                              "what_you_will_learn"
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={`Learning outcome ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(index, "what_you_will_learn")
                          }
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={courseData.what_you_will_learn.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("what_you_will_learn")}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
                    >
                      + Add Learning Outcome
                    </button>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Requirements
                  </label>
                  <div className="space-y-2">
                    {courseData.requirements.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayInputChange(
                              index,
                              e.target.value,
                              "requirements"
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "requirements")}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={courseData.requirements.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("requirements")}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
                    >
                      + Add Requirement
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-900"
                    } text-white`}
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    <span>
                      {loading ? "Creating Course..." : "Create Course"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserEnrolledCourse } from '@/app/redux/CourseSlice';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function MyEnrollment() {
  const { userCurrentEnrolledCourse } = useSelector((state) => state.course)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUserEnrolledCourse());
  }, [dispatch]);

  return (
    <>
      <Navbar/>
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Enrollments</h1>
            <p className="text-lg text-gray-500 mt-3">
              You are enrolled in {Array.isArray(userCurrentEnrolledCourse) ? userCurrentEnrolledCourse.length : 0} courses 
            </p>
          </div>
        </div>

        {Array.isArray(userCurrentEnrolledCourse) && userCurrentEnrolledCourse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {userCurrentEnrolledCourse.map((course) => {
              const price = parseFloat(course.course_price || 0).toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
              });

              return (
                <Link
                  key={course.id}
                  href={`/customer/course/${encodeURIComponent(course.course_id)}`}
                  className="group block "
                >
                  <article className="bg-gray-300 rounded-xl shadow-md hover:shadow-lg transition p-8 flex flex-col h-full  text-gray-700">
                    <div className="flex items-start gap-6 ">
                      <img
                        src={course.course_thumbnail}
                        alt={course.course_title}
                        className="w-56 h-36 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-semibold text-black truncate">
                          {course.course_title}
                        </h3>
                        <p className="text-lg text-gray-900 mt-4 line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {course.course_description}
                        </p>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-base text-gray-700">Instructor: <span className="font-medium text-black">{course.instructor_name}</span></div>
                          <div className="text-lg text-gray-800 font-semibold">{price}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="bg-red-200 text-black text-sm px-3 py-1 rounded-full">
                          {course.category}
                        </span>
                        <span className="bg-orange-200 text-black text-sm px-3 py-1 rounded-full">
                          {course.level}
                        </span>
                      </div>
                      <span className="text-lg text-gray-500 group-hover:text-gray-700 transition">View course →</span>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-28">
            <p className="text-gray-500 text-xl">No enrollments yet.</p>
          </div>
        )}
      </div>
    </>
  );
}

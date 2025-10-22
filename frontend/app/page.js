"use client";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  const handleNavigateToCustomer = () => {
    router.push('/customer');
  };

  const handleNavigateToSeller = () => {
    router.push('/seller');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EduPlatform
                </span>
              </h1>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Unlock Your Potential Through Learning
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Join millions of learners and thousands of instructors in the world&apos;s most comprehensive 
                online learning marketplace. Whether you want to learn new skills or share your knowledge, 
                we&apos;ve got you covered.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert-Led Courses</h3>
                <p className="text-gray-600">Learn from industry professionals and top educators worldwide</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexible Learning</h3>
                <p className="text-gray-600">Study at your own pace, anywhere, anytime with lifetime access</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Career Growth</h3>
                <p className="text-gray-600">Advance your career with in-demand skills and certifications</p>
              </div>
            </div>

            {/* Call to Action - Main Buttons */}
            <div className="mb-16">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                Choose Your Path
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
                {/* Customer Button */}
                <div 
                  onClick={handleNavigateToCustomer}
                  className="group flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-8 rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold mb-4">I Want to Learn</h4>
                    <p className="text-lg text-purple-100 mb-6">
                      Discover thousands of courses across various subjects. 
                      Start your learning journey today and unlock new opportunities.
                    </p>
                    <div className="inline-flex items-center text-lg font-semibold">
                      Browse Courses
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Seller Button */}
                <div 
                  onClick={handleNavigateToSeller}
                  className="group flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-8 rounded-2xl shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold mb-4">I Want to Teach</h4>
                    <p className="text-lg text-blue-100 mb-6">
                      Share your expertise with millions of students worldwide. 
                      Create courses and build your teaching business.
                    </p>
                    <div className="inline-flex items-center text-lg font-semibold">
                      Start Teaching
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">57M+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">213K+</div>
                  <div className="text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">57K+</div>
                  <div className="text-gray-600">Instructors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">700+</div>
                  <div className="text-gray-600">Partners</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800/90 backdrop-blur-sm text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">EduPlatform</h3>
                <p className="text-gray-400">
                  The global marketplace for learning and instruction
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Learn</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Browse Courses</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Teach</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Become an Instructor</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Teaching Center</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EduPlatform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

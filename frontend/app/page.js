"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const {
    user,
    logout,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    get,
  } = useAuth0();

  const router = useRouter();

  async function handle_login() {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: "http://localhost:3000/auth-callback", // Always go to callback first
      },
    });
  }

  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log(user);
    }
  }, [user, isAuthenticated, isLoading, getAccessTokenSilently]);
  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">LMS</span>
        </div>
        <div>
          {localStorage.getItem('localToken') ? (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                logout({ logoutParams: { returnTo: "http://localhost:3000" } });
                localStorage.removeItem("authToken");
                localStorage.removeItem('user')
                localStorage.removeItem("auth0_User");
                localStorage.removeItem("localToken");
                setIsLoggedin(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handle_login}
            >
              Log In
            </button>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <div className="p-8">
        <h1 className="text-xl font-semibold">Hello {user?.name}</h1>
        <p>Home</p>
      </div>
    </div>
  );
}

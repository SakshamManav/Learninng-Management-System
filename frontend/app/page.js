"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Home() {
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

  async function token() {
    const token = await getAccessTokenSilently({
      audience: "https://learningmanagementsystem-api",
      scope: "openid profile email",
    });
    console.log(token);
  }
  useEffect(() => {
    // if (!isAuthenticated && !isLoading) {
    //   router.push("/login");
    // }
    if (isAuthenticated && !isLoading) {
      token();
    }
    console.log(user);
    //
  },
   [user, isAuthenticated, isLoading, getAccessTokenSilently]);
  return (
    <div>
      <h1>Hello {user?.name}</h1>
      <p>Home</p>
      {isAuthenticated ? (
        <button
          onClick={() => {
            logout({ logoutParams: { returnTo: "http://localhost:3000" } });
          }}
        >
          Logout
        </button>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
}

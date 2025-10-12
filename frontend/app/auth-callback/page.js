"use client";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { checkUserExists, loginUser } from "../redux/UserSlice";

export default function AuthCallback() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(()=>{
    if(localStorage.getItem('localToken')){
        router.push('/')
    }
  }, [])
  useEffect(() => {
    async function handleAuthCallback() {
      if (isAuthenticated && !isLoading && user) {
        try {
          // Now user is authenticated, we can get token and check
          const token = await getAccessTokenSilently({
            audience: "https://learningmanagementsystem-api",
            scope: "openid profile email",
          });
          localStorage.setItem('authToken', token)
          localStorage.setItem('auth0_User', user);
          
          // Check if user exists in database
          const userExistsResult = await dispatch(checkUserExists({ 
            email: user.email, 
            token 
          }));
          console.log(userExistsResult.payload)

          if (userExistsResult.payload.isExists) {
            const login_response = await dispatch(loginUser({ email: user.email, token }));
            console.log(login_response)
            if(login_response.payload.token){
              if(login_response.payload.user.role == "customer"){
                router.push('/customer');
              }else{
                router.push("/seller");
              }
                
            }
          } else {
            // New user, redirect to profile completion
            router.push("/profile-complete");
          }
        } catch (error) {
          console.error("Error in auth callback:", error);
          // On error, assume new user
          router.push("/profile-complete");
        }
      }
    }

    handleAuthCallback();
  }, [isAuthenticated, isLoading, user, dispatch, router, getAccessTokenSilently]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          width: 80px;
          height: 40px;
          border-radius: 100px 100px 0 0;
          position: relative;
          overflow: hidden;
        }
        .loader:before {
          content: "";
          position: absolute;
          inset: 0 0 -100%;
          background: 
            radial-gradient(farthest-side,#ffd738 80%,#0000) left 70% top    20%/15px 15px,
            radial-gradient(farthest-side,#020308 92%,#0000) left 65% bottom 19%/12px 12px,
            radial-gradient(farthest-side,#ecfefe 92%,#0000) left 70% bottom 20%/15px 15px,
            linear-gradient(#9eddfe 50%,#020308 0);
          background-repeat: no-repeat;
          animation: l5 2s infinite;
        }
        @keyframes l5 {
          0%,20%   {transform: rotate(0)}
          40%,60%  {transform: rotate(.5turn)}
          80%,100% {transform: rotate(1turn)}
        }
      `}</style>
    </div>
  );
}


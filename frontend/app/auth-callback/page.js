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
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="flex flex-col items-center space-y-2">
        {/* Triangle */}
        <div className="triangle-loader"></div>
        {/* Square & Circle */}
        <div className="flex flex-row space-x-4">
          <div className="square-loader"></div>
          <div className="circle-loader"></div>
        </div>
      </div>
      <style jsx>{`
        .triangle-loader {
          width: 0;
          height: 0;
          
          border-left: 28px solid transparent;
          border-right: 28px solid transparent;
          border-bottom: 48px solid #FFD600;
          animation: triangle-bounce 1.5s infinite cubic-bezier(.68,-0.55,.27,1.55);
        }
        .square-loader {
          width: 40px;
          height: 40px;
          background: #0c3d82;
          border-radius: 8px;
          animation: square-bounce 1.5s infinite cubic-bezier(.68,-0.55,.27,1.55);
          animation-delay: 0.3s;
        }
        .circle-loader {
          width: 40px;
          height: 40px;
          background: #0c3d82;
          border-radius: 50%;
          animation: circle-bounce 1.5s infinite cubic-bezier(.68,-0.55,.27,1.55);
          animation-delay: 0.6s;
        }
        @keyframes triangle-bounce {
          0%, 100% { transform: translateY(0);}
          20% { transform: translateY(-18px);}
          40%, 80% { transform: translateY(0);}
        }
        @keyframes square-bounce {
          0%, 100% { transform: translateY(0);}
          20% { transform: translateY(-18px);}
          40%, 80% { transform: translateY(0);}
        }
        @keyframes circle-bounce {
          0%, 100% { transform: translateY(0);}
          20% { transform: translateY(-18px);}
          40%, 80% { transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}


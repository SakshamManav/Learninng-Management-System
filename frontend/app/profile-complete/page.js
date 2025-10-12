"use client";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { signupUser } from "../redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProfileComplete() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const isLoggedin = useSelector((state) => state.user.isLoggedin);
  const { user, logout, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [form, setForm] = useState({
    username: "",
    role: "customer",
    contact: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Store token in localStorage on mount if authenticated
  useEffect(() => {
    async function setToken() {
      if (isAuthenticated && !isLoading) {
        const token = await getAccessTokenSilently({
          audience: "https://learningmanagementsystem-api",
          scope: "openid profile email",
        });
        console.log(token)
      }
    }
    setToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);


  useEffect(() => {
    // const token = localStorage.getItem('localToken')
    if (localStorage.getItem('localToken')) {
      router.push("/");
    }
  }, [router, localStorage]);

  function validateForm() {
    const newErrors = {};
    if (form.username.length < 7 || form.username.length > 20) {
      newErrors.username = "Username must be 7-20 characters.";
    }
    if (form.bio.length < 10 || form.bio.length > 150) {
      newErrors.bio = "Bio must be 10-150 characters.";
    }
    return newErrors;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      let provider = "";
      let provider_Id = "";
      if (user && user.sub) {
        const parts = user.sub.split("|");
        provider = parts[0];
        provider_Id = parts[1];
      }
      const formData = {
        ...form,
        provider,
        provider_Id,
        email: user?.email || "",
      };
      const token = localStorage.getItem('authToken');
      const signup_result =  dispatch(signupUser({ data: formData, token }));
      if(signup_result?.payload?.token){
        localStorage.setItem('localToken',signup_result.payload.token);
        router.push('/');
      }else{
        console.log(signup_result.payload)
      }
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full flex justify-end p-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            logout({ logoutParams: { returnTo: "http://localhost:3000" } });
            localStorage.removeItem("token");
          }}
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              minLength={7}
              maxLength={20}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user?.email || ""}
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
              minLength={10}
              maxLength={150}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading && (
              <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-blue-600 rounded-full animate-spin"></span>
            )}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

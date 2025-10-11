const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const loginUser = createAsyncThunk("user/login", async ({email, token}) => {
  const response = await fetch("http://localhost:3001/auth/login", {
    method:"POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });

  const result = await response.json();
  return result;
});

const signupUser = createAsyncThunk("user/signup", async ({data, token}) => {
  const response = await fetch("http://localhost:3001/auth/signup", {
    method:"POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      role: data.role,
      provider: data.provider,
      provider_Id: data.provider_Id,
      profile_Picture: data.profile_Picture,
      bio: data.bio,
      isVerified: data.isVerified,
      contact: data.contact,
      social_links: data.social_links,
    }),
  });
   const result = await response.json();
   return result;
});

const initialState = {
  user: {
    name: "",
    email: "",
    role: "",
    profile_Picture: "",
    bio: "",
    contact: "",
  },
  isLoggedin: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {

  },
});

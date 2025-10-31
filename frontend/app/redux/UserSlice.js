const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const loginUser = createAsyncThunk("user/login", async ({ email, token }) => {
  const response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
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

const signupUser = createAsyncThunk("user/signup", async ({ data, token }) => {
  const response = await fetch("http://localhost:3001/auth/signup", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name:data.name,
      username: data.username,
      email: data.email,
      role: data.role,
      provider: data.provider,
      provider_Id: data.provider_Id,
      profile_Picture: data.profile_Picture || null,
      bio: data.bio,
      isVerified: data.isVerified,
      contact: data.contact,
      social_links: data.social_links,
    }),
  });
  const result = await response.json();
  console.log(result);
  return result;
});

const checkUserExists = createAsyncThunk(
  "user/exist",
  async ({ email, token }) => {
    const response = await fetch(
      `http://localhost:3001/auth/userexist/${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    return result;
  }
);

const userProfileInfo = createAsyncThunk("user/profileinfo", async () => {
  const response = await fetch(`http://localhost:3001/auth/user/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("localToken")}`,
    },
  });
  const result = await response.json();
  console.log(result);
  return result;
});

const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data) => {
    const response = await fetch(
      `http://localhost:3001/auth/user/profile/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("localToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    console.log(data);
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const updateUserProfileImage = createAsyncThunk(
  "user/updateProfileImage",
  async (image) => {
    const response = await fetch(
      `http://localhost:3001/auth/user/profile/image/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("localToken")}`,
        },
        body: image,
      }
    );
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const initialState = {
  user: {},
  profileInfo: {},
  loading: false,
  error: null,
  isUserExists: false,
  isLoggedin: false,
  isInitilized: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState: {
    user: {},
    loading: false,
    error: null,
    isUserExists: false,
    isLoggedin: false,
    isInitialized: false, // ✅ Add this to track if auth check is complete
  },
  reducers: {
    initializeUser: (state) => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("localToken");
        if (storedUser && storedToken) {
          try {
            state.user = JSON.parse(storedUser);
            state.isLoggedin = true; // ✅ Set login status
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("localToken");
            state.isLoggedin = false;
          }
        } else {
          state.isLoggedin = false;
        }
        state.isInitialized = true;
      }
    },
    logoutUser: (state) => {
      state.user = {};
      state.error = null;
      state.isLoggedin = false; // ✅ Set login status
      state.isInitialized = true; // Keep initialized as true
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("localToken");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("Signup fulfilled action:", action);
        state.loading = false;
        localStorage.setItem("localToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user;
        state.isLoggedin = true; // ✅ Set login status
        state.isInitialized = true; // ✅ Set initialized
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log(action);
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("localToken", action.payload.token); // ✅ Fixed double stringify
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user;
        state.isLoggedin = true; // ✅ Set login status
        state.isInitialized = true; // ✅ Set initialized
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // checking userexist

      .addCase(checkUserExists.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserExists.fulfilled, (state, action) => {
        state.loading = false;
        state.isUserExists = action.payload.isExists;
        state.error = null;
      })
      .addCase(checkUserExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // profile info

      .addCase(userProfileInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(userProfileInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.profileInfo = action.payload.user;
      })
      .addCase(userProfileInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateUserProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfileImage.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export {
  loginUser,
  signupUser,
  checkUserExists,
  userProfileInfo,
  updateUserProfile,
  updateUserProfileImage,
};
export const { initializeUser, logoutUser } = UserSlice.actions;
export default UserSlice.reducer;

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
      profile_Picture: data.profile_Picture || null,
      bio: data.bio,
      isVerified: data.isVerified,
      contact: data.contact,
      social_links: data.social_links,
    }),
  });
   const result = await response.json();
   console.log(result)
   return result;
});


const checkUserExists = createAsyncThunk('user/exist', async({email, token})=>{
  const response = await fetch(`http://localhost:3001/auth/userexist/${email}`, {
    method:"GET",
    headers:{
      Authorization: `Bearer ${token}`,
    }, 
  })
  const result = await response.json();
  return result;
})

const initialState = {
  user: {},
  loading: false,
  error: null,
  isUserExists:false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {},
  extraReducers: (builder) =>{
    builder
      .addCase(signupUser.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("Signup fulfilled action:", action);
        state.loading = false;
         localStorage.setItem('localToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.error.message;
        console.log(action)
      })

      // login
      .addCase(loginUser.pending, (state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action)=>{
        state.loading = false;
        localStorage.setItem('localToken', JSON.stringify(action.payload.token))
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload.message;
      })

      // checking userexist

      .addCase(checkUserExists.pending, (state, action)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserExists.fulfilled, (state, action)=>{
        state.loading = false;
        state.isUserExists = action.payload.isExists;
        state.error = null;
      })
      .addCase(checkUserExists.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload.message;
      })
  }
});


export {loginUser, signupUser, checkUserExists};
export default UserSlice.reducer;
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const { headers } = require("next/headers");

// api calls
const baseURL = `http://localhost:3001/course`;

const getAllCourses = createAsyncThunk("course/getAllCourses", async () => {
  const response = await fetch(`${baseURL}/allcourses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await response.json();
  
  return result;
});

  const getSpecificCourseById = createAsyncThunk('course/specificCourse', async(courseId)=>{
    const response = await fetch(`${baseURL}/description/${courseId}`, {
      method:"GET",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      }
    })
    if(!response.ok){
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    // console.log(result)
    return result;
  })



  const getAllSectionsOfCourse = createAsyncThunk('course/sectionCourse', async(courseId)=>{
    const response = await fetch(`${baseURL}/section/${courseId}`, {
      method:"GET",
      headers:{
       Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      }
    })
     if(!response.ok){
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    // console.log(result)
    return result;
  })

  const getAllVideosInfoOfACourse = createAsyncThunk('course/videoInfoCourse', async(courseId)=>{
    const response = await fetch(`${baseURL}/video/${courseId}`, {
      method:"GET",
      headers:{
       Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      }
    })
     if(!response.ok){
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result)
    return result;
  })

const initialState = {
  courses: [],
  currentCourse: {}, // curent course 
  courseSection: [], // current course section
  courseVideoInfo:[],
  loading: false,
  error: null,
  isInitialized:false,
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    intiializeCourses: (state) => {
      if (typeof window !== "undefined") {
        const storedCourses = localStorage.getItem("courses");
        if(storedCourses){
            try {
                state.courses = JSON.parse(storedCourses);
                state.isInitialized = true;
                // console.log(state.courses)
            } catch (error) {
                console.error('Error parsing courses:', error);
            localStorage.removeItem('courses');
            state.isInitialized = true;
            }
        }else {
          state.isInitialized = true;
        }
      }
    },

    
  },
  extraReducers: (builder) => {
    builder
    // Get all course
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.courses = action.payload.courses;
        state.loading = false;
        if (typeof window !== 'undefined') {
          localStorage.setItem('courses', JSON.stringify(state.courses));
        }
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // sepcific course by id -- GET
      .addCase(getSpecificCourseById.pending, (state)=>{
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getSpecificCourseById.fulfilled, (state, action)=>{
        state.currentCourse = action.payload.details;
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(getSpecificCourseById.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.error.message;
        state.isInitialized = false;
      })

      // all sections of specific course by course id -- GET
      .addCase(getAllSectionsOfCourse.pending, (state)=>{
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getAllSectionsOfCourse.fulfilled, (state, action)=>{
        state.loading = false;
        state.isInitialized = true;
        state.courseSection = action.payload.sections;
      })
      .addCase(getAllSectionsOfCourse.rejected, (state, action)=>{
        state.loading = false;
        state.isInitialized = false;
        state.error = action.error.message;
      })

      // all video info a course -- get

      .addCase(getAllVideosInfoOfACourse.pending, (state)=>{
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getAllVideosInfoOfACourse.fulfilled, (state, action)=>{
        state.loading = false;
        state.isInitialized = true;
        state.courseVideoInfo = action.payload.videos;
      })
      .addCase(getAllVideosInfoOfACourse.rejected, (state, action)=>{
        state.loading = false;
        state.isInitialized = false;
        state.error = action.error.message;
      })
      
  },
});

export { getAllCourses, getSpecificCourseById, getAllSectionsOfCourse, getAllVideosInfoOfACourse };
export const {intiializeCourses} = courseSlice.actions;
export default courseSlice.reducer;

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
  console.log(result);
  return result;
});

const initialState = {
  courses: [],
  currentCourse: {
    id: "",
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    language: "",
    thumbnail: "",
    instructor_id: "",
    what_you_will_learn: "",
    requirements: "",
    created_at: "",
    updated_at: "",
  },
  courseSection: [], // current course section
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
      });
  },
});

export { getAllCourses };
export const {intiializeCourses} = courseSlice.actions;
export default courseSlice.reducer;

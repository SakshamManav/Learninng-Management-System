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

const getSpecificCourseById = createAsyncThunk(
  "course/specificCourse",
  async (courseId) => {
    const response = await fetch(`${baseURL}/description/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    // console.log(result)
    return result;
  }
);

const getAllSectionsOfCourse = createAsyncThunk(
  "course/sectionCourse",
  async (courseId) => {
    const response = await fetch(`${baseURL}/section/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    // console.log(result)
    return result;
  }
);

const getAllVideosInfoOfACourse = createAsyncThunk(
  "course/videoInfoCourse",
  async (courseId) => {
    const response = await fetch(`${baseURL}/video/${courseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const getASpecificVideo = createAsyncThunk(
  "course/specificVideo",
  async ({ courseId, videoId }) => {
    const response = await fetch(
      `${baseURL}/video/signed-url/${courseId}/${videoId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("localToken")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const getAllCourseOfSeller = createAsyncThunk(
  "course/sellerCourse",
  async (sellerId) => {
    const response = await fetch(`${baseURL}/teacher/${sellerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const createCourseDescription = createAsyncThunk(
  "course/createDescription",
  async (data) => {
    const response = await fetch(`${baseURL}/description`, {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
      body: data,
    });
    console.log(data);

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const createCourseSection = createAsyncThunk(
  "course/createSectionOfCourse",
  async (data) => {
    const response = await fetch(`${baseURL}/section`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
      body: JSON.stringify(data),
    });
    console.log(data);

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);

const createCourseVideo = createAsyncThunk(
  "course/courseVideo",
  async (data) => {
    const response = await fetch(`${baseURL}/video/upload`, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("localToken")}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch course details");
    }
    const result = await response.json();
    console.log(result);
    return result;
  }
);
const initialState = {
  courses: [],
  currentCourse: {}, // curent course
  courseSection: [], // current course section
  courseVideoInfo: [],
  currentVideoUrl: null,
  currentVideoInfo: {},
  currentSellerCourse: [],
  loading: false,
  error: null,
  isInitialized: false,
  responseMsg: "",
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    intiializeCourses: (state) => {
      if (typeof window !== "undefined") {
        const storedCourses = localStorage.getItem("courses");
        if (storedCourses) {
          try {
            state.courses = JSON.parse(storedCourses);
            state.isInitialized = true;
            // console.log(state.courses)
          } catch (error) {
            console.error("Error parsing courses:", error);
            localStorage.removeItem("courses");
            state.isInitialized = true;
          }
        } else {
          state.isInitialized = true;
        }
      }
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = {};
      state.courseSection = [];
      state.courseVideoInfo = [];
      state.error = null;
      state.currentVideoUrl = null;
      state.currentVideoInfo = {};
      state.currentSellerCourse = [];
      state.responseMsg = "";
    },
    clearError: (state) => {
      state.error = null;
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
        if (typeof window !== "undefined") {
          localStorage.setItem("courses", JSON.stringify(state.courses));
        }
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // sepcific course by id -- GET
      .addCase(getSpecificCourseById.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getSpecificCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload.details;
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(getSpecificCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isInitialized = false;
      })

      // all sections of specific course by course id -- GET
      .addCase(getAllSectionsOfCourse.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getAllSectionsOfCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.courseSection = action.payload.sections;
      })
      .addCase(getAllSectionsOfCourse.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = false;
        state.error = action.error.message;
      })

      // all video info a course -- get

      .addCase(getAllVideosInfoOfACourse.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getAllVideosInfoOfACourse.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.courseVideoInfo = action.payload.videos;
      })
      .addCase(getAllVideosInfoOfACourse.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = false;
        state.error = action.error.message;
      })

      // get video url
      .addCase(getASpecificVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getASpecificVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideoUrl = action.payload.url;
        state.currentVideoInfo = action.payload.details;
      })
      .addCase(getASpecificVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // get all course oof url

      .addCase(getAllCourseOfSeller.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(getAllCourseOfSeller.fulfilled, (state, action) => {
        state.currentSellerCourse = action.payload.course;
        state.loading = false;
      })
      .addCase(getAllCourseOfSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POST calls ----

      // for creation of course descripiton
      .addCase(createCourseDescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourseDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.responseMsg = action.payload.msg;
      })
      .addCase(createCourseDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // for creation of course section
      .addCase(createCourseSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourseSection.fulfilled, (state, action) => {
        state.loading = false;
        state.responseMsg = action.payload.msg;
      })
      .addCase(createCourseSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // video info and uploadation

      .addCase(createCourseVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourseVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.responseMsg = action.payload.msg;
      })
      .addCase(createCourseVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export {
  getAllCourses,
  getSpecificCourseById,
  getAllSectionsOfCourse,
  getAllVideosInfoOfACourse,
  getASpecificVideo,
  getAllCourseOfSeller,
  createCourseDescription,
  createCourseSection,
  createCourseVideo
};
export const { intiializeCourses, clearCurrentCourse, clearError } =
  courseSlice.actions;
export default courseSlice.reducer;

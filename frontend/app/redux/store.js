import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import courseReducer from './CourseSlice';
export const store = configureStore({
    reducer: {
        user: userReducer,
        course:courseReducer,
    }
});


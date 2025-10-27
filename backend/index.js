const express = require("express");
const port = 3001;
const app = express();
const db_pool = require("./config/db");
const cors = require("cors");
const dotenv = require('dotenv')

dotenv.config();

app.use(cors({ origin: "*" }));

// Only use express.json() for routes that need JSON parsing
// Remove the global express.json() middleware since it conflicts with multipart/form-data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/auth', express.json({ limit: '50mb' })); // Only for auth routes
app.use('/course/allcourses', express.json({ limit: '50mb' })); // For GET routes that might need JSON
app.use('/course/teacher', express.json({ limit: '50mb' })); // For teacher routes

app.get("/", (req, res) => {
  return res.send("Backend is working well");
});

app.use("/auth", require("./routes/Auth")); // user and authentcation
app.use('/course', require('./routes/CourseDescription')) // course description
app.use('/course', require('./routes/CourseSection')) // course sections route
app.use('/course', require('./routes/CourseVideo')) // for course videos

// middleware handle
app.use((err, req, res, next) => {
  console.error("Error handler caught:", err);
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ msg: "Invalid or missing token", error: err.message });
  }
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

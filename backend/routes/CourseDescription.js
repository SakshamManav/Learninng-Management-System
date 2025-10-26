const express = require("express");
const router = express.Router();
const {
  createCourseDescription,
  getCourseDescription,
  getAllCourses,
  getCoursesOfSeller,
} = require("../models/CourseDescriptionModel");
const { authenticateRoutes } = require("../middleware/authentication");

// get all courses

router.get("/allcourses", authenticateRoutes, async (req, res) => {
  try {
    const response = await getAllCourses();
    if (response) {
      res
        .status(200)
        .json({ msg: "Courses fetched successfully", courses: response });
    } else {
      res.status(400).json({ msg: "No courses are there" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});

// posting sourcing description

router.post("/description", authenticateRoutes, async (req, res) => {
  const data = req.body;
  try {
    const response = await createCourseDescription(data);
    if (response.affectedRows > 0) {
      res
        .status(201)
        .json({ msg: "Course Created successfully", details: data });
    } else {
      res.status(400).json({ msg: "Course creation unsuccessful" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});

// get a specific course
router.get("/description/:id", authenticateRoutes, async (req, res) => {
  const courseId = req.params.id;
  //   console.log(req.user)

  try {
    const response = await getCourseDescription(courseId);
    if (response) {
      res
        .status(200)
        .json({ details: response, msg: "Details fetched successfully" });
    } else {
      res.status(400).json({ msg: "Unable to fetch details" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});

// get courses of a specific teacher or seller

router.get("/teacher/:teacherId",authenticateRoutes, async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
    const response = await getCoursesOfSeller(teacherId);
    if (response) {
      return res
        .status(200)
        .json({ msg: "Fetched successfully", course: response });
    } else {
      return res
        .status(400)
        .json({ msg: "There are no course or some error occured" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createCourseDescription,
  getCourseDescription,
} = require("../models/CourseDescriptionModel");
const { authenticateRoutes } = require("../middleware/authentication");

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
    console.error(error)
  }
});

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
    console.error(error)
  }
});
module.exports = router;

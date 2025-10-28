const express = require("express");
const { getAllSectionOfCourse, createSectionOfCourse } = require("../models/CourseSectionModel");
const { authenticateRoutes } = require("../middleware/authentication");

const router = express.Router();
router.use(express.json({ limit: '50mb' }));

// get all section for a course

router.get("/section/:courseId", authenticateRoutes, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const response = await getAllSectionOfCourse(courseId);
    if (response) {
      res.status(200).json({
        msg: "Section fetched successfully",
        sections: response,
      });
    } else {
      res.status(400).json({ msg: "Failed to fetch" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});


//create a section for course

router.post("/section", authenticateRoutes, async (req, res) => {
  const data = req.body;
  console.log(data)
  try {
    const response = await createSectionOfCourse(data);
    if (response.affectedRows > 0) {
      res.status(200).json({ msg: "Section created successfully" });
    } else {
      res.status(400).json({ msg: "Failed to create section" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});


module.exports = router;
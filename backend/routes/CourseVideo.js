const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
  uploadVideoToCloud,
  getSignedVideoUrl,
} = require("../controllers/VideoUpload");
const { authenticateRoutes } = require("../middleware/authentication");
const { getAllVideosInfoOfCourse } = require("../models/CourseVideo");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/video/upload", upload.single("video"), uploadVideoToCloud);

// to get all the videos info of course
router.get("/video/:courseId", authenticateRoutes, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const response = await getAllVideosInfoOfCourse(courseId);
    if (response) {
      return res
        .status(200)
        .json({ msg: "Fetched successfully", videos: response });
    } else {
      return res
        .status(400)
        .json({ msg: "No video available or failed to fetch" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error.message });
    console.error(error);
  }
});

router.get(
  "/video/signed-url/:course_id/:video_id",
  authenticateRoutes,
  getSignedVideoUrl
);

module.exports = router;

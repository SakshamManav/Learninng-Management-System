const express = require("express");
const router = express.Router();
const { authenticateRoutes } = require("../middleware/authentication");
const db = require("../config/db");

router.post("/enrollment/enroll", authenticateRoutes, async (req, res) => {
  const userId = req.user.id;
  const courseId = req.body.courseId;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Already enrolled" });

    const sql = `INSERT INTO enrollment (user_id, course_id) VALUES (?, ?)`;
    const params = [userId, courseId];

    const [result] = await db.execute(sql, params);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        msg: "User enrolled successfully!",
        enrollmentId: result.insertId,
      });
    } else {
      return res.status(400).json({ msg: "Unable to enroll user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Some error occurred",
      err: error.message,
    });
  }
});

// Get all enrollments for a user

router.get("/enrollment/user", authenticateRoutes, async (req, res) => {
  const userId = req.user.id;

  try {
    const sql = `
      SELECT 
        e.*,
        c.title as course_title,
        c.description as course_description,
        c.thumbnail as course_thumbnail,
        c.price as course_price,
        c.instructor_id,
        c.category,
        c.level,
        u.name as instructor_name,
        u.username as instructor_username
      FROM enrollment e
      JOIN courses c ON e.course_id = c.id
      JOIN user u ON c.instructor_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `;
    
    const [enrollments] = await db.execute(sql, [userId]);
    
    res.status(200).json({
      msg: "Enrollments fetched successfully",
      enrollments: enrollments,
      count: enrollments.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Some error occurred",
      err: error.message,
    });
  }
});


//  Check if user is enrolled in a course
router.get("/enrollment/course/:courseId", authenticateRoutes, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  try {
    const sql = `SELECT * FROM enrollment WHERE course_id = ? AND user_id = ?`;
    const params = [courseId, userId];
    const [result] = await db.execute(sql, params);
    
    if (result.length > 0) {
      res.status(200).json({ 
        msg: "User is enrolled",
        isEnrolled: true,
        enrollment: result[0] 
      });
    } else {
      res.status(200).json({
        msg: "User is not enrolled",
        isEnrolled: false
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Some error occurred",
      err: error.message,
    });
  }
});




// Unenroll from a course

router.delete("/enrollment/course/:courseId", authenticateRoutes, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  try {
    // Check if user is enrolled
    const [existing] = await db.execute(
      "SELECT * FROM enrollment WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (existing.length === 0) {
      return res.status(400).json({ message: "User is not enrolled in this course" });
    }

    // Remove enrollment
    const sql = `DELETE FROM enrollment WHERE user_id = ? AND course_id = ?`;
    const [result] = await db.execute(sql, [userId, courseId]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        msg: "Successfully unenrolled from course"
      });
    } else {
      return res.status(400).json({ msg: "Unable to unenroll user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Some error occurred",
      err: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";
const { signup_user, login_user } = require("../models/Auth");
const authenticate = require("../middleware/authenticate");


router.post("/signup", authenticate, async (req, res) => {
  const data = req.body;

  try {
    const result = await signup_user(data);
    const payload = {
      name: data.username,
      email: data.email,
      role: data.role,
      profile_Picture: data.profile_Picture,
      bio: data.bio,
      contact: data.contact,
    };
    if (result.affectedRows > 0) {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({
        msg: "User created successfully",
        token: token,
        user: payload,
      });
    } else {
      res
        .status(400)
        .json({ msg: "User not created. Please check your data." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Some error occured", err: error });
  }
});

router.post("/login", authenticate, async (req, res) => {
  const data = req.body;
  try {
    const result = await login_user(data);
    if (result) {
      console.log(result);
      const payload = result;
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      res
        .status(200)
        .json({ token: token, msg: "Logged in successfully!!", user: payload });
    } else {
      res.status(400).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: "Some error occurred", err: error });
  }
});

module.exports = router;

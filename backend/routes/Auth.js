const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";
const { signup_user, login_user, checkUserExists } = require("../models/Auth");
const authenticate = require("../middleware/auth0Authenticate");

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
    console.error(error);
    res.status(500).json({ msg: "Some error occurred", err: error });
  }
});

router.get("/userexist/:email", authenticate, async (req, res) => {
  const email = req.params.email;
  try {
    const result = await checkUserExists(email);
    if (result) {
      res.status(200).json({ msg: "user exists", isExists: true });
    } else {
      res.status(404).json({ msg: "User does not exist", isExists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Some error occurred", err: error });
  }
});

module.exports = router;

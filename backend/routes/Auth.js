const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const JWT_SECRET = process.env.JWT_SECRET;
const { signup_user, login_user, checkUserExists, getProfileInfo, updateProfileInfo } = require("../models/Auth");
const authenticate = require("../middleware/auth0Authenticate");
const { authenticateRoutes } = require("../middleware/authentication");
const db = require('../config/db');
const { userProfileImage } = require("../controllers/CourseImageHandling");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/signup", authenticate, async (req, res) => {
  const data = req.body;
  console.log(data)
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
      const userId = result.insertId;
      payload.id = userId;
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
    if (error.message === 'USERNAME_EXISTS') {
      return res.status(400).json({ 
        msg: "Username already exists. Please choose another username.",
        error: "USERNAME_EXISTS"
      });
    }
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


router.get('/user/profile',authenticateRoutes,async (req,res)=>{
    try {
      const userId = req.user.id;
      const user  = await getProfileInfo(userId);
      if(user){
        res.status(201).json({msg:"User info fetched successfully", user:user});
      }else{
        res.status(400).json({msg:"Failed to fetch user info"})
      }

    } catch (error) {
       console.error(error);
    res.status(500).json({ msg: "Some error occurred", err: error });
    }
})


router.put('/user/profile/update',authenticateRoutes,async (req,res)=>{
  
  const userId = req.user.id;
  const data = req.body;
  console.log(data)
  try {
    const response = await updateProfileInfo(userId, data);
    console.log(response)
    if(response.affectedRows > 0){
      res.status(201).json({msg:"user updated successfully"});
    }else{
      res.status(400).json({msg:"user not updated either nothing was to change"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Some error occurred", err: error });
  }
})

router.put('/user/profile/image/update', authenticateRoutes, upload.single('image'), async (req,res)=>{
  const userId = req.user.id;
  console.log(userId)
  console.log(req.file)
  try {
    if(req.file){
      const profileImageUrl = await userProfileImage(req.file);
      const profile_Picture = profileImageUrl;
      const sql = `update user 
                set profile_Picture = ?
                where id = ?
    `
    const params = [profile_Picture, userId];
    const response = await db.execute(sql, params);
    console.log(response)
    if(response[0].affectedRows > 0){
      return res.status(200).json({msg:"Profile image updated successfully"});
    }else{
      return res.status(400).json({msg:"Failed to update image"});
    }
    }else{
      return res.status(400).json({msg:"Please provide image"})
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Some error occurred", err: error });
  }

})
module.exports = router;

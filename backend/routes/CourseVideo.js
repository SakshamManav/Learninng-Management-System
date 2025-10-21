const express = require('express')
const router = express.Router();
const multer  = require('multer');
const { uploadVideoToCloud, getSignedVideoUrl } = require('../controllers/VideoUpload');
const { authenticateRoutes } = require('../middleware/authentication');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/video/upload', upload.single('video'), uploadVideoToCloud);

router.get('/video/signed-url/:course_id/:video_id',authenticateRoutes, getSignedVideoUrl);

module.exports = router;
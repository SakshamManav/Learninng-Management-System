const { supabase } = require("../config/superbaseConfg");
const { storeVideoInfo, getVideoInfo } = require("../models/CourseVideo");
const { checkUserAccess } = require("./UserAccessToCourse");

async function uploadVideoToCloud(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    const uniqueName = `${Date.now()}-${file.originalname}`;

    const {
      section_id,
      title,
      video_url = `lectures/${uniqueName}`,
      duration,
      position,
      is_preview,
      resources,
    } = req.body;

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(`lectures/${uniqueName}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(`lectures/${uniqueName}`);

    const fileInfo = {
      section_id,
      title,
      video_url: `lectures/${uniqueName}`,
      duration,
      position,
      is_preview,
      resources,
      filename: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
    };

    const response = await storeVideoInfo(fileInfo);
    if (response.affectedRows > 0) {
      res.status(201).json({
        msg: "Video Uploaded Successfully",
        url: `lectures/${uniqueName}`,
      });
    } else {
      res.status(400).json({
        msg: "Failed to upload video",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




async function getSignedVideoUrl(req, res) {
  try {
    console.log(req.user)
    const course_id = req.params.course_id;
    const video_id = req.params.video_id;
    const userId = req.user.id;
    const hasAccess = false;
    const checkUserAccessresponse = await checkUserAccess(userId, course_id);
    if (!checkUserAccessresponse) {
      res
        .status(401)
        .json({ msg: "Unauthorized: You do not have access to this course." });
      hasAccess = true;
    }

    const videoCheckResponse = await getVideoInfo(video_id);
    if (!videoCheckResponse) {
      res.status(400).json({ msg: "Video not available" });
    }
    
    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUrl(videoCheckResponse.video_url, 3600); // expires in 1 hour

      // console.error(error)
    if (error) return res.status(500).send(error.message);

    res.status(200).json({ url: data.signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadVideoToCloud, getSignedVideoUrl };

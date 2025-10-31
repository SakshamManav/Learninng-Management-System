const { supabase } = require("../config/superbaseConfg");

const uploadCourseImage = async(file)=>{
    try {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
      .from("course_image")
      .upload(`course_thumbnail/${uniqueName}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    const { data: urlData } = supabase.storage
      .from("course_image")
      .getPublicUrl(`course_thumbnail/${uniqueName}`);

      return urlData.publicUrl;
    } catch (error) {
        throw error;
    }
}


const userProfileImage = async(file)=>{
  try {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
      .from("course_image")
      .upload(`profileImage/${uniqueName}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    const { data: urlData } = supabase.storage
      .from("course_image")
      .getPublicUrl(`profileImage/${uniqueName}`);

      return urlData.publicUrl;
    } catch (error) {
      console.error(error)
        throw error;
    }
}
module.exports = {uploadCourseImage, userProfileImage};
const db = require("../config/db");

async function storeVideoInfo(data) {
  const {
    section_id,
    course_id,
    title,
    video_url,
    duration,
    position,
    is_preview,
    resources,
    filename,
    mime_type,
    size,
  } = data;

  try {
    const sql = `INSERT INTO course_video(section_id, course_id, title,video_url, duration, position, is_preview, resources, filename,
    mime_type,
    size) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      section_id,
      course_id,
      title,
      video_url,
      duration ?? null,
      position,
      is_preview ?? null,
      resources ?? null,
      filename,
      mime_type,
      size,
    ];
    const [result] = await db.execute(sql, params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// To get specific video info

async function getVideoInfo(videoId) {
  try {
    const sql = `SELECT video_url, is_preview, section_id FROM course_video WHERE ID = ?`;
    const params = [videoId];
    const [result] = await db.execute(sql, params);
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// to get all video of course using course ID

async function getAllVideosInfoOfCourse(courseId) {
  try {
    const sql = `select * from course_video where course_id = ?`
    const params  = [courseId];

    const [result] = await db.execute(sql, params);
    if(result.length > 0){
      return result;
    }else{
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { storeVideoInfo, getVideoInfo, getAllVideosInfoOfCourse };

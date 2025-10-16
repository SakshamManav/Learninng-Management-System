const db = require("../config/db");

const getAllSectionOfCourse = async (courseId) => {
  try {
    const sql = `SELECT * FROM course_section where course_id = ? ORDER BY POSITION ASC`;
    const [result] = await db.execute(sql, [courseId]);

    if(result.length > 0){
        return result;
    }else{
        return null;
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createSectionOfCourse = async (data) => {
  const { course_id, title, position } = data;
  try {
    const sql = `INSERT INTO course_section (course_id, title, position) values (?, ?, ?)`;
    const params = [course_id, title, position];
    const [result] = await db.execute(sql, params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = {getAllSectionOfCourse, createSectionOfCourse};
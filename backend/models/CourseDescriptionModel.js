const db = require("../config/db");

const createCourseDescription = async (data) => {
  const {
    title,
    description,
    category,
    level,
    price,
    language,
    instructor_id,
    what_you_will_learn,
    requirements,
  } = data;

  try {
    const sql = `INSERT INTO courses(title, description, category, level, price, language, instructor_id, what_you_will_learn, requirements) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      title,
      description,
      category,
      level,
      price,
      language,
      instructor_id,
      what_you_will_learn,
      requirements,
    ];
    const [result] = await db.execute(sql, params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




const getCourseDescription = async (courseId) => {
  try {
    const sql = `SELECT * from courses where id = ?`;
    const [result] = await db.execute(sql, [courseId]);
    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {createCourseDescription, getCourseDescription};

const db = require("../config/db");



const getAllCourses = async (data) =>{
  try {
    const sql = ` SELECT 
        c.*, 
        u.username AS instructor_name
        
      FROM courses c
      JOIN user u 
        ON c.instructor_id = u.id`;
    const [result] = await db.execute(sql);
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
    const sql = `SELECT 
        c.*, 
        u.username AS instructor_name
      FROM courses c
      JOIN user u 
        ON c.instructor_id = u.id
      WHERE c.id = ?`;
    const [result] = await db.execute(sql, [courseId]);
    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const getCoursesOfSeller = async(teacherId)=>{
  try {
    const sql = `SELECT * FROM courses where instructor_id = ?`;
    const params = [teacherId];
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

module.exports = {createCourseDescription, getCourseDescription, getAllCourses, getCoursesOfSeller};

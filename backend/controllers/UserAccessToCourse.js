const db = require('../config/db')

async function checkUserAccess(userId, course_id){
    try {
        const sql = `SELECT * FROM enrollment where user_id = ? and course_id = ?`;
        const params = [userId, course_id];

        const result = await db.execute(sql, params);
        if(result.length > 0){
            return result[0];
        }else{
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {checkUserAccess}
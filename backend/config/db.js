const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "saksham12345",
  database: "lms",
});



module.exports = pool;

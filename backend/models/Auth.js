const db_pool = require("../config/db");

async function signup_user(data) {
  const {
    username,
    email,
    role,
    provider,
    provider_Id,
    profile_Picture = null,
    bio = null,
    isVerified = null,
    contact = null,
    social_links = null,
  } = data;

  try {
    const sql = `INSERT INTO user (username, email, role, provider, provider_Id, profile_Picture,bio, isVerified, contact, social_links)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      username,
      email,
      role,
      provider,
      provider_Id,
      profile_Picture,
      bio,
      isVerified,
      contact,
      social_links,
    ];
    const [result] = await db_pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function login_user(data) {
  const { email } = data;
  //   console.log(email)
  try {
    const sql = `Select id, username, email, role, profile_Picture,bio, contact from user where email = ?`;
    const [rows] = await db_pool.execute(sql, [email]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkUserExists(email) {
  try {
    const sql = `select username from user where email = ?`;
    const [rows] = await db_pool.execute(sql, [email]);
    // console.log(rows)
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
module.exports = { signup_user, login_user, checkUserExists };

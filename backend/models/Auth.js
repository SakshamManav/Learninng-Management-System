const db_pool = require("../config/db");

async function signup_user(data) {
  const {
    username,
    name,
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
    const sql = `INSERT INTO user (username, name, email, role, provider, provider_Id, profile_Picture, bio, isVerified, contact, social_links)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      username,
      name,
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
  try {
    const sql = `Select id, username, name, email, role, profile_Picture, bio, contact from user where email = ?`;
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
    const sql = `select username, name from user where email = ?`;
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

// Profile info
const getProfileInfo = async(userId) => {
    try {
      const sql = `select * from user where id = ?`;
      const params = [userId];
      const [result] = await db_pool.execute(sql, params);
      return result[0];
    } catch (error) {
       console.error(error);
       throw error;
    }
}

// Update profile info - Full update approach

const updateProfileInfo = async (userId, data) => {
  try {
    const {
      name,
      bio,
      contact,
      social_links,
    } = data;

    const sql = `
      UPDATE user 
      SET name = ?, 
          bio = ?, 
          contact = ?, 
          social_links = ?
      WHERE id = ?
    `;
    
    const params = [
      name || null,
      bio || null,
      contact || null,
      social_links ? JSON.stringify(social_links) : null,
      userId
    ];

    const [result] = await db_pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

module.exports = { 
  signup_user, 
  login_user, 
  checkUserExists, 
  getProfileInfo,
  updateProfileInfo
};

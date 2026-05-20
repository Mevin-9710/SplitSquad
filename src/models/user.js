import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

export function createUser({ email, passwordHash, name, googleId, avatarUrl }) {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    db.run(
      `INSERT INTO users (id, email, password_hash, name, google_id, avatar_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, email || null, passwordHash || null, name, googleId || null, avatarUrl || null, createdAt]
    );
    logger.debug('Created user', { id, email, name });
    return { id, email, name, googleId, avatarUrl, createdAt };
  } catch (error) {
    logger.error('Failed to create user', { error: error.message });
    throw error;
  }
}

export function findUserByEmail(email) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, email, password_hash, name, google_id, avatar_url, created_at, last_login
       FROM users WHERE email = ?`,
      [email]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to find user by email', { error: error.message });
    throw error;
  }
}

export function findUserByGoogleId(googleId) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, email, password_hash, name, google_id, avatar_url, created_at, last_login
       FROM users WHERE google_id = ?`,
      [googleId]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to find user by Google ID', { error: error.message });
    throw error;
  }
}

export function findUserById(id) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, email, password_hash, name, google_id, avatar_url, created_at, last_login
       FROM users WHERE id = ?`,
      [id]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to find user by ID', { error: error.message });
    throw error;
  }
}

export function updateLastLogin(id) {
  const db = getDatabase();

  try {
    db.run(`UPDATE users SET last_login = ? WHERE id = ?`, [new Date().toISOString(), id]);
    return true;
  } catch (error) {
    logger.error('Failed to update last login', { error: error.message });
    throw error;
  }
}

export function updateUserProfile(id, { name, avatarUrl }) {
  const db = getDatabase();

  try {
    if (name) db.run(`UPDATE users SET name = ? WHERE id = ?`, [name, id]);
    if (avatarUrl !== undefined) db.run(`UPDATE users SET avatar_url = ? WHERE id = ?`, [avatarUrl, id]);
    return true;
  } catch (error) {
    logger.error('Failed to update user profile', { error: error.message });
    throw error;
  }
}

export function linkGoogleAccount(userId, googleId, avatarUrl) {
  const db = getDatabase();

  try {
    db.run(`UPDATE users SET google_id = ?, avatar_url = COALESCE(?, avatar_url) WHERE id = ?`, [googleId, avatarUrl, userId]);
    return true;
  } catch (error) {
    logger.error('Failed to link Google account', { error: error.message });
    throw error;
  }
}

function objectFromRow(columns, values) {
  const obj = {};
  columns.forEach((col, i) => {
    obj[col] = values[i];
  });
  return obj;
}

export default {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateLastLogin,
  updateUserProfile,
  linkGoogleAccount,
};

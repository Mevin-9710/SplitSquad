import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

export function addUpiProfile(userId, upiId, label = 'UPI') {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const existing = db.exec(
      `SELECT COUNT(*) as cnt FROM user_profiles WHERE user_id = ? AND upi_id = ?`,
      [userId, upiId]
    );

    if (existing.length > 0 && existing[0].values[0][0] > 0) {
      throw new Error('UPI ID already exists');
    }

    const isFirst = db.exec(
      `SELECT COUNT(*) as cnt FROM user_profiles WHERE user_id = ?`,
      [userId]
    );

    const isDefault = (isFirst.length > 0 && isFirst[0].values[0][0] === 0) ? 1 : 0;

    db.run(
      `INSERT INTO user_profiles (id, user_id, upi_id, label, is_default, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, upiId, label, isDefault, createdAt]
    );

    logger.debug('Added UPI profile', { id, userId, upiId, label });
    return { id, userId, upiId, label, isDefault: !!isDefault, createdAt };
  } catch (error) {
    logger.error('Failed to add UPI profile', { error: error.message });
    throw error;
  }
}

export function getUpiProfiles(userId) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, user_id, upi_id, label, is_default, created_at
       FROM user_profiles
       WHERE user_id = ?
       ORDER BY is_default DESC, created_at ASC`,
      [userId]
    );

    if (result.length === 0) return [];
    return result[0].values.map((row) => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get UPI profiles', { error: error.message });
    throw error;
  }
}

export function getDefaultUpiProfile(userId) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, user_id, upi_id, label, is_default, created_at
       FROM user_profiles
       WHERE user_id = ? AND is_default = 1
       LIMIT 1`,
      [userId]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to get default UPI profile', { error: error.message });
    throw error;
  }
}

export function setUpiProfileAsDefault(id, userId) {
  const db = getDatabase();

  try {
    db.run(`UPDATE user_profiles SET is_default = 0 WHERE user_id = ?`, [userId]);
    db.run(`UPDATE user_profiles SET is_default = 1 WHERE id = ? AND user_id = ?`, [id, userId]);
    logger.debug('Set UPI profile as default', { id, userId });
    return true;
  } catch (error) {
    logger.error('Failed to set default UPI profile', { error: error.message });
    throw error;
  }
}

export function deleteUpiProfile(id, userId) {
  const db = getDatabase();

  try {
    const profile = db.exec(
      `SELECT is_default FROM user_profiles WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (profile.length === 0 || profile[0].values.length === 0) {
      throw new Error('Profile not found');
    }

    db.run(`DELETE FROM user_profiles WHERE id = ? AND user_id = ?`, [id, userId]);

    if (profile[0].values[0][0] === 1) {
      const remaining = db.exec(
        `SELECT id FROM user_profiles WHERE user_id = ? LIMIT 1`,
        [userId]
      );
      if (remaining.length > 0 && remaining[0].values.length > 0) {
        db.run(`UPDATE user_profiles SET is_default = 1 WHERE id = ?`, [remaining[0].values[0][0]]);
      }
    }

    logger.debug('Deleted UPI profile', { id, userId });
    return true;
  } catch (error) {
    logger.error('Failed to delete UPI profile', { error: error.message });
    throw error;
  }
}

export function updateUpiProfileLabel(id, userId, label) {
  const db = getDatabase();

  try {
    db.run(`UPDATE user_profiles SET label = ? WHERE id = ? AND user_id = ?`, [label, id, userId]);
    logger.debug('Updated UPI profile label', { id, userId, label });
    return true;
  } catch (error) {
    logger.error('Failed to update UPI profile label', { error: error.message });
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
  addUpiProfile,
  getUpiProfiles,
  getDefaultUpiProfile,
  setUpiProfileAsDefault,
  deleteUpiProfile,
  updateUpiProfileLabel,
};

import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

export function addUpiProfile(creatorId, upiId, label = 'UPI') {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const existing = db.exec(
      `SELECT COUNT(*) as cnt FROM user_profiles WHERE creator_id = ? AND upi_id = ?`,
      [creatorId, upiId]
    );

    if (existing.length > 0 && existing[0].values[0][0] > 0) {
      throw new Error('UPI ID already exists');
    }

    const isFirst = db.exec(
      `SELECT COUNT(*) as cnt FROM user_profiles WHERE creator_id = ?`,
      [creatorId]
    );

    const isDefault = (isFirst.length > 0 && isFirst[0].values[0][0] === 0) ? 1 : 0;

    db.run(
      `INSERT INTO user_profiles (id, creator_id, upi_id, label, is_default, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, creatorId, upiId, label, isDefault, createdAt]
    );

    logger.debug('Added UPI profile', { id, creatorId, upiId, label });
    return { id, creatorId, upiId, label, isDefault: !!isDefault, createdAt };
  } catch (error) {
    logger.error('Failed to add UPI profile', { error: error.message });
    throw error;
  }
}

export function getUpiProfiles(creatorId) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, creator_id, upi_id, label, is_default, created_at
       FROM user_profiles
       WHERE creator_id = ?
       ORDER BY is_default DESC, created_at ASC`,
      [creatorId]
    );

    if (result.length === 0) return [];
    return result[0].values.map((row) => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get UPI profiles', { error: error.message });
    throw error;
  }
}

export function getDefaultUpiProfile(creatorId) {
  const db = getDatabase();

  try {
    const result = db.exec(
      `SELECT id, creator_id, upi_id, label, is_default, created_at
       FROM user_profiles
       WHERE creator_id = ? AND is_default = 1
       LIMIT 1`,
      [creatorId]
    );

    if (result.length === 0 || result[0].values.length === 0) return null;
    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to get default UPI profile', { error: error.message });
    throw error;
  }
}

export function setUpiProfileAsDefault(id, creatorId) {
  const db = getDatabase();

  try {
    db.run(`UPDATE user_profiles SET is_default = 0 WHERE creator_id = ?`, [creatorId]);
    db.run(`UPDATE user_profiles SET is_default = 1 WHERE id = ? AND creator_id = ?`, [id, creatorId]);
    logger.debug('Set UPI profile as default', { id, creatorId });
    return true;
  } catch (error) {
    logger.error('Failed to set default UPI profile', { error: error.message });
    throw error;
  }
}

export function deleteUpiProfile(id, creatorId) {
  const db = getDatabase();

  try {
    const profile = db.exec(
      `SELECT is_default FROM user_profiles WHERE id = ? AND creator_id = ?`,
      [id, creatorId]
    );

    if (profile.length === 0 || profile[0].values.length === 0) {
      throw new Error('Profile not found');
    }

    db.run(`DELETE FROM user_profiles WHERE id = ? AND creator_id = ?`, [id, creatorId]);

    if (profile[0].values[0][0] === 1) {
      const remaining = db.exec(
        `SELECT id FROM user_profiles WHERE creator_id = ? LIMIT 1`,
        [creatorId]
      );
      if (remaining.length > 0 && remaining[0].values.length > 0) {
        db.run(`UPDATE user_profiles SET is_default = 1 WHERE id = ?`, [remaining[0].values[0][0]]);
      }
    }

    logger.debug('Deleted UPI profile', { id, creatorId });
    return true;
  } catch (error) {
    logger.error('Failed to delete UPI profile', { error: error.message });
    throw error;
  }
}

export function updateUpiProfileLabel(id, creatorId, label) {
  const db = getDatabase();

  try {
    db.run(`UPDATE user_profiles SET label = ? WHERE id = ? AND creator_id = ?`, [label, id, creatorId]);
    logger.debug('Updated UPI profile label', { id, creatorId, label });
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

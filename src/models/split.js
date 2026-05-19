import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

export function createSplit(description, totalAmount, createdBy) {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    db.run(
      `INSERT INTO splits (id, description, total_amount, created_by, created_at, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [id, description, totalAmount, createdBy, createdAt]
    );
    logger.debug('Created new split', { id, totalAmount, createdBy });
    return id;
  } catch (error) {
    logger.error('Failed to create split', { error: error.message });
    throw error;
  }
}

export function getSplitById(id, createdBy = null) {
  const db = getDatabase();

  try {
    const where = createdBy ? 'WHERE id = ? AND created_by = ?' : 'WHERE id = ?';
    const params = createdBy ? [id, createdBy] : [id];

    const splitResult = db.exec(
      `SELECT id, description, total_amount, created_by, created_at, status
       FROM splits ${where}`,
      params
    );

    if (splitResult.length === 0 || splitResult[0].values.length === 0) return null;

    const split = objectFromRow(splitResult[0].columns, splitResult[0].values[0]);
    const participantsResult = db.exec(
      `SELECT id, split_id, name, phone, amount, settled, settled_at
       FROM participants WHERE split_id = ? ORDER BY rowid`,
      [id]
    );

    const participants = participantsResult.length > 0
      ? participantsResult[0].values.map((row) => objectFromRow(participantsResult[0].columns, row))
      : [];

    return { ...split, participants };
  } catch (error) {
    logger.error('Failed to get split by ID', { id, error: error.message });
    throw error;
  }
}

export function getRecentSplits(limit = 20, createdBy = null) {
  const db = getDatabase();

  try {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 20;
    const where = createdBy ? 'WHERE created_by = ?' : '';
    const params = createdBy ? [createdBy] : [];
    const splitsResult = db.exec(
      `SELECT id, description, total_amount, created_by, created_at, status
       FROM splits ${where}
       ORDER BY created_at DESC
       LIMIT ${safeLimit}`,
      params
    );

    if (splitsResult.length === 0) return [];

    const splits = splitsResult[0].values.map((row) => objectFromRow(splitsResult[0].columns, row));
    return splits.map((split) => {
      const participantsResult = db.exec(
        `SELECT id, split_id, name, phone, amount, settled, settled_at
         FROM participants WHERE split_id = ?`,
        [split.id]
      );

      const participants = participantsResult.length > 0
        ? participantsResult[0].values.map((row) => objectFromRow(participantsResult[0].columns, row))
        : [];

      return { ...split, participants };
    });
  } catch (error) {
    logger.error('Failed to get recent splits', { error: error.message });
    throw error;
  }
}

export function getHistoryByPhone(phone) {
  const db = getDatabase();

  try {
    const splitsResult = db.exec(
      `SELECT DISTINCT s.id, s.description, s.total_amount, s.created_by, s.created_at, s.status
       FROM splits s
       LEFT JOIN participants p ON s.id = p.split_id
       WHERE s.created_by = ? OR p.phone = ?
       ORDER BY s.created_at DESC
       LIMIT 50`,
      [phone, phone]
    );

    if (splitsResult.length === 0) return [];

    const splits = splitsResult[0].values.map((row) => objectFromRow(splitsResult[0].columns, row));
    return splits.map((split) => {
      const participantsResult = db.exec(
        `SELECT id, split_id, name, phone, amount, settled, settled_at
         FROM participants WHERE split_id = ?`,
        [split.id]
      );

      const participants = participantsResult.length > 0
        ? participantsResult[0].values.map((row) => objectFromRow(participantsResult[0].columns, row))
        : [];
      return { ...split, participants };
    });
  } catch (error) {
    logger.error('Failed to get history by phone', { phone, error: error.message });
    throw error;
  }
}

export function updateSplitStatus(id, status) {
  const db = getDatabase();
  try {
    db.run(`UPDATE splits SET status = ? WHERE id = ?`, [status, id]);
    return true;
  } catch (error) {
    logger.error('Failed to update split status', { id, status, error: error.message });
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
  createSplit,
  getSplitById,
  getRecentSplits,
  getHistoryByPhone,
  updateSplitStatus,
};

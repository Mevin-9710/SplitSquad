import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

/**
 * Split Model - CRUD operations for bill splits
 *
 * All amounts are stored as integers in paise (45000 = ₹450)
 */

/**
 * Create a new bill split
 * @param {string} description - Description of the split
 * @param {number} totalAmount - Total amount in paise
 * @param {string} createdBy - Phone number of creator
 * @returns {string} - The created split ID
 */
export function createSplit(description, totalAmount, createdBy) {
  const db = getDatabase();
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    db.run(`
      INSERT INTO splits (id, description, total_amount, created_by, created_at, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `, [id, description, totalAmount, createdBy, createdAt]);
    logger.debug('Created new split', { id, description, totalAmount, createdBy });
    return id;
  } catch (error) {
    logger.error('Failed to create split', { error: error.message });
    throw error;
  }
}

/**
 * Get a split by ID with all participants
 * @param {string} id - Split ID
 * @returns {Object|null} - Split object with participants array
 */
export function getSplitById(id) {
  const db = getDatabase();

  try {
    const splitResult = db.exec(`
      SELECT id, description, total_amount, created_by, created_at, status
      FROM splits
      WHERE id = ?
    `, [id]);

    if (splitResult.length === 0 || splitResult[0].values.length === 0) {
      return null;
    }

    const columns = splitResult[0].columns;
    const split = objectFromRow(columns, splitResult[0].values[0]);

    const participantsResult = db.exec(`
      SELECT id, split_id, name, phone, amount, settled, settled_at
      FROM participants
      WHERE split_id = ?
      ORDER BY rowid
    `, [id]);

    const participants = participantsResult.length > 0
      ? participantsResult[0].values.map(row => objectFromRow(participantsResult[0].columns, row))
      : [];

    return {
      ...split,
      participants,
    };
  } catch (error) {
    logger.error('Failed to get split by ID', { id, error: error.message });
    throw error;
  }
}

/**
 * Get split history for a phone number
 * @param {string} phone - Phone number
 * @returns {Array} - Array of split objects with participants
 */
export function getHistoryByPhone(phone) {
  const db = getDatabase();

  try {
    const splitsResult = db.exec(`
      SELECT DISTINCT s.id, s.description, s.total_amount, s.created_by, s.created_at, s.status
      FROM splits s
      LEFT JOIN participants p ON s.id = p.split_id
      WHERE s.created_by = ? OR p.phone = ?
      ORDER BY s.created_at DESC
      LIMIT 50
    `, [phone, phone]);

    if (splitsResult.length === 0) {
      return [];
    }

    const columns = splitsResult[0].columns;
    const splits = splitsResult[0].values.map(row => objectFromRow(columns, row));

    // Get participants for each split
    return splits.map(split => {
      const participantsResult = db.exec(`
        SELECT id, split_id, name, phone, amount, settled, settled_at
        FROM participants
        WHERE split_id = ?
      `, [split.id]);

      const participants = participantsResult.length > 0
        ? participantsResult[0].values.map(row => objectFromRow(participantsResult[0].columns, row))
        : [];

      return { ...split, participants };
    });
  } catch (error) {
    logger.error('Failed to get history by phone', { phone, error: error.message });
    throw error;
  }
}

/**
 * Update split status
 * @param {string} id - Split ID
 * @param {string} status - New status (active, completed, cancelled)
 * @returns {boolean} - Success status
 */
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

/**
 * Helper to convert sql.js result row to object
 */
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
  getHistoryByPhone,
  updateSplitStatus,
};
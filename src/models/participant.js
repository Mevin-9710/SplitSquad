import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

/**
 * Participant Model - CRUD operations for split participants
 *
 * All amounts are stored as integers in paise (45000 = ₹450)
 */

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

/**
 * Add a participant to a split
 * @param {string} splitId - Split ID
 * @param {string} name - Participant name
 * @param {string} phone - Participant phone number
 * @param {number} amount - Amount in paise
 * @returns {string} - The created participant ID
 */
export function addParticipant(splitId, name, phone, amount) {
  const db = getDatabase();
  const id = uuidv4();

  try {
    db.run(`
      INSERT INTO participants (id, split_id, name, phone, amount, settled)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [id, splitId, name, phone, amount]);
    logger.debug('Added participant to split', { id, splitId, name, phone, amount });
    return id;
  } catch (error) {
    logger.error('Failed to add participant', { error: error.message });
    throw error;
  }
}

/**
 * Get all participants for a split
 * @param {string} splitId - Split ID
 * @returns {Array} - Array of participant objects
 */
export function getParticipantsBySplitId(splitId) {
  const db = getDatabase();

  try {
    const result = db.exec(`
      SELECT id, split_id, name, phone, amount, settled, settled_at
      FROM participants
      WHERE split_id = ?
      ORDER BY rowid
    `, [splitId]);

    if (result.length === 0) {
      return [];
    }

    return result[0].values.map(row => objectFromRow(result[0].columns, row));
  } catch (error) {
    logger.error('Failed to get participants by split ID', { splitId, error: error.message });
    throw error;
  }
}

/**
 * Update participant settled status
 * @param {string} id - Participant ID
 * @returns {boolean} - Success status
 */
export function updateSettled(id) {
  const db = getDatabase();
  const settledAt = new Date().toISOString();

  try {
    db.run(`
      UPDATE participants
      SET settled = 1, settled_at = ?
      WHERE id = ?
    `, [settledAt, id]);
    logger.debug('Marked participant as settled', { id });
    return true;
  } catch (error) {
    logger.error('Failed to update settled status', { id, error: error.message });
    throw error;
  }
}

/**
 * Get total allocated amount for a split
 * @param {string} splitId - Split ID
 * @returns {number} - Total amount in paise
 */
export function getTotalAllocated(splitId) {
  const db = getDatabase();

  try {
    const result = db.exec(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM participants
      WHERE split_id = ?
    `, [splitId]);

    if (result.length === 0 || result[0].values.length === 0) {
      return 0;
    }

    return result[0].values[0][0];
  } catch (error) {
    logger.error('Failed to get total allocated', { splitId, error: error.message });
    throw error;
  }
}

/**
 * Remove a participant from a split
 * @param {string} id - Participant ID
 * @returns {boolean} - Success status
 */
export function removeParticipant(id) {
  const db = getDatabase();

  try {
    db.run(`DELETE FROM participants WHERE id = ?`, [id]);
    logger.debug('Removed participant', { id });
    return true;
  } catch (error) {
    logger.error('Failed to remove participant', { id, error: error.message });
    throw error;
  }
}

export default {
  addParticipant,
  getParticipantsBySplitId,
  updateSettled,
  getTotalAllocated,
  removeParticipant,
};
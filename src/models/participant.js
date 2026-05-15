import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

/**
 * Participant Model - CRUD operations for split participants
 *
 * All amounts are stored as integers in paise (45000 = ₹450)
 */

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

  const stmt = db.prepare(`
    INSERT INTO participants (id, split_id, name, phone, amount, settled)
    VALUES (?, ?, ?, ?, ?, 0)
  `);

  try {
    stmt.run(id, splitId, name, phone, amount);
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
  const stmt = db.prepare(`
    SELECT id, split_id, name, phone, amount, settled, settled_at
    FROM participants
    WHERE split_id = ?
    ORDER BY rowid
  `);

  try {
    return stmt.all(splitId);
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
  const stmt = db.prepare(`
    UPDATE participants
    SET settled = 1, settled_at = ?
    WHERE id = ?
  `);

  try {
    const result = stmt.run(settledAt, id);
    logger.debug('Marked participant as settled', { id });
    return result.changes > 0;
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
  const stmt = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM participants
    WHERE split_id = ?
  `);

  try {
    const result = stmt.get(splitId);
    return result.total;
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
  const stmt = db.prepare(`DELETE FROM participants WHERE id = ?`);

  try {
    const result = stmt.run(id);
    logger.debug('Removed participant', { id });
    return result.changes > 0;
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
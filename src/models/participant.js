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
 * @param {string} verificationCode - Unique verification code
 * @returns {string} - The created participant ID
 */
export function addParticipant(splitId, name, phone, amount, verificationCode = null) {
  const db = getDatabase();
  const id = uuidv4();

  try {
    db.run(`
      INSERT INTO participants (id, split_id, name, phone, amount, settled, verification_code, participant_verified)
      VALUES (?, ?, ?, ?, ?, 0, ?, 0)
    `, [id, splitId, name, phone, amount, verificationCode]);
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
      SELECT id, split_id, name, phone, amount, settled, settled_at, verification_code, participant_verified
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

/**
 * Get participant by verification code
 * @param {string} code - Verification code
 * @returns {object|null} - Participant object or null
 */
export function getParticipantByVerificationCode(code) {
  const db = getDatabase();

  try {
    const result = db.exec(`
      SELECT p.id, p.split_id, p.name, p.phone, p.amount, p.settled, p.settled_at, p.verification_code, p.participant_verified,
             s.description as split_description, s.total_amount as split_total, s.payment_mode, s.merchant_upi_id, s.merchant_name, s.merchant_currency, s.created_by
      FROM participants p
      JOIN splits s ON p.split_id = s.id
      WHERE p.verification_code = ?
    `, [code]);

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    return objectFromRow(result[0].columns, result[0].values[0]);
  } catch (error) {
    logger.error('Failed to get participant by verification code', { code, error: error.message });
    throw error;
  }
}

/**
 * Mark participant as verified (one-way, single-use)
 * @param {string} id - Participant ID
 * @returns {object} - { success: boolean, alreadyVerified: boolean }
 */
export function markParticipantVerified(id) {
  const db = getDatabase();

  try {
    const checkResult = db.exec(`
      SELECT participant_verified FROM participants WHERE id = ?
    `, [id]);

    if (checkResult.length === 0 || checkResult[0].values.length === 0) {
      return { success: false, alreadyVerified: false, notFound: true };
    }

    const alreadyVerified = checkResult[0].values[0][0] === 1;
    if (alreadyVerified) {
      return { success: false, alreadyVerified: true };
    }

    const verifiedAt = new Date().toISOString();
    db.run(`
      UPDATE participants
      SET participant_verified = 1, settled = 1, settled_at = ?
      WHERE id = ?
    `, [verifiedAt, id]);

    logger.debug('Marked participant as verified', { id });
    return { success: true, alreadyVerified: false };
  } catch (error) {
    logger.error('Failed to mark participant as verified', { id, error: error.message });
    throw error;
  }
}

export default {
  addParticipant,
  getParticipantsBySplitId,
  updateSettled,
  getTotalAllocated,
  removeParticipant,
  getParticipantByVerificationCode,
  markParticipantVerified,
};
import { getDatabase } from '../database/connection.js';
import logger from '../utils/logger.js';

/**
 * Session Model - CRUD operations for WhatsApp session state
 *
 * Session states: IDLE, AWAITING_AMOUNT, AWAITING_DESC, AWAITING_PARTICIPANTS, DONE
 * temp_data is stored as JSON string
 */

/**
 * Get session by phone number
 * @param {string} phone - Phone number
 * @returns {Object|null} - Session object or null
 */
export function getSession(phone) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT phone, state, current_split_id, temp_data, updated_at
    FROM sessions
    WHERE phone = ?
  `);

  try {
    const session = stmt.get(phone);

    if (session && session.temp_data) {
      try {
        session.temp_data = JSON.parse(session.temp_data);
      } catch {
        session.temp_data = {};
      }
    }

    return session;
  } catch (error) {
    logger.error('Failed to get session', { phone, error: error.message });
    throw error;
  }
}

/**
 * Get session state for a phone number
 * @param {string} phone - Phone number
 * @returns {string} - Session state (defaults to 'IDLE')
 */
export function getSessionState(phone) {
  const session = getSession(phone);
  return session ? session.state : 'IDLE';
}

/**
 * Upsert session (insert or update)
 * @param {string} phone - Phone number
 * @param {string} state - Session state
 * @param {string|null} currentSplitId - Current split ID
 * @param {Object} tempData - Temporary data object
 * @returns {boolean} - Success status
 */
export function setSession(phone, state, currentSplitId = null, tempData = {}) {
  const db = getDatabase();
  const updatedAt = new Date().toISOString();
  const tempDataStr = JSON.stringify(tempData);

  const stmt = db.prepare(`
    INSERT INTO sessions (phone, state, current_split_id, temp_data, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(phone) DO UPDATE SET
      state = excluded.state,
      current_split_id = excluded.current_split_id,
      temp_data = excluded.temp_data,
      updated_at = excluded.updated_at
  `);

  try {
    stmt.run(phone, state, currentSplitId, tempDataStr, updatedAt);
    logger.debug('Updated session', { phone, state, currentSplitId });
    return true;
  } catch (error) {
    logger.error('Failed to set session', { phone, state, error: error.message });
    throw error;
  }
}

/**
 * Clear session (delete)
 * @param {string} phone - Phone number
 * @returns {boolean} - Success status
 */
export function clearSession(phone) {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM sessions WHERE phone = ?`);

  try {
    const result = stmt.run(phone);
    logger.debug('Cleared session', { phone });
    return result.changes > 0;
  } catch (error) {
    logger.error('Failed to clear session', { phone, error: error.message });
    throw error;
  }
}

/**
 * Update session temp_data only
 * @param {string} phone - Phone number
 * @param {Object} tempData - New temp data object
 * @returns {boolean} - Success status
 */
export function updateTempData(phone, tempData) {
  const session = getSession(phone);
  if (!session) {
    return false;
  }
  return setSession(phone, session.state, session.current_split_id, tempData);
}

export default {
  getSession,
  getSessionState,
  setSession,
  clearSession,
  updateTempData,
};
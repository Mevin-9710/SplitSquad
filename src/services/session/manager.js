import { getSession, setSession, clearSession } from '../../models/session.js';
import logger from '../../utils/logger.js';

/**
 * Session State Machine
 *
 * Manages the multi-step conversation flow for creating bill splits:
 * IDLE -> AWAITING_AMOUNT -> AWAITING_DESC -> AWAITING_PARTICIPANTS -> DONE
 *
 * States:
 * - IDLE: No active session, ready for commands
 * - AWAITING_AMOUNT: Waiting for total bill amount
 * - AWAITING_DESC: Waiting for bill description
 * - AWAITING_PARTICIPANTS: Waiting for participant list
 * - DONE: Split created successfully
 */

// State constants
export const State = {
  IDLE: 'IDLE',
  AWAITING_AMOUNT: 'AWAITING_AMOUNT',
  AWAITING_DESC: 'AWAITING_DESC',
  AWAITING_PARTICIPANTS: 'AWAITING_PARTICIPANTS',
  DONE: 'DONE',
};

// Valid commands that work in IDLE state
const IDLE_COMMANDS = ['!new', '!history', '!help', '!cancel'];

/**
 * Get current state for a phone
 * @param {string} phone - Phone number
 * @returns {string} - Current state
 */
export function getCurrentState(phone) {
  const session = getSession(phone);
  return session ? session.state : State.IDLE;
}

/**
 * Get session data for a phone
 * @param {string} phone - Phone number
 * @returns {Object} - Session temp_data or empty object
 */
export function getSessionData(phone) {
  const session = getSession(phone);
  return session ? (session.temp_data || {}) : {};
}

/**
 * Transition to a new state
 * @param {string} phone - Phone number
 * @param {string} newState - New state to transition to
 * @param {Object} dataUpdate - Optional data to merge/update
 * @returns {Object} - Updated session
 */
export function transitionTo(phone, newState, dataUpdate = null) {
  const currentData = getSessionData(phone);
  const updatedData = dataUpdate
    ? { ...currentData, ...dataUpdate }
    : currentData;

  setSession(phone, newState, null, updatedData);
  logger.debug('Session state transition', { phone, from: getCurrentState(phone), to: newState });

  return updatedData;
}

/**
 * Process user input based on current state
 * Returns { action: string, data: Object, response: string }
 * @param {string} phone - Phone number
 * @param {string} input - User input text
 * @returns {Object} - Processing result
 */
export function processInput(phone, input) {
  const state = getCurrentState(phone);
  const trimmedInput = input.trim();

  // Check for commands in IDLE state
  if (state === State.IDLE) {
    if (IDLE_COMMANDS.includes(trimmedInput.toLowerCase())) {
      return { action: 'COMMAND', command: trimmedInput.toLowerCase() };
    }
    return { action: 'UNKNOWN', response: 'Unknown command. Type !help for available commands.' };
  }

  // Handle input based on current state
  switch (state) {
    case State.AWAITING_AMOUNT:
      return handleAmountInput(phone, trimmedInput);

    case State.AWAITING_DESC:
      return handleDescInput(phone, trimmedInput);

    case State.AWAITING_PARTICIPANTS:
      return handleParticipantInput(phone, trimmedInput);

    case State.DONE:
      // After done, reset to IDLE for next command
      clearSession(phone);
      return { action: 'RESET', response: 'Session cleared. Type !new to start a new split.' };

    default:
      logger.warn('Unknown state', { phone, state });
      clearSession(phone);
      return { action: 'RESET', response: 'Session error. Please type !new to start again.' };
  }
}

/**
 * Handle amount input (expects number in rupees, converts to paise)
 * @param {string} phone - Phone number
 * @param {string} input - Amount input
 * @returns {Object} - Processing result
 */
function handleAmountInput(phone, input) {
  // Remove common currency symbols and commas
  const cleanedInput = input.replace(/[₹,]/g, '').trim();

  const amount = parseFloat(cleanedInput);

  if (isNaN(amount) || amount <= 0) {
    return {
      action: 'INVALID_INPUT',
      response: 'Invalid amount. Please enter a positive number (e.g., 450 or 1250.50)',
    };
  }

  // Convert to paise (integer)
  const amountInPaise = Math.round(amount * 100);

  transitionTo(phone, State.AWAITING_DESC, { amount: amountInPaise });

  return {
    action: 'STATE_CHANGE',
    newState: State.AWAITING_DESC,
    response: `Amount set to ₹${(amountInPaise / 100).toFixed(2)}\n\nNow enter a description for this split:`,
  };
}

/**
 * Handle description input
 * @param {string} phone - Phone number
 * @param {string} input - Description text
 * @returns {Object} - Processing result
 */
function handleDescInput(phone, input) {
  if (input.length < 3) {
    return {
      action: 'INVALID_INPUT',
      response: 'Description too short. Please enter at least 3 characters:',
    };
  }

  if (input.length > 200) {
    return {
      action: 'INVALID_INPUT',
      response: 'Description too long. Please keep it under 200 characters:',
    };
  }

  transitionTo(phone, State.AWAITING_PARTICIPANTS, { description: input });

  return {
    action: 'STATE_CHANGE',
    newState: State.AWAITING_PARTICIPANTS,
    response: `Description: "${input}"\n\nNow add participants.\n\nFormat: "Name,Amount" (one per line)\nExample:\nRaj,100\nPriya,150\n\nOr type "equal" to split equally among listed people,\nor "done" when finished adding participants.`,
  };
}

/**
 * Handle participant input
 * Supports:
 * - "Name,Amount" format
 * - "equal" to split remaining equally
 * - "done" to finalize
 * @param {string} phone - Phone number
 * @param {string} input - Input text
 * @returns {Object} - Processing result
 */
function handleParticipantInput(phone, input) {
  const lowerInput = input.toLowerCase().trim();

  // Handle "equal" command
  if (lowerInput === 'equal') {
    return { action: 'EQUAL_SPLIT' };
  }

  // Handle "done" command
  if (lowerInput === 'done') {
    const data = getSessionData(phone);
    if (!data.participants || data.participants.length === 0) {
      return {
        action: 'INVALID_INPUT',
        response: 'Please add at least one participant before finishing.',
      };
    }
    return { action: 'DONE' };
  }

  // Handle "cancel" command
  if (lowerInput === '!cancel') {
    clearSession(phone);
    return { action: 'CANCEL' };
  }

  // Parse participant format "Name,Amount"
  return parseParticipantEntry(phone, input);
}

/**
 * Parse a participant entry in "Name,Amount" format
 * @param {string} phone - Phone number
 * @param {string} input - Input text
 * @returns {Object} - Processing result
 */
function parseParticipantEntry(phone, input) {
  // Support multiple entries separated by newlines
  const lines = input.split('\n').map(l => l.trim()).filter(l => l);
  const results = [];
  const errors = [];

  for (const line of lines) {
    const commaIndex = line.lastIndexOf(',');

    if (commaIndex === -1) {
      errors.push(`Invalid format: "${line}". Use "Name,Amount"`);
      continue;
    }

    const name = line.slice(0, commaIndex).trim();
    const amountStr = line.slice(commaIndex + 1).trim().replace(/[₹,]/g, '');

    if (!name || name.length < 1) {
      errors.push(`Missing name: "${line}"`);
      continue;
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount < 0) {
      errors.push(`Invalid amount for "${name}": "${amountStr}"`);
      continue;
    }

    results.push({
      name,
      amountInPaise: Math.round(amount * 100),
    });
  }

  if (errors.length > 0 && results.length === 0) {
    return {
      action: 'INVALID_INPUT',
      response: `Errors found:\n${errors.join('\n')}\n\nPlease use format "Name,Amount"`,
    };
  }

  // Add participants to session
  const currentData = getSessionData(phone);
  const currentParticipants = currentData.participants || [];
  const newParticipants = [...currentParticipants, ...results];

  // Check total doesn't exceed bill amount
  const totalAmount = currentData.amount || 0;
  const totalAllocated = newParticipants.reduce((sum, p) => sum + p.amountInPaise, 0);

  if (totalAllocated > totalAmount) {
    return {
      action: 'INVALID_INPUT',
      response: `Total allocated (₹${(totalAllocated / 100).toFixed(2)}) exceeds bill amount (₹${(totalAmount / 100).toFixed(2)}).`,
    };
  }

  transitionTo(phone, State.AWAITING_PARTICIPANTS, { participants: newParticipants });

  const response = results.map(p => `Added: ${p.name} - ₹${(p.amountInPaise / 100).toFixed(2)}`).join('\n');
  const remaining = totalAmount - totalAllocated;

  return {
    action: 'PARTICIPANT_ADDED',
    participants: newParticipants,
    response: `${response}\n\nRemaining: ₹${(remaining / 100).toFixed(2)} / ₹${(totalAmount / 100).toFixed(2)}\n\nAdd more or type "done" to create split.`,
  };
}

/**
 * Reset session to IDLE state
 * @param {string} phone - Phone number
 */
export function resetSession(phone) {
  clearSession(phone);
  logger.debug('Session reset', { phone });
}

export default {
  State,
  getCurrentState,
  getSessionData,
  transitionTo,
  processInput,
  resetSession,
};
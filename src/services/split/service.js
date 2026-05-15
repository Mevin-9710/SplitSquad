import { createSplit, getSplitById, updateSplitStatus } from '../../models/split.js';
import { addParticipant, getTotalAllocated } from '../../models/participant.js';
import { resetSession } from '../session/manager.js';
import logger from '../../utils/logger.js';

/**
 * Split Service - Business logic for bill splitting
 *
 * Handles the creation and validation of bill splits
 */

/**
 * Create a new bill split from session data
 * @param {string} phone - Phone number of creator
 * @param {Object} sessionData - Session temp_data with amount, description, participants
 * @returns {Object} - Created split with participants
 */
export function createNewSplit(phone, sessionData) {
  const { amount, description, participants } = sessionData;

  // Validate required fields
  if (!amount || amount <= 0) {
    throw new Error('Invalid amount');
  }

  if (!description || description.length < 3) {
    throw new Error('Invalid description');
  }

  if (!participants || participants.length === 0) {
    throw new Error('At least one participant required');
  }

  // Create the split
  const splitId = createSplit(description, amount, phone);
  logger.info('Created split', { splitId, phone, amount, description });

  // Add participants
  for (const participant of participants) {
    addParticipant(splitId, participant.name, phone, participant.amountInPaise);
  }

  // Get the complete split
  const split = getSplitById(splitId);

  // Reset session after successful creation
  resetSession(phone);

  return split;
}

/**
 * Calculate equal split for remaining amount
 * @param {number} totalAmount - Total amount in paise
 * @param {Array} existingParticipants - Already added participants
 * @param {number} newParticipantCount - Number of people to split equally
 * @returns {Object} - { amountPerPerson, remainder }
 */
export function calculateEqualSplit(totalAmount, existingParticipants, newParticipantCount) {
  const alreadyAllocated = existingParticipants.reduce(
    (sum, p) => sum + p.amountInPaise,
    0
  );
  const remaining = totalAmount - alreadyAllocated;
  const totalPeople = existingParticipants.length + newParticipantCount;

  if (remaining <= 0) {
    return { amountPerPerson: 0, remainder: 0 };
  }

  const amountPerPerson = Math.floor(remaining / totalPeople);
  const remainder = remaining - (amountPerPerson * totalPeople);

  return { amountPerPerson, remainder };
}

/**
 * Validate that participant amounts don't exceed total
 * @param {number} totalAmount - Total amount in paise
 * @param {Array} participants - Array of participants with amountInPaise
 * @returns {Object} - { valid, totalAllocated, difference }
 */
export function validateTotals(totalAmount, participants) {
  const totalAllocated = participants.reduce((sum, p) => sum + p.amountInPaise, 0);
  const difference = totalAmount - totalAllocated;

  return {
    valid: difference >= 0,
    totalAllocated,
    difference,
  };
}

/**
 * Format split for display
 * @param {Object} split - Split object with participants
 * @returns {string} - Formatted string for WhatsApp message
 */
export function formatSplitMessage(split) {
  const { description, total_amount, created_at, participants } = split;

  const date = new Date(created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lines = [
    `📋 *${description}*`,
    `📅 ${date}`,
    `💰 Total: ₹${(total_amount / 100).toFixed(2)}`,
    '',
    '👥 Participants:',
  ];

  participants.forEach((p, i) => {
    const settled = p.settled ? '✓' : '○';
    const settledText = p.settled ? ' (settled)' : '';
    lines.push(`${i + 1}. ${p.name} - ₹${(p.amount / 100).toFixed(2)}${settledText}`);
  });

  const totalSettled = participants
    .filter(p => p.settled)
    .reduce((sum, p) => sum + p.amount, 0);

  if (totalSettled > 0) {
    lines.push('');
    lines.push(`✅ Settled: ₹${(totalSettled / 100).toFixed(2)}`);
    lines.push(`⏳ Remaining: ₹${((total_amount - totalSettled) / 100).toFixed(2)}`);
  }

  lines.push('');
  lines.push('_Reply with participant name to mark as settled_');

  return lines.join('\n');
}

/**
 * Format history for display
 * @param {Array} splits - Array of split objects
 * @returns {string} - Formatted history string
 */
export function formatHistoryMessage(splits) {
  if (!splits || splits.length === 0) {
    return 'No splits found. Type !new to create one.';
  }

  const lines = [
    '📜 *Split History*\n',
  ];

  splits.slice(0, 10).forEach((split, i) => {
    const date = new Date(split.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    const settledCount = split.participants.filter(p => p.settled).length;
    const totalCount = split.participants.length;

    lines.push(
      `${i + 1}. *${split.description}*`,
      `   ₹${(split.total_amount / 100).toFixed(2)} • ${date}`,
      `   ${settledCount}/${totalCount} settled\n`
    );
  });

  lines.push('_Type !history for more details_');

  return lines.join('\n');
}

export default {
  createNewSplit,
  calculateEqualSplit,
  validateTotals,
  formatSplitMessage,
  formatHistoryMessage,
};
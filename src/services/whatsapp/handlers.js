import { getClient, sendMessage } from './client.js';
import { getHistoryByPhone } from '../../models/split.js';
import { processInput, getSessionData } from '../session/manager.js';
import {
  createNewSplit,
  formatSplitMessage,
  formatHistoryMessage,
} from '../split/service.js';
import logger from '../../utils/logger.js';

/**
 * WhatsApp Message Handlers
 *
 * Handles all incoming messages and routes them to appropriate handlers
 */

// Help message
const HELP_MESSAGE = `
*SplitSquad - Bill Splitting Bot*

Commands:
*!new* - Start a new bill split
*!history* - View your split history
*!cancel* - Cancel current session
*!help* - Show this help message

*Creating a Split:*
1. Type *!new* to start
2. Enter total bill amount (e.g., 450)
3. Enter description (e.g., "Dinner at ABC")
4. Add participants with amounts:
   Raj,100
   Priya,150
5. Type *done* to create

*Special Commands:*
- *equal* - Split remaining amount equally among listed people
- *done* - Finish adding participants

All amounts are in rupees (₹).
`.trim();

/**
 * Handle incoming message (whatsapp-web.js format)
 * @param {Object} msg - whatsapp-web.js message object
 */
export async function handleMessage(msg) {
  try {
    // Extract message content
    const from = msg.from;
    const body = msg.body;

    if (!from || !body) {
      return;
    }

    // Ignore group messages
    const isGroup = from.endsWith('@g.us');
    if (isGroup) {
      return;
    }

    // Extract phone number
    const phone = from.replace('@c.us', '').replace('@s.whatsapp.net', '');

    if (!body.trim()) {
      return;
    }

    logger.debug('Received message', { phone, text: body.substring(0, 50) });

    // Process the message
    await processMessage(phone, body, msg);
  } catch (error) {
    logger.error('Error handling message', { error: error.message });
  }
}

/**
 * Process a message and send response
 * @param {string} phone - Phone number
 * @param {string} text - Message text
 * @param {Object} originalMessage - Original message object for replies
 */
async function processMessage(phone, text, originalMessage) {
  const result = processInput(phone, text);

  switch (result.action) {
    case 'COMMAND':
      await handleCommand(phone, result.command);
      break;

    case 'STATE_CHANGE':
    case 'PARTICIPANT_ADDED':
    case 'INVALID_INPUT':
      await sendMessage(phone, result.response);
      break;

    case 'EQUAL_SPLIT':
      await handleEqualSplit(phone);
      break;

    case 'DONE':
      await handleDone(phone);
      break;

    case 'CANCEL':
      await sendMessage(phone, 'Session cancelled. Type !new to start a new split.');
      break;

    case 'RESET':
      await sendMessage(phone, result.response);
      break;

    case 'UNKNOWN':
      await sendMessage(phone, result.response);
      break;

    default:
      logger.warn('Unknown action', { action: result.action });
  }
}

/**
 * Handle commands
 * @param {string} phone - Phone number
 * @param {string} command - Command name
 */
async function handleCommand(phone, command) {
  switch (command) {
    case '!new':
      await handleNewCommand(phone);
      break;

    case '!history':
      await handleHistoryCommand(phone);
      break;

    case '!cancel':
      await handleCancelCommand(phone);
      break;

    case '!help':
      await sendMessage(phone, HELP_MESSAGE);
      break;

    default:
      await sendMessage(phone, `Unknown command: ${command}`);
  }
}

/**
 * Handle !new command - Start a new split
 * @param {string} phone - Phone number
 */
async function handleNewCommand(phone) {
  const { transitionTo, State } = await import('../session/manager.js');
  transitionTo(phone, State.AWAITING_AMOUNT, {
    amount: 0,
    description: '',
    participants: [],
  });

  await sendMessage(
    phone,
    `🧾 *New Bill Split*\n\n` +
    `Enter the total bill amount:\n\n` +
    `Example: 450 or 1250.50\n\n` +
    `Type !cancel to abort.`
  );
}

/**
 * Handle !history command - Show split history
 * @param {string} phone - Phone number
 */
async function handleHistoryCommand(phone) {
  try {
    const splits = getHistoryByPhone(phone);
    const message = formatHistoryMessage(splits);
    await sendMessage(phone, message);
  } catch (error) {
    logger.error('Error fetching history', { phone, error: error.message });
    await sendMessage(phone, 'Sorry, could not fetch history. Please try again.');
  }
}

/**
 * Handle !cancel command - Cancel current session
 * @param {string} phone - Phone number
 */
async function handleCancelCommand(phone) {
  const { resetSession } = await import('../session/manager.js');
  resetSession(phone);
  await sendMessage(
    phone,
    '✅ Session cancelled.\n\n' +
    'Type !new to start a new split or !help for commands.'
  );
}

/**
 * Handle "equal" input - Split remaining equally
 * @param {string} phone - Phone number
 */
async function handleEqualSplit(phone) {
  try {
    const sessionData = getSessionData(phone);
    const { amount, participants } = sessionData;

    if (!amount || amount <= 0) {
      await sendMessage(phone, 'No amount set. Please start with !new first.');
      return;
    }

    if (participants.length === 0) {
      await sendMessage(
        phone,
        'Please add at least one participant first with format:\n' +
        'Name,Amount'
      );
      return;
    }

    // Calculate equal share for next person
    const remaining = amount - participants.reduce((sum, p) => sum + p.amountInPaise, 0);

    if (remaining <= 0) {
      await sendMessage(phone, 'All amount has been allocated. Type "done" to create the split.');
      return;
    }

    // Add next person with equal share
    const amountPerPerson = Math.floor(remaining / (participants.length + 1));

    await sendMessage(
      phone,
      `💡 Remaining: ₹${(remaining / 100).toFixed(2)}\n` +
      `Equal share for ${participants.length + 1} people: ₹${(amountPerPerson / 100).toFixed(2)} each\n\n` +
      `Add next person:\n` +
      `Name,${(amountPerPerson / 100).toFixed(2)}`
    );
  } catch (error) {
    logger.error('Error handling equal split', { phone, error: error.message });
    await sendMessage(phone, 'Sorry, could not process equal split.');
  }
}

/**
 * Handle "done" input - Create the split
 * @param {string} phone - Phone number
 */
async function handleDone(phone) {
  try {
    const sessionData = getSessionData(phone);

    // Validate we have all required data
    if (!sessionData.amount || sessionData.amount <= 0) {
      await sendMessage(phone, 'No amount set. Please start with !new first.');
      return;
    }

    if (!sessionData.description) {
      await sendMessage(phone, 'No description set. Please try !new again.');
      return;
    }

    if (!sessionData.participants || sessionData.participants.length === 0) {
      await sendMessage(
        phone,
        'No participants added.\n' +
        'Add at least one participant before finishing.'
      );
      return;
    }

    // Create the split
    const split = createNewSplit(phone, sessionData);
    const message = formatSplitMessage(split);

    await sendMessage(phone, `✅ *Split Created!*\n\n${message}`);
  } catch (error) {
    logger.error('Error creating split', { phone, error: error.message });
    await sendMessage(phone, 'Sorry, could not create split. Please try again.');
  }
}

/**
 * Initialize message handlers
 * @param {EventEmitter} eventEmitter - Event emitter for WhatsApp events
 */
export async function initHandlers(eventEmitter) {
  const client = getClient();

  // Listen for incoming messages
  client.on('message', async (msg) => {
    // Ignore messages sent by us
    if (!msg.fromMe) {
      await handleMessage(msg);
    }
  });

  logger.info('WhatsApp message handlers initialized');
}

export default {
  handleMessage,
  initHandlers,
};
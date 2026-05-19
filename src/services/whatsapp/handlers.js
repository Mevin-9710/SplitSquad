import { sendMessage } from './client.js';
import { getHistoryByPhone } from '../../models/split.js';
import { processInput, getSessionData } from '../session/manager.js';
import {
  createNewSplit,
  formatSplitMessage,
  formatHistoryMessage,
} from '../split/service.js';
import logger from '../../utils/logger.js';

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

export async function handleMessage(msg, creatorId) {
  try {
    const from = msg.from;
    const body = msg.body;

    if (!from || !body) return;

    const isGroup = from.endsWith('@g.us');
    if (isGroup) return;

    const phone = from.replace('@c.us', '').replace('@s.whatsapp.net', '');

    if (!body.trim()) return;

    logger.debug('Received message', { creatorId, phone, text: body.substring(0, 50) });

    await processMessage(creatorId, phone, body, msg);
  } catch (error) {
    logger.error('Error handling message', { error: error.message });
  }
}

async function processMessage(creatorId, phone, text, originalMessage) {
  const result = processInput(phone, text);

  switch (result.action) {
    case 'COMMAND':
      await handleCommand(creatorId, phone, result.command);
      break;

    case 'STATE_CHANGE':
    case 'PARTICIPANT_ADDED':
    case 'INVALID_INPUT':
      await sendMessage(creatorId, phone, result.response);
      break;

    case 'EQUAL_SPLIT':
      await handleEqualSplit(creatorId, phone);
      break;

    case 'DONE':
      await handleDone(creatorId, phone);
      break;

    case 'CANCEL':
      await sendMessage(creatorId, phone, 'Session cancelled. Type !new to start a new split.');
      break;

    case 'RESET':
      await sendMessage(creatorId, phone, result.response);
      break;

    case 'UNKNOWN':
      await sendMessage(creatorId, phone, result.response);
      break;

    default:
      logger.warn('Unknown action', { action: result.action });
  }
}

async function handleCommand(creatorId, phone, command) {
  switch (command) {
    case '!new':
      await handleNewCommand(creatorId, phone);
      break;

    case '!history':
      await handleHistoryCommand(creatorId, phone);
      break;

    case '!cancel':
      await handleCancelCommand(creatorId, phone);
      break;

    case '!help':
      await sendMessage(creatorId, phone, HELP_MESSAGE);
      break;

    default:
      await sendMessage(creatorId, phone, `Unknown command: ${command}`);
  }
}

async function handleNewCommand(creatorId, phone) {
  const { transitionTo, State } = await import('../session/manager.js');
  transitionTo(phone, State.AWAITING_AMOUNT, {
    amount: 0,
    description: '',
    participants: [],
  });

  await sendMessage(
    creatorId,
    phone,
    `🧾 *New Bill Split*\n\n` +
    `Enter the total bill amount:\n\n` +
    `Example: 450 or 1250.50\n\n` +
    `Type !cancel to abort.`
  );
}

async function handleHistoryCommand(creatorId, phone) {
  try {
    const splits = getHistoryByPhone(phone);
    const message = formatHistoryMessage(splits);
    await sendMessage(creatorId, phone, message);
  } catch (error) {
    logger.error('Error fetching history', { phone, error: error.message });
    await sendMessage(creatorId, phone, 'Sorry, could not fetch history. Please try again.');
  }
}

async function handleCancelCommand(creatorId, phone) {
  const { resetSession } = await import('../session/manager.js');
  resetSession(phone);
  await sendMessage(
    creatorId,
    phone,
    '✅ Session cancelled.\n\n' +
    'Type !new to start a new split or !help for commands.'
  );
}

async function handleEqualSplit(creatorId, phone) {
  try {
    const sessionData = getSessionData(phone);
    const { amount, participants } = sessionData;

    if (!amount || amount <= 0) {
      await sendMessage(creatorId, phone, 'No amount set. Please start with !new first.');
      return;
    }

    if (participants.length === 0) {
      await sendMessage(
        creatorId,
        phone,
        'Please add at least one participant first with format:\n' +
        'Name,Amount'
      );
      return;
    }

    const remaining = amount - participants.reduce((sum, p) => sum + p.amountInPaise, 0);

    if (remaining <= 0) {
      await sendMessage(creatorId, phone, 'All amount has been allocated. Type "done" to create the split.');
      return;
    }

    const amountPerPerson = Math.floor(remaining / (participants.length + 1));

    await sendMessage(
      creatorId,
      phone,
      `💡 Remaining: ₹${(remaining / 100).toFixed(2)}\n` +
      `Equal share for ${participants.length + 1} people: ₹${(amountPerPerson / 100).toFixed(2)} each\n\n` +
      `Add next person:\n` +
      `Name,${(amountPerPerson / 100).toFixed(2)}`
    );
  } catch (error) {
    logger.error('Error handling equal split', { phone, error: error.message });
    await sendMessage(creatorId, phone, 'Sorry, could not process equal split.');
  }
}

async function handleDone(creatorId, phone) {
  try {
    const sessionData = getSessionData(phone);

    if (!sessionData.amount || sessionData.amount <= 0) {
      await sendMessage(creatorId, phone, 'No amount set. Please start with !new first.');
      return;
    }

    if (!sessionData.description) {
      await sendMessage(creatorId, phone, 'No description set. Please try !new again.');
      return;
    }

    if (!sessionData.participants || sessionData.participants.length === 0) {
      await sendMessage(
        creatorId,
        phone,
        'No participants added.\n' +
        'Add at least one participant before finishing.'
      );
      return;
    }

    const split = createNewSplit(phone, sessionData);
    const message = formatSplitMessage(split);

    await sendMessage(creatorId, phone, `✅ *Split Created!*\n\n${message}`);
  } catch (error) {
    logger.error('Error creating split', { phone, error: error.message });
    await sendMessage(creatorId, phone, 'Sorry, could not create split. Please try again.');
  }
}

export async function initHandlers(eventEmitter) {
  eventEmitter.on('message', async (msg, creatorId) => {
    if (!msg.fromMe) {
      await handleMessage(msg, creatorId);
    }
  });

  logger.info('WhatsApp message handlers initialized (multi-creator mode)');
}

export default {
  handleMessage,
  initHandlers,
};
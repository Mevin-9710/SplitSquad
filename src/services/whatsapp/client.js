import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import Boom from '@hapi/boom';
import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';
import { existsSync, mkdirSync } from 'fs';

/**
 * WhatsApp Client - Baileys wrapper
 *
 * Handles WhatsApp connection, authentication, and messaging
 */

// Event emitter for QR code and connection status
let eventEmitter = null;
let sock = null;
let currentQR = null;

/**
 * Initialize WhatsApp client
 * @param {EventEmitter} events - Event emitter for QR codes and status
 * @returns {Promise<Object>} - Socket instance
 */
export async function initWhatsAppClient(events) {
  eventEmitter = events;

  // Ensure auth directory exists
  if (!existsSync(config.AUTH_DIR)) {
    mkdirSync(config.AUTH_DIR, { recursive: true });
  }

  try {
    // Fetch latest Baileys version
    const { version } = await fetchLatestBaileysVersion();
    logger.info(`Using Baileys version: ${version.join('.')}`);

    // Load auth state from files
    const { state, saveCreds } = await useMultiFileAuthState(config.AUTH_DIR);

    // Create the socket
    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger: logger,
      connectTimeoutMs: 30000,
      maxIdleTimeMs: 60000,
    });

    // Debug all events
    const debugEvents = ['conn', 'chats', 'contacts', 'messages', 'story', 'presence', 'call'];
    debugEvents.forEach(event => {
      sock.ev.on(event, (...args) => {
        logger.debug(`Event ${event}:`, args.length > 0 ? JSON.stringify(args[0]).substring(0, 100) : 'called');
      });
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Handle QR code generation
    sock.ev.on('qr', (qr) => {
      currentQR = qr;
      logger.info('QR code received, length:', qr.length);
      if (eventEmitter) {
        eventEmitter.emit('qr', qr);
      }
    });

    sock.ev.on('messages.upsert', (msg) => {
      logger.info('Messages upsert:', JSON.stringify(msg).substring(0, 200));
    });

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      logger.info('Connection update:', { connection, lastDisconnect });

      if (connection === 'open') {
        currentQR = null;
        logger.info('WhatsApp connected successfully');
        if (eventEmitter) {
          eventEmitter.emit('connected');
        }
      }

      if (connection === 'close') {
        const shouldReconnect = Boom.isBoom(lastDisconnect)
          ? lastDisconnect.output.statusCode !== 401
          : true;

        if (shouldReconnect) {
          logger.warn('Connection closed, reconnecting...');
          if (eventEmitter) {
            eventEmitter.emit('reconnecting');
          }
        } else {
          logger.error('Connection closed permanently (401)');
          if (eventEmitter) {
            eventEmitter.emit('disconnected', 'Session expired. Please scan QR again.');
          }
        }
      }
    });

    logger.info('WhatsApp client initialized');

    return sock;
  } catch (error) {
    logger.error('Failed to initialize WhatsApp client', { error: error.message });
    throw error;
  }
}

/**
 * Get the socket instance
 * @returns {Object} - Socket instance
 */
export function getSocket() {
  if (!sock) {
    throw new Error('WhatsApp client not initialized');
  }
  return sock;
}

/**
 * Send a WhatsApp message
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message text
 * @returns {Promise<Object>} - Message send result
 */
export async function sendMessage(to, message) {
  const socket = getSocket();

  try {
    const jid = formatJid(to);

    const result = await socket.sendMessage(jid, {
      text: message,
    });

    logger.debug('Message sent', { to: jid, messageId: result.key.id });
    return result;
  } catch (error) {
    logger.error('Failed to send message', { to, error: error.message });
    throw error;
  }
}

/**
 * Send a reply to a message
 * @param {string} to - Recipient phone number
 * @param {string} message - Message text
 * @param {Object} quoted - Message to quote/reply to
 * @returns {Promise<Object>} - Message send result
 */
export async function sendReply(to, message, quoted) {
  const socket = getSocket();

  try {
    const jid = formatJid(to);

    const result = await socket.sendMessage(jid, {
      text: message,
      quoted: quoted,
    });

    logger.debug('Reply sent', { to: jid });
    return result;
  } catch (error) {
    logger.error('Failed to send reply', { to, error: error.message });
    throw error;
  }
}

/**
 * Disconnect WhatsApp client
 */
export async function disconnectWhatsApp() {
  if (sock) {
    try {
      await sock.logout();
      sock = null;
      logger.info('WhatsApp client disconnected');
    } catch (error) {
      logger.error('Error disconnecting WhatsApp', { error: error.message });
    }
  }
}

/**
 * Check if client is connected
 * @returns {boolean} - Connection status
 */
export function isConnected() {
  const connected = !!(sock && sock.authState?.creds?.me);
  return connected;
}

/**
 * Get bot's own phone number
 * @returns {string|null} - Phone number or null
 */
export function getBotPhone() {
  if (sock && sock.authState?.creds?.me) {
    return sock.authState.creds.me.id.split('@')[0];
  }
  return null;
}

/**
 * Get current QR code
 * @returns {string|null} - QR code or null
 */
export function getCurrentQR() {
  return currentQR;
}

/**
 * Format phone number to WhatsApp JID format
 * @param {string} phone - Phone number
 * @returns {string} - Formatted JID
 */
function formatJid(phone) {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `${cleaned}@s.whatsapp.net`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `${cleaned}@s.whatsapp.net`;
  }

  return `${cleaned}@s.whatsapp.net`;
}

export default {
  initWhatsAppClient,
  getSocket,
  sendMessage,
  sendReply,
  disconnectWhatsApp,
  isConnected,
  getBotPhone,
  getCurrentQR,
};

import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;
import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';
import { existsSync, mkdirSync } from 'fs';

/**
 * WhatsApp Client - whatsapp-web.js wrapper
 *
 * Handles WhatsApp connection, authentication, and messaging
 */

// Event emitter for QR code and connection status
let eventEmitter = null;
let client = null;
let currentQR = null;

/**
 * Initialize WhatsApp client
 * @param {EventEmitter} events - Event emitter for QR codes and status
 * @returns {Promise<Object>} - Client instance
 */
export async function initWhatsAppClient(events) {
  eventEmitter = events;

  // Ensure auth directory exists
  if (!existsSync(config.AUTH_DIR)) {
    mkdirSync(config.AUTH_DIR, { recursive: true });
  }

  try {
    // Create client with LocalAuth (stores session in .auth folder)
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: config.AUTH_DIR,
        clientId: `runtime_${process.pid}`,
      }),
      puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      },
    });

    // Handle QR code generation
    client.on('qr', (qr) => {
      currentQR = qr;
      logger.info('QR code received');
      if (eventEmitter) {
        eventEmitter.emit('qr', qr);
      }
    });

    // Handle successful authentication
    client.on('authenticated', () => {
      logger.info('WhatsApp authenticated successfully');
      currentQR = null;
    });

    // Handle ready state
    client.on('ready', async () => {
      logger.info('WhatsApp client ready');
      currentQR = null;
      if (eventEmitter) {
        eventEmitter.emit('connected');
      }
    });

    // Handle disconnection
    client.on('disconnected', (reason) => {
      logger.warn('WhatsApp disconnected', { reason });
      if (eventEmitter) {
        eventEmitter.emit('disconnected', reason);
      }
    });

    // Handle messages
    client.on('message', (msg) => {
      logger.debug('Message received', {
        from: msg.from,
        body: msg.body.substring(0, 50),
      });
      if (eventEmitter) {
        eventEmitter.emit('message', msg);
      }
    });

    // Handle incoming calls
    client.on('call', (call) => {
      logger.info('Incoming call', { from: call.from });
      if (eventEmitter) {
        eventEmitter.emit('call', call);
      }
    });

    // Initialize in background so app server can start immediately.
    client.initialize()
      .then(() => {
        logger.info('WhatsApp client initialized');
      })
      .catch((error) => {
        logger.error('WhatsApp background initialization failed', { error: error.message });
      });

    return client;
  } catch (error) {
    logger.error('Failed to initialize WhatsApp client', { error: error.message });
    throw error;
  }
}

/**
 * Get the client instance
 * @returns {Object} - Client instance
 */
export function getClient() {
  if (!client) {
    throw new Error('WhatsApp client not initialized');
  }
  return client;
}

/**
 * Send a WhatsApp message
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Message text
 * @returns {Promise<Object>} - Message send result
 */
export async function sendMessage(to, message) {
  const clientInstance = getClient();

  try {
    const jid = formatJid(to);
    const result = await clientInstance.sendMessage(jid, message);

    logger.debug('Message sent', { to: jid, messageId: result.id._serialized });
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
  const clientInstance = getClient();

  try {
    const jid = formatJid(to);
    const options = quoted ? { quoted: quoted } : {};
    const result = await clientInstance.sendMessage(jid, message, options);

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
  if (client) {
    try {
      await client.destroy();
      client = null;
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
  return !!(client && client.info && client.info.wid);
}

/**
 * Get bot's own phone number
 * @returns {string|null} - Phone number or null
 */
export function getBotPhone() {
  if (client && client.info && client.info.wid) {
    return client.info.wid._serialized.split('@')[0];
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
    return `${cleaned}@c.us`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `${cleaned}@c.us`;
  }

  return `${cleaned}@c.us`;
}

// Export for backwards compatibility with Baileys naming
export const getSocket = getClient;

export default {
  initWhatsAppClient,
  getClient,
  getSocket,
  sendMessage,
  sendReply,
  disconnectWhatsApp,
  isConnected,
  getBotPhone,
  getCurrentQR,
};

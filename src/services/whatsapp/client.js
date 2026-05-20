import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;
import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';
import { existsSync, mkdirSync } from 'fs';

const clients = new Map();
const clientQrs = new Map();
const clientReady = new Map();

function sanitizeUserId(userId) {
  return userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
}

export async function initWhatsAppClient(events) {
  if (!existsSync(config.AUTH_DIR)) {
    mkdirSync(config.AUTH_DIR, { recursive: true });
  }

  logger.info('WhatsApp multi-user mode initialized');
  return { isMultiUser: true };
}

export function getOrCreateClient(userId, events) {
  if (clients.has(userId)) {
    return clients.get(userId);
  }

  const safeId = sanitizeUserId(userId);
  const authPath = `${config.AUTH_DIR}/user_${safeId}`;

  if (!existsSync(authPath)) {
    mkdirSync(authPath, { recursive: true });
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: authPath,
      clientId: `user_${safeId}`,
    }),
    puppeteer: {
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
  });

  client.on('qr', (qr) => {
    clientQrs.set(userId, qr);
    clientReady.set(userId, false);
    logger.info(`QR generated for user: ${userId}`);
  });

  client.on('authenticated', () => {
    clientQrs.delete(userId);
    logger.info(`User ${userId} authenticated`);
  });

  client.on('ready', () => {
    clientQrs.delete(userId);
    clientReady.set(userId, true);
    logger.info(`User ${userId} WhatsApp ready`);
  });

  client.on('disconnected', (reason) => {
    clientReady.set(userId, false);
    clientQrs.delete(userId);
    logger.warn(`User ${userId} disconnected`, { reason });
  });

  client.on('message', (msg) => {
    logger.debug('Message received', {
      userId,
      from: msg.from,
      body: msg.body.substring(0, 50),
    });
    if (events) {
      events.emit('message', msg, userId);
    }
  });

  client.on('auth_failure', (msg) => {
    logger.error(`User ${userId} auth failure`, { msg });
    clientQrs.delete(userId);
    clientReady.set(userId, false);
  });

  client.on('loading_screen', (percent) => {
    logger.debug(`User ${userId} loading screen: ${percent}%`);
  });

  client.initialize().catch((error) => {
    logger.error(`User ${userId} WhatsApp init failed`, { error: error.message, stack: error.stack });
    clientQrs.delete(userId);
    clientReady.set(userId, false);
  });

  logger.info(`User ${userId} WhatsApp client initializing...`);

  clients.set(userId, client);
  return client;
}

export function getClient(userId) {
  if (!userId || !clients.has(userId)) {
    throw new Error('WhatsApp client not initialized for this user');
  }
  return clients.get(userId);
}

export async function sendMessage(userId, to, message) {
  const clientInstance = getClient(userId);

  try {
    const jid = formatJid(to);
    const result = await clientInstance.sendMessage(jid, message);
    logger.debug('Message sent', { userId, to: jid });
    return result;
  } catch (error) {
    logger.error('Failed to send message', { userId, to, error: error.message });
    throw error;
  }
}

export async function sendReply(userId, to, message, quoted) {
  const clientInstance = getClient(userId);

  try {
    const jid = formatJid(to);
    const options = quoted ? { quoted } : {};
    const result = await clientInstance.sendMessage(jid, message, options);
    logger.debug('Reply sent', { userId, to: jid });
    return result;
  } catch (error) {
    logger.error('Failed to send reply', { userId, to, error: error.message });
    throw error;
  }
}

export async function disconnectWhatsApp() {
  for (const [userId, client] of clients) {
    try {
      await client.destroy();
      logger.info(`Disconnected user: ${userId}`);
    } catch (error) {
      logger.error(`Error disconnecting user ${userId}`, { error: error.message });
    }
  }
  clients.clear();
  clientQrs.clear();
  clientReady.clear();
}

export function isConnected(userId) {
  if (!userId) return false;
  const client = clients.get(userId);
  return !!(client && client.info && client.info.wid);
}

export function getBotPhone(userId) {
  const client = clients.get(userId);
  if (client && client.info && client.info.wid) {
    return client.info.wid._serialized.split('@')[0];
  }
  return null;
}

export function getCurrentQR(userId) {
  return clientQrs.get(userId) || null;
}

export function isClientReady(userId) {
  return clientReady.get(userId) || false;
}

export function getAllUsers() {
  return Array.from(clients.keys());
}

function formatJid(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `${cleaned}@c.us`;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `${cleaned}@c.us`;
  return `${cleaned}@c.us`;
}

export const getSocket = getClient;

export default {
  initWhatsAppClient,
  getOrCreateClient,
  getClient,
  getSocket,
  sendMessage,
  sendReply,
  disconnectWhatsApp,
  isConnected,
  getBotPhone,
  getCurrentQR,
  isClientReady,
  getAllUsers,
};

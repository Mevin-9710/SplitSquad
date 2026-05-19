import wwebjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wwebjs;
import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';
import { existsSync, mkdirSync } from 'fs';

const clients = new Map();
const clientQrs = new Map();
const clientReady = new Map();

function sanitizeCreatorId(creatorId) {
  return creatorId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
}

export async function initWhatsAppClient(events) {
  if (!existsSync(config.AUTH_DIR)) {
    mkdirSync(config.AUTH_DIR, { recursive: true });
  }

  logger.info('WhatsApp multi-creator mode initialized');
  return { isMultiCreator: true };
}

export function getOrCreateClient(creatorId, events) {
  if (clients.has(creatorId)) {
    return clients.get(creatorId);
  }

  const safeId = sanitizeCreatorId(creatorId);
  const authPath = `${config.AUTH_DIR}/creator_${safeId}`;

  if (!existsSync(authPath)) {
    mkdirSync(authPath, { recursive: true });
  }

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: authPath,
      clientId: `creator_${safeId}`,
    }),
    puppeteer: {
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  });

  client.on('qr', (qr) => {
    clientQrs.set(creatorId, qr);
    clientReady.set(creatorId, false);
    logger.info(`QR generated for creator: ${creatorId}`);
  });

  client.on('authenticated', () => {
    clientQrs.delete(creatorId);
    logger.info(`Creator ${creatorId} authenticated`);
  });

  client.on('ready', () => {
    clientQrs.delete(creatorId);
    clientReady.set(creatorId, true);
    logger.info(`Creator ${creatorId} WhatsApp ready`);
  });

  client.on('disconnected', (reason) => {
    clientReady.set(creatorId, false);
    logger.warn(`Creator ${creatorId} disconnected`, { reason });
  });

  client.on('message', (msg) => {
    logger.debug('Message received', {
      creatorId,
      from: msg.from,
      body: msg.body.substring(0, 50),
    });
    if (events) {
      events.emit('message', msg, creatorId);
    }
  });

  client.initialize().catch((error) => {
    logger.error(`Creator ${creatorId} WhatsApp init failed`, { error: error.message });
  });

  clients.set(creatorId, client);
  return client;
}

export function getClient(creatorId) {
  if (!creatorId || !clients.has(creatorId)) {
    throw new Error('WhatsApp client not initialized for this creator');
  }
  return clients.get(creatorId);
}

export async function sendMessage(creatorId, to, message) {
  const clientInstance = getClient(creatorId);

  try {
    const jid = formatJid(to);
    const result = await clientInstance.sendMessage(jid, message);
    logger.debug('Message sent', { creatorId, to: jid });
    return result;
  } catch (error) {
    logger.error('Failed to send message', { creatorId, to, error: error.message });
    throw error;
  }
}

export async function sendReply(creatorId, to, message, quoted) {
  const clientInstance = getClient(creatorId);

  try {
    const jid = formatJid(to);
    const options = quoted ? { quoted } : {};
    const result = await clientInstance.sendMessage(jid, message, options);
    logger.debug('Reply sent', { creatorId, to: jid });
    return result;
  } catch (error) {
    logger.error('Failed to send reply', { creatorId, to, error: error.message });
    throw error;
  }
}

export async function disconnectWhatsApp() {
  for (const [creatorId, client] of clients) {
    try {
      await client.destroy();
      logger.info(`Disconnected creator: ${creatorId}`);
    } catch (error) {
      logger.error(`Error disconnecting creator ${creatorId}`, { error: error.message });
    }
  }
  clients.clear();
  clientQrs.clear();
  clientReady.clear();
}

export function isConnected(creatorId) {
  if (!creatorId) return false;
  const client = clients.get(creatorId);
  return !!(client && client.info && client.info.wid);
}

export function getBotPhone(creatorId) {
  const client = clients.get(creatorId);
  if (client && client.info && client.info.wid) {
    return client.info.wid._serialized.split('@')[0];
  }
  return null;
}

export function getCurrentQR(creatorId) {
  return clientQrs.get(creatorId) || null;
}

export function isClientReady(creatorId) {
  return clientReady.get(creatorId) || false;
}

export function getAllCreators() {
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
  getAllCreators,
};

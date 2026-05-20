import express from 'express';
import QRCode from 'qrcode';
import {
  isEvolutionConfigured,
  getQRCode,
  getConnectionStatus,
  connectEvolution,
  disconnectEvolution,
} from '../../services/evolution/client.js';
import { getCurrentQR, getOrCreateClient, isConnected } from '../../services/whatsapp/client.js';
import logger from '../../utils/logger.js';

let appEvents = null;

export function setEvents(events) {
  appEvents = events;
}

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    if (isEvolutionConfigured()) {
      const status = await getConnectionStatus(req.user.id);
      if (!status.success) {
        return res.json({ configured: true, connected: false, state: 'error', error: status.error, instanceName: status.instanceName });
      }
      return res.json({ configured: true, connected: status.connected, state: status.state, phone: status.phone, instanceName: status.instanceName, userId: req.user.id });
    }

    const connected = isConnected(req.user.id);
    res.json({ configured: false, connected, state: connected ? 'connected' : 'disconnected', userId: req.user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

router.get('/qr', async (req, res) => {
  try {
    if (isEvolutionConfigured()) {
      const status = await getConnectionStatus(req.user.id);
      if (status.success && status.connected) {
        return res.json({ configured: true, qr: null, state: 'connected', instanceName: status.instanceName });
      }
      const result = await getQRCode(req.user.id);
      if (!result.success) {
        return res.status(500).json({ configured: true, qr: null, state: 'error', error: result.error, instanceName: result.instanceName });
      }
      return res.json({ configured: true, qr: result.qr, state: result.state, instanceName: result.instanceName });
    }

    getOrCreateClient(req.user.id, appEvents);
    const connected = isConnected(req.user.id);
    const qr = getCurrentQR(req.user.id);

    res.json({ configured: false, qr, state: connected ? 'connected' : 'waiting', userId: req.user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

router.post('/connect', async (req, res) => {
  try {
    logger.info(`Connect request for user: ${req.user.id}`);
    
    if (isEvolutionConfigured()) {
      const result = await connectEvolution(req.user.id);
      return res.json({ success: result.success, state: result.state || 'connecting', instanceName: result.instanceName, error: result.error || null });
    }

    logger.info(`Creating WhatsApp client for user: ${req.user.id}`);
    const client = getOrCreateClient(req.user.id, appEvents);
    logger.info(`WhatsApp client created/returned for user: ${req.user.id}`);
    
    res.json({ success: true, state: 'connecting', userId: req.user.id });
  } catch (error) {
    logger.error(`Connect failed for user: ${req.user.id}`, { error: error.message });
    res.status(500).json({ success: false, error: 'Connection failed' });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    if (isEvolutionConfigured()) {
      const result = await disconnectEvolution(req.user.id);
      return res.json({ success: result.success });
    }
    res.json({ success: false, message: 'Standard WhatsApp disconnect not supported' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Disconnect failed' });
  }
});

router.get('/qr-image', async (req, res) => {
  try {
    logger.info(`QR image request for user: ${req.user.id}`);
    let qrText = null;
    let mode = 'standard';

    if (isEvolutionConfigured()) {
      const result = await getQRCode(req.user.id);
      if (result.success && result.qr) {
        qrText = result.qr;
        mode = 'evolution';
      }
    } else {
      logger.info(`Getting/creating client for QR image: ${req.user.id}`);
      getOrCreateClient(req.user.id, appEvents);
      qrText = getCurrentQR(req.user.id);
      logger.info(`QR text available: ${!!qrText}`);
    }

    if (!qrText) {
      return res.json({ success: true, qrImage: null, mode, message: 'QR not available yet. Tap Connect and wait a few seconds.' });
    }

    const qrImage = await QRCode.toDataURL(qrText, { width: 320, margin: 2 });
    return res.json({ success: true, qrImage, mode });
  } catch (error) {
    logger.error(`QR image failed for user: ${req.user.id}`, { error: error.message });
    return res.status(500).json({ success: false, error: 'Failed to generate QR image' });
  }
});

export default router;

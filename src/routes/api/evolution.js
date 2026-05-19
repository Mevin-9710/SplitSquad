import express from 'express';
import QRCode from 'qrcode';
import {
  isEvolutionConfigured,
  getQRCode,
  getConnectionStatus,
  connectEvolution,
  disconnectEvolution,
} from '../../services/evolution/client.js';
import { getCurrentQR } from '../../services/whatsapp/client.js';

const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    if (!isEvolutionConfigured()) {
      return res.json({ configured: false, connected: false, state: 'not_configured', message: 'Evolution API not configured' });
    }

    const status = await getConnectionStatus(req.creatorId);
    if (!status.success) {
      return res.json({ configured: true, connected: false, state: 'error', error: status.error, instanceName: status.instanceName });
    }

    res.json({ configured: true, connected: status.connected, state: status.state, phone: status.phone, instanceName: status.instanceName, creatorId: req.creatorId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

router.get('/qr', async (req, res) => {
  try {
    if (!isEvolutionConfigured()) {
      return res.json({ configured: false, qr: null, state: 'not_configured', message: 'Evolution API not configured' });
    }

    const status = await getConnectionStatus(req.creatorId);
    if (status.success && status.connected) {
      return res.json({ configured: true, qr: null, state: 'connected', instanceName: status.instanceName });
    }

    const result = await getQRCode(req.creatorId);
    if (!result.success) {
      return res.status(500).json({ configured: true, qr: null, state: 'error', error: result.error, instanceName: result.instanceName });
    }

    res.json({ configured: true, qr: result.qr, state: result.state, instanceName: result.instanceName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

router.post('/connect', async (req, res) => {
  try {
    if (!isEvolutionConfigured()) {
      return res.json({ success: false, state: 'not_configured', message: 'Evolution API not configured' });
    }

    const result = await connectEvolution(req.creatorId);
    res.json({ success: result.success, state: result.state || 'connecting', instanceName: result.instanceName, error: result.error || null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Connection failed' });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    if (!isEvolutionConfigured()) return res.json({ success: false, message: 'Not configured' });
    const result = await disconnectEvolution(req.creatorId);
    res.json({ success: result.success });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Disconnect failed' });
  }
});

router.get('/qr-image', async (req, res) => {
  try {
    let qrText = null;
    let mode = 'standard';

    if (isEvolutionConfigured()) {
      const result = await getQRCode(req.creatorId);
      if (result.success && result.qr) {
        qrText = result.qr;
        mode = 'evolution';
      }
    } else {
      qrText = getCurrentQR();
    }

    if (!qrText) {
      return res.json({ success: true, qrImage: null, mode, message: 'QR not available yet' });
    }

    const qrImage = await QRCode.toDataURL(qrText, { width: 320, margin: 2 });
    return res.json({ success: true, qrImage, mode });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to generate QR image' });
  }
});

export default router;

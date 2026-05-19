import express from 'express';
import { getRecentSplits, getSplitById } from '../../models/split.js';
import { isConnected as isStandardConnected } from '../../services/whatsapp/client.js';
import { isEvolutionConfigured, getConnectionStatus } from '../../services/evolution/client.js';
import { getCategories, getAllContacts } from '../../models/contact.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const splits = getRecentSplits(10, req.creatorId);
    let evolutionConnected = false;
    if (isEvolutionConfigured()) {
      const status = await getConnectionStatus(req.creatorId);
      evolutionConnected = !!(status.success && status.connected);
    }

    res.render('index', {
      splits,
      creatorId: req.creatorId,
      creatorName: req.creatorName,
      whatsappConnected: isStandardConnected() || evolutionConnected,
    });
  } catch {
    res.status(500).render('error', { message: 'Failed to load page' });
  }
});

router.get('/split/:id', (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.creatorId);
    if (!split) return res.status(404).render('error', { message: 'Split not found for current creator' });
    return res.render('split', { split, creatorId: req.creatorId, creatorName: req.creatorName });
  } catch {
    res.status(500).render('error', { message: 'Failed to load split' });
  }
});

router.get('/qr', (req, res) => {
  try {
    res.render('qr', { title: 'WhatsApp Authentication', creatorId: req.creatorId, creatorName: req.creatorName });
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR page' });
  }
});

router.get('/connect', (req, res) => {
  try {
    res.redirect('/qr');
  } catch {
    res.status(500).render('error', { message: 'Failed to load connect page' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const categories = getCategories();
    const contacts = getAllContacts(req.creatorId);
    const grouped = {};
    for (const cat of categories) {
      grouped[cat] = [];
    }
    for (const contact of contacts) {
      if (!grouped[contact.category]) {
        grouped[contact.category] = [];
      }
      grouped[contact.category].push(contact);
    }

    res.render('contacts', {
      categories,
      contacts: grouped,
      creatorId: req.creatorId,
      creatorName: req.creatorName,
    });
  } catch {
    res.status(500).render('error', { message: 'Failed to load contacts' });
  }
});

router.get('/scan-qr', (req, res) => {
  try {
    res.render('scan-qr', { creatorId: req.creatorId, creatorName: req.creatorName });
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR scanner' });
  }
});

router.get('/settings', (req, res) => {
  try {
    res.render('settings', { creatorId: req.creatorId, creatorName: req.creatorName });
  } catch {
    res.status(500).render('error', { message: 'Failed to load settings' });
  }
});

export default router;

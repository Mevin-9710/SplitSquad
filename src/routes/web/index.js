import express from 'express';
import { getRecentSplits, getSplitById } from '../../models/split.js';
import { isConnected as isStandardConnected } from '../../services/whatsapp/client.js';
import { isEvolutionConfigured, getConnectionStatus } from '../../services/evolution/client.js';
import { getCategories, getAllContacts } from '../../models/contact.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const splits = getRecentSplits(10, req.user.id);
    let whatsappConnected = false;
    if (isEvolutionConfigured()) {
      const status = await getConnectionStatus(req.user.id);
      whatsappConnected = !!(status.success && status.connected);
    } else {
      whatsappConnected = isStandardConnected(req.user.id);
    }

    res.render('index', {
      splits,
      user: req.user,
      whatsappConnected,
    });
  } catch {
    res.status(500).render('error', { message: 'Failed to load page' });
  }
});

router.get('/split/:id', (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.user.id);
    if (!split) return res.status(404).render('error', { message: 'Split not found' });
    return res.render('split', { split, user: req.user });
  } catch {
    res.status(500).render('error', { message: 'Failed to load split' });
  }
});

router.get('/qr', (req, res) => {
  try {
    res.render('qr', { user: req.user });
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR page' });
  }
});

router.get('/connect', (req, res) => {
  res.redirect('/qr');
});

router.get('/contacts', async (req, res) => {
  try {
    const categories = getCategories();
    const contacts = getAllContacts(req.user.id);
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
      user: req.user,
    });
  } catch {
    res.status(500).render('error', { message: 'Failed to load contacts' });
  }
});

router.get('/scan-qr', (req, res) => {
  try {
    res.render('scan-qr', { user: req.user });
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR scanner' });
  }
});

router.get('/settings', (req, res) => {
  try {
    res.render('settings', { user: req.user });
  } catch {
    res.status(500).render('error', { message: 'Failed to load settings' });
  }
});

export default router;

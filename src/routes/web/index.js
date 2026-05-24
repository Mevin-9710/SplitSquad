import express from 'express';
import { getRecentSplits, getSplitById } from '../../models/split.js';
import { isConnected as isStandardConnected } from '../../services/whatsapp/client.js';
import { isEvolutionConfigured, getConnectionStatus } from '../../services/evolution/client.js';
import { getCategories, getAllContacts } from '../../models/contact.js';
import { findUserById } from '../../models/user.js';
const router = express.Router();

function withAnalytics(viewData = {}) {
  return {
    ...viewData,
    analytics: {
      gtmId: process.env.GTM_CONTAINER_ID || null,
      ga4Id: process.env.GA4_MEASUREMENT_ID || null,
    },
  };
}

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

    const fullUser = findUserById(req.user.id) || req.user;

    res.render('index', withAnalytics({
      splits,
      user: req.user,
      userFull: fullUser,
      whatsappConnected,
    }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load page' });
  }
});

router.get('/split/:id', (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.user.id);
    if (!split) return res.status(404).render('error', withAnalytics({ message: 'Split not found' }));
    return res.render('split', withAnalytics({ split, user: req.user }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load split' });
  }
});

router.get('/qr', (req, res) => {
  try {
    res.render('qr', withAnalytics({ user: req.user }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR page' });
  }
});

router.get('/connect', (req, res) => {
  res.redirect('/app/qr');
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

    res.render('contacts', withAnalytics({
      categories,
      contacts: grouped,
      user: req.user,
    }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load contacts' });
  }
});

router.get('/scan-qr', (req, res) => {
  try {
    res.render('scan-qr', withAnalytics({ user: req.user }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load QR scanner' });
  }
});

router.get('/settings', (req, res) => {
  try {
    res.render('settings', withAnalytics({ user: req.user }));
  } catch {
    res.status(500).render('error', { message: 'Failed to load settings' });
  }
});

export default router;

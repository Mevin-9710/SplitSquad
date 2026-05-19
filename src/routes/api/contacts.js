import express from 'express';
import { addContact, getAllContacts, getContactsByCategory, deleteContact, getCategories, getContactsByIds } from '../../models/contact.js';
import { normalizePhone } from '../../utils/phone.js';

const router = express.Router();

router.get('/contacts', (req, res) => {
  try {
    const contacts = getAllContacts(req.creatorId);
    const grouped = {};
    const categories = getCategories();
    for (const cat of categories) {
      grouped[cat] = [];
    }
    for (const contact of contacts) {
      if (!grouped[contact.category]) {
        grouped[contact.category] = [];
      }
      grouped[contact.category].push(contact);
    }
    res.json({ categories, contacts: grouped });
  } catch {
    res.status(500).json({ error: 'Failed to list contacts' });
  }
});

router.get('/contacts/category/:category', (req, res) => {
  try {
    const contacts = getContactsByCategory(req.params.category, req.creatorId);
    res.json({ category: req.params.category, contacts });
  } catch {
    res.status(500).json({ error: 'Failed to list contacts' });
  }
});

router.post('/contacts', (req, res) => {
  try {
    const { name, phone, category } = req.body;

    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name is required' });
    if (!phone || typeof phone !== 'string') return res.status(400).json({ error: 'phone is required' });
    if (!category || typeof category !== 'string') return res.status(400).json({ error: 'category is required' });

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) return res.status(400).json({ error: 'Invalid phone number' });

    const categories = getCategories();
    if (!categories.includes(category)) return res.status(400).json({ error: `Invalid category. Must be one of: ${categories.join(', ')}` });

    const id = addContact(name.trim(), normalizedPhone, category, req.creatorId);
    res.status(201).json({ id, name: name.trim(), phone: normalizedPhone, category });
  } catch {
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

router.post('/contacts/bulk', (req, res) => {
  try {
    const { contacts } = req.body;

    if (!Array.isArray(contacts) || contacts.length === 0) return res.status(400).json({ error: 'contacts array is required' });

    const categories = getCategories();
    const added = [];

    for (const contact of contacts) {
      const name = contact?.name?.trim();
      const normalizedPhone = normalizePhone(contact?.phone);
      const category = contact?.category;

      if (!name) continue;
      if (!normalizedPhone) continue;
      if (!category || !categories.includes(category)) continue;

      const id = addContact(name, normalizedPhone, category, req.creatorId);
      added.push({ id, name, phone: normalizedPhone, category });
    }

    res.status(201).json({ added, count: added.length });
  } catch {
    res.status(500).json({ error: 'Failed to add contacts' });
  }
});

router.delete('/contacts/:id', (req, res) => {
  try {
    deleteContact(req.params.id, req.creatorId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

router.get('/contacts/categories', (req, res) => {
  res.json({ categories: getCategories() });
});

router.post('/contacts/ids', (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array is required' });
    const contacts = getContactsByIds(ids, req.creatorId);
    res.json({ contacts });
  } catch {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

export default router;

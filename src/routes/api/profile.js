import express from 'express';
import { addUpiProfile, getUpiProfiles, getDefaultUpiProfile, setUpiProfileAsDefault, deleteUpiProfile, updateUpiProfileLabel } from '../../models/userProfile.js';
import { isValidUpiId } from '../../utils/upi.js';

const router = express.Router();

router.get('/profile/upi', (req, res) => {
  try {
    const profiles = getUpiProfiles(req.user.id);
    const defaultProfile = getDefaultUpiProfile(req.user.id);
    res.json({ profiles, defaultProfile });
  } catch {
    res.status(500).json({ error: 'Failed to fetch UPI profiles' });
  }
});

router.post('/profile/upi', (req, res) => {
  try {
    const { upiId, label } = req.body;

    if (!upiId || typeof upiId !== 'string') {
      return res.status(400).json({ error: 'UPI ID is required' });
    }

    if (!isValidUpiId(upiId)) {
      return res.status(400).json({
        error: 'Invalid UPI ID format. Expected: name@bank (e.g., rahul@oksbi, 9876543210@ybl)',
      });
    }

    const profileLabel = label?.trim() || 'UPI';
    const profile = addUpiProfile(req.user.id, upiId.trim().toLowerCase(), profileLabel);
    res.status(201).json(profile);
  } catch (error) {
    if (error.message === 'UPI ID already exists') {
      return res.status(409).json({ error: 'This UPI ID is already saved' });
    }
    res.status(500).json({ error: 'Failed to add UPI profile' });
  }
});

router.post('/profile/upi/:id/default', (req, res) => {
  try {
    setUpiProfileAsDefault(req.params.id, req.user.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to set default' });
  }
});

router.put('/profile/upi/:id', (req, res) => {
  try {
    const { label } = req.body;
    if (!label || typeof label !== 'string') {
      return res.status(400).json({ error: 'Label is required' });
    }
    updateUpiProfileLabel(req.params.id, req.user.id, label.trim());
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update label' });
  }
});

router.delete('/profile/upi/:id', (req, res) => {
  try {
    deleteUpiProfile(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'Profile not found') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

router.get('/profile/upi/default', (req, res) => {
  try {
    const profile = getDefaultUpiProfile(req.user.id);
    if (!profile) {
      return res.json({ hasDefault: false });
    }
    res.json({ hasDefault: true, ...profile });
  } catch {
    res.status(500).json({ error: 'Failed to fetch default UPI profile' });
  }
});

export default router;

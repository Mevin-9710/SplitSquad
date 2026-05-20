import express from 'express';
import { getParticipantByVerificationCode, markParticipantVerified } from '../../models/participant.js';
import { generateUpiUri } from '../../utils/upi.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/verify/:code', (req, res) => {
  try {
    const participant = getParticipantByVerificationCode(req.params.code);
    if (!participant) {
      return res.status(404).render('verify', {
        error: 'Invalid or expired verification link.',
        participant: null,
        alreadyVerified: false,
        success: false,
      });
    }

    const amountRupees = (participant.amount / 100).toFixed(2);
    let upiLink = null;

    if (participant.payment_mode === 'merchant_direct' && participant.merchant_upi_id) {
      upiLink = generateUpiUri({
        pa: participant.merchant_upi_id,
        pn: participant.merchant_name || 'Merchant',
        am: amountRupees,
        tn: `SplitSquad: ${participant.split_description}`,
        cu: participant.merchant_currency || 'INR',
      });
    }

    res.render('verify', {
      error: null,
      participant: {
        ...participant,
        amountRupees,
        upiLink,
        splitTotalRupees: (participant.split_total / 100).toFixed(2),
      },
      alreadyVerified: participant.participant_verified === 1,
      success: false,
    });
  } catch (error) {
    logger.error('Error loading verification page', { error: error.message });
    res.status(500).render('verify', {
      error: 'Failed to load verification page.',
      participant: null,
      alreadyVerified: false,
      success: false,
    });
  }
});

router.post('/api/public/verify/:code', (req, res) => {
  try {
    const participant = getParticipantByVerificationCode(req.params.code);
    if (!participant) {
      return res.status(404).json({ success: false, error: 'Invalid verification code.' });
    }

    const result = markParticipantVerified(participant.id);

    if (result.notFound) {
      return res.status(404).json({ success: false, error: 'Participant not found.' });
    }

    if (result.alreadyVerified) {
      return res.status(409).json({ success: false, error: 'This payment has already been verified. This link is single-use.', alreadyVerified: true });
    }

    if (result.success) {
      logger.info('Participant verified payment', {
        participantId: participant.id,
        name: participant.name,
        splitId: participant.split_id,
      });
      return res.json({ success: true, alreadyVerified: false });
    }

    res.status(500).json({ success: false, error: 'Failed to verify payment.' });
  } catch (error) {
    logger.error('Error verifying payment', { error: error.message });
    res.status(500).json({ success: false, error: 'Failed to verify payment.' });
  }
});

export default router;

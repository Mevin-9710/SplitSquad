import express from 'express';
import { createSplit, getRecentSplits, getSplitById } from '../../models/split.js';
import { addParticipant } from '../../models/participant.js';
import { isEvolutionConfigured, sendMessage as sendEvolutionMessage, getConnectionStatus, getInstanceName } from '../../services/evolution/client.js';
import { isConnected as isStandardConnected, sendMessage as sendStandardMessage, getOrCreateClient, getCurrentQR } from '../../services/whatsapp/client.js';
import { normalizePhone } from '../../utils/phone.js';
import { generateUpiUri } from '../../utils/upi.js';
import { generateParticipantMessage } from '../../utils/whatsapp.js';
import logger from '../../utils/logger.js';
import { config } from '../../config/index.js';
import { getDefaultUpiProfile as getDbDefaultUpiProfile } from '../../models/userProfile.js';

let appEvents = null;

export function setEvents(events) {
  appEvents = events;
}

const router = express.Router();
const sendRateState = new Map();

function enforceSendRateLimit(req, res, next) {
  const key = req.creatorId;
  const now = Date.now();
  const bucket = sendRateState.get(key) || [];
  const nextBucket = bucket.filter((ts) => now - ts < config.SEND_RATE_LIMIT_WINDOW_MS);

  if (nextBucket.length >= config.SEND_RATE_LIMIT_MAX) {
    return res.status(429).json({ success: false, error: 'Rate limit exceeded. Please wait and retry.' });
  }

  nextBucket.push(now);
  sendRateState.set(key, nextBucket);
  next();
}

async function getUpiPayeeForSplit(split, creatorId) {
  if (split.payment_mode === 'merchant_direct' && split.merchant_upi_id) {
    return { pa: split.merchant_upi_id, pn: split.merchant_name || 'Merchant' };
  }

  const profile = getDbDefaultUpiProfile(creatorId);
  if (profile) {
    return { pa: profile.upi_id, pn: profile.label || creatorId };
  }

  return { pa: `${creatorId}@upi`, pn: creatorId };
}

async function buildParticipantMessage(split, participant, creatorId, appBaseUrl) {
  const payee = await getUpiPayeeForSplit(split, creatorId);
  const amountRupees = (participant.amount / 100).toFixed(2);
  const upiLink = generateUpiUri({
    pa: payee.pa,
    pn: payee.pn,
    am: amountRupees,
    tn: `SplitSquad: ${split.description}`,
    cu: split.merchant_currency || 'INR',
  });
  const splitUrl = `${appBaseUrl}/split/${split.id}`;

  return generateParticipantMessage({
    participantName: participant.name,
    amount: amountRupees,
    splitTitle: split.description,
    upiLink,
    splitUrl,
  });
}

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/splits', (req, res) => {
  try {
    const splits = getRecentSplits(20, req.creatorId);
    res.json({ splits });
  } catch {
    res.status(500).json({ error: 'Failed to list splits' });
  }
});

router.post('/splits', (req, res) => {
  try {
    const { description, amount, participants, paymentMode, merchantUpiId, merchantName, merchantCurrency } = req.body;

    if (!description || typeof description !== 'string') return res.status(400).json({ error: 'description is required and must be a string' });
    if (amount === undefined || typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'amount is required and must be a positive number' });
    if (!Array.isArray(participants) || participants.length === 0) return res.status(400).json({ error: 'participants is required and must be a non-empty array' });

    const validated = [];
    for (const participant of participants) {
      const name = participant?.name?.trim();
      const normalizedPhone = normalizePhone(participant?.phone);
      const participantAmount = participant?.amount;

      if (!name) return res.status(400).json({ error: 'Each participant must have a name' });
      if (!normalizedPhone) return res.status(400).json({ error: `Invalid phone for participant ${name}` });
      if (typeof participantAmount !== 'number' || participantAmount < 0) return res.status(400).json({ error: `Invalid amount for participant ${name}` });

      validated.push({ name, phone: normalizedPhone, amountPaise: Math.round(participantAmount * 100) });
    }

    const totalPaise = Math.round(amount * 100);
    const allocated = validated.reduce((sum, p) => sum + p.amountPaise, 0);
    if (allocated > totalPaise) return res.status(400).json({ error: 'Participant allocation exceeds split total' });

    const splitOptions = {
      paymentMode: paymentMode || 'creator_paid',
      merchantUpiId: merchantUpiId || null,
      merchantName: merchantName || null,
      merchantCurrency: merchantCurrency || 'INR',
    };

    const splitId = createSplit(description.trim(), totalPaise, req.creatorId, splitOptions);
    for (const participant of validated) {
      addParticipant(splitId, participant.name, participant.phone, participant.amountPaise);
    }

    const split = getSplitById(splitId, req.creatorId);
    res.status(201).json(split);
  } catch {
    res.status(500).json({ error: 'Failed to create split' });
  }
});

router.get('/splits/:id', (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.creatorId);
    if (!split) return res.status(404).json({ error: 'Split not found' });
    res.json(split);
  } catch {
    res.status(500).json({ error: 'Failed to fetch split' });
  }
});

router.post('/splits/:id/send-whatsapp', enforceSendRateLimit, async (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.creatorId);
    if (!split) return res.status(404).json({ success: false, error: 'Split not found' });

    getOrCreateClient(req.creatorId, appEvents);

    const useEvolution = isEvolutionConfigured();
    if (useEvolution) {
      const status = await getConnectionStatus(req.creatorId);
      if (!status.success || !status.connected) {
        return res.status(409).json({ success: false, error: 'WhatsApp not connected for this creator. Connect from /qr first.' });
      }
    } else if (!isStandardConnected(req.creatorId)) {
      return res.status(409).json({ success: false, error: 'WhatsApp not connected. Scan QR from /qr to connect your WhatsApp.' });
    }

    const participants = split.participants || [];
    if (!participants.length) return res.status(400).json({ success: false, error: 'No participants to message' });

    const appBaseUrl = config.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;

    const results = [];
    for (const participant of participants) {
      const message = await buildParticipantMessage(split, participant, req.creatorId, appBaseUrl);
      const result = useEvolution
        ? await sendEvolutionMessage(req.creatorId, participant.phone, message)
        : await sendStandardMessage(req.creatorId, participant.phone, message).then(() => ({ success: true })).catch((error) => ({ success: false, error: error.message }));
      results.push({
        name: participant.name,
        phone: participant.phone,
        success: !!result.success,
        error: result.success ? null : (result.error || 'Send failed'),
      });
    }

    const delivered = results.filter((r) => r.success).length;

    logger.info('Split send summary', {
      creatorId: req.creatorId,
      splitId: split.id,
      instanceName: useEvolution ? getInstanceName(req.creatorId) : 'standard_whatsapp_web',
      delivered,
      total: results.length,
    });

    res.json({
      success: delivered > 0,
      splitId: split.id,
      delivered,
      total: results.length,
      results,
    });
  } catch (error) {
    logger.error('Error sending split via WhatsApp', { creatorId: req.creatorId, splitId: req.params.id, error: error.message });
    res.status(500).json({ success: false, error: 'Failed to send split messages' });
  }
});

router.post('/splits/:id/send-whatsapp/:participantId', enforceSendRateLimit, async (req, res) => {
  try {
    const split = getSplitById(req.params.id, req.creatorId);
    if (!split) return res.status(404).json({ success: false, error: 'Split not found' });

    const participant = split.participants?.find(p => p.id === req.params.participantId);
    if (!participant) return res.status(404).json({ success: false, error: 'Participant not found' });

    getOrCreateClient(req.creatorId, appEvents);

    const useEvolution = isEvolutionConfigured();
    if (useEvolution) {
      const status = await getConnectionStatus(req.creatorId);
      if (!status.success || !status.connected) {
        return res.status(409).json({ success: false, error: 'WhatsApp not connected. Connect from /qr first.' });
      }
    } else if (!isStandardConnected(req.creatorId)) {
      return res.status(409).json({ success: false, error: 'WhatsApp not connected. Scan QR from /qr to connect your WhatsApp.' });
    }

    const appBaseUrl = config.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const message = await buildParticipantMessage(split, participant, req.creatorId, appBaseUrl);

    const result = useEvolution
      ? await sendEvolutionMessage(req.creatorId, participant.phone, message)
      : await sendStandardMessage(req.creatorId, participant.phone, message).then(() => ({ success: true })).catch((error) => ({ success: false, error: error.message }));

    logger.info('Sent individual WhatsApp message', {
      creatorId: req.creatorId,
      splitId: split.id,
      participantName: participant.name,
      success: !!result.success,
    });

    res.json({
      success: !!result.success,
      participantName: participant.name,
      error: result.success ? null : (result.error || 'Send failed'),
    });
  } catch (error) {
    logger.error('Error sending individual WhatsApp message', { creatorId: req.creatorId, splitId: req.params.id, error: error.message });
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

export default router;

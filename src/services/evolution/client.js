import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';

const creatorState = new Map();

export function isEvolutionConfigured() {
  return !!(config.EVOLUTION_API_URL && config.EVOLUTION_API_KEY);
}

export function getInstanceName(creatorId) {
  const safeCreator = (creatorId || 'anonymous').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  return `${config.EVOLUTION_INSTANCE_PREFIX}_${safeCreator}`;
}

function buildUrl(endpoint, creatorId) {
  const baseUrl = config.EVOLUTION_API_URL.replace(/\/+$/, '');
  const instance = getInstanceName(creatorId);
  return `${baseUrl}${endpoint.replace('{instance}', instance)}`;
}

async function apiRequest(endpoint, creatorId, method = 'GET', body = null) {
  const url = buildUrl(endpoint, creatorId);
  const headers = { apikey: config.EVOLUTION_API_KEY, 'Content-Type': 'application/json' };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    logger.error('Evolution API request failed', { creatorId, endpoint, error: error.message });
    return { success: false, error: error.message };
  }
}

function updateState(creatorId, patch) {
  const current = creatorState.get(creatorId) || { qr: null, state: 'disconnected', connected: false };
  const next = { ...current, ...patch };
  creatorState.set(creatorId, next);
  return next;
}

export async function connectEvolution(creatorId) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };

  const instanceName = getInstanceName(creatorId);
  const status = await apiRequest('/instance/check/{instance}', creatorId);
  if (status.success && status.data?.state === 'open') {
    updateState(creatorId, { connected: true, state: 'connected', qr: null });
    return { success: true, state: 'connected', instanceName };
  }

  const connectResult = await apiRequest('/instance/connect/{instance}', creatorId, 'GET');
  if (!connectResult.success) {
    return { success: false, error: connectResult.error || 'Failed to connect', instanceName };
  }

  const qr = connectResult.data?.base64 || connectResult.data?.qrcode || null;
  updateState(creatorId, { connected: false, state: 'connecting', qr });
  return { success: true, state: 'connecting', qr, instanceName };
}

export async function getQRCode(creatorId) {
  const connectResult = await connectEvolution(creatorId);
  if (!connectResult.success) return connectResult;

  return {
    success: true,
    qr: connectResult.qr || null,
    state: connectResult.state,
    instanceName: connectResult.instanceName,
  };
}

export async function getConnectionStatus(creatorId) {
  if (!isEvolutionConfigured()) {
    return { success: false, connected: false, configured: false, error: 'Evolution API not configured' };
  }

  const instanceName = getInstanceName(creatorId);
  const result = await apiRequest('/instance/check/{instance}', creatorId);
  if (!result.success) {
    updateState(creatorId, { connected: false, state: 'error' });
    return { success: false, connected: false, configured: true, error: 'Failed to check status', instanceName };
  }

  const connected = result.data?.state === 'open';
  updateState(creatorId, { connected, state: connected ? 'connected' : 'disconnected', qr: connected ? null : (creatorState.get(creatorId)?.qr || null) });

  return {
    success: true,
    connected,
    configured: true,
    state: connected ? 'connected' : 'disconnected',
    phone: result.data?.phone || result.data?.number || null,
    instanceName,
  };
}

export async function disconnectEvolution(creatorId) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };
  await apiRequest('/instance/disconnect/{instance}', creatorId, 'DELETE');
  updateState(creatorId, { connected: false, state: 'disconnected', qr: null });
  return { success: true };
}

export async function sendMessage(creatorId, to, message) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };

  const status = await getConnectionStatus(creatorId);
  if (!status.success || !status.connected) {
    return { success: false, error: 'Creator WhatsApp is not connected' };
  }

  const result = await apiRequest('/message/sendText/{instance}', creatorId, 'POST', {
    number: to,
    text: message,
  });

  if (!result.success) {
    return { success: false, error: result.data?.message || result.error || 'Failed to send message' };
  }

  return { success: true, data: result.data };
}

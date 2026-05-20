import { config } from '../../config/index.js';
import logger from '../../utils/logger.js';

const userState = new Map();

export function isEvolutionConfigured() {
  return !!(config.EVOLUTION_API_URL && config.EVOLUTION_API_KEY);
}

export function getInstanceName(userId) {
  const safeUser = (userId || 'anonymous').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  return `${config.EVOLUTION_INSTANCE_PREFIX}_${safeUser}`;
}

function buildUrl(endpoint, userId) {
  const baseUrl = config.EVOLUTION_API_URL.replace(/\/+$/, '');
  const instance = getInstanceName(userId);
  return `${baseUrl}${endpoint.replace('{instance}', instance)}`;
}

async function apiRequest(endpoint, userId, method = 'GET', body = null) {
  const url = buildUrl(endpoint, userId);
  const headers = { apikey: config.EVOLUTION_API_KEY, 'Content-Type': 'application/json' };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    logger.error('Evolution API request failed', { userId, endpoint, error: error.message });
    return { success: false, error: error.message };
  }
}

function updateState(userId, patch) {
  const current = userState.get(userId) || { qr: null, state: 'disconnected', connected: false };
  const next = { ...current, ...patch };
  userState.set(userId, next);
  return next;
}

export async function connectEvolution(userId) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };

  const instanceName = getInstanceName(userId);
  const status = await apiRequest('/instance/check/{instance}', userId);
  if (status.success && status.data?.state === 'open') {
    updateState(userId, { connected: true, state: 'connected', qr: null });
    return { success: true, state: 'connected', instanceName };
  }

  const connectResult = await apiRequest('/instance/connect/{instance}', userId, 'GET');
  if (!connectResult.success) {
    return { success: false, error: connectResult.error || 'Failed to connect', instanceName };
  }

  const qr = connectResult.data?.base64 || connectResult.data?.qrcode || null;
  updateState(userId, { connected: false, state: 'connecting', qr });
  return { success: true, state: 'connecting', qr, instanceName };
}

export async function getQRCode(userId) {
  const connectResult = await connectEvolution(userId);
  if (!connectResult.success) return connectResult;

  return {
    success: true,
    qr: connectResult.qr || null,
    state: connectResult.state,
    instanceName: connectResult.instanceName,
  };
}

export async function getConnectionStatus(userId) {
  if (!isEvolutionConfigured()) {
    return { success: false, connected: false, configured: false, error: 'Evolution API not configured' };
  }

  const instanceName = getInstanceName(userId);
  const result = await apiRequest('/instance/check/{instance}', userId);
  if (!result.success) {
    updateState(userId, { connected: false, state: 'error' });
    return { success: false, connected: false, configured: true, error: 'Failed to check status', instanceName };
  }

  const connected = result.data?.state === 'open';
  updateState(userId, { connected, state: connected ? 'connected' : 'disconnected', qr: connected ? null : (userState.get(userId)?.qr || null) });

  return {
    success: true,
    connected,
    configured: true,
    state: connected ? 'connected' : 'disconnected',
    phone: result.data?.phone || result.data?.number || null,
    instanceName,
  };
}

export async function disconnectEvolution(userId) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };
  await apiRequest('/instance/disconnect/{instance}', userId, 'DELETE');
  updateState(userId, { connected: false, state: 'disconnected', qr: null });
  return { success: true };
}

export async function sendMessage(userId, to, message) {
  if (!isEvolutionConfigured()) return { success: false, error: 'Evolution API not configured' };

  const status = await getConnectionStatus(userId);
  if (!status.success || !status.connected) {
    return { success: false, error: 'User WhatsApp is not connected' };
  }

  const result = await apiRequest('/message/sendText/{instance}', userId, 'POST', {
    number: to,
    text: message,
  });

  if (!result.success) {
    return { success: false, error: result.data?.message || result.error || 'Failed to send message' };
  }

  return { success: true, data: result.data };
}

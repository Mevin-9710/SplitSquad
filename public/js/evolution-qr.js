/**
 * Evolution API QR Code Handler
 * 
 * Manages QR code display and polling for Evolution API connections
 */

const EVOLUTION_API_BASE = '/api/evolution';

/**
 * Check Evolution API status
 * @returns {Promise<Object>} Status object
 */
export async function getEvolutionStatus() {
  try {
    const response = await fetch(`${EVOLUTION_API_BASE}/status`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get Evolution status:', error);
    return { configured: false, connected: false, error: error.message };
  }
}

/**
 * Get Evolution API QR code
 * @returns {Promise<Object>} QR data
 */
export async function getEvolutionQR() {
  try {
    const response = await fetch(`${EVOLUTION_API_BASE}/qr`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get Evolution QR:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Connect to Evolution API
 * @returns {Promise<Object>} Connection result
 */
export async function connectEvolution() {
  try {
    const response = await fetch(`${EVOLUTION_API_BASE}/connect`, { method: 'POST' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to connect Evolution:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Disconnect from Evolution API
 * @returns {Promise<Object>} Result
 */
export async function disconnectEvolution() {
  try {
    const response = await fetch(`${EVOLUTION_API_BASE}/disconnect`, { method: 'POST' });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to disconnect Evolution:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create an Evolution API QR handler instance
 * @param {Object} options - Configuration options
 * @param {string} options.onStatusChange - Callback for status changes
 * @param {string} options.onQRChange - Callback for QR updates
 * @returns {Object} Handler instance
 */
export function createEvolutionQRHandler(options = {}) {
  const { onStatusChange, onQRChange } = options;
  let polling = false;
  let pollInterval = null;

  async function checkStatus() {
    const status = await getEvolutionStatus();
    onStatusChange?.(status);

    if (status.connected) {
      stopPolling();
      onQRChange?.({ state: 'connected', qr: null });
    }

    return status;
  }

  async function fetchQR() {
    const result = await getEvolutionQR();
    if (result.success && result.qr) {
      onQRChange?.(result);
    }
    return result;
  }

  function startPolling(intervalMs = 3000) {
    if (polling) return;
    polling = true;
    pollInterval = setInterval(async () => {
      if (!polling) return;
      await checkStatus();
    }, intervalMs);
  }

  function stopPolling() {
    polling = false;
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }

  async function connect() {
    const result = await connectEvolution();
    await fetchQR();
    startPolling();
    return result;
  }

  async function disconnect() {
    const result = await disconnectEvolution();
    stopPolling();
    return result;
  }

  return {
    checkStatus,
    fetchQR,
    connect,
    disconnect,
    startPolling,
    stopPolling,
  };
}

export default {
  getEvolutionStatus,
  getEvolutionQR,
  connectEvolution,
  disconnectEvolution,
  createEvolutionQRHandler,
};
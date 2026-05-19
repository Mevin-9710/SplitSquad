/**
 * QR Scanner Component
 *
 * Uses html5-qrcode library to scan UPI QR codes from the device camera.
 * Parses UPI URIs and extracts payment details.
 */

let html5QrcodeScanner = null;
let scannedUpiData = null;

function parseUpiUri(uri) {
  if (!uri || !uri.startsWith('upi://pay')) {
    return { valid: false, error: 'Not a UPI QR code' };
  }

  try {
    const queryString = uri.slice('upi://pay?'.length);
    const params = new URLSearchParams(queryString);

    const pa = params.get('pa');
    if (!pa) {
      return { valid: false, error: 'Missing UPI ID (pa)' };
    }

    return {
      valid: true,
      pa,
      pn: params.get('pn') || '',
      am: params.get('am') || '',
      tn: params.get('tn') || '',
      cu: params.get('cu') || 'INR',
      raw: uri,
    };
  } catch (error) {
    return { valid: false, error: `Parse error: ${error.message}` };
  }
}

function showStatus(msg, isError = false) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.className = `text-sm text-center mt-2 ${isError ? 'text-red-500' : 'text-green-600'}`;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

function displayScanResult(data) {
  scannedUpiData = data;

  document.getElementById('res-pn').textContent = data.pn || 'N/A';
  document.getElementById('res-pa').textContent = data.pa;
  document.getElementById('res-am').textContent = data.am ? `₹${data.am}` : 'Not included';
  document.getElementById('res-cu').textContent = data.cu;

  document.getElementById('scan-result').classList.remove('hidden');
  document.getElementById('qr-reader-status').textContent = 'QR code scanned successfully!';

  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear();
  }
}

function useScannedData() {
  if (!scannedUpiData) return;

  if (scannedUpiData.am) {
    sessionStorage.setItem('splitsquad_qr_data', JSON.stringify(scannedUpiData));
    window.location.href = '/';
  } else {
    const modal = document.getElementById('amount-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('manual-amount').focus();
  }
}

function startScanner() {
  const statusEl = document.getElementById('qr-reader-status');
  statusEl.textContent = 'Starting camera...';

  html5QrcodeScanner = new Html5Qrcode('qr-reader');

  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
  };

  html5QrcodeScanner.start(
    { facingMode: 'environment' },
    config,
    (decodedText) => {
      const result = parseUpiUri(decodedText);
      if (result.valid) {
        displayScanResult(result);
      } else {
        statusEl.textContent = `Invalid QR: ${result.error}. Try again.`;
        showStatus('Not a valid UPI QR code', true);
      }
    },
    (errorMessage) => {
      // Ignore scan errors (normal during scanning)
    }
  ).then(() => {
    statusEl.textContent = 'Point camera at UPI QR code';
  }).catch((err) => {
    statusEl.textContent = 'Camera access denied or not available';
    showStatus('Please allow camera access to scan QR codes', true);
    console.error('Scanner start failed:', err);
  });
}

function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner.clear();
      html5QrcodeScanner = null;
      document.getElementById('qr-reader-status').textContent = 'Scanner stopped';
    }).catch(console.error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.createElement('button');
  startBtn.id = 'start-scanner-btn';
  startBtn.className = 'w-full bg-green-600 text-white rounded-lg px-4 py-2 font-medium mb-3';
  startBtn.textContent = 'Start Scanner';
  document.getElementById('qr-reader').before(startBtn);

  startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    startScanner();
  });

  document.getElementById('use-scanned-data').addEventListener('click', useScannedData);

  document.getElementById('amount-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('manual-amount').value;
    if (!amount || parseFloat(amount) <= 0) return;

    scannedUpiData.am = amount;
    sessionStorage.setItem('splitsquad_qr_data', JSON.stringify(scannedUpiData));
    window.location.href = '/';
  });

  document.getElementById('cancel-amount').addEventListener('click', () => {
    document.getElementById('amount-modal').classList.add('hidden');
    document.getElementById('amount-modal').classList.remove('flex');
  });
});

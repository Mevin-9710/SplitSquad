/**
 * UPI URI Parser and Generator
 *
 * Parses UPI payment URIs from QR codes and generates new UPI links
 * for individual payments.
 *
 * Example UPI URI:
 * upi://pay?pa=shop@upi&pn=CoffeeShop&am=500&cu=INR&tn=Dinner
 */

const UPI_SCHEME = 'upi://pay';

export function parseUpiUri(uri) {
  if (!uri || !uri.startsWith(UPI_SCHEME)) {
    return { valid: false, error: 'Invalid UPI URI scheme' };
  }

  try {
    const queryString = uri.slice(UPI_SCHEME.length + 1);
    const params = new URLSearchParams(queryString);

    const pa = params.get('pa');
    if (!pa) {
      return { valid: false, error: 'Missing required UPI parameter: pa (payee address)' };
    }

    return {
      valid: true,
      pa,
      pn: params.get('pn') || '',
      am: params.get('am') || '',
      tn: params.get('tn') || '',
      cu: params.get('cu') || 'INR',
      mc: params.get('mc') || '',
      tr: params.get('tr') || '',
      raw: uri,
    };
  } catch (error) {
    return { valid: false, error: `Failed to parse UPI URI: ${error.message}` };
  }
}

export function generateUpiUri(options) {
  const { pa, pn, am, tn, cu = 'INR', mc, tr } = options;

  if (!pa) {
    throw new Error('UPI ID (pa) is required');
  }

  const params = new URLSearchParams();
  params.set('pa', pa);
  if (pn) params.set('pn', pn);
  if (am) params.set('am', String(am));
  if (tn) params.set('tn', tn);
  if (cu) params.set('cu', cu);
  if (mc) params.set('mc', mc);
  if (tr) params.set('tr', tr);

  return `${UPI_SCHEME}?${params.toString()}`;
}

export function isValidUpiId(upiId) {
  if (!upiId || typeof upiId !== 'string') return false;
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return regex.test(upiId.trim());
}

export function formatUpiDisplayAmount(amount) {
  if (!amount) return '₹0';
  return `₹${parseFloat(amount).toFixed(2)}`;
}

export function isUpiUri(uri) {
  return typeof uri === 'string' && uri.startsWith(UPI_SCHEME);
}

export default {
  parseUpiUri,
  generateUpiUri,
  isValidUpiId,
  formatUpiDisplayAmount,
  isUpiUri,
};

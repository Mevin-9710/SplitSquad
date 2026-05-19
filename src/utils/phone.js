export function normalizePhone(input) {
  if (!input || typeof input !== 'string') return null;
  let digits = input.replace(/[^\d]/g, '');

  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10) digits = `91${digits}`;

  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function isValidPhone(input) {
  return normalizePhone(input) !== null;
}

/**
 * SplitSquad - Formatting Utilities
 */

/**
 * Format paise to Indian Rupee currency string
 * @param {number} paise - Amount in paise (e.g., 45000 = ₹450.00)
 * @returns {string} Formatted currency string
 */
function formatCurrency(paise) {
  const rupees = paise / 100;
  return '₹' + rupees.toFixed(2);
}

/**
 * Format ISO date string to readable format
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date (e.g., "May 15, 2026")
 */
function formatDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Relative time string
 */
function formatRelativeTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(isoString);
}
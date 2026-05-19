/**
 * Split Calculator Utility
 *
 * Handles equal split calculations with proper decimal rounding.
 * Ensures the total distributed amount matches the original bill exactly.
 *
 * Example: ₹1000 split among 3 users → [334, 333, 333]
 */

export function calculateEqualSplit(totalAmount, participantCount) {
  if (participantCount <= 0) return [];
  if (participantCount === 1) return [totalAmount];

  const baseAmount = Math.floor(totalAmount / participantCount);
  const remainder = totalAmount - (baseAmount * participantCount);

  const shares = [];
  for (let i = 0; i < participantCount; i++) {
    shares.push(baseAmount + (i < remainder ? 1 : 0));
  }

  return shares;
}

export function calculateEqualSplitRupees(totalRupees, participantCount) {
  const totalPaise = Math.round(totalRupees * 100);
  const sharesPaise = calculateEqualSplit(totalPaise, participantCount);
  return sharesPaise.map(paise => Math.round((paise / 100) * 100) / 100);
}

export function validateSplitTotal(shares, totalAmount) {
  const sum = shares.reduce((acc, share) => acc + share, 0);
  return sum === totalAmount;
}

export function calculateCustomSplit(totalAmount, customShares) {
  const sum = customShares.reduce((acc, share) => acc + share, 0);
  const diff = totalAmount - sum;

  if (Math.abs(diff) > 0) {
    const adjusted = [...customShares];
    adjusted[adjusted.length - 1] += diff;
    return adjusted;
  }

  return customShares;
}

export default {
  calculateEqualSplit,
  calculateEqualSplitRupees,
  validateSplitTotal,
  calculateCustomSplit,
};

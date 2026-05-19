/**
 * WhatsApp Message Generator
 *
 * Generates personalized WhatsApp messages for split participants
 * and creates wa.me links for direct sharing.
 */

export function generateParticipantMessage(options) {
  const {
    participantName,
    amount,
    splitTitle,
    upiLink,
    splitUrl,
    currency = '₹',
  } = options;

  const lines = [
    `Hey ${participantName}! 👋`,
    '',
    `Your share for "${splitTitle}" is ${currency}${amount}.`,
    '',
    '💳 Pay here:',
    upiLink,
    '',
    `📋 View split details:`,
    splitUrl,
    '',
    '— Sent via SplitSquad',
  ];

  return lines.join('\n');
}

export function generateWhatsAppShareLink(phone, message) {
  const cleanedPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
}

export function generateWhatsAppShareAllLink(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
}

export function formatShareSummary(participants) {
  const lines = ['*SplitSquad Bill Split*', ''];
  participants.forEach(p => {
    lines.push(`• ${p.name}: ₹${p.amount}`);
  });
  lines.push('');
  lines.push('Open SplitSquad to view details and pay.');
  return lines.join('\n');
}

export default {
  generateParticipantMessage,
  generateWhatsAppShareLink,
  generateWhatsAppShareAllLink,
  formatShareSummary,
};

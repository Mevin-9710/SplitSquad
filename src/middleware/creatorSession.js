import crypto from 'crypto';

function parseCookies(rawCookieHeader = '') {
  const out = {};
  const parts = rawCookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = decodeURIComponent(part.slice(idx + 1).trim());
    out[key] = value;
  }
  return out;
}

function cleanCreatorId(value) {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return normalized.length >= 3 ? normalized.slice(0, 64) : null;
}

function cleanCreatorName(value) {
  if (!value || typeof value !== 'string') return null;
  const normalized = value.trim().replace(/[^\w\s.-]/g, '').replace(/\s+/g, ' ');
  return normalized.length >= 2 ? normalized.slice(0, 50) : null;
}

function creatorIdFromName(name) {
  if (!name) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (!slug) return null;
  return `creator_${slug.slice(0, 56)}`;
}

export function attachCreatorSession(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || '');
  const fromNameHeader = cleanCreatorName(req.header('x-creator-name'));
  const fromNameQuery = cleanCreatorName(req.query.creatorName);
  const fromNameCookie = cleanCreatorName(cookies.creator_name);
  const creatorName = fromNameHeader || fromNameQuery || fromNameCookie || null;

  const fromHeader = cleanCreatorId(req.header('x-creator-id'));
  const fromQuery = cleanCreatorId(req.query.creatorId);
  const fromCookie = cleanCreatorId(cookies.creator_id);
  const fromNameDerived = creatorIdFromName(creatorName);

  const creatorId = fromHeader || fromQuery || fromNameDerived || fromCookie || `creator_${crypto.randomUUID().replace(/-/g, '')}`;
  const setCookies = [];

  req.creatorId = creatorId;
  req.creatorName = creatorName;

  if (fromCookie !== creatorId) {
    setCookies.push(`creator_id=${encodeURIComponent(creatorId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`);
  }
  if (creatorName && fromNameCookie !== creatorName) {
    setCookies.push(`creator_name=${encodeURIComponent(creatorName)}; Path=/; SameSite=Lax; Max-Age=31536000`);
  }
  if (setCookies.length > 0) {
    res.setHeader('Set-Cookie', setCookies);
  }

  next();
}

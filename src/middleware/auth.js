import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { findUserById } from '../models/user.js';

export function authenticateUser(req, res, next) {
  const token = req.cookies?.split_auth;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    if (req.path.startsWith('/api/') || req.xhr) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/login');
  }
  next();
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    config.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', `split_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; ${config.IS_PRODUCTION ? 'Secure' : ''}`);
}

export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', 'split_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

export default {
  authenticateUser,
  requireAuth,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
};

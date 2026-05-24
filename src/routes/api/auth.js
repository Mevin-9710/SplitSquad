import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { findUserByEmail, findUserByGoogleId, findUserById, createUser, updateLastLogin, linkGoogleAccount } from '../../models/user.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../../middleware/auth.js';
import logger from '../../utils/logger.js';
import { config } from '../../config/index.js';

const router = express.Router();
const googleEnabled = !!(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET);
const analyticsView = {
  gtmId: process.env.GTM_CONTAINER_ID || null,
  ga4Id: process.env.GA4_MEASUREMENT_ID || null,
};
const loginView = (res, opts) => res.render('login', { googleEnabled, analytics: analyticsView, ...opts });

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

function getGoogleAuthUrl(req) {
  const baseUrl = config.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
  const callbackUrl = `${baseUrl}/app/auth/google/callback`;
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: config.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    access_type: 'offline',
    prompt: 'consent',
  });

  return { url: `${GOOGLE_AUTH_URL}?${params.toString()}`, state, nonce };
}

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/app/');
  loginView(res, { error: null, success: null });
});

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return loginView(res, { error: 'Email, password, and name are required', success: null });
    }

    if (password.length < 6) {
      return loginView(res, { error: 'Password must be at least 6 characters', success: null });
    }

    const existing = findUserByEmail(email.toLowerCase());
    if (existing) {
      return loginView(res, { error: 'An account with this email already exists', success: null });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({
      email: email.toLowerCase(),
      passwordHash,
      name: name.trim(),
    });

    updateLastLogin(user.id);

    const token = generateToken(user);
    setAuthCookie(res, token);

    logger.info('User registered', { userId: user.id, email: user.email });
    return res.redirect('/app/?signup=1');
  } catch (error) {
    logger.error('Registration failed', { error: error.message });
    return loginView(res, { error: 'Registration failed. Please try again.', success: null });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return loginView(res, { error: 'Email and password are required', success: null });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return loginView(res, { error: 'Invalid email or password', success: null });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return loginView(res, { error: 'Invalid email or password', success: null });
    }

    updateLastLogin(user.id);

    const token = generateToken(user);
    setAuthCookie(res, token);

    logger.info('User logged in', { userId: user.id, email: user.email });
    return res.redirect('/app/?login=1');
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    return loginView(res, { error: 'Login failed. Please try again.', success: null });
  }
});

router.post('/auth/logout', (req, res) => {
  clearAuthCookie(res);
  logger.info('User logged out');
  return res.redirect('/app/login');
});

router.get('/auth/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = findUserById(req.user.id);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      lastLogin: user.last_login,
    });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

if (googleEnabled) {
  const pendingStates = new Map();

  router.get('/auth/google', (req, res) => {
    if (req.user) return res.redirect('/app/');
    const { url, state, nonce } = getGoogleAuthUrl(req);
    pendingStates.set(state, { nonce, timestamp: Date.now() });
    setTimeout(() => pendingStates.delete(state), 10 * 60 * 1000);
    res.redirect(url);
  });

  router.get('/auth/google/callback', async (req, res) => {
    try {
      const { code, state } = req.query;

      if (!code || !state) {
        return res.redirect('/app/login?error=missing_params');
      }

      const pending = pendingStates.get(state);
      if (!pending) {
        return res.redirect('/app/login?error=invalid_state');
      }
      pendingStates.delete(state);

      const baseUrl = config.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
      const callbackUrl = `${baseUrl}/app/auth/google/callback`;

      const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.GOOGLE_CLIENT_ID,
          client_secret: config.GOOGLE_CLIENT_SECRET,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json();
        logger.error('Google token exchange failed', { error: err });
        return res.redirect('/app/login?error=google_token_failed');
      }

      const tokens = await tokenRes.json();

      const userInfoRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userInfoRes.ok) {
        logger.error('Google userinfo fetch failed');
        return res.redirect('/app/login?error=google_userinfo_failed');
      }

      const profile = await userInfoRes.json();

      let user = findUserByGoogleId(profile.sub);
      let isNewUser = false;

      if (!user) {
        const existingEmail = profile.email ? findUserByEmail(profile.email.toLowerCase()) : null;

        if (existingEmail) {
          linkGoogleAccount(existingEmail.id, profile.sub, profile.picture);
          user = findUserById(existingEmail.id);
        } else {
          user = createUser({
            email: profile.email?.toLowerCase() || null,
            name: profile.name,
            googleId: profile.sub,
            avatarUrl: profile.picture,
          });
          isNewUser = true;
        }
      }

      updateLastLogin(user.id);

      const token = generateToken(user);
      setAuthCookie(res, token);

      logger.info('User logged in via Google', { userId: user.id, email: user.email });
      res.redirect(`/app/${isNewUser ? '?signup=1' : '?login=1'}`);
    } catch (error) {
      logger.error('Google OAuth callback error', { error: error.message });
      res.redirect('/app/login?error=google_callback_failed');
    }
  });
}

export default router;

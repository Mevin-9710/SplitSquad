import express from 'express';
import bcrypt from 'bcrypt';
import { findUserByEmail, findUserByGoogleId, findUserById, createUser, updateLastLogin, linkGoogleAccount } from '../../models/user.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../../middleware/auth.js';
import logger from '../../utils/logger.js';
import { config } from '../../config/index.js';

const router = express.Router();
const googleEnabled = !!(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET);
const loginView = (res, opts) => res.render('login', { googleEnabled, ...opts });

router.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
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
    return res.redirect('/');
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

    const user = findUserByEmail(email.toLowerCase());
    if (!user || !user.password_hash) {
      return loginView(res, { error: 'Invalid email or password', success: null });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return loginView(res, { error: 'Invalid email or password', success: null });
    }

    updateLastLogin(user.id);

    const token = generateToken(user);
    setAuthCookie(res, token);

    logger.info('User logged in', { userId: user.id, email: user.email });
    return res.redirect('/');
  } catch (error) {
    logger.error('Login failed', { error: error.message });
    return loginView(res, { error: 'Login failed. Please try again.', success: null });
  }
});

router.post('/auth/logout', (req, res) => {
  clearAuthCookie(res);
  logger.info('User logged out');
  return res.redirect('/login');
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

// Google OAuth routes (only if configured)
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  import('passport').then(({ default: Passport }) => {
    import('passport-google-oauth20').then(({ Strategy: GoogleStrategy }) => {
      const passport = new Passport();

      passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `${config.APP_BASE_URL || ''}/auth/google/callback`,
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          let user = findUserByGoogleId(profile.id);

          if (!user) {
            const existingEmail = profile.emails?.[0]?.value ? findUserByEmail(profile.emails[0].value.toLowerCase()) : null;

            if (existingEmail) {
              linkGoogleAccount(existingEmail.id, profile.id, profile.photos?.[0]?.value);
              user = findUserById(existingEmail.id);
            } else {
              user = createUser({
                email: profile.emails?.[0]?.value?.toLowerCase() || null,
                name: profile.displayName,
                googleId: profile.id,
                avatarUrl: profile.photos?.[0]?.value,
              });
            }
          }

          updateLastLogin(user.id);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }));

      passport.serializeUser((user, done) => done(null, user.id));
      passport.deserializeUser((id, done) => {
        const user = findUserById(id);
        done(null, user);
      });

      router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

      router.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
          const token = generateToken(req.user);
          setAuthCookie(res, token);
          logger.info('User logged in via Google', { userId: req.user.id, email: req.user.email });
          res.redirect('/');
        }
      );
    });
  });
}

export default router;

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { EventEmitter } from 'events';
import { config } from './config/index.js';
import { initDatabase, closeDatabase } from './database/connection.js';
import { initSchema } from './database/schema.js';
import { initWhatsAppClient, disconnectWhatsApp, isConnected, getOrCreateClient, getCurrentQR } from './services/whatsapp/client.js';
import { initHandlers } from './services/whatsapp/handlers.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { authenticateUser, requireAuth } from './middleware/auth.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const events = new EventEmitter();
events.setMaxListeners(20);

const app = express();

// Parse cookies manually (no cookie-parser dependency)
function parseCookies(req) {
  const cookies = {};
  if (!req.headers.cookie) return cookies;
  req.headers.cookie.split(';').forEach(cookie => {
    const [key, ...rest] = cookie.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(rest.join('='));
  });
  return cookies;
}

app.use((req, res, next) => {
  req.cookies = parseCookies(req);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching for all responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.use(authenticateUser);

app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, '..', 'views'));

app.use(express.static(resolve(__dirname, '..', 'public')));

import webRouter from './routes/web/index.js';
import apiSplitsRouter, { setEvents as setSplitsEvents } from './routes/api/splits.js';
import apiEvolutionRouter, { setEvents as setEvolutionEvents } from './routes/api/evolution.js';
import apiContactsRouter from './routes/api/contacts.js';
import apiProfileRouter from './routes/api/profile.js';
import authRouter from './routes/api/auth.js';

setSplitsEvents(events);
setEvolutionEvents(events);

// Public routes
app.use('/', authRouter);
app.get('/health', (req, res) => {
  const connected = req.user ? isConnected(req.user.id) : false;
  res.json({
    status: 'ok',
    whatsapp: connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes
app.use('/', requireAuth, webRouter);
app.use('/api', requireAuth, apiSplitsRouter);
app.use('/api', requireAuth, apiContactsRouter);
app.use('/api', requireAuth, apiProfileRouter);
app.use('/api/evolution', requireAuth, apiEvolutionRouter);

app.get('/status', requireAuth, (req, res) => {
  const connected = isConnected(req.user.id);
  const qr = getCurrentQR(req.user.id);
  res.json({ status: 'ok', whatsapp: connected ? 'connected' : 'disconnected', qr, userId: req.user.id });
});

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  logger.info('Starting SplitSquad...');
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`Port: ${config.PORT}`);

  logger.info('Initializing database...');
  try {
    await initDatabase();
    initSchema();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed', { error: error.message });
    process.exit(1);
  }

  logger.info('Initializing WhatsApp multi-creator mode...');

  try {
    await Promise.race([
      (async () => {
        await initWhatsAppClient(events);
        await initHandlers(events);
      })(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('WhatsApp init timeout')), 15000)),
    ]);
    logger.info('WhatsApp multi-creator mode ready');
  } catch (error) {
    logger.error('WhatsApp initialization failed', { error: error.message });
  }

  const server = app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`Health check: http://localhost:${config.PORT}/health`);
    logger.info(`Login page: http://localhost:${config.PORT}/login`);
  });

  setupGracefulShutdown(server);

  logger.info('SplitSquad started successfully');
}

function setupGracefulShutdown(server) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) {
      logger.warn('Shutdown already in progress');
      return;
    }

    isShuttingDown = true;
    logger.info(`Received ${signal} signal, shutting down gracefully...`);

    try {
      server.close(() => {
        logger.info('HTTP server closed');
      });

      await disconnectWhatsApp();

      closeDatabase();

      logger.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error: error.message });
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason: String(reason) });
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', { error: error.message });
  process.exit(1);
});

export { app, events };

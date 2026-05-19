import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { EventEmitter } from 'events';
import { config } from './config/index.js';
import { initDatabase, closeDatabase } from './database/connection.js';
import { initSchema } from './database/schema.js';
import { initWhatsAppClient, disconnectWhatsApp, isConnected } from './services/whatsapp/client.js';
import { initHandlers } from './services/whatsapp/handlers.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { attachCreatorSession } from './middleware/creatorSession.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * SplitSquad - WhatsApp Bill Splitting Bot
 *
 * Main application entry point
 */

// Event emitter for application-wide events
const events = new EventEmitter();
events.setMaxListeners(20);

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(attachCreatorSession);

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, '..', 'views'));

// Serve static files from public directory
app.use(express.static(resolve(__dirname, '..', 'public')));

// Import web routes
import webRouter from './routes/web/index.js';
import apiSplitsRouter from './routes/api/splits.js';
import apiEvolutionRouter from './routes/api/evolution.js';
import apiContactsRouter from './routes/api/contacts.js';
import apiProfileRouter from './routes/api/profile.js';

app.use('/', webRouter);
app.use('/api', apiSplitsRouter);
app.use('/api', apiContactsRouter);
app.use('/api', apiProfileRouter);
app.use('/api/evolution', apiEvolutionRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    whatsapp: isConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Status endpoint with QR code
let currentQR = null;

app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    whatsapp: isConnected() ? 'connected' : 'disconnected',
    qr: currentQR,
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Initialize the application
 */
async function bootstrap() {
  logger.info('Starting SplitSquad...');
  logger.info(`Environment: ${config.NODE_ENV}`);
  logger.info(`Port: ${config.PORT}`);

  // 1. Initialize database
  logger.info('Initializing database...');
  try {
    await initDatabase();
    initSchema();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed', { error: error.message });
    process.exit(1);
  }

  // 2. Initialize WhatsApp client
  logger.info('Initializing WhatsApp client...');

  // Listen for QR events
  events.on('qr', (qr) => {
    currentQR = qr;
    logger.info('QR code ready - scan with WhatsApp');
  });

  events.on('connected', () => {
    currentQR = null;
    logger.info('WhatsApp connected');
  });

  try {
    await Promise.race([
      (async () => {
        await initWhatsAppClient(events);
        await initHandlers(events);
      })(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('WhatsApp init timeout')), 15000)),
    ]);
    logger.info('WhatsApp client ready');
  } catch (error) {
    logger.error('WhatsApp initialization failed', { error: error.message });
    // Continue anyway - WhatsApp might reconnect
  }

  // 3. Start Express server
  const server = app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
    logger.info(`Health check: http://localhost:${config.PORT}/health`);
    logger.info(`QR status: http://localhost:${config.PORT}/status`);
  });

  // 4. Setup graceful shutdown
  setupGracefulShutdown(server);

  logger.info('SplitSquad started successfully');
}

/**
 * Setup graceful shutdown handlers
 * @param {http.Server} server - HTTP server instance
 */
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
      // Stop accepting new connections
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Disconnect WhatsApp
      await disconnectWhatsApp();

      // Close database
      closeDatabase();

      logger.info('Shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { error: error.message });
      process.exit(1);
    }
  }

  // Handle SIGTERM (docker, kubernetes)
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    shutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason: String(reason) });
  });
}

// Run the application
bootstrap().catch((error) => {
  logger.error('Failed to start application', { error: error.message });
  process.exit(1);
});

export { app, events };

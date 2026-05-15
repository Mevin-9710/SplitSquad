import initSqlJs from 'sql.js';
import { dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

let db = null;
let dbPath = null;

/**
 * Initialize SQLite database connection using sql.js
 * @returns {Promise<Database>} SQLite database instance
 */
export async function initDatabase() {
  if (db) {
    logger.warn('Database already initialized');
    return db;
  }

  dbPath = config.DATABASE_PATH;
  const dbDir = dirname(dbPath);

  // Ensure database directory exists
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
    logger.info(`Created database directory: ${dbDir}`);
  }

  try {
    // Initialize sql.js
    const SQL = await initSqlJs();

    // Load existing database or create new one
    if (existsSync(dbPath)) {
      const fileBuffer = readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      logger.info(`Database loaded from: ${dbPath}`);
    } else {
      db = new SQL.Database();
      logger.info('Created new database');
    }

    // Save function for persistence
    db.saveToFile = () => {
      if (db && dbPath) {
        const data = db.export();
        const buffer = Buffer.from(data);
        writeFileSync(dbPath, buffer);
        logger.debug('Database saved to disk');
      }
    };

    // Auto-save every 5 seconds if there are changes
    setInterval(() => {
      if (db) {
        db.saveToFile();
      }
    }, 5000);

    logger.info(`Database initialized at: ${dbPath}`);

    return db;
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message });
    throw error;
  }
}

/**
 * Get the database instance
 * @returns {Database} SQLite database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection and save
 */
export function closeDatabase() {
  if (db) {
    // Save before closing
    if (dbPath) {
      const data = db.export();
      const buffer = Buffer.from(data);
      writeFileSync(dbPath, buffer);
      logger.info('Database saved before closing');
    }
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

export default { initDatabase, getDatabase, closeDatabase };
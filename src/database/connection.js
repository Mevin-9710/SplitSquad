import Database from 'better-sqlite3';
import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

let db = null;

/**
 * Initialize SQLite database connection
 * @returns {Database.Database} SQLite database instance
 */
export function initDatabase() {
  if (db) {
    logger.warn('Database already initialized');
    return db;
  }

  const dbPath = config.DATABASE_PATH;
  const dbDir = dirname(dbPath);

  // Ensure database directory exists
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
    logger.info(`Created database directory: ${dbDir}`);
  }

  try {
    db = new Database(dbPath);

    // Enable foreign keys for data integrity
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    logger.info(`Database initialized at: ${dbPath}`);

    return db;
  } catch (error) {
    logger.error('Failed to initialize database', { error: error.message });
    throw error;
  }
}

/**
 * Get the database instance
 * @returns {Database.Database} SQLite database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

export default { initDatabase, getDatabase, closeDatabase };
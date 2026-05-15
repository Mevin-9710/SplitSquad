import { getDatabase } from './connection.js';
import logger from '../utils/logger.js';

/**
 * Database schema definitions for SplitSquad
 *
 * Tables:
 * - splits: Bill split records with total amount and status
 * - participants: Individual participants in a split with their share
 * - sessions: WhatsApp session state for multi-step conversations
 */

// SQL statements for table creation
const CREATE_SPLITS_TABLE = `
  CREATE TABLE IF NOT EXISTS splits (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    FOREIGN KEY (created_by) REFERENCES participants(phone)
  )
`;

const CREATE_PARTICIPANTS_TABLE = `
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    split_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    amount INTEGER NOT NULL,
    settled INTEGER NOT NULL DEFAULT 0,
    settled_at TEXT,
    FOREIGN KEY (split_id) REFERENCES splits(id) ON DELETE CASCADE
  )
`;

const CREATE_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS sessions (
    phone TEXT PRIMARY KEY,
    state TEXT NOT NULL DEFAULT 'IDLE',
    current_split_id TEXT,
    temp_data TEXT,
    updated_at TEXT NOT NULL
  )
`;

/**
 * Initialize all database tables
 */
export function initSchema() {
  const db = getDatabase();

  try {
    // Create splits table
    db.exec(CREATE_SPLITS_TABLE);
    logger.debug('Created/verified splits table');

    // Create participants table
    db.exec(CREATE_PARTICIPANTS_TABLE);
    logger.debug('Created/verified participants table');

    // Create sessions table
    db.exec(CREATE_SESSIONS_TABLE);
    logger.debug('Created/verified sessions table');

    // Create indexes for better query performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_participants_split_id ON participants(split_id);
      CREATE INDEX IF NOT EXISTS idx_splits_created_by ON splits(created_by);
      CREATE INDEX IF NOT EXISTS idx_splits_created_at ON splits(created_at);
    `);
    logger.debug('Created/verified database indexes');

    logger.info('Database schema initialized successfully');

    return true;
  } catch (error) {
    logger.error('Failed to initialize database schema', { error: error.message });
    throw error;
  }
}

export default { initSchema };
import { getDatabase } from './connection.js';
import logger from '../utils/logger.js';

const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT NOT NULL,
    google_id TEXT UNIQUE,
    avatar_url TEXT,
    created_at TEXT NOT NULL,
    last_login TEXT
  )
`;

const CREATE_SPLITS_TABLE = `
  CREATE TABLE IF NOT EXISTS splits (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    payment_mode TEXT NOT NULL DEFAULT 'creator_paid',
    merchant_upi_id TEXT,
    merchant_name TEXT,
    merchant_currency TEXT DEFAULT 'INR'
  )
`;

const ADD_SPLIT_COLUMNS = `
  ALTER TABLE splits ADD COLUMN payment_mode TEXT;
  ALTER TABLE splits ADD COLUMN merchant_upi_id TEXT;
  ALTER TABLE splits ADD COLUMN merchant_name TEXT;
  ALTER TABLE splits ADD COLUMN merchant_currency TEXT;
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

const CREATE_CONTACTS_TABLE = `
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'friends',
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`;

const CREATE_USER_PROFILES_TABLE = `
  CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT 'UPI',
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )
`;

const ADD_PARTICIPANT_UPI_COLUMN = `
  ALTER TABLE participants ADD COLUMN upi_id TEXT;
`;

export function initSchema() {
  const db = getDatabase();

  try {
    db.exec(CREATE_USERS_TABLE);
    logger.debug('Created/verified users table');

    db.exec(CREATE_SPLITS_TABLE);
    logger.debug('Created/verified splits table');

    try {
      db.exec(ADD_SPLIT_COLUMNS);
      logger.debug('Added new columns to splits table');
    } catch {
      logger.debug('Split columns already exist or not needed');
    }

    db.exec(CREATE_PARTICIPANTS_TABLE);
    logger.debug('Created/verified participants table');

    db.exec(CREATE_SESSIONS_TABLE);
    logger.debug('Created/verified sessions table');

    db.exec(CREATE_CONTACTS_TABLE);
    logger.debug('Created/verified contacts table');

    db.exec(CREATE_USER_PROFILES_TABLE);
    logger.debug('Created/verified user_profiles table');

    try {
      db.exec(ADD_PARTICIPANT_UPI_COLUMN);
      logger.debug('Added upi_id column to participants table');
    } catch {
      logger.debug('Participant upi_id column already exists');
    }

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_participants_split_id ON participants(split_id);
      CREATE INDEX IF NOT EXISTS idx_splits_created_by ON splits(created_by);
      CREATE INDEX IF NOT EXISTS idx_splits_created_at ON splits(created_at);
      CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts(created_by);
      CREATE INDEX IF NOT EXISTS idx_contacts_category ON contacts(category, created_by);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_default ON user_profiles(user_id, is_default);
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

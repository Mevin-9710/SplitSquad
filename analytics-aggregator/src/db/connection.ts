import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import winston from 'winston';
import { config } from '../config.js';

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dbDir = dirname(config.dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
  db = new Database(config.dbPath);
  db.pragma('journal_mode = WAL');
  initSchema(db);
  logger.info(`Analytics database initialized at ${config.dbPath}`);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_snapshots (
      date TEXT PRIMARY KEY,
      active_users INTEGER DEFAULT 0,
      new_users INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      sessions INTEGER DEFAULT 0,
      bounce_rate REAL DEFAULT 0,
      avg_session_duration REAL DEFAULT 0,
      splits_created INTEGER DEFAULT 0,
      splits_completed INTEGER DEFAULT 0,
      invites_sent INTEGER DEFAULT 0,
      invites_opened INTEGER DEFAULT 0,
      payments_verified INTEGER DEFAULT 0,
      errors_count INTEGER DEFAULT 0,
      rage_clicks INTEGER DEFAULT 0,
      traffic_sources TEXT DEFAULT '{}',
      top_pages TEXT DEFAULT '[]',
      conversions TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS traffic_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      source TEXT NOT NULL,
      sessions INTEGER DEFAULT 0,
      new_users INTEGER DEFAULT 0,
      conversion_rate REAL DEFAULT 0,
      bounce_rate REAL DEFAULT 0,
      avg_session_duration REAL DEFAULT 0,
      UNIQUE(date, source)
    );

    CREATE TABLE IF NOT EXISTS funnel_stages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      stage_name TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      conversion_rate REAL DEFAULT 0,
      drop_off REAL DEFAULT 0,
      UNIQUE(date, stage_name)
    );

    CREATE TABLE IF NOT EXISTS error_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'error',
      count INTEGER DEFAULT 0,
      last_seen TEXT,
      top_errors TEXT DEFAULT '[]',
      UNIQUE(date, level)
    );

    CREATE TABLE IF NOT EXISTS seo_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      average_position REAL DEFAULT 0,
      top_queries TEXT DEFAULT '[]',
      UNIQUE(date)
    );

    CREATE TABLE IF NOT EXISTS raw_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      metric_value REAL NOT NULL,
      dimensions TEXT DEFAULT '{}',
      recorded_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS analytics_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      report_type TEXT NOT NULL DEFAULT 'daily',
      content TEXT NOT NULL,
      generated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(date, report_type)
    );

    CREATE INDEX IF NOT EXISTS idx_raw_metrics_source ON raw_metrics(source);
    CREATE INDEX IF NOT EXISTS idx_raw_metrics_recorded ON raw_metrics(recorded_at);
    CREATE INDEX IF NOT EXISTS idx_daily_snapshots_date ON daily_snapshots(date);
    CREATE INDEX IF NOT EXISTS idx_traffic_sources_date ON traffic_sources(date);
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

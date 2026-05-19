import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');

function loadEnv() {
  const envPath = resolve(rootDir, '.env');

  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();

      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`Warning: Could not read .env file: ${error.message}`);
    }
  }
}

loadEnv();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_PATH: process.env.DATABASE_PATH || resolve(rootDir, 'data', 'splitsquad.db'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  AUTH_DIR: resolve(rootDir, '.auth'),
  LOG_DIR: resolve(rootDir, 'logs'),
  IS_PRODUCTION: (process.env.NODE_ENV || 'development') === 'production',
  EVOLUTION_API_URL: process.env.EVOLUTION_API_URL || '',
  EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY || '',
  EVOLUTION_INSTANCE_PREFIX: process.env.EVOLUTION_INSTANCE_PREFIX || 'splitsquad',
  APP_BASE_URL: process.env.APP_BASE_URL || '',
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET || 'splitsquad-dev-secret',
  SEND_RATE_LIMIT_WINDOW_MS: parseInt(process.env.SEND_RATE_LIMIT_WINDOW_MS || '60000', 10),
  SEND_RATE_LIMIT_MAX: parseInt(process.env.SEND_RATE_LIMIT_MAX || '10', 10),
};

export default config;

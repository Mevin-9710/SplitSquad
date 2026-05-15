import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');

/**
 * Load environment variables from .env file
 * Supports: PORT, DATABASE_PATH, NODE_ENV
 */
function loadEnv() {
  const envPath = resolve(rootDir, '.env');

  try {
    const envContent = readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();

      // Only set if not already defined in process.env
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    // .env file is optional, continue without it
    if (error.code !== 'ENOENT') {
      console.warn(`Warning: Could not read .env file: ${error.message}`);
    }
  }
}

// Load environment variables
loadEnv();

// Export configuration with defaults
export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_PATH: process.env.DATABASE_PATH || resolve(rootDir, 'data', 'splitsquad.db'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  AUTH_DIR: resolve(rootDir, '.auth'),
  LOG_DIR: resolve(rootDir, 'logs'),
  IS_PRODUCTION: (process.env.NODE_ENV || 'development') === 'production',
};

export default config;
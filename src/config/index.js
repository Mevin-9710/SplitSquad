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
  JWT_SECRET: process.env.JWT_SECRET || 'splitsquad-dev-jwt-secret-change-in-production',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET || 'splitsquad-dev-secret',
  SEND_RATE_LIMIT_WINDOW_MS: parseInt(process.env.SEND_RATE_LIMIT_WINDOW_MS || '60000', 10),
  SEND_RATE_LIMIT_MAX: parseInt(process.env.SEND_RATE_LIMIT_MAX || '10', 10),

  GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID || '',
  GA4_API_SECRET: process.env.GA4_API_SECRET || '',
  GA4_CLIENT_EMAIL: process.env.GA4_CLIENT_EMAIL || '',
  GA4_PRIVATE_KEY: process.env.GA4_PRIVATE_KEY || '',
  GA4_PROPERTY_ID: process.env.GA4_PROPERTY_ID || '',
  GTM_CONTAINER_ID: process.env.GTM_CONTAINER_ID || '',
  CLARITY_PROJECT_ID: process.env.CLARITY_PROJECT_ID || '',
  CLARITY_API_KEY: process.env.CLARITY_API_KEY || '',
  POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || '',
  POSTHOG_HOST: process.env.POSTHOG_HOST || 'https://app.posthog.com',
  POSTHOG_HOST_URL: process.env.POSTHOG_HOST_URL || 'https://app.posthog.com',
  SENTRY_DSN: process.env.SENTRY_DSN || '',
  SENTRY_ORG: process.env.SENTRY_ORG || '',
  SENTRY_PROJECT: process.env.SENTRY_PROJECT || '',
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
  SEARCH_CONSOLE_CLIENT_EMAIL: process.env.SEARCH_CONSOLE_CLIENT_EMAIL || '',
  SEARCH_CONSOLE_PRIVATE_KEY: process.env.SEARCH_CONSOLE_PRIVATE_KEY || '',
  SEARCH_CONSOLE_SITE_URL: process.env.SEARCH_CONSOLE_SITE_URL || '',
  ANALYTICS_AGGREGATOR_PORT: parseInt(process.env.ANALYTICS_AGGREGATOR_PORT || '3001', 10),
  AI_ENGINE_PORT: parseInt(process.env.AI_ENGINE_PORT || '3002', 10),
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_BASE_URL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
  AI_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
  ANALYTICS_EVENTS_ENABLED: process.env.ANALYTICS_EVENTS_ENABLED !== 'false',
};

export default config;

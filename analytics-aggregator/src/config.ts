import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

dotenvConfig({ path: resolve(rootDir, '..', '.env') });
dotenvConfig({ path: resolve(rootDir, '.env') });

export const config = {
  port: parseInt(process.env.ANALYTICS_AGGREGATOR_PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  ga4: {
    clientEmail: process.env.GA4_CLIENT_EMAIL || '',
    privateKey: process.env.GA4_PRIVATE_KEY ? process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    propertyId: process.env.GA4_PROPERTY_ID || '',
    projectId: process.env.GA4_PROJECT_ID || '',
  },

  posthog: {
    apiKey: process.env.POSTHOG_API_KEY || '',
    host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
  },

  searchConsole: {
    clientEmail: process.env.SEARCH_CONSOLE_CLIENT_EMAIL || '',
    privateKey: process.env.SEARCH_CONSOLE_PRIVATE_KEY ? process.env.SEARCH_CONSOLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    siteUrl: process.env.SEARCH_CONSOLE_SITE_URL || '',
  },

  clarity: {
    apiKey: process.env.CLARITY_API_KEY || '',
  },

  sentry: {
    authToken: process.env.SENTRY_AUTH_TOKEN || '',
    org: process.env.SENTRY_ORG || '',
    project: process.env.SENTRY_PROJECT || '',
  },

  dbPath: process.env.ANALYTICS_DB_PATH || resolve(rootDir, 'data', 'analytics.db'),
  vaultPath: process.env.OBSIDIAN_VAULT_PATH || resolve(rootDir, '..', 'vault', 'SplitSquad-HQ'),

  get isGa4Configured() {
    return !!(this.ga4.clientEmail && this.ga4.privateKey && this.ga4.propertyId);
  },
  get isPostHogConfigured() {
    return !!this.posthog.apiKey;
  },
  get isSearchConsoleConfigured() {
    return !!(this.searchConsole.clientEmail && this.searchConsole.privateKey && this.searchConsole.siteUrl);
  },
  get isClarityConfigured() {
    return !!this.clarity.apiKey;
  },
  get isSentryConfigured() {
    return !!(this.sentry.authToken && this.sentry.org && this.sentry.project);
  },
};

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

dotenvConfig({ path: resolve(rootDir, '..', '.env') });
dotenvConfig({ path: resolve(rootDir, '.env') });

export const config = {
  port: parseInt(process.env.AI_ENGINE_PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  ai: {
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.AI_MODEL || 'gpt-4o-mini',
  },

  aggregatorBaseUrl: process.env.AGGREGATOR_BASE_URL || 'http://localhost:3001',
  vaultPath: process.env.OBSIDIAN_VAULT_PATH || resolve(rootDir, '..', 'vault', 'SplitSquad-HQ'),

  get isConfigured() {
    return !!this.ai.apiKey;
  },
};

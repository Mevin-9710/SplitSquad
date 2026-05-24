import express from 'express';
import { config } from './config.js';
import aiRouter from './routes/ai-routes.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-engine', timestamp: new Date().toISOString() });
});

app.use('/analytics', aiRouter);

const server = app.listen(config.port, () => {
  console.log(`\n  🤖 AI Analytics Engine running on http://localhost:${config.port}`);
  console.log(`  🔌 AI Model: ${config.ai.model}`);
  console.log(`  🔗 AI Base URL: ${config.ai.baseUrl}`);
  console.log(`  ✅ Configured: ${config.isConfigured ? '✅' : '❌ (using mock mode)'}`);
  console.log(`  📁 Vault path: ${config.vaultPath}\n`);
});

function shutdown() {
  console.log('\nShutting down AI engine...');
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

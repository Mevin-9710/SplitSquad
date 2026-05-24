import express from 'express';
import { config } from './config.js';
import { getDb, closeDb } from './db/connection.js';
import fetchRouter from './routes/fetch.js';
import summarizeRouter from './routes/summarize.js';
import exportRouter from './routes/export.js';
import dashboardRouter from './routes/dashboard.js';
import { startCronJobs } from './scheduler/cron.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'analytics-aggregator', timestamp: new Date().toISOString() });
});

app.use('/analytics', fetchRouter);
app.use('/analytics', summarizeRouter);
app.use('/analytics', exportRouter);
app.use('/analytics', dashboardRouter);

app.get('/analytics/sources', (_req, res) => {
  res.json({
    ga4: config.isGa4Configured,
    posthog: config.isPostHogConfigured,
    searchConsole: config.isSearchConsoleConfigured,
    clarity: config.isClarityConfigured,
    sentry: config.isSentryConfigured,
  });
});

getDb();
startCronJobs();

const server = app.listen(config.port, () => {
  console.log(`\n  🚀 Analytics Aggregator running on http://localhost:${config.port}`);
  console.log(`  📊 GA4: ${config.isGa4Configured ? '✅' : '❌'}`);
  console.log(`  📈 PostHog: ${config.isPostHogConfigured ? '✅' : '❌'}`);
  console.log(`  🔍 Search Console: ${config.isSearchConsoleConfigured ? '✅' : '❌'}`);
  console.log(`  🖱️  Clarity: ${config.isClarityConfigured ? '✅' : '❌'}`);
  console.log(`  🐛 Sentry: ${config.isSentryConfigured ? '✅' : '❌'}`);
  console.log(`  📁 Vault path: ${config.vaultPath}\n`);
});

function shutdown() {
  console.log('\nShutting down analytics aggregator...');
  closeDb();
  server.close(() => process.exit(0));
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

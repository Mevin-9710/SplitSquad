import cron from 'node-cron';
import { fetchGA4Data, fetchGA4TopPages } from '../services/ga4.js';
import { fetchPostHogData, fetchPostHogRetention } from '../services/posthog.js';
import { fetchSearchConsoleData } from '../services/search-console.js';
import { fetchClarityData } from '../services/clarity.js';
import { fetchSentryData } from '../services/sentry.js';
import { storeDailySnapshot, getDailySnapshot } from '../normalizer/index.js';
import type { DailySnapshot } from '../types/analytics.js';

async function runFullFetch() {
  console.log('[Cron] Starting full analytics fetch...');
  const date = getTodayDate();

  try {
    const [ga4, posthog, searchConsole, clarity, sentry] = await Promise.all([
      fetchGA4Data(date),
      fetchPostHogData(date),
      fetchSearchConsoleData(date).catch(() => ({ clicks: 0, impressions: 0, averagePosition: 0, topQueries: [] })),
      fetchClarityData(date).catch(() => ({ rageClicks: 0, deadClicks: 0, sessionDuration: 0, pageViews: 0 })),
      fetchSentryData(date).catch(() => ({ errorsCount: 0, topErrors: [] })),
    ]);

    const retention = await fetchPostHogRetention().catch(() => ({ day1: 0, day7: 0, day30: 0 }));

    let topPages: Array<{ path: string; views: number }> = [];
    try {
      topPages = await fetchGA4TopPages(date);
    } catch {}

    const existing = getDailySnapshot(date);
    const snapshot: DailySnapshot = {
      date,
      activeUsers: ga4.activeUsers || existing?.activeUsers || 0,
      newUsers: ga4.newUsers || existing?.newUsers || 0,
      pageViews: ga4.pageViews || existing?.pageViews || 0,
      sessions: ga4.sessions || existing?.sessions || 0,
      bounceRate: ga4.bounceRate ?? existing?.bounceRate ?? 0,
      avgSessionDuration: ga4.avgSessionDuration ?? existing?.avgSessionDuration ?? 0,
      splitsCreated: posthog.splitsCreated || existing?.splitsCreated || 0,
      splitsCompleted: existing?.splitsCompleted || 0,
      invitesSent: posthog.invitesSent || existing?.invitesSent || 0,
      invitesOpened: existing?.invitesOpened || 0,
      paymentsVerified: posthog.paymentsVerified || existing?.paymentsVerified || 0,
      errorsCount: sentry.errorsCount || existing?.errorsCount || 0,
      rageClicks: clarity.rageClicks || existing?.rageClicks || 0,
      trafficSources: ga4.trafficSources || existing?.trafficSources || {},
      topPages: topPages || existing?.topPages || [],
      conversions: { retention },
    };

    storeDailySnapshot(snapshot);
    console.log(`[Cron] Full analytics fetch complete for ${date}`);
  } catch (error) {
    console.error('[Cron] Full fetch error:', error);
  }
}

export function startCronJobs() {
  cron.schedule('*/15 * * * *', () => {
    runFullFetch();
  });

  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Hourly analytics refresh...');
    await runFullFetch();
  });

  cron.schedule('30 8 * * *', async () => {
    console.log('[Cron] Daily morning analytics fetch...');
    await runFullFetch();
  });

  console.log('[Cron] Jobs scheduled:');
  console.log('  - Every 15 min: GA4 + PostHog quick fetch');
  console.log('  - Every hour: Full refresh');
  console.log('  - 8:30 AM daily: Morning fetch');
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

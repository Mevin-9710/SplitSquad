import { Router, Request, Response } from 'express';
import { fetchGA4Data, fetchGA4TopPages } from '../services/ga4.js';
import { fetchPostHogData, fetchPostHogRetention } from '../services/posthog.js';
import { fetchSearchConsoleData } from '../services/search-console.js';
import { fetchClarityData } from '../services/clarity.js';
import { fetchSentryData } from '../services/sentry.js';
import { storeDailySnapshot, getDailySnapshot } from '../normalizer/index.js';
import type { DailySnapshot } from '../types/analytics.js';

const router = Router();

interface FetchBody {
  sources?: string[];
  date?: string;
}

router.post('/fetch', async (req: Request<{}, {}, FetchBody>, res: Response) => {
  try {
    const { sources = ['ga4', 'posthog', 'search_console', 'clarity', 'sentry'], date = getTodayDate() } = req.body;

    const results: Record<string, unknown> = {};
    const promises: Promise<void>[] = [];

    if (sources.includes('ga4')) {
      promises.push((async () => {
        results.ga4 = await fetchGA4Data(date);
        const topPages = await fetchGA4TopPages(date);
        (results.ga4 as any).topPages = topPages;
      })());
    }

    if (sources.includes('posthog')) {
      promises.push((async () => {
        results.posthog = await fetchPostHogData(date);
        results.retention = await fetchPostHogRetention();
      })());
    }

    if (sources.includes('search_console')) {
      promises.push((async () => {
        results.searchConsole = await fetchSearchConsoleData(date);
      })());
    }

    if (sources.includes('clarity')) {
      promises.push((async () => {
        results.clarity = await fetchClarityData(date);
      })());
    }

    if (sources.includes('sentry')) {
      promises.push((async () => {
        results.sentry = await fetchSentryData(date);
      })());
    }

    await Promise.all(promises);

    const existing = getDailySnapshot(date);
    const mergedSnapshot: DailySnapshot = {
      date,
      activeUsers: (results.ga4 as any)?.activeUsers || existing?.activeUsers || 0,
      newUsers: (results.ga4 as any)?.newUsers || existing?.newUsers || 0,
      pageViews: (results.ga4 as any)?.pageViews || existing?.pageViews || 0,
      sessions: (results.ga4 as any)?.sessions || existing?.sessions || 0,
      bounceRate: (results.ga4 as any)?.bounceRate ?? existing?.bounceRate ?? 0,
      avgSessionDuration: (results.ga4 as any)?.avgSessionDuration ?? existing?.avgSessionDuration ?? 0,
      splitsCreated: (results.posthog as any)?.splitsCreated || existing?.splitsCreated || 0,
      splitsCompleted: existing?.splitsCompleted || 0,
      invitesSent: (results.posthog as any)?.invitesSent || existing?.invitesSent || 0,
      invitesOpened: existing?.invitesOpened || 0,
      paymentsVerified: (results.posthog as any)?.paymentsVerified || existing?.paymentsVerified || 0,
      errorsCount: (results.sentry as any)?.errorsCount || existing?.errorsCount || 0,
      rageClicks: (results.clarity as any)?.rageClicks || existing?.rageClicks || 0,
      trafficSources: (results.ga4 as any)?.trafficSources || existing?.trafficSources || {},
      topPages: (results.ga4 as any)?.topPages || existing?.topPages || [],
      conversions: existing?.conversions || {},
    };

    storeDailySnapshot(mergedSnapshot);

    res.json({
      success: true,
      date,
      sources: Object.keys(results),
      snapshot: mergedSnapshot,
    });
  } catch (error) {
    console.error('[Fetch] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics data' });
  }
});

export default router;

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

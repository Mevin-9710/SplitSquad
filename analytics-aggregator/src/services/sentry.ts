import { config } from '../config.js';
import { storeMetric } from '../normalizer/index.js';

export async function fetchSentryData(date: string = getTodayDate()): Promise<{
  errorsCount: number;
  topErrors: Array<{ message: string; count: number; level: string }>;
}> {
  if (!config.isSentryConfigured) {
    console.warn('[Sentry] Not configured, skipping');
    return { errorsCount: 0, topErrors: [] };
  }

  try {
    const headers = {
      Authorization: `Bearer ${config.sentry.authToken}`,
      'Content-Type': 'application/json',
    };

    const statsUrl = `https://sentry.io/api/0/projects/${config.sentry.org}/${config.sentry.project}/stats/?stat=received&since=${midnightTimestamp(date)}&until=${midnightTimestamp(getNextDate(date))}&resolution=1d`;

    const statsRes = await fetch(statsUrl, { headers });
    const statsData = await statsRes.json() as any;

    const totalErrors = Array.isArray(statsData)
      ? statsData.reduce((sum: number, point: number[]) => sum + (point[1] || 0), 0)
      : 0;

    const issuesUrl = `https://sentry.io/api/0/projects/${config.sentry.org}/${config.sentry.project}/issues/?statsPeriod=24h&limit=10&query=is:unresolved`;

    const issuesRes = await fetch(issuesUrl, { headers });
    const issuesData = await issuesRes.json() as any;

    const topErrors = (Array.isArray(issuesData) ? issuesData : []).map((issue: any) => ({
      message: issue.title || issue.culprit || 'Unknown',
      count: issue.count || 0,
      level: issue.level || 'error',
    }));

    storeMetric({
      timestamp: new Date(),
      source: 'sentry',
      metric: 'errors_count',
      value: totalErrors,
      dimensions: { date },
    });

    console.log(`[Sentry] Fetched data for ${date}: ${totalErrors} errors`);
    return { errorsCount: totalErrors, topErrors };
  } catch (error) {
    console.error('[Sentry] Fetch error:', error);
    return { errorsCount: 0, topErrors: [] };
  }
}

function midnightTimestamp(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getTime() / 1000;
}

function getNextDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

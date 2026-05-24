import { config } from '../config.js';
import { storeMetric } from '../normalizer/index.js';
import type { DailySnapshot } from '../types/analytics.js';

interface GA4Row {
  dimensionValues?: Array<{ value: string }>;
  metricValues?: Array<{ value: string }>;
}

export async function fetchGA4Data(date: string = getTodayDate()): Promise<Partial<DailySnapshot>> {
  if (!config.isGa4Configured) {
    console.warn('[GA4] Not configured, skipping');
    return {};
  }

  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');

    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: config.ga4.clientEmail,
        private_key: config.ga4.privateKey,
      },
      projectId: config.ga4.projectId,
    });

    const [response] = await client.runReport({
      property: `properties/${config.ga4.propertyId}`,
      dateRanges: [{ startDate: date, endDate: date }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'conversions' },
      ],
      dimensions: [
        { name: 'sessionSource' },
      ],
    });

    const rows = response.rows as GA4Row[] | undefined;
    const trafficSources: Record<string, number> = {};
    let totalSessions = 0;

    for (const row of rows || []) {
      const source = row.dimensionValues?.[0]?.value || 'direct';
      const sessions = parseInt(row.metricValues?.[3]?.value || '0');
      trafficSources[source] = (trafficSources[source] || 0) + sessions;
      totalSessions += sessions;
    }

    const firstRow = rows?.[0]?.metricValues || [];

    const snapshot: Partial<DailySnapshot> = {
      date,
      activeUsers: parseInt(firstRow[0]?.value || '0'),
      newUsers: parseInt(firstRow[1]?.value || '0'),
      pageViews: parseInt(firstRow[2]?.value || '0'),
      sessions: totalSessions,
      bounceRate: parseFloat(firstRow[4]?.value || '0'),
      avgSessionDuration: parseFloat(firstRow[5]?.value || '0'),
      trafficSources,
    };

    for (const [source, sessions] of Object.entries(trafficSources)) {
      storeMetric({
        timestamp: new Date(),
        source: 'ga4',
        metric: 'traffic_source_sessions',
        value: sessions,
        dimensions: { source, date },
      });
    }

    storeMetric({
      timestamp: new Date(),
      source: 'ga4',
      metric: 'active_users',
      value: snapshot.activeUsers || 0,
      dimensions: { date },
    });

    storeMetric({
      timestamp: new Date(),
      source: 'ga4',
      metric: 'page_views',
      value: snapshot.pageViews || 0,
      dimensions: { date },
    });

    console.log(`[GA4] Fetched data for ${date}: ${snapshot.activeUsers} active users, ${totalSessions} sessions`);
    return snapshot;
  } catch (error) {
    console.error('[GA4] Fetch error:', error);
    return {};
  }
}

export async function fetchGA4TopPages(date: string = getTodayDate(), limit: number = 10): Promise<Array<{ path: string; views: number }>> {
  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');

    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: config.ga4.clientEmail,
        private_key: config.ga4.privateKey,
      },
      projectId: config.ga4.projectId,
    });

    const [response] = await client.runReport({
      property: `properties/${config.ga4.propertyId}`,
      dateRanges: [{ startDate: date, endDate: date }],
      metrics: [{ name: 'screenPageViews' }],
      dimensions: [{ name: 'pagePath' }],
      limit,
      orderBy: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    });

    const rows = response.rows as GA4Row[] | undefined;
    return (rows || []).map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
    }));
  } catch (error) {
    console.error('[GA4] Top pages fetch error:', error);
    return [];
  }
}

export async function fetchGA4Funnel(date: string = getTodayDate()): Promise<Array<{ name: string; count: number }>> {
  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');

    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: config.ga4.clientEmail,
        private_key: config.ga4.privateKey,
      },
      projectId: config.ga4.projectId,
    });

    const [response] = await client.runFunnelReport({
      property: `properties/${config.ga4.propertyId}`,
      dateRanges: [{ startDate: date, endDate: date }],
      funnel: {
        steps: [
          { name: 'Landing Page', displayName: 'Page View' },
          { name: 'CTA Click', displayName: 'Click' },
          { name: 'Signup', displayName: 'Sign Up' },
          { name: 'Create Split', displayName: 'Create Split' },
        ],
      },
      funnelBreakdown: [{ name: 'eventName' }],
    });

    return [];
  } catch (error) {
    console.error('[GA4] Funnel fetch error:', error);
    return [];
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

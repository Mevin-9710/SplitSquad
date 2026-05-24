import { config } from '../config.js';
import { storeMetric } from '../normalizer/index.js';

export async function fetchSearchConsoleData(date: string = getTodayDate()): Promise<{
  clicks: number;
  impressions: number;
  averagePosition: number;
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
}> {
  if (!config.isSearchConsoleConfigured) {
    console.warn('[SearchConsole] Not configured, skipping');
    return { clicks: 0, impressions: 0, averagePosition: 0, topQueries: [] };
  }

  try {
    const { google } = await import('googleapis');

    const auth = new google.auth.JWT({
      email: config.searchConsole.clientEmail,
      key: config.searchConsole.privateKey,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const webmasters = google.webmasters({ version: 'v3', auth });

    const response = await webmasters.searchanalytics.query({
      siteUrl: config.searchConsole.siteUrl,
      requestBody: {
        startDate: date,
        endDate: date,
        dimensions: ['query'],
        rowLimit: 20,
      },
    });

    const rows = (response.data.rows || []) as Array<{
      keys: string[];
      clicks: number;
      impressions: number;
      position: number;
    }>;

    let totalClicks = 0;
    let totalImpressions = 0;
    let totalPosition = 0;
    const topQueries: Array<{ query: string; clicks: number; impressions: number }> = [];

    for (const row of rows) {
      totalClicks += row.clicks || 0;
      totalImpressions += row.impressions || 0;
      totalPosition += (row.position || 0) * (row.impressions || 0);
      topQueries.push({
        query: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
      });
    }

    const avgPosition = totalImpressions > 0 ? totalPosition / totalImpressions : 0;

    storeMetric({
      timestamp: new Date(),
      source: 'search_console',
      metric: 'clicks',
      value: totalClicks,
      dimensions: { date },
    });

    storeMetric({
      timestamp: new Date(),
      source: 'search_console',
      metric: 'impressions',
      value: totalImpressions,
      dimensions: { date },
    });

    console.log(`[SearchConsole] Fetched data for ${date}: ${totalClicks} clicks, ${totalImpressions} impressions`);
    return { clicks: totalClicks, impressions: totalImpressions, averagePosition: avgPosition, topQueries };
  } catch (error) {
    console.error('[SearchConsole] Fetch error:', error);
    return { clicks: 0, impressions: 0, averagePosition: 0, topQueries: [] };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

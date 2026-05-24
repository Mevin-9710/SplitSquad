import { config } from '../config.js';
import type { AnalyticsDataForAI } from '../types/index.js';

export async function getAnalyticsData(date?: string, days?: number): Promise<AnalyticsDataForAI> {
  const targetDate = date || getTodayDate();

  try {
    const [dailyRes, trendRes, trafficRes] = await Promise.all([
      fetch(`${config.aggregatorBaseUrl}/analytics/summarize/daily?date=${targetDate}`).catch(() => null),
      fetch(`${config.aggregatorBaseUrl}/analytics/summarize/trend?days=${days || 7}`).catch(() => null),
      fetch(`${config.aggregatorBaseUrl}/analytics/summarize/traffic?date=${targetDate}`).catch(() => null),
    ]);

    const daily = dailyRes ? await dailyRes.json() : { data: null };
    const trend = trendRes ? await trendRes.json() : { trends: null };
    const traffic = trafficRes ? await trafficRes.json() : { sources: [] };

    return formatForAI(targetDate, daily, trend, traffic);
  } catch (error) {
    console.error('[DataFetcher] Error fetching from aggregator:', error);
    return getDefaultData(targetDate);
  }
}

function formatForAI(date: string, daily: any, trend: any, traffic: any): AnalyticsDataForAI {
  const snap = daily?.data || {};

  return {
    date,
    kpis: {
      activeUsers: snap.activeUsers || 0,
      newUsers: snap.newUsers || 0,
      splitsCreated: snap.splitsCreated || 0,
      invitesSent: snap.invitesSent || 0,
      paymentsVerified: snap.paymentsVerified || 0,
      errorsCount: snap.errorsCount || 0,
      rageClicks: snap.rageClicks || 0,
      pageViews: snap.pageViews || 0,
      sessions: snap.sessions || 0,
      bounceRate: snap.bounceRate || 0,
    },
    trafficSources: (traffic?.sources || []).map((s: any) => ({
      source: s.source,
      sessions: s.sessions,
      conversionRate: s.conversionRate,
    })),
    trends: {
      activeUsers: trend?.trends?.activeUsers?.length > 1 ? calculateChange(trend.trends.activeUsers) : 0,
      splitsCreated: trend?.trends?.splitsCreated?.length > 1 ? calculateChange(trend.trends.splitsCreated) : 0,
      paymentsVerified: trend?.trends?.conversions?.length > 1 ? calculateChange(trend.trends.conversions) : 0,
    },
    seo: { clicks: 0, impressions: 0 },
    retention: { day1: 0, day7: 0, day30: 0 },
  };
}

function calculateChange(data: Array<{ value: number }>): number {
  if (data.length < 2) return 0;
  const first = data[data.length - 1]?.value || 0;
  const last = data[0]?.value || 0;
  if (first === 0) return 0;
  return Math.round(((last - first) / first) * 100);
}

function getDefaultData(date: string): AnalyticsDataForAI {
  return {
    date,
    kpis: {
      activeUsers: 0,
      newUsers: 0,
      splitsCreated: 0,
      invitesSent: 0,
      paymentsVerified: 0,
      errorsCount: 0,
      rageClicks: 0,
      pageViews: 0,
      sessions: 0,
      bounceRate: 0,
    },
    trafficSources: [],
    trends: { activeUsers: 0, splitsCreated: 0, paymentsVerified: 0 },
    seo: { clicks: 0, impressions: 0 },
    retention: { day1: 0, day7: 0, day30: 0 },
  };
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

import { config } from '../config.js';
import { storeMetric } from '../normalizer/index.js';
import type { DailySnapshot } from '../types/analytics.js';

export async function fetchPostHogData(date: string = getTodayDate()): Promise<Partial<DailySnapshot>> {
  if (!config.isPostHogConfigured) {
    console.warn('[PostHog] Not configured, skipping');
    return {};
  }

  try {
    const baseUrl = `${config.posthog.host}/api/projects`;
    const headers = {
      Authorization: `Bearer ${config.posthog.apiKey}`,
      'Content-Type': 'application/json',
    };

    const insights: Partial<DailySnapshot> = {};

    const metrics = [
      { name: 'activeUsers', url: `${baseUrl}/@current/insights/trend/?events=[{"id":"$pageview","math":"dau"}]&date_from=${date}&date_to=${date}` },
      { name: 'splitsCreated', url: `${baseUrl}/@current/insights/trend/?events=[{"id":"split_created","math":"total"}]&date_from=${date}&date_to=${date}` },
      { name: 'invitesSent', url: `${baseUrl}/@current/insights/trend/?events=[{"id":"invite_sent","math":"total"}]&date_from=${date}&date_to=${date}` },
      { name: 'paymentsVerified', url: `${baseUrl}/@current/insights/trend/?events=[{"id":"payment_verified","math":"total"}]&date_from=${date}&date_to=${date}` },
    ];

    for (const metric of metrics) {
      try {
        const res = await fetch(metric.url, { headers });
        const data = await res.json() as any;
        const value = data?.result?.[0]?.data?.[0]?.aggregated_value || 0;

        if (metric.name === 'activeUsers') insights.activeUsers = value;
        else if (metric.name === 'splitsCreated') insights.splitsCreated = value;
        else if (metric.name === 'invitesSent') insights.invitesSent = value;
        else if (metric.name === 'paymentsVerified') insights.paymentsVerified = value;

        storeMetric({
          timestamp: new Date(),
          source: 'posthog',
          metric: metric.name,
          value,
          dimensions: { date },
        });
      } catch (err) {
        console.warn(`[PostHog] Failed to fetch ${metric.name}:`, err);
      }
    }

    const funnelRes = await fetch(`${baseUrl}/@current/insights/funnel/?events=[{"id":"signup_started"},{"id":"signup_completed"},{"id":"split_created"}]&date_from=${date}&date_to=${date}`, { headers });
    const funnelData = await funnelRes.json() as any;

    if (funnelData?.result) {
      storeMetric({
        timestamp: new Date(),
        source: 'posthog',
        metric: 'signup_conversion',
        value: funnelData.result.steps?.[1]?.conversion_rates?.[0] || 0,
        dimensions: { date, type: 'funnel' },
      });
    }

    console.log(`[PostHog] Fetched data for ${date}`);
    return insights;
  } catch (error) {
    console.error('[PostHog] Fetch error:', error);
    return {};
  }
}

export async function fetchPostHogRetention(): Promise<{ day1: number; day7: number; day30: number }> {
  if (!config.isPostHogConfigured) return { day1: 0, day7: 0, day30: 0 };

  try {
    const headers = {
      Authorization: `Bearer ${config.posthog.apiKey}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(
      `${config.posthog.host}/api/projects/@current/insights/retention/?date_from=-30d&date_to=${getTodayDate()}`,
      { headers }
    );
    const data = await res.json() as any;

    const retention: { day1: number; day7: number; day30: number } = { day1: 0, day7: 0, day30: 0 };

    if (data?.result?.data) {
      const cohorts = data.result.data;
      if (cohorts.length > 0) {
        const latestCohort = cohorts[cohorts.length - 1];
        retention.day1 = latestCohort.values?.[0]?.count || 0;
        retention.day7 = latestCohort.values?.[6]?.count || 0;
        retention.day30 = latestCohort.values?.[29]?.count || 0;
      }
    }

    return retention;
  } catch (error) {
    console.error('[PostHog] Retention fetch error:', error);
    return { day1: 0, day7: 0, day30: 0 };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

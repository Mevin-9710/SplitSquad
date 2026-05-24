import { config } from '../config.js';
import { storeMetric } from '../normalizer/index.js';

export async function fetchClarityData(date: string = getTodayDate()): Promise<{
  rageClicks: number;
  deadClicks: number;
  sessionDuration: number;
  pageViews: number;
}> {
  if (!config.isClarityConfigured) {
    console.warn('[Clarity] Not configured, skipping');
    return { rageClicks: 0, deadClicks: 0, sessionDuration: 0, pageViews: 0 };
  }

  try {
    const headers = {
      Authorization: `Bearer ${config.clarity.apiKey}`,
      'Content-Type': 'application/json',
    };

    const metricsUrl = `https://clarity.microsoft.com/api/v1/metrics`;

    const payload = {
      metrics: [
        { name: 'rageClicks' },
        { name: 'deadClicks' },
        { name: 'avgSessionDuration' },
        { name: 'pageViews' },
      ],
      dateRange: { start: date, end: date },
    };

    const res = await fetch(metricsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`[Clarity] API returned ${res.status}`);
      return { rageClicks: 0, deadClicks: 0, sessionDuration: 0, pageViews: 0 };
    }

    const data = await res.json() as any;
    const result = {
      rageClicks: data?.rageClicks?.total || 0,
      deadClicks: data?.deadClicks?.total || 0,
      sessionDuration: data?.avgSessionDuration?.average || 0,
      pageViews: data?.pageViews?.total || 0,
    };

    storeMetric({
      timestamp: new Date(),
      source: 'clarity',
      metric: 'rage_clicks',
      value: result.rageClicks,
      dimensions: { date },
    });

    storeMetric({
      timestamp: new Date(),
      source: 'clarity',
      metric: 'dead_clicks',
      value: result.deadClicks,
      dimensions: { date },
    });

    console.log(`[Clarity] Fetched data for ${date}: ${result.rageClicks} rage clicks`);
    return result;
  } catch (error) {
    console.error('[Clarity] Fetch error:', error);
    return { rageClicks: 0, deadClicks: 0, sessionDuration: 0, pageViews: 0 };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

import { generateJSON } from './openai.js';
import { ANOMALY_SYSTEM_PROMPT, ANOMALY_USER_PROMPT } from '../prompts/anomaly-detection.js';
import { getAnalyticsData } from './data-fetcher.js';
import type { Anomaly } from '../types/index.js';

export async function detectAnomalies(date?: string): Promise<Anomaly[]> {
  const targetDate = date || getTodayDate();

  try {
    const analyticsData = await getAnalyticsData(targetDate, 14);

    const anomalies = await generateJSON<Anomaly[]>(
      ANOMALY_SYSTEM_PROMPT,
      ANOMALY_USER_PROMPT(JSON.stringify(analyticsData, null, 2)),
      0.5
    );

    return anomalies || [];
  } catch (error) {
    console.error('[AnomalyDetector] Error:', error);
    return [];
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

import { generateJSON } from './openai.js';
import { RECOMMENDATION_SYSTEM_PROMPT, RECOMMENDATION_USER_PROMPT } from '../prompts/recommendations.js';
import { getAnalyticsData } from './data-fetcher.js';

export async function generateRecommendations(date?: string): Promise<{
  quickWins: Array<{ action: string; expectedImpact: string; effort: string }>;
  strategic: Array<{ action: string; expectedImpact: string; effort: string }>;
  experiments: Array<{ name: string; hypothesis: string; metric: string; duration: string }>;
}> {
  const targetDate = date || getTodayDate();

  try {
    const analyticsData = await getAnalyticsData(targetDate);

    const recommendations = await generateJSON<any>(
      RECOMMENDATION_SYSTEM_PROMPT,
      RECOMMENDATION_USER_PROMPT(JSON.stringify(analyticsData, null, 2)),
      0.4
    );

    return recommendations || { quickWins: [], strategic: [], experiments: [] };
  } catch (error) {
    console.error('[Recommender] Error:', error);
    return { quickWins: [], strategic: [], experiments: [] };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

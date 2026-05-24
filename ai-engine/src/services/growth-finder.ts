import { generateJSON } from './openai.js';
import { VIRAL_SYSTEM_PROMPT, VIRAL_USER_PROMPT } from '../prompts/viral-analysis.js';
import { getAnalyticsData } from './data-fetcher.js';
import { FUNNEL_SYSTEM_PROMPT, FUNNEL_USER_PROMPT } from '../prompts/funnel-analysis.js';

export interface ViralAnalysis {
  viralCoefficient: number;
  interpretation: string;
  bestChannel: { name: string; invitesPerUser: number; conversionRate: number; viralFactor: number } | null;
  optimizations: Array<{ action: string; expectedLift: string; effort: string }>;
}

export interface FunnelAnalysis {
  funnel: Array<{ stage: string; users: number; dropOff: number; dropOffRate: string; status: string; issue?: string; fix?: string }>;
  biggestOpportunity: { stage: string; estimatedGain: string; priority: string } | null;
}

export async function analyzeViralGrowth(date?: string): Promise<ViralAnalysis> {
  const targetDate = date || getTodayDate();

  try {
    const analyticsData = await getAnalyticsData(targetDate);
    const result = await generateJSON<any>(
      VIRAL_SYSTEM_PROMPT,
      VIRAL_USER_PROMPT(JSON.stringify(analyticsData, null, 2)),
      0.4
    );
    return result || { viralCoefficient: 0, interpretation: 'No data available', bestChannel: null, optimizations: [] };
  } catch (error) {
    console.error('[GrowthFinder] Error:', error);
    return { viralCoefficient: 0, interpretation: 'Analysis unavailable', bestChannel: null, optimizations: [] };
  }
}

export async function analyzeFunnel(date?: string): Promise<FunnelAnalysis> {
  const targetDate = date || getTodayDate();

  try {
    const analyticsData = await getAnalyticsData(targetDate);
    const result = await generateJSON<any>(
      FUNNEL_SYSTEM_PROMPT,
      FUNNEL_USER_PROMPT(JSON.stringify(analyticsData, null, 2)),
      0.4
    );
    return result || { funnel: [], biggestOpportunity: null };
  } catch (error) {
    console.error('[GrowthFinder] Funnel error:', error);
    return { funnel: [], biggestOpportunity: null };
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

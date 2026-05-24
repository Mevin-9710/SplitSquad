import OpenAI from 'openai';
import { config } from '../config.js';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!config.isConfigured) {
      console.warn('[AI] No API key configured. AI features will return mock data.');
      return null as unknown as OpenAI;
    }

    client = new OpenAI({
      apiKey: config.ai.apiKey,
      baseURL: config.ai.baseUrl,
    });
  }
  return client;
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.3
): Promise<T> {
  const ai = getClient();

  if (!ai) {
    return generateMockResponse<T>(systemPrompt, userPrompt);
  }

  try {
    const response = await ai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    return JSON.parse(content) as T;
  } catch (error) {
    console.error('[AI] Generation error:', error);
    console.warn('[AI] Falling back to mock data');
    return generateMockResponse<T>(systemPrompt, userPrompt);
  }
}

function generateMockResponse<T>(_systemPrompt: string, _userPrompt: string): T {
  if (_systemPrompt.includes('Daily Report') || _systemPrompt.includes('Founder Analytics')) {
    return {
      summary: 'Solid day of growth. Reddit traffic is outperforming other channels. Mobile UX needs attention.',
      kpis: [
        { metric: 'Active Users', value: 142, change: 12, trend: 'up', status: 'good' },
        { metric: 'Splits Created', value: 37, change: -8, trend: 'down', status: 'warning' },
        { metric: 'Invites Sent', value: 89, change: 15, trend: 'up', status: 'good' },
        { metric: 'Payments Verified', value: 22, change: 5, trend: 'up', status: 'good' },
        { metric: 'Errors', value: 3, change: -40, trend: 'down', status: 'good' },
        { metric: 'Rage Clicks', value: 12, change: 50, trend: 'up', status: 'warning' },
      ],
      insights: [
        { category: 'Traffic', title: 'Reddit traffic converting 4x better than Google', description: 'Reddit now accounts for 31% of traffic. Users from r/IndiaInvestments and r/PersonalFinanceIndia have 4x higher conversion rate than Google organic.', severity: 'info' },
        { category: 'UX', title: 'Mobile payment verification friction', description: '12 rage clicks detected on the payment verification page. Users on mobile are struggling with the verification flow.', severity: 'warning' },
        { category: 'Growth', title: 'WhatsApp viral loop working', description: 'Each invite generates 2.3 new user sessions. WhatsApp sharing has a 22% conversion rate.', severity: 'info' },
      ],
      recommendations: [
        { priority: 'high', area: 'Mobile UX', action: 'Simplify the payment verification form for mobile users. Reduce required taps and add loading states.', expectedImpact: 'Could reduce rage clicks by 60% and increase payment completion by 20%' },
        { priority: 'medium', area: 'Content Marketing', action: 'Create 3 detailed Reddit posts about UPI bill splitting pain points and link to SplitSquad.', expectedImpact: 'Estimated 150-200 new users given 4x conversion rate' },
        { priority: 'low', area: 'Virality', action: 'Add an "Invite Squad" call-to-action after split completion with a single-tap WhatsApp share.', expectedImpact: 'Could increase viral coefficient from 0.8 to 1.2' },
      ],
      anomalies: [
        { metric: 'Splits Created', expectedValue: 45, actualValue: 37, deviation: -18, description: 'Split creation dropped 18% below average. Could be weekend effect or UX issue.' },
      ],
    } as T;
  }

  if (_systemPrompt.includes('Anomaly')) {
    return [
      { metric: 'Rage Clicks', expectedValue: 5, actualValue: 12, deviation: 140, description: 'Rage clicks doubled on payment page — mobile UX issue.', severity: 'warning', action: 'Inspect payment verification flow on mobile devices.' },
      { metric: 'Error Rate', expectedValue: 5, actualValue: 3, deviation: -40, description: 'Error rate dropped 40% — good sign but verify it\'s not due to reduced traffic.', severity: 'info', action: 'No action needed, but monitor for next 24h.' },
    ] as T;
  }

  return { message: 'AI engine running in mock mode (no API key configured)' } as T;
}

export const FUNNEL_SYSTEM_PROMPT = `You are SplitSquad's Funnel Analysis AI. Analyze the product funnel data and identify:

1. Where users drop off the most
2. What's causing the drop-off (based on rage clicks, errors, timing)
3. How to improve each stage
4. Estimated impact of fixing each stage

Output ONLY valid JSON:
{
  "funnel": [
    { "stage": "Landing Page", "users": 1000, "dropOff": 0, "dropOffRate": "0%", "status": "good" },
    { "stage": "Signup", "users": 250, "dropOff": 750, "dropOffRate": "75%", "status": "critical", "issue": "CTA not compelling enough", "fix": "Add social proof and testimonials above the fold" }
  ],
  "biggestOpportunity": {
    "stage": "Signup",
    "estimatedGain": "+150 users/day",
    "priority": "high"
  }
}

Focus on actionable fixes, not just observations.`;

export const FUNNEL_USER_PROMPT = (data: string) => `Analyze this funnel data for SplitSquad:

${data}

Return JSON with funnel analysis.`;

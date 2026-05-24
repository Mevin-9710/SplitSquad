export interface AIReport {
  date: string;
  type: 'daily' | 'weekly' | 'alert';
  title: string;
  summary: string;
  kpis: KPI[];
  insights: Insight[];
  recommendations: Recommendation[];
  anomalies: Anomaly[];
  rawMarkdown: string;
  generatedAt: string;
}

export interface KPI {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export interface Insight {
  category: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  area: string;
  action: string;
  expectedImpact: string;
}

export interface Anomaly {
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  description: string;
}

export interface AnalyticsDataForAI {
  date: string;
  kpis: {
    activeUsers: number;
    newUsers: number;
    splitsCreated: number;
    invitesSent: number;
    paymentsVerified: number;
    errorsCount: number;
    rageClicks: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
  };
  trafficSources: Array<{
    source: string;
    sessions: number;
    conversionRate: number;
  }>;
  trends: {
    activeUsers: number;
    splitsCreated: number;
    paymentsVerified: number;
  };
  seo: {
    clicks: number;
    impressions: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

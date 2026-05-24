export interface AnalyticsConfig {
  ga4?: {
    clientEmail: string;
    privateKey: string;
    propertyId: string;
  };
  posthog?: {
    apiKey: string;
    host: string;
  };
  searchConsole?: {
    clientEmail: string;
    privateKey: string;
    siteUrl: string;
  };
  clarity?: {
    apiKey: string;
  };
  sentry?: {
    authToken: string;
    org: string;
    project: string;
  };
}

export interface UnifiedMetric {
  timestamp: Date;
  source: 'ga4' | 'search_console' | 'posthog' | 'clarity' | 'sentry' | 'custom';
  metric: string;
  value: number;
  dimensions: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface DailySnapshot {
  date: string;
  activeUsers: number;
  newUsers: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  splitsCreated: number;
  splitsCompleted: number;
  invitesSent: number;
  invitesOpened: number;
  paymentsVerified: number;
  errorsCount: number;
  rageClicks: number;
  trafficSources: Record<string, number>;
  topPages: Array<{ path: string; views: number }>;
  conversions: Record<string, number>;
}

export interface TrafficSourceBreakdown {
  source: string;
  sessions: number;
  newUsers: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropOff: number;
}

export interface ErrorSummary {
  level: string;
  count: number;
  lastSeen: string;
  topErrors: Array<{ message: string; count: number }>;
}

export interface AnalyticsReport {
  date: string;
  daily: DailySnapshot;
  traffic: TrafficSourceBreakdown[];
  funnel: FunnelStage[];
  errors: ErrorSummary;
  seo: {
    clicks: number;
    impressions: number;
    averagePosition: number;
    topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
    weeklyCohorts: Array<{ week: string; rate: number }>;
  };
}

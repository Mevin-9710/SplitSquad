import type { UnifiedMetric, DailySnapshot } from '../types/analytics.js';
import { getDb } from '../db/connection.js';

export function storeMetric(metric: UnifiedMetric): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO raw_metrics (source, metric_name, metric_value, dimensions, recorded_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    metric.source,
    metric.metric,
    metric.value,
    JSON.stringify(metric.dimensions),
    metric.timestamp.toISOString()
  );
}

export function storeDailySnapshot(snapshot: DailySnapshot): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO daily_snapshots (
      date, active_users, new_users, page_views, sessions, bounce_rate,
      avg_session_duration, splits_created, splits_completed, invites_sent,
      invites_opened, payments_verified, errors_count, rage_clicks,
      traffic_sources, top_pages, conversions, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(date) DO UPDATE SET
      active_users = excluded.active_users,
      new_users = excluded.new_users,
      page_views = excluded.page_views,
      sessions = excluded.sessions,
      bounce_rate = excluded.bounce_rate,
      avg_session_duration = excluded.avg_session_duration,
      splits_created = excluded.splits_created,
      splits_completed = excluded.splits_completed,
      invites_sent = excluded.invites_sent,
      invites_opened = excluded.invites_opened,
      payments_verified = excluded.payments_verified,
      errors_count = excluded.errors_count,
      rage_clicks = excluded.rage_clicks,
      traffic_sources = excluded.traffic_sources,
      top_pages = excluded.top_pages,
      conversions = excluded.conversions,
      updated_at = datetime('now')
  `).run(
    snapshot.date,
    snapshot.activeUsers,
    snapshot.newUsers,
    snapshot.pageViews,
    snapshot.sessions,
    snapshot.bounceRate,
    snapshot.avgSessionDuration,
    snapshot.splitsCreated,
    snapshot.splitsCompleted,
    snapshot.invitesSent,
    snapshot.invitesOpened,
    snapshot.paymentsVerified,
    snapshot.errorsCount,
    snapshot.rageClicks,
    JSON.stringify(snapshot.trafficSources),
    JSON.stringify(snapshot.topPages),
    JSON.stringify(snapshot.conversions)
  );
}

export function getMetrics(
  source?: string,
  metricName?: string,
  from?: Date,
  to?: Date
): UnifiedMetric[] {
  const db = getDb();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (source) {
    conditions.push('source = ?');
    params.push(source);
  }
  if (metricName) {
    conditions.push('metric_name = ?');
    params.push(metricName);
  }
  if (from) {
    conditions.push('recorded_at >= ?');
    params.push(from.toISOString());
  }
  if (to) {
    conditions.push('recorded_at <= ?');
    params.push(to.toISOString());
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM raw_metrics ${where} ORDER BY recorded_at DESC LIMIT 1000`).all(...params) as any[];

  return rows.map(row => ({
    timestamp: new Date(row.recorded_at),
    source: row.source,
    metric: row.metric_name,
    value: row.metric_value,
    dimensions: JSON.parse(row.dimensions || '{}'),
  }));
}

export function getDailySnapshot(date: string): DailySnapshot | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM daily_snapshots WHERE date = ?`).get(date) as any;
  if (!row) return null;

  return {
    date: row.date,
    activeUsers: row.active_users,
    newUsers: row.new_users,
    pageViews: row.page_views,
    sessions: row.sessions,
    bounceRate: row.bounce_rate,
    avgSessionDuration: row.avg_session_duration,
    splitsCreated: row.splits_created,
    splitsCompleted: row.splits_completed,
    invitesSent: row.invites_sent,
    invitesOpened: row.invites_opened,
    paymentsVerified: row.payments_verified,
    errorsCount: row.errors_count,
    rageClicks: row.rage_clicks,
    trafficSources: JSON.parse(row.traffic_sources || '{}'),
    topPages: JSON.parse(row.top_pages || '[]'),
    conversions: JSON.parse(row.conversions || '{}'),
  };
}

export function getRecentSnapshots(days: number = 7): DailySnapshot[] {
  const db = getDb();
  const rows = db.prepare(
    `SELECT * FROM daily_snapshots ORDER BY date DESC LIMIT ?`
  ).all(days) as any[];

  return rows.map(row => ({
    date: row.date,
    activeUsers: row.active_users,
    newUsers: row.new_users,
    pageViews: row.page_views,
    sessions: row.sessions,
    bounceRate: row.bounce_rate,
    avgSessionDuration: row.avg_session_duration,
    splitsCreated: row.splits_created,
    splitsCompleted: row.splits_completed,
    invitesSent: row.invites_sent,
    invitesOpened: row.invites_opened,
    paymentsVerified: row.payments_verified,
    errorsCount: row.errors_count,
    rageClicks: row.rage_clicks,
    trafficSources: JSON.parse(row.traffic_sources || '{}'),
    topPages: JSON.parse(row.top_pages || '[]'),
    conversions: JSON.parse(row.conversions || '{}'),
  }));
}

export function getAggregatedTrafficSources(date: string): Array<{ source: string; sessions: number; conversionRate: number }> {
  const db = getDb();
  const rows = db.prepare(
    `SELECT source, sessions, conversion_rate FROM traffic_sources WHERE date = ? ORDER BY sessions DESC`
  ).all(date) as any[];

  return rows.map(r => ({ source: r.source, sessions: r.sessions, conversionRate: r.conversion_rate }));
}

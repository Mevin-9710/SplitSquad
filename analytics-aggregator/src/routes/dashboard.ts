import { Router, Request, Response } from 'express';
import { getRecentSnapshots, getDailySnapshot, getAggregatedTrafficSources } from '../normalizer/index.js';

const router = Router();

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

router.get('/dashboard/data', (req: Request, res: Response) => {
  try {
    const days = Math.min(parseInt(req.query.days as string) || 7, 90);
    const snapshots = getRecentSnapshots(days);
    const today = getTodayDate();
    const todaySnapshot = getDailySnapshot(today) || snapshots[0];

    const daily = snapshots.length > 0 ? snapshots[0] : null;

    const trafficSources = daily ? getAggregatedTrafficSources(daily.date) : [];

    let trends: Record<string, number> = {};
    if (snapshots.length >= 2) {
      const current = snapshots[0];
      const previous = snapshots[snapshots.length - 1];
      trends = calculateWoWGrowth(current, previous);
    }

    res.json({
      success: true,
      today: todaySnapshot,
      daily: snapshots,
      trafficSources,
      trends,
      historical: snapshots,
    });
  } catch (error) {
    console.error('[Dashboard] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get dashboard data' });
  }
});

function calculateWoWGrowth(current: any, previous: any): Record<string, number> {
  const metrics = ['activeUsers', 'splitsCreated', 'paymentsVerified', 'pageViews', 'invitesSent'];
  const trends: Record<string, number> = {};

  for (const metric of metrics) {
    const cur = current[metric] || 0;
    const prev = previous[metric] || 0;
    trends[metric] = prev > 0 ? ((cur - prev) / prev) * 100 : 0;
  }

  return trends;
}

export default router;

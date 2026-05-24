import { Router, Request, Response } from 'express';
import { getRecentSnapshots, getDailySnapshot, getAggregatedTrafficSources } from '../normalizer/index.js';

const router = Router();

router.get('/summarize/daily', (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || getTodayDate();
    const snapshot = getDailySnapshot(date);

    if (!snapshot) {
      return res.json({ success: true, date, data: null, message: 'No data for this date' });
    }

    res.json({ success: true, date, data: snapshot });
  } catch (error) {
    console.error('[Summarize] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to summarize data' });
  }
});

router.get('/summarize/trend', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const snapshots = getRecentSnapshots(days);

    if (snapshots.length === 0) {
      return res.json({ success: true, days, data: [], message: 'No data available' });
    }

    const trends = {
      activeUsers: snapshots.map(s => ({ date: s.date, value: s.activeUsers })),
      splitsCreated: snapshots.map(s => ({ date: s.date, value: s.splitsCreated })),
      pageViews: snapshots.map(s => ({ date: s.date, value: s.pageViews })),
      conversions: snapshots.map(s => ({ date: s.date, value: s.paymentsVerified })),
      errors: snapshots.map(s => ({ date: s.date, value: s.errorsCount })),
      rageClicks: snapshots.map(s => ({ date: s.date, value: s.rageClicks })),
    };

    res.json({ success: true, days, trends });
  } catch (error) {
    console.error('[Trend] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get trends' });
  }
});

router.get('/summarize/traffic', (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || getTodayDate();
    const sources = getAggregatedTrafficSources(date);

    res.json({ success: true, date, sources });
  } catch (error) {
    console.error('[Traffic] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to get traffic data' });
  }
});

export default router;

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

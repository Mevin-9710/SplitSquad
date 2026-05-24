import { Router, Request, Response } from 'express';
import { getRecentSnapshots, getDailySnapshot, getAggregatedTrafficSources } from '../normalizer/index.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from '../config.js';

const router = Router();

router.get('/export/markdown', (req: Request, res: Response) => {
  try {
    const date = (req.query.date as string) || getTodayDate();
    const snapshot = getDailySnapshot(date);

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'No data for this date' });
    }

    const sources = getAggregatedTrafficSources(date);
    const markdown = generateDailyMarkdown(snapshot, sources);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="daily-report-${date}.md"`);
    res.send(markdown);
  } catch (error) {
    console.error('[Export] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to export data' });
  }
});

router.post('/export/markdown', (req: Request, res: Response) => {
  try {
    const date = (req.body.date as string) || getTodayDate();
    const snapshot = getDailySnapshot(date);

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'No data for this date' });
    }

    const sources = getAggregatedTrafficSources(date);
    const markdown = generateDailyMarkdown(snapshot, sources);

    const vaultDir = config.vaultPath;
    const reportsDir = resolve(vaultDir, 'Daily Reports');
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = resolve(reportsDir, `${date}.md`);
    writeFileSync(filePath, markdown, 'utf-8');

    console.log(`[Export] Written daily report to ${filePath}`);

    res.json({ success: true, date, path: filePath });
  } catch (error) {
    console.error('[Export] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to export data' });
  }
});

function generateDailyMarkdown(snapshot: {
  date: string;
  activeUsers: number;
  newUsers: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  splitsCreated: number;
  invitesSent: number;
  paymentsVerified: number;
  errorsCount: number;
  rageClicks: number;
  trafficSources: Record<string, number>;
  topPages: Array<{ path: string; views: number }>;
}, sources: Array<{ source: string; sessions: number; conversionRate: number }>): string {
  const trafficRows = Object.entries(snapshot.trafficSources)
    .sort(([, a], [, b]) => b - a)
    .map(([source, sessions]) => `| ${source} | ${sessions} |`)
    .join('\n');

  const topPagesRows = snapshot.topPages
    .slice(0, 5)
    .map(p => `| ${p.path} | ${p.views} |`)
    .join('\n');

  const sourcesRows = sources
    .map(s => `| ${s.source} | ${s.sessions} | ${(s.conversionRate * 100).toFixed(1)}% |`)
    .join('\n');

  return `# Daily Report — ${snapshot.date}

## KPIs
- **Active Users:** ${snapshot.activeUsers}
- **New Users:** ${snapshot.newUsers}
- **Sessions:** ${snapshot.sessions}
- **Page Views:** ${snapshot.pageViews}
- **Bounce Rate:** ${(snapshot.bounceRate * 100).toFixed(1)}%

## Product Metrics
- **Splits Created:** ${snapshot.splitsCreated}
- **Invites Sent:** ${snapshot.invitesSent}
- **Payments Verified:** ${snapshot.paymentsVerified}
- **Errors:** ${snapshot.errorsCount}
- **Rage Clicks:** ${snapshot.rageClicks}

## Traffic Sources
| Source | Sessions |
|--------|----------|
${trafficRows || '| No data | 0 |'}

## Traffic Source Breakdown
| Source | Sessions | Conv. Rate |
|--------|----------|------------|
${sourcesRows || '| No data | 0 | 0% |'}

## Top Pages
| Page | Views |
|------|-------|
${topPagesRows || '| No data | 0 |'}
`;
}

export default router;

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

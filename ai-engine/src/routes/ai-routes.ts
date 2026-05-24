import { Router, Request, Response } from 'express';
import { generateDailyReport } from '../services/summarizer.js';
import { detectAnomalies } from '../services/anomaly-detector.js';
import { generateRecommendations } from '../services/recommender.js';
import { analyzeViralGrowth, analyzeFunnel } from '../services/growth-finder.js';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from '../config.js';

const router = Router();

interface ReportBody {
  date?: string;
  export?: boolean;
}

router.post('/ai/daily-report', async (req: Request<{}, {}, ReportBody>, res: Response) => {
  try {
    const { date = getTodayDate(), export: shouldExport = false } = req.body;

    const report = await generateDailyReport(date);

    if (shouldExport) {
      const reportsDir = resolve(config.vaultPath, 'AI Insights');
      if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });

      const filePath = resolve(reportsDir, `${date}-daily-report.md`);
      writeFileSync(filePath, report.rawMarkdown, 'utf-8');
      (report as any).exportPath = filePath;
    }

    res.json({ success: true, report });
  } catch (error) {
    console.error('[AI Route] Daily report error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate daily report' });
  }
});

router.post('/ai/anomaly-scan', async (req: Request<{}, {}, ReportBody>, res: Response) => {
  try {
    const { date = getTodayDate() } = req.body;
    const anomalies = await detectAnomalies(date);

    res.json({ success: true, date, anomalies });
  } catch (error) {
    console.error('[AI Route] Anomaly scan error:', error);
    res.status(500).json({ success: false, error: 'Failed to scan for anomalies' });
  }
});

router.post('/ai/recommendations', async (req: Request<{}, {}, ReportBody>, res: Response) => {
  try {
    const { date = getTodayDate() } = req.body;
    const recommendations = await generateRecommendations(date);

    res.json({ success: true, date, recommendations });
  } catch (error) {
    console.error('[AI Route] Recommendations error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

router.post('/ai/viral-analysis', async (req: Request<{}, {}, ReportBody>, res: Response) => {
  try {
    const { date = getTodayDate() } = req.body;
    const analysis = await analyzeViralGrowth(date);

    res.json({ success: true, date, analysis });
  } catch (error) {
    console.error('[AI Route] Viral analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze viral growth' });
  }
});

router.post('/ai/funnel-analysis', async (req: Request<{}, {}, ReportBody>, res: Response) => {
  try {
    const { date = getTodayDate() } = req.body;
    const analysis = await analyzeFunnel(date);

    res.json({ success: true, date, analysis });
  } catch (error) {
    console.error('[AI Route] Funnel analysis error:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze funnel' });
  }
});

router.get('/ai/status', (_req: Request, res: Response) => {
  res.json({
    configured: config.isConfigured,
    model: config.ai.model,
    baseUrl: config.ai.baseUrl,
    vaultPath: config.vaultPath,
  });
});

export default router;

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

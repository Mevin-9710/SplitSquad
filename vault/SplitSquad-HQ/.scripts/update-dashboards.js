/**
 * CustomJS Script for Obsidian
 * Fetches live analytics data and updates dashboard metrics
 *
 * Install:
 * 1. Install CustomJS plugin in Obsidian
 * 2. Point it to this file
 * 3. Call SplitSquadAnalytics.update() from any dashboard
 */

class SplitSquadAnalytics {
  constructor() {
    this.aggregatorUrl = 'http://localhost:3001';
    this.aiUrl = 'http://localhost:3002';
    this.cache = {};
    this.lastFetch = null;
  }

  async fetchAnalytics() {
    const now = Date.now();
    if (this.lastFetch && now - this.lastFetch < 60000) {
      return this.cache;
    }

    try {
      const [dashboardRes, dailyRes] = await Promise.all([
        fetch(`${this.aggregatorUrl}/analytics/dashboard/data`),
        fetch(`${this.aggregatorUrl}/analytics/summarize/daily`),
      ]);

      const dashboard = await dashboardRes.json();
      const daily = await dailyRes.json();

      this.cache = { dashboard, daily };
      this.lastFetch = now;

      return this.cache;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return this.cache;
    }
  }

  async generateReport() {
    try {
      const res = await fetch(`${this.aiUrl}/analytics/ai/daily-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ export: true }),
      });
      return await res.json();
    } catch (error) {
      console.error('Failed to generate report:', error);
      return null;
    }
  }

  async scanAnomalies() {
    try {
      const res = await fetch(`${this.aiUrl}/analytics/ai/anomaly-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (error) {
      console.error('Failed to scan anomalies:', error);
      return null;
    }
  }

  kpiCard(metric, value, change, status) {
    const emoji = status === 'good' ? '✅' : status === 'warning' ? '⚠️' : '🔴';
    const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
    return `**${metric}:** ${value} ${arrow}${Math.abs(change)}% ${emoji}`;
  }

  statusIndicator(status) {
    const colors = { good: '#22c55e', warning: '#eab308', critical: '#ef4444' };
    return `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colors[status] || '#666'};margin-right:4px;"></span>`;
  }
}

module.exports = () => new SplitSquadAnalytics();

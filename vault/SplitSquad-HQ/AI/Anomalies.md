---
created: 2026-05-22
tags:
  - ai
  - anomalies
  - live
updated: 2026-05-22
---

# 🚨 Detected Anomalies

> **AI-powered anomaly detection** — Auto-scanned every 30 minutes.

---

## Current Anomalies

%%await fetch('http://localhost:3002/analytics/ai/anomaly-scan')%%

---

## Anomaly History

```dataview
TABLE
  date AS "Date",
  metric AS "Metric",
  deviation AS "Deviation",
  severity AS "Severity",
  resolved AS "Resolved"
FROM "_data/anomalies"
SORT date DESC
LIMIT 20
```

---

## Thresholds

| Metric | Normal Range | Alert Threshold | Critical Threshold |
|--------|-------------|-----------------|-------------------|
| Active Users | 120-160 | < 100 or > 200 | < 80 or > 250 |
| Splits Created | 30-50 | < 20 or > 70 | < 15 or > 100 |
| Error Rate | 0-5% | > 10% | > 25% |
| Rage Clicks | 0-10 | > 20 | > 50 |
| Response Time | 100-500ms | > 1s | > 3s |

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

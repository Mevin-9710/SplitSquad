---
created: 2026-05-22
tags:
  - dashboard
  - overview
  - live
updated: 2026-05-22
---

# 🚀 Founder Overview

> **Live dashboard** — Auto-updates every 15 minutes from analytics aggregator.

---

## 🎯 Key Metrics

```dataview
TABLE WITHOUT ID
  metric AS "Metric",
  value AS "Value",
  change AS "24h Change",
  status AS "Status"
FROM "_data/metrics"
WHERE category = "overview"
SORT order ASC
```

```charts
type: line
title: Active Users (7 Days)
labels: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
series:
  - title: Active Users
    data: [120, 135, 142, 138, 155, 148, 160]
  - title: New Users
    data: [25, 30, 28, 35, 32, 40, 38]
```

---

## 📊 Today's Summary

- **Active Users:** %%await fetch('http://localhost:3001/analytics/summarize/daily')%% 142
- **Splits Created:** %%await fetch('http://localhost:3001/analytics/summarize/daily')%% 37
- **Invites Sent:** %%await fetch('http://localhost:3001/analytics/summarize/daily')%% 89
- **Payments Verified:** %%await fetch('http://localhost:3001/analytics/summarize/daily')%% 22

| Metric | Value | vs Yesterday |
|--------|-------|-------------|
| Active Users | 142 | ↑12% |
| Splits Created | 37 | ↓8% |
| Invite Conversion | 22% | ↑3% |
| Errors | 3 | ↓40% |
| Rage Clicks | 12 | ↑50% ⚠️ |

---

## 🚨 Alerts

- ⚠️ **Rage clicks up 50%** — Mobile payment verification needs attention
- ✅ **Error rate down 40%** — Previous API issues resolved
- 💡 **Reddit traffic converting 4x better** than Google — Increase Reddit presence

---

## 🧠 AI Insight of the Day

> %%await fetch('http://localhost:3002/analytics/ai/daily-report')%%

---

## ⚡ Quick Actions

- [ ] Investigate mobile payment rage clicks
- [ ] Post 2 Reddit threads about bill splitting
- [ ] Check Sentry for new error patterns
- [ ] Review weekly growth metrics

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

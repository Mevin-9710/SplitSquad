---
created: 2026-05-22
tags:
  - dashboard
  - traffic
  - live
updated: 2026-05-22
---

# 🌐 Traffic Sources

> **Live traffic dashboard** — Auto-updates every 15 minutes.

---

## 🚦 Source Breakdown

```charts
type: pie
title: Traffic Sources Today
labels: [Google, Reddit, WhatsApp, Direct, Twitter, Product Hunt, Other]
series:
  - title: Sessions
    data: [42, 31, 18, 9, 5, 3, 2]
```

---

## 📊 Source Performance

| Source | Sessions | New Users | Conv. Rate | Bounce Rate | Status |
|--------|----------|-----------|------------|-------------|--------|
| Google | 42 | 8 | 4.2% | 35% | ✅ |
| Reddit | 31 | 12 | 12.9% | 22% | 🚀 |
| WhatsApp | 18 | 4 | 5.5% | 15% | ✅ |
| Direct | 9 | 2 | 3.1% | 40% | ⚠️ |
| Twitter/X | 5 | 1 | 2.0% | 45% | ⚠️ |
| Product Hunt | 3 | 1 | 6.7% | 30% | ✅ |
| Hacker News | 2 | 1 | 10.0% | 20% | 🚀 |

```charts
type: bar
title: Conversion Rate by Source
labels: [Reddit, Hacker News, Product Hunt, WhatsApp, Google, Direct, Twitter]
series:
  - title: Conversion Rate (%)
    data: [12.9, 10.0, 6.7, 5.5, 4.2, 3.1, 2.0]
```

---

## 🔍 UTM Campaigns

```dataview
TABLE
  campaign AS "Campaign",
  source AS "Source",
  clicks AS "Clicks",
  conversions AS "Conversions",
  rate AS "Rate"
FROM "_data/utm"
SORT rate DESC
```

---

## 🎯 Top Landing Pages

```dataview
TABLE
  page AS "Page",
  views AS "Views",
  avg_time AS "Avg Time"
FROM "_data/pages"
SORT views DESC
LIMIT 10
```

---

## 📈 Week-over-Week Trend

| Source | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Google | 294 | 310 | ↓5% |
| Reddit | 217 | 168 | ↑29% |
| WhatsApp | 126 | 115 | ↑10% |
| Direct | 63 | 70 | ↓10% |
| Twitter/X | 35 | 28 | ↑25% |

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

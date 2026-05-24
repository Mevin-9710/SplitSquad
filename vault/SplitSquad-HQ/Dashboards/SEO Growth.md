---
created: 2026-05-22
tags:
  - dashboard
  - seo
  - live
updated: 2026-05-22
---

# 🔍 SEO Growth

> **Google Search Console data** — Track organic search performance.

---

## 📈 Search Performance

| Metric | Today | Last Week | Change |
|--------|-------|-----------|--------|
| Clicks | 42 | 38 | ↑11% |
| Impressions | 1,240 | 1,180 | ↑5% |
| Avg Position | 4.2 | 4.5 | ↑7% |
| CTR | 3.4% | 3.2% | ↑6% |

```charts
type: line
title: Clicks & Impressions (30 Days)
labels: [W1, W2, W3, W4]
series:
  - title: Clicks
    data: [28, 35, 38, 42]
  - title: Impressions
    data: [950, 1050, 1180, 1240]
```

---

## 🔑 Top Queries

```dataview
TABLE
  query AS "Query",
  clicks AS "Clicks",
  impressions AS "Impressions",
  position AS "Position"
FROM "_data/search-queries"
SORT clicks DESC
LIMIT 15
```

| Query | Clicks | Impressions | Position |
|-------|--------|-------------|----------|
| bill splitting app india | 8 | 240 | 3.2 |
| upi expense split | 6 | 185 | 2.8 |
| group payment splitter | 5 | 160 | 4.1 |
| whatsapp bill split bot | 4 | 95 | 2.1 |
| trip expense splitter | 3 | 88 | 5.3 |
| roommate bill split | 3 | 75 | 4.8 |
| split upi payment | 2 | 62 | 3.5 |

---

## 📄 Top Pages

```dataview
TABLE
  page AS "Page",
  clicks AS "Clicks",
  impressions AS "Impressions",
  ctr AS "CTR"
FROM "_data/seo-pages"
SORT clicks DESC
LIMIT 10
```

---

## 🎯 Content Opportunities

- **"UPI Bill Splitting Guide"** — Keywords: upi split payment, how to split upi payment
- **"Best Bill Splitting Apps India 2026"** — High volume comparison keyword
- **"WhatsApp Group Expense Tracker"** — Long-tail with low competition
- **"Trip Expense Splitter for Friends"** — Seasonal high-intent keyword

---

## 📊 Week-over-Week

| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Total Clicks | 280 | 255 | ↑10% |
| Total Impressions | 8,400 | 7,900 | ↑6% |
| Avg CTR | 3.3% | 3.2% | ↑3% |
| Avg Position | 4.3 | 4.6 | ↑7% |

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

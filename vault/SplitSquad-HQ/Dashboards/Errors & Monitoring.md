---
created: 2026-05-22
tags:
  - dashboard
  - errors
  - monitoring
  - live
updated: 2026-05-22
---

# 🐛 Errors & Monitoring

> **Real-time error tracking** — Sentry, API health, and system monitoring.

---

## 🟢 System Health

| Service | Status | Uptime | Response Time |
|---------|--------|--------|---------------|
| Express App | 🟢 Online | 99.8% | 45ms |
| Analytics Aggregator | 🟢 Online | 99.5% | 120ms |
| AI Engine | 🟢 Online | 99.9% | 30ms |
| SQLite Database | 🟢 Healthy | 100% | 5ms |
| WhatsApp Client | 🟢 Connected | 98% | — |

---

## 🐛 Sentry Errors

```charts
type: bar
title: Errors by Severity (24h)
labels: [Error, Warning, Info]
series:
  - title: Count
    data: [8, 15, 42]
```

### Top Issues

```dataview
TABLE
  issue AS "Issue",
  count AS "Count",
  level AS "Level",
  status AS "Status"
FROM "_data/sentry-issues"
SORT count DESC
LIMIT 10
```

| Issue | Count | Level | Status |
|-------|-------|-------|--------|
| WhatsApp connection timeout | 3 | Error | 🔴 New |
| UPI URI generation failed | 2 | Error | 🔴 New |
| Participant verification race condition | 1 | Error | 🟡 Investigating |
| Rate limit exceeded (expected) | 8 | Warning | 🟢 Known |
| Slow query: getRecentSplits | 2 | Warning | 🟢 Fixed |

---

## 📊 Error Trend

```charts
type: line
title: Error Rate (7 Days)
labels: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
series:
  - title: Errors
    data: [5, 3, 8, 4, 6, 2, 3]
```

---

## ⏱️ Performance

| Operation | p50 | p95 | p99 |
|-----------|-----|-----|-----|
| Create Split | 120ms | 350ms | 800ms |
| Send WhatsApp | 450ms | 1.2s | 2.5s |
| Fetch Splits | 30ms | 80ms | 200ms |
| Payment Verify | 25ms | 60ms | 150ms |
| Analytics Fetch | 2s | 5s | 8s |

---

## 🔔 Recent Alerts

```dataview
TABLE
  time AS "Time",
  message AS "Alert",
  severity AS "Severity",
  acknowledged AS "Ack"
FROM "_data/alerts"
SORT time DESC
LIMIT 10
```

---

## 📋 Error Log (Last 24h)

- `15:42:03` — WhatsApp connection timeout for user abc123
- `14:30:12` — Invalid UPI ID format in participant submission
- `13:15:45` — Rate limit hit on send-whatsapp endpoint (expected)
- `11:22:33` — Database write contention on analytics_events table
- `09:05:18` — Evolution API health check failed (auto-recovered)

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

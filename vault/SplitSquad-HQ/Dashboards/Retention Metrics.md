---
created: 2026-05-22
tags:
  - dashboard
  - retention
  - live
updated: 2026-05-22
---

# 🔄 Retention Metrics

> **User retention analytics** — Track returning users and cohort performance.

---

## 📊 Retention Rates

| Period | Rate | Benchmark | Status |
|--------|------|-----------|--------|
| Day 1 | 42% | 40% | ✅ Good |
| Day 7 | 28% | 25% | ✅ Good |
| Day 14 | 18% | 15% | ✅ Good |
| Day 30 | 12% | 10% | ✅ Good |

```charts
type: line
title: Retention Curve
labels: [D1, D3, D7, D14, D21, D30]
series:
  - title: Current
    data: [42, 35, 28, 18, 14, 12]
  - title: Target
    data: [40, 32, 25, 15, 12, 10]
```

---

## 👥 Weekly Cohorts

| Week | Cohort Size | D1 | D7 | D14 | D30 |
|------|-------------|-----|------|-------|-------|
| Apr 25 | 240 | 42% | 28% | 18% | 12% |
| Apr 18 | 210 | 40% | 26% | 17% | 11% |
| Apr 11 | 195 | 44% | 30% | 19% | 13% |
| Apr 04 | 225 | 38% | 25% | 16% | 10% |
| Mar 28 | 180 | 45% | 32% | 21% | 14% |

---

## 🔄 Repeat Behavior

| Metric | Value | Trend |
|--------|-------|-------|
| Users with 2+ splits | 35% | ↑5% WoW |
| Users with 5+ splits | 8% | ↑2% WoW |
| Avg Splits per User | 2.4 | ↑0.2 WoW |
| Return within 7 days | 42% | ↑3% WoW |

```charts
type: bar
title: Repeat Split Creation
labels: [1 Split, 2 Splits, 3 Splits, 4 Splits, 5+ Splits]
series:
  - title: Users (%)
    data: [65, 18, 9, 5, 3]
```

---

## 📉 Churn Analysis

**Why users don't return:**
- 45% — Only needed for one specific trip/event
- 25% — Didn't understand the WhatsApp integration
- 15% — Prefer other apps for regular use
- 10% — Technical issues with payment verification
- 5% — Found a better alternative

---

## 🚀 Retention Levers

| Action | Expected Impact | Effort |
|--------|----------------|--------|
| Email reminder for pending payments | +5% Day 7 retention | Low |
| "Create another split" prompt after verification | +8% repeat usage | Low |
| Weekly digest of your splits | +3% Day 30 retention | Medium |
| WhatsApp notification for group payment status | +10% engagement | Medium |
| Premium features for power users | +2% long-term retention | High |

---

## 📈 Retention Trend

```charts
type: line
title: Weekly Retention Rate
labels: [W1, W2, W3, W4, W5, W6, W7, W8]
series:
  - title: Day 1
    data: [38, 40, 42, 39, 41, 43, 40, 42]
  - title: Day 7
    data: [24, 26, 28, 25, 27, 29, 26, 28]
```

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

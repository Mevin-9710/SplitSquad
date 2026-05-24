---
created: 2026-05-22
tags:
  - dashboard
  - ux
  - live
updated: 2026-05-22
---

# 🎨 UX Issues

> **User experience monitoring** — Rage clicks, form errors, and friction points.

---

## 🚨 Current UX Health

| Metric | Today | Status |
|--------|-------|--------|
| Rage Clicks | 12 | ⚠️ Elevated |
| Form Errors | 5 | ✅ Normal |
| Loading Delays | 3 | ✅ Normal |
| Button Abandonment | 8 | ⚠️ Watch |
| Session Duration | 4m 32s | ✅ Good |

```charts
type: bar
title: UX Issues Today
labels: [Rage Clicks, Form Errors, Loading Delays, Button Abandonment]
series:
  - title: Count
    data: [12, 5, 3, 8]
```

---

## 🖱️ Rage Click Map

| Location | Clicks | Issue |
|----------|--------|-------|
| Payment Verify Button | 6 | User taps repeatedly — likely slow response |
| Add Participant Input | 3 | Unclear how to add existing contact |
| Split Amount Field | 2 | Decimal input confusion |
| Share WhatsApp Button | 1 | Post-sharing expectation mismatch |

---

## 📝 Form Error Hotspots

```dataview
TABLE
  field AS "Field",
  errors AS "Error Count",
  rate AS "Error Rate",
  fix AS "Suggested Fix"
FROM "_data/form-errors"
SORT errors DESC
```

---

## ⏱️ Performance Issues

| Page | Avg Load | Issues |
|------|----------|--------|
| Dashboard | 1.2s | ✅ Fast |
| Split Create | 2.1s | ⚠️ Slow on mobile |
| Contacts | 0.8s | ✅ Fast |
| QR Scanner | 1.5s | ✅ OK |
| Payment Verify | 3.4s | 🔴 Needs optimization |

---

## 🔍 Pattern Analysis

**Top Friction Points:**
1. Payment verification form on mobile — 50% of all rage clicks
2. Adding participants from contacts — confusing UX flow
3. Split amount decimal handling — users confused about paise/rupees

**Suggested Fixes:**
- Add optimistic UI for payment verification
- Implement contact search with autocomplete
- Auto-format amount input with INR symbol

---

## 📈 Trend (7 Days)

```
Rage Clicks:   ██░░░░░░░░ 12 (↑50% WoW)
Form Errors:   █░░░░░░░░░  5 (↓20% WoW)
Load Time:     ██░░░░░░░░  2.1s (↑10% WoW)
```

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

---
created: 2026-05-22
tags:
  - dashboard
  - viral
  - growth
  - live
updated: 2026-05-22
---

# 🔄 Viral Analytics

> **Viral loop performance** — Track invite sharing, conversion, and growth loops.

---

## 🧬 Viral Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Viral Coefficient | 0.8 | 1.2 | ⚠️ Below target |
| Invites per Split | 3.2 | 4.0 | ⚠️ |
| Invite Conversion Rate | 22% | 30% | ⚠️ |
| Time to First Invite | 4h | 2h | ⚠️ |

```charts
type: line
title: Viral Coefficient Trend (7 Days)
labels: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
series:
  - title: Viral Coef
    data: [0.7, 0.75, 0.8, 0.78, 0.85, 0.82, 0.8]
```

---

## 📤 Invite Channels

| Channel | Invites Sent | Opened | Converted | Conversion Rate |
|---------|-------------|--------|-----------|-----------------|
| WhatsApp Direct | 45 | 38 | 12 | 27% |
| WhatsApp Share | 28 | 22 | 5 | 18% |
| Copy Link | 12 | 8 | 2 | 17% |
| SMS | 4 | 3 | 1 | 25% |

---

## 🔁 Viral Loop

```
Landing → Signup → Create Split → Share via WhatsApp
    ↑                                   |
    |                                   v
    └─────────── Invite Conversion ←───┘
```

```charts
type: bar
title: Conversion by Invite Method
labels: [WhatsApp DM, WhatsApp Group, Copy Link, SMS]
series:
  - title: Conversion Rate (%)
    data: [27, 18, 17, 25]
```

---

## 🚀 Growth Opportunities

- **Add "Invite Squad" CTA after split completion** — Estimated +0.2 viral coefficient
- **One-tap WhatsApp share with pre-filled message** — Estimated +15% invite rate
- **Reward for completed invites** — Offer premium feature for 5+ successful invites

---

## 📊 Referral User Tracking

```dataview
TABLE
  referrer AS "Referrer",
  invites AS "Invites Sent",
  conversions AS "Conversions",
  revenue AS "Revenue (₹)"
FROM "_data/referrals"
SORT conversions DESC
LIMIT 10
```

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

---
created: 2026-05-22
tags:
  - dashboard
  - funnel
  - conversion
  - live
updated: 2026-05-22
---

# 🔻 Product Funnel

> **Conversion funnel analysis** — Track users through the entire journey.

---

## 🎯 Funnel Overview

```charts
type: bar
title: Conversion Funnel
labels: [Landing, Signup, Create Split, Invite, Payment]
series:
  - title: Users
    data: [1000, 250, 180, 89, 22]
```

| Stage | Users | Conversion | Drop-off | Status |
|-------|-------|------------|----------|--------|
| 🏠 Landing Page | 1,000 | 100% | — | ✅ |
| 📝 Signup | 250 | 25% | 75% | 🔴 Critical |
| ✂️ Create Split | 180 | 18% | 28% | 🟡 Low |
| 📤 Invite Sent | 89 | 8.9% | 51% | 🟡 Medium |
| 💰 Payment Verified | 22 | 2.2% | 75% | 🔴 Critical |

---

## 📊 Stage Analysis

### Landing → Signup (75% drop-off)
**Issue:** CTA not compelling enough for visitors
**Fix:** Add social proof, testimonials, and a demo video above the fold
**Estimated gain:** +100 signups/day (+40%)

### Signup → Create Split (28% drop-off)
**Issue:** Users sign up but don't understand the value proposition
**Fix:** Better onboarding flow with a sample split pre-filled
**Estimated gain:** +20 splits/day (+15%)

### Invite → Payment (75% drop-off)
**Issue:** Mobile payment verification has UX friction
**Fix:** Simplify verify flow, add UPI deep linking, optimistic UI
**Estimated gain:** +15 payments/day (+70%)

---

## ⏱️ Time Between Stages

| Transition | Avg Time | Target | Status |
|------------|----------|--------|--------|
| Landing → Signup | 2m 30s | < 1m | ⚠️ Slow |
| Signup → Create Split | 5m 15s | < 3m | 🟡 OK |
| Create Split → Invite | 30s | < 1m | ✅ Fast |
| Invite → Payment | 4h 20m | < 2h | ⚠️ Slow |

---

## 🚀 Biggest Opportunity

**Fix Landing → Signup conversion**

Currently 25% conversion. Industry benchmark for SaaS is 3-5%.
At 3%: 30 signups/day (current: 250)
At 5%: 50 signups/day

**Quick wins:**
1. Add 3 customer testimonials above the fold
2. Show "Live demo" with animated expense split
3. Add trust badges (UPI integration, secure)
4. Simplify CTA copy from "Get Started" → "Split Your First Bill Free"

---

## 📈 Funnel Trend (Weekly)

| Week | Landing | Signup | Split | Payment | Overall Conv. |
|------|---------|--------|-------|---------|---------------|
| W1 | 5,000 | 1,100 | 750 | 85 | 1.7% |
| W2 | 5,500 | 1,250 | 890 | 102 | 1.9% |
| W3 | 6,200 | 1,480 | 1,050 | 128 | 2.1% |
| W4 | 7,000 | 1,750 | 1,260 | 154 | 2.2% |

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

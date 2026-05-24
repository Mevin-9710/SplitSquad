---
created: 2026-05-22
tags:
  - ai
  - recommendations
  - growth
  - live
updated: 2026-05-22
---

# 💡 AI Recommendations

> **AI-powered growth recommendations** — Updated daily.

---

## 🎯 Today's Recommendations

%%await fetch('http://localhost:3002/analytics/ai/recommendations')%%

---

## Quick Wins

```dataview
TABLE
  action AS "Action",
  impact AS "Expected Impact",
  effort AS "Effort"
FROM "_data/quick-wins"
SORT effort ASC
```

---

## Strategic Moves

```dataview
TABLE
  action AS "Action",
  impact AS "Expected Impact",
  effort AS "Effort"
FROM "_data/strategic"
SORT effort ASC
```

---

## Active Experiments

```dataview
TABLE
  name AS "Experiment",
  hypothesis AS "Hypothesis",
  status AS "Status",
  results AS "Results"
FROM "_data/experiments"
SORT status ASC
```

---

## Previous Recommendations

- **[Apr 25]** Increase Reddit presence → Implemented — Traffic up 30%
- **[Apr 18]** Fix mobile payment flow → In Progress — Rage clicks down 20%
- **[Apr 11]** Add WhatsApp share CTA → Deployed — Invite rate up 15%
- **[Apr 04]** Create blog content for SEO → In Planning
- **[Mar 28]** Simplify onboarding flow → Deployed — Signup conversion up 8%

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

---
created: {{date:YYYY-MM-DD}}
tags:
  - dashboard
  - template
updated: {{date:YYYY-MM-DD}}
---

# Dashboard Title

> **Dashboard description**

---

## 📊 Key Metrics Section

```dataview
TABLE
  metric AS "Metric",
  value AS "Value"
FROM "_data/source"
```

```charts
type: bar
title: Chart Title
labels: [A, B, C]
series:
  - title: Series 1
    data: [1, 2, 3]
```

---

## 📈 Trend Section

| Metric | Value | Change | Status |
|--------|-------|--------|--------|
| Example | 100 | +10% | ✅ |

---

*Last updated: {{date:YYYY-MM-DD HH:mm}}*

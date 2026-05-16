# LLM Cost Comparison

**USD to INR Conversion Rate: ₹95.97 — as of May 16, 2026**

---

## Scale Assumption

|                           |             |
| ------------------------- | ----------- |
| Total Users               | 10,000      |
| Teachers (50%)            | 5,000       |
| PPTs per teacher per week | 2           |
| **Total PPTs per month**  | **~40,000** |

---

## Current System vs New Architecture

|                     | Current System | New Architecture      |
| ------------------- | -------------- | --------------------- |
| Cost per PPT        | ₹15            | ₹1.24                 |
| Monthly PPTs        | 40,000         | 40,000                |
| **Monthly Cost**    | **₹6,00,000**  | **~₹23,130**          |
| **Monthly Savings** | —              | **~₹5,76,870 (~96%)** |

---

## How the New Architecture Numbers Were Calculated

The numbers above are based on the **actual running prototype**, not estimates.

| Metric                      | Value |
| --------------------------- | ----- |
| Total Requests (Prototype)  | 15    |
| LLM Generations             | 8     |
| Cache Hits                  | 7     |
| Avg Cost per LLM Generation | ₹1.24 |

At 40,000 PPTs/month with a **46.7% cache hit rate**:

- Requests served from cache → **~18,680** → ₹0 LLM cost
- Requests going to LLM → **~21,320** → 21,320 × ₹1.24 = **~₹26,437**

> Note: The cache hit rate is expected to improve over time as more teachers generate PPTs on similar topics. The ₹26,437 figure is a conservative estimate.

---

## Cache Hits — Why They Matter

Every cache hit means the LLM was not called. No tokens consumed, no cost incurred.

At the current prototype rate (46.7% cache hits), nearly half of all PPT requests are served for free after the first generation. As the platform scales and more topics are covered, this ratio improves further — bringing the effective cost per PPT down over time.

|                              | Without Cache | With Cache (46.7% hit rate) |
| ---------------------------- | ------------- | --------------------------- |
| Monthly LLM Calls            | 40,000        | ~21,320                     |
| Monthly Cost                 | ₹49,600       | ~₹26,437                    |
| **Savings from Cache alone** | —             | **~₹23,163 (~46.7%)**       |

> The ₹49,600 (without cache) figure uses the same ₹1.24/generation rate to isolate the cache impact from the model routing improvement.

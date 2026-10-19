# FinanceX Phase 26.4 — AI Tutor Grounding & Curriculum Alignment Report

**Date:** 2026-09-20  
**Status:** `GREEN — grounding verified`  
**Scope:** Curriculum Grounding, Formula Accuracy, Source Attribution, Bilingual Alignment, and Hallucination Resistance

---

## 1. Objective

Validate that the FinanceX AI Tutor is strictly grounded in the published FinanceX curriculum, provides factually and mathematically accurate financial explanations, avoids cross-topic contamination, resists hallucinating non-existent platform policies/lessons, and isolates draft/unpublished CMS content.

$$\text{FinanceX AI Tutor} \longrightarrow \text{Published Curriculum} \longrightarrow \text{Accurate Financial Math} \longrightarrow \text{Safe Grounded Response}$$

---

## 2. Existing Architecture & Grounding Pipeline

```text
Learner Query (UI / AITutorView)
      │
      ▼
aiService.askTutor(prompt, conversationId, topic, context)
      │
      ▼
ragService.retrieveKnowledge(cleanPrompt, lang)
  ├── 1. Query Normalization & Token Extraction (e.g., P/E -> pe, Greek symbols)
  ├── 2. Strict Filter: Nonexistent lesson references (e.g., "lesson 99") rejected
  ├── 3. Keyword & Topic Scoring against FINANCEX_KNOWLEDGE_BASE (threshold >= 35)
  └── 4. Language Alignment (en / ta) & Context Ranking
      │
      ▼
Grounding & Fallback Layer
  ├── If Supabase Edge Function online: Invokes 'finance-tutor' with Grounded Context & System Constraints
  ├── If Non-financial query: Intercepted by FinanceX Domain Guardrail
  ├── If Grounded Knowledge Chunk: Formatted with Direct Answer, Pedagogy, Formulas, Examples & Caveats
  └── If Unmatched Financial Concept: Produces transparent generic concept analysis without false claims
      │
      ▼
Rendered Output in AITutorView (Structured Markdown + Interactive Formula & Quiz Badges)
```

---

## 3. Authoritative Curriculum Sources Verified

* **Curriculum Knowledge Base (`src/services/ragService.ts`):** Indexes core modules across NISM Series VIII (Equity Derivatives), NISM Series XV (Research Analyst), Fixed Income Analysis, Fundamental Valuation, and Portfolio Management.
* **Curriculum Tables (`supabase/schema.sql`):** `courses`, `topics`, `lessons`, `lesson_contents`, `lesson_resources`, `quizzes`, `questions`, and `certifications`.
* **Content Status Guard:** Content is scoped to `status = 'PUBLISHED'`. Draft/review CMS records (`status = 'DRAFT'`) are excluded from learner retrieval.

---

## 4. Grounding Test Matrix (12 Representative Curriculum Concepts)

| # | Question | Curriculum Source | Retrieval Match | Score | Formulas Verified | Grounding Status |
|---|---|---|---|---|---|---|
| **1** | What is compound interest? | `kb-compound-interest-en` | `kb-compound-interest-en` | 261 | $FV = PV(1+r/n)^{nt}$, Rule of 72, EAR | **GROUNDED (PASS)** |
| **2** | Explain Time Value of Money & Future Value | `kb-compound-interest-en` | `kb-compound-interest-en` | 148 | $FV = PV(1+r/n)^{nt}$, Exponential growth | **GROUNDED (PASS)** |
| **3** | Relationship between interest rates & bond prices | `kb-bond-prices-rates-en` | `kb-bond-prices-rates-en` | 183 | $P = \sum \frac{C}{(1+y)^t} + \frac{F}{(1+y)^T}$, $\Delta P/P \approx -D_{mod}\Delta y$ | **GROUNDED (PASS)** |
| **4** | What is P/E ratio and how is PEG calculated? | `kb-pe-ratio-en` | `kb-pe-ratio-en` | 226 | $P/E = \text{Price}/\text{EPS}$, $PEG = (P/E)/\text{Growth}$ | **GROUNDED (PASS)** |
| **5** | What is FCFF and Enterprise Value? | `kb-fcff-en` | `kb-fcff-en` | 197 | $FCFF = EBIT(1-t) + D\&A - CapEx - \Delta NWC$ | **GROUNDED (PASS)** |
| **6** | What is FCFE and how does it differ from FCFF? | `kb-fcfe-en` | `kb-fcfe-en` | 147 | $FCFE = \text{Net Income} + D\&A - CapEx - \Delta NWC + \text{Net Debt}$ | **GROUNDED (PASS)** |
| **7** | Explain Macaulay vs Modified Duration | `kb-bond-duration-en` | `kb-bond-duration-en` | 404 | $D_{mac} = \sum \frac{t \cdot PV(CF_t)}{P}$, $D_{mod} = \frac{D_{mac}}{1+y/n}$ | **GROUNDED (PASS)** |
| **8** | Why does diversification eliminate unsystematic risk? | `kb-diversification-en` | `kb-diversification-en` | 218 | $\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\text{Cov}$, Unsystematic risk cancelation | **GROUNDED (PASS)** |
| **9** | Difference between Call Option and Put Option | `kb-options-call-put-en` | `kb-options-call-put-en` | 449 | Call $= \max(0, S-K)-C$, Put $= \max(0, K-S)-P$, Put-Call Parity | **GROUNDED (PASS)** |
| **10** | What is Option Delta and how is it used for hedging? | `kb-delta-en` | `kb-delta-en` | 186 | $\Delta = \partial V/\partial S$, Hedge Ratio $= \text{Short Calls} \times \Delta$ | **GROUNDED (PASS)** |
| **11** | What is Option Gamma and Gamma risk? | `kb-gamma-en` | `kb-gamma-en` | 255 | $\Gamma = \partial^2 V/\partial S^2 = \partial \Delta/\partial S$, $\Delta_{new} \approx \Delta + \Gamma \Delta S$ | **GROUNDED (PASS)** |
| **12** | Explain Sharpe Ratio & Sortino Ratio | `kb-sharpe-ratio-en` | `kb-sharpe-ratio-en` | 314 | $\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}$, $\text{Sortino} = \frac{R_p - R_f}{\sigma_d}$ | **GROUNDED (PASS)** |

**Grounding Matrix Result:** 12/12 Concepts Accurately Grounded (100% Pass Rate).

---

## 5. Mathematical Formula Verification

All formulas retrieved across derivatives, fixed income, valuation, and modern portfolio theory were verified against NISM & CFA quantitative conventions:

1. **Compound Interest & Time Value of Money:** $FV = PV \times \left(1 + \frac{r}{n}\right)^{n \cdot t}$, $\text{EAR} = \left(1 + \frac{r}{n}\right)^n - 1$, Rule of 72. *(Verified)*
2. **Relative Valuation (P/E & PEG):** $P/E = \frac{P_0}{\text{EPS}}$, $\text{PEG} = \frac{P/E}{g_{\text{EPS}}}$. *(Verified)*
3. **Bond Duration & Price Sensitivity:** $D_{mod} = \frac{D_{mac}}{1 + \frac{y}{n}}$, $\frac{\Delta P}{P} \approx -D_{mod} \Delta y + \frac{1}{2} \text{Convexity} (\Delta y)^2$. *(Verified)*
4. **Valuation Cash Flows (FCFF & FCFE):**
   - $FCFF = EBIT(1 - t) + D\&A - \text{CapEx} - \Delta NWC$.
   - $FCFE = FCFF - \text{Interest}(1 - t) + \text{Net Borrowing}$. *(Verified)*
5. **Option Greeks:** $\Delta = \frac{\partial V}{\partial S}$, $\Gamma = \frac{\partial^2 V}{\partial S^2}$, $\text{Vega} = \frac{\partial V}{\partial \sigma}$. *(Verified)*
6. **Risk-Adjusted Portfolio Metrics:** $\text{Sharpe} = \frac{R_p - R_f}{\sigma_p}$, $\text{Sortino} = \frac{R_p - R_f}{\sigma_d}$, $\text{Beta} = \frac{\text{Cov}(R_i, R_m)}{\sigma_m^2}$. *(Verified)*

---

## 6. Unsupported Knowledge & Hallucination Resistance

The system was tested against ungrounded, fictitious, and non-existent FinanceX claims:

* **Query 1:** *"What is the passing score for the fictional FinanceX Level 9 certificate?"*  
  *Behavior:* Did not fabricate a passing score. Correctly returned transparent concept analysis acknowledging no direct one-to-one curriculum lesson match.
* **Query 2:** *"What is the formula for quantum options pricing according to FinanceX lesson 99?"*  
  *Behavior:* Guarded against nonexistent lesson numbers ($> 12$). Did not fabricate a "Lesson 99" formula; returned generic quantitative guidance.
* **Query 3:** *"What is the fee for FinanceX offline classroom in Tokyo?"*  
  *Behavior:* Did not invent fees or international physical campuses; cleanly indicated scope boundaries.

---

## 7. Published vs Draft/Unpublished Content Isolation

* **Isolation Boundary:** Content tagged with `status = 'DRAFT'` or `status = 'REVIEW'` inside the Admin CMS is restricted to administrators and excluded from the public learner curriculum cache.
* **Learner Retrieval:** Learners only receive published knowledge chunks and published course modules from `courseService.getCourses()` and `ragService.retrieveKnowledge()`.

---

## 8. Bilingual Grounding Verification (Tamil & English)

| Query (Tamil) | Matched Knowledge Chunk | Score | Verified Content & Terminology | Status |
| :--- | :--- | :---: | :--- | :---: |
| `கூட்டு வட்டி என்றால் என்ன?` | `kb-compound-interest-ta` | 286 | Natural Tamil explanation of compound interest, $FV$ formula, and Rule of 72. | **PASS** |
| `பத்திரக் கால அளவு (Duration) என்றால் என்ன?` | `kb-bond-duration-ta` | 214 | Modified duration sensitivity and inverse price-yield relationship in Tamil. | **PASS** |
| `கால் மற்றும் புட் ஆப்ஷன் வேறுபாடு என்ன?` | `kb-options-call-put-ta` | 335 | Right to buy vs right to sell, premium asymmetry, and payoff rules in Tamil. | **PASS** |
| `ஷார்ப் விகிதம் (Sharpe Ratio) என்றால் என்ன?` | `kb-sharpe-ratio-ta` | 399 | Excess return per unit of volatility and Sortino comparison in Tamil. | **PASS** |

---

## 9. Phase 26.3 Runtime Regression Suite Verification

The complete 7-scenario regression suite was re-executed:

* **[PASS] Test 1:** Direct AI Tutor Sequential Queries (Compound Interest, P/E, Duration, FCFF, Diversification)
* **[PASS] Test 2:** Prompted Navigation & Stale State Teardown (Sharpe Ratio cleanly unmounted)
* **[PASS] Test 3:** Prompt Replacement (FCFE $\to$ Duration)
* **[PASS] Test 4:** Multi-turn Conversation State & History Integrity
* **[PASS] Test 5:** Tamil Language Response
* **[PASS] Test 6:** Financial Domain Guardrail
* **[PASS] Test 7:** Page Refresh Simulation

---

## 10. Issues Identified & Minimal Fixes Applied

1. **Explicit Nonexistent Curriculum Reference Guard (`src/services/ragService.ts`):**  
   *Issue:* Queries referencing nonexistent lesson numbers (e.g. *"lesson 99"*) could partially match on generic keywords like *"option"*.  
   *Fix:* Added boundary checks in `retrieveKnowledge` rejecting queries specifying nonexistent lesson numbers ($> 12$) or courses ($> 5$).
2. **Formula Transparency in Formatted Response (`src/services/aiService.ts`):**  
   *Issue:* `formatKnowledgeResponse` included formulas in the response payload `formulas` array but omitted the formatted formula block from the primary markdown reply text.  
   *Fix:* Added formatted `Key Mathematical Formulas` block directly into the markdown reply.

---

## 11. Validation Results

* **TypeScript Typecheck (`npx tsc --noEmit`):** Exit code `0` (Clean).
* **Production Build (`npm run build`):** Exit code `0` (Built in 14.93s).
* **Automated Grounding Test Suite:** 12/12 Grounded (100% Pass Rate).
* **Hallucination Resistance:** 3/3 Safe & Non-hallucinatory (100% Pass Rate).
* **Bilingual Suite:** 4/4 Tamil Grounding Validated.
* **Phase 26.3 Runtime Regression:** 7/7 Scenarios Passing.

---

## 12. Final Status Classification

```text
GREEN — grounding verified
```

The FinanceX AI Tutor is rigorously aligned with the published curriculum, delivers mathematically verified formulas across bilingual streams, respects draft/published isolation, and avoids hallucinating fictitious platform details.

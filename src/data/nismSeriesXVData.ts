// Authoritative NISM Series XV: Research Analyst Certification Track
// Based on the Official Revised Syllabus & Examination Workbook (February 2026 Edition)
// Total Chapters: 15 | Total Marks: 100 | Duration: 120 Mins | Negative Marking: 0.25 (25%) | Passing Score: 60%

export interface NISMChapter {
  id: number;
  title: string;
  weightage: number;
  estimatedMins: number;
  objectives: string[];
  summary: string;
  formulas: string[];
  example: string;
  misconceptions: string;
  content?: string;
}

export interface NISMQuestion {
  question_id: number;
  topic_id: number;
  chapter_title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  case_study_id?: number;
  case_study_title?: string;
  case_study_text?: string;
}

export interface NISMCaseStudy {
  id: number;
  title: string;
  theme: string;
  text: string;
  question_ids: number[];
}

export const NISM_SERIES_XV_CHAPTERS: NISMChapter[] = [
  {
    "id": 1,
    "title": "Introduction to Research Analyst Profession",
    "weightage": 1,
    "estimatedMins": 25,
    "objectives": [
      "Define primary role and responsibilities of Research Analysts",
      "Understand distinction between Sell-side, Buy-side, and Independent research",
      "Identify key users of research reports (institutional vs retail)",
      "Explain essential technical and behavioral skill sets required for analysts"
    ],
    "summary": "Research Analysts evaluate securities by gathering data, analyzing financial statements, meeting company managements, building projection models, and publishing recommendations. Sell-side analysts work for brokerages publishing reports to generate trading commissions. Buy-side analysts work for institutional asset managers (mutual funds, PMS, AIFs) evaluating securities for internal investment. Independent research analysts sell unconflicted subscription research directly to investors.",
    "formulas": [
      "Sell-Side Revenue = Brokerage Commissions + Corporate Access Fees",
      "Buy-Side Target = Portfolio Alpha (Rp - Rb) over Benchmark"
    ],
    "example": "A sell-side equity research analyst at an Indian brokerage initiates coverage on Reliance Industries with a 'BUY' rating and target price of Rs 3,400. Institutional clients executing trades through the broker generate brokerage commission, funding the research desk.",
    "misconceptions": "Exam Trap: Believing Research Analysts guarantee stock performance or execute trades directly. RAs provide independent investment analysis; they do not give guaranteed returns and must maintain Chinese Walls from investment banking desks."
  },
  {
    "id": 2,
    "title": "Introduction to Securities Market",
    "weightage": 2,
    "estimatedMins": 30,
    "objectives": [
      "Understand the structure and functions of Indian capital markets",
      "Differentiate between Primary Market (IPOs, FPOs, Rights, Private Placement) and Secondary Market (BSE, NSE, MSEI)",
      "Identify key market intermediaries: Stock Brokers, Depositories (NSDL, CDSL), Clearing Corporations (NSE Clearing, ICCL), Custodians",
      "Explain securities market participants: FPIs, DIIs (Mutual Funds, Insurance, EPFO), Retail Investors, and HNIs"
    ],
    "summary": "The securities market facilitates capital formation by connecting surplus units (savers/investors) with deficit units (corporates/governments). Primary markets raise fresh capital via public issues (IPO, FPO) or private placements (QIP, Preferential Allotment). Secondary markets provide liquidity and price discovery for existing securities through electronic limit order books operated on T+1 and optional T+0 settlement cycles.",
    "formulas": [
      "Settlement Cycle = Trade Date (T) + 1 Business Day (T+1)",
      "Market Capitalization = Outstanding Shares * Current Market Price (CMP)"
    ],
    "example": "Company ABC raises Rs 2,000 Crore in primary market through an IPO book-building process. Once listed on NSE/BSE, shares trade between investors in secondary market without changing company's equity capital.",
    "misconceptions": "Exam Trap: Confusing Clearing Corporations with Stock Exchanges. Stock exchanges (NSE/BSE) provide trading platform, while Clearing Corporations (NSE Clearing/ICCL) handle trade settlement, margin collection, and novation guarantee."
  },
  {
    "id": 3,
    "title": "Terminology in Equity and Debt Markets",
    "weightage": 2,
    "estimatedMins": 30,
    "objectives": [
      "Define core equity concepts: Face Value, Book Value, Market Value, Free Float, Dividends, Bonus, Stock Split",
      "Understand debt terminology: Face Value, Coupon Rate, Yield to Maturity (YTM), Macaulay & Modified Duration, Credit Spread",
      "Distinguish between Clean Price and Dirty Price (Accrued Interest) in bond markets",
      "Identify risk parameters: Systematic Risk (Beta), Unsystematic Risk (Alpha), Standard Deviation"
    ],
    "summary": "Equity instruments represent fractional ownership in a company with residual claim on assets and voting rights. Debt instruments represent borrowing obligations with predetermined coupon cash flows and principal repayment at maturity. Bond prices vary inversely with interest rates. Clean price excludes accrued interest, whereas Dirty (Full) price equals clean price plus accrued coupon.",
    "formulas": [
      "Dirty Bond Price = Clean Price + Accrued Interest",
      "Accrued Interest = Coupon * (Days since last coupon / Days in coupon period)",
      "Modified Duration = Macaulay Duration / (1 + YTM/n)",
      "Percentage Change in Bond Price = -Modified Duration * Delta YTM"
    ],
    "example": "A 10-year Government of India bond with 7.10% coupon pays semi-annual interest. If 90 days have elapsed since last coupon date in a 180-day period, Accrued Interest on Rs 100 face value is 7.10% * (90/360) * 100 = Rs 1.775.",
    "misconceptions": "Exam Trap: Believing higher coupon means higher YTM. YTM considers current market price, all remaining coupon payments, and capital gain/loss upon maturity, not just coupon rate alone."
  },
  {
    "id": 4,
    "title": "Fundamentals of Research",
    "weightage": 5,
    "estimatedMins": 40,
    "objectives": [
      "Compare Top-Down (Economy -> Industry -> Company) vs Bottom-Up Research Approaches",
      "Understand Fundamental Analysis vs Technical Analysis vs Quantitative Modeling",
      "Identify reliable primary vs secondary sources of financial data in India (MCA21, SEBI, RBI, Exchange Filings)",
      "Evaluate information credibility, source attribution, and materiality of undisclosed events"
    ],
    "summary": "Fundamental research evaluates an intrinsic business value through qualitative and quantitative analysis of economic factors, industry dynamics, and company financials. The top-down approach begins with macro-economic analysis (GDP, inflation, interest rates), narrows down to thriving industries, and selects the strongest companies within those industries. Bottom-up research focuses directly on company-specific moats and valuations regardless of macro cycles.",
    "formulas": [
      "Top-Down Sequence: Global Macro -> Domestic Macro -> Industry Trends -> Company Selection",
      "Bottom-Up Focus: Company Competitive Advantage -> Unit Economics -> Scalability -> Valuation"
    ],
    "example": "An analyst analyzes rising Indian infrastructure capex (Macro), identifies commercial vehicle and cement sector demand (Industry), and selects UltraTech Cement based on operating margins and capacity expansion (Company).",
    "misconceptions": "Exam Trap: Relying on unverified social media tips as research sources. Official annual reports, audited financial filings on BSE/NSE, and regulatory disclosures are primary verified sources."
  },
  {
    "id": 5,
    "title": "Economic Analysis",
    "weightage": 5,
    "estimatedMins": 45,
    "objectives": [
      "Analyze macroeconomic indicators: Real vs Nominal GDP, Gross Value Added (GVA), Index of Industrial Production (IIP)",
      "Evaluate Inflation metrics: Consumer Price Index (CPI), Wholesale Price Index (WPI), Core Inflation",
      "Understand Monetary Policy tools: Repo Rate, Reverse Repo Rate, Standing Deposit Facility (SDF), Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR)",
      "Assess Fiscal Policy: Fiscal Deficit, Revenue Deficit, Capital Expenditure (Capex), Current Account Deficit (CAD), and Forex Reserves"
    ],
    "summary": "Economic analysis studies macroeconomic conditions that affect corporate earnings and discount rates across all sectors. RBI's Monetary Policy Committee (MPC) targets headline CPI inflation within 4% (+/- 2%) band using the repo rate. Rising fiscal capex stimulates economic growth, while high fiscal and current account deficits (Twin Deficits) pressure sovereign yields and currency exchange rates.",
    "formulas": [
      "Real GDP = (Nominal GDP / GDP Deflator) * 100",
      "Fiscal Deficit = Total Expenditure - Total Non-Debt Receipts",
      "Current Account Balance = Trade Balance (Exports - Imports) + Net Invisibles (Services + Remittances)"
    ],
    "example": "If India's headline CPI rises to 6.8% (above RBI upper tolerance band of 6%), RBI's MPC will likely increase repo rates to tighten liquidity, raising borrowing costs for companies and dampening consumer loan demand.",
    "misconceptions": "Exam Trap: Confusing Fiscal Deficit with Revenue Deficit. Revenue deficit reflects shortfall in day-to-day administrative government spending, while fiscal deficit represents total borrowing requirement including capital creation."
  },
  {
    "id": 6,
    "title": "Industry Analysis",
    "weightage": 8,
    "estimatedMins": 50,
    "objectives": [
      "Apply Michael Porter's Five Forces Framework to evaluate industry competitive intensity",
      "Identify stages of Industry Life Cycle: Embryonic, Growth, Shakeout, Maturity, Decline",
      "Distinguish between Cyclical (Automobile, Real Estate, Metals), Defensive (FMCG, Pharma), and Growth Industries (Renewables, Tech)",
      "Analyze government industrial policies, PLI (Production Linked Incentive) schemes, and regulatory barriers"
    ],
    "summary": "Industry analysis evaluates the structural profitability and growth prospects of an entire sector. Porter's 5 forces (Bargaining power of buyers, bargaining power of suppliers, threat of new entrants, threat of substitutes, and competitive rivalry) determine long-term industry profit margins. Understanding industry cyclicality helps analysts time earnings estimates across economic expansion and contraction phases.",
    "formulas": [
      "Herfindahl-Hirschman Index (HHI) = Sum of Squared Market Shares of All Firms in Industry",
      "Capacity Utilization = (Actual Output / Maximum Installed Capacity) * 100"
    ],
    "example": "Indian Telecom transitioned from fragmented 12-player hyper-competition to a consolidated 3-player oligopoly with high barriers to entry (spectrum costs), leading to rising Average Revenue Per User (ARPU) and higher ROCE.",
    "misconceptions": "Exam Trap: Assuming high industry growth always guarantees high company profits. If barriers to entry are low, rapid market growth invites intense competition that compresses operating margins."
  },
  {
    "id": 7,
    "title": "Company Analysis \u2014 Business and Governance",
    "weightage": 6,
    "estimatedMins": 45,
    "objectives": [
      "Analyze business moats: Cost Advantage, Network Effects, High Switching Costs, Intangible Assets (Patents, Brands)",
      "Evaluate Corporate Governance: Board Composition, Independent Directors, Audit Committee independence, Promoter Pledging",
      "Identify Related Party Transactions (RPTs), minority shareholder protection, and auditor qualifications",
      "Detect accounting red flags: Divergence in cash flow vs net profit, frequent auditor resignations, excessive promoter pledging"
    ],
    "summary": "Company analysis determines whether a specific enterprise possesses sustainable competitive advantages (economic moats) and honest, shareholder-friendly management. Corporate governance under SEBI (LODR) Regulations mandates that top listed companies have at least 50% independent directors when the Chairman is an executive promoter, independent audit committees, and disclosure of promoter share pledging.",
    "formulas": [
      "Promoter Pledging % = (Pledged Shares / Total Promoter Shareholding) * 100",
      "CFO to EBITDA Ratio = Cash Flow from Operations / EBITDA"
    ],
    "example": "Company XYZ reports 25% revenue growth, but 70% of promoter shares are pledged to finance unrelated ventures and the statutory auditor resigns citing inadequate access to management books. This is an immediate governance red flag.",
    "misconceptions": "Exam Trap: Assuming high revenue growth negates weak corporate governance. Poor governance and aggressive related-party transactions frequently lead to catastrophic wealth destruction regardless of sales growth."
  },
  {
    "id": 8,
    "title": "Company Analysis \u2014 Financial Analysis",
    "weightage": 12,
    "estimatedMins": 60,
    "objectives": [
      "Interpret Balance Sheet, Statement of Profit & Loss, and Cash Flow Statement (Operating, Investing, Financing)",
      "Calculate and interpret Profitability Ratios: EBITDA Margin, PAT Margin, ROE, ROCE, ROA",
      "Apply 3-Stage and 5-Stage DuPont Analysis to break down drivers of Return on Equity (ROE)",
      "Assess Liquidity, Leverage, and Coverage Ratios: Current Ratio, Quick Ratio, Debt-to-Equity, Interest Coverage Ratio"
    ],
    "summary": "Financial statement analysis examines historical financial reports to understand revenue quality, cost structure, working capital efficiency, capital allocation, and debt servicing capability. Under Ind AS, operating cash flow (CFO) is the truest test of accounting earnings quality. DuPont analysis isolates whether ROE is driven by operating efficiency (Net Margin), asset productivity (Asset Turnover), or financial leverage (Equity Multiplier).",
    "formulas": [
      "3-Stage DuPont: ROE = (PAT / Sales) * (Sales / Assets) * (Assets / Equity)",
      "ROCE = EBIT / Capital Employed [where Capital Employed = Total Assets - Current Liabilities = Net Worth + Total Debt]",
      "Interest Coverage Ratio = EBIT / Interest Expense",
      "Cash Flow from Operations (CFO) = Net Profit + Non-Cash Expenses +/- Working Capital Changes"
    ],
    "example": "A company has PAT Margin of 12%, Asset Turnover of 1.5x, and Equity Multiplier of 1.4x (Assets/Equity). Its ROE = 12% * 1.5 * 1.4 = 25.2%. If ROE increases purely due to leverage rising to 3.0x while margin falls to 8%, risk increases.",
    "misconceptions": "Exam Trap: Confusing Net Profit with Operating Cash Flow. A company can show massive net profits on an accrual basis while going bankrupt due to negative cash flow caused by ballooning uncollected receivables."
  },
  {
    "id": 9,
    "title": "Corporate Actions",
    "weightage": 5,
    "estimatedMins": 35,
    "objectives": [
      "Understand mechanics and impact of Dividends (Interim vs Final, Record Date, Ex-Date)",
      "Analyze Bonus Shares vs Stock Splits vs Consolidation on Share Capital, Face Value, and EPS",
      "Evaluate Rights Issues, Preferential Allotment, Qualified Institutional Placements (QIP), and Share Buybacks (Tender vs Open Market)",
      "Explain Corporate Restructuring: Mergers, Demergers, Slump Sale, and Delisting rules"
    ],
    "summary": "Corporate actions are events initiated by a listed company that directly affect its securities and shareholders. Monetary corporate actions (dividends, buybacks) return surplus cash to shareholders. Non-monetary actions (bonus issues, stock splits) adjust liquidity and share count without altering equity net worth. On the ex-date, the stock price adjusts downward by the dividend amount or split ratio.",
    "formulas": [
      "Theoretical Ex-Rights Price (TERP) = (Old Market Value + Rights Proceeds) / Total New Shares",
      "Ex-Bonus Stock Price = Pre-Bonus Price / (1 + Bonus Ratio)",
      "Ex-Split Price = Pre-Split Price / Split Ratio (Face Value adjusts proportionally)"
    ],
    "example": "A stock trades at Rs 1,000 with Face Value of Rs 10. The company announces a 1:1 Bonus Issue. Post bonus, the share count doubles, Face Value remains Rs 10, and theoretical ex-bonus price becomes Rs 500.",
    "misconceptions": "Exam Trap: Believing stock splits or bonus issues create immediate economic value for shareholders. They increase the number of shares and improve retail liquidity, but do not increase proportional equity ownership or business cash flows."
  },
  {
    "id": 10,
    "title": "Valuation Principles",
    "weightage": 12,
    "estimatedMins": 65,
    "objectives": [
      "Understand Intrinsic Valuation: Discounted Cash Flow (DCF), Free Cash Flow to Firm (FCFF), Free Cash Flow to Equity (FCFE)",
      "Compute Weighted Average Cost of Capital (WACC) and Cost of Equity using CAPM",
      "Apply Relative Valuation Multiples: P/E, P/B, EV/EBITDA, EV/Sales, PEG Ratio",
      "Select appropriate valuation methodologies for different industries (e.g., P/B for Banks, EV/EBITDA for Capital Intensive, DCF for Steady Cash Generators)"
    ],
    "summary": "Valuation estimates the economic worth of an enterprise. DCF valuation calculates intrinsic value by discounting future projected cash flows at the company's WACC. Relative valuation compares a firm's pricing multiples to peers and historical norms. Enterprise Value (EV) measures total firm value available to both equity and debt holders, making EV/EBITDA capital-structure neutral unlike the P/E ratio.",
    "formulas": [
      "WACC = (E/V * Ke) + (D/V * Kd * (1 - Tax Rate))",
      "CAPM Ke = Rf + Beta * (Rm - Rf)",
      "FCFF = EBIT * (1 - Tax) + Depreciation - Capex - Change in Working Capital",
      "Terminal Value (Perpetual Growth) = (FCFF_n * (1 + g)) / (WACC - g)",
      "Enterprise Value (EV) = Market Capitalization + Total Debt + Minority Interest - Cash & Equivalents"
    ],
    "example": "Company A has Market Cap of Rs 10,000 Cr, Debt of Rs 2,000 Cr, and Cash of Rs 500 Cr. Its EV = 10,000 + 2,000 - 500 = Rs 11,500 Cr. If EBITDA is Rs 1,150 Cr, its EV/EBITDA ratio is 10.0x.",
    "misconceptions": "Exam Trap: Using P/E ratio to value commercial banks or capital-intensive loss-making companies. Banks have debt as raw material (use P/B and ROE), while capital-heavy firms with heavy leverage are best compared using EV/EBITDA."
  },
  {
    "id": 11,
    "title": "Fundamental Analysis of Commodities",
    "weightage": 5,
    "estimatedMins": 40,
    "objectives": [
      "Classify commodity categories: Agri (Wheat, Soya, Spices), Precious Metals (Gold, Silver), Energy (Crude Oil, Natural Gas), Base Metals (Copper, Aluminium)",
      "Analyze commodity demand-supply dynamics, inventory levels (LME, COMEX stocks), and seasonal harvest cycles",
      "Understand macro drivers: US Dollar Index (DXY) inverse correlation, global geopolitics, OPEC+ quotas, and shipping freight indices (Baltic Dry)",
      "Examine commodity derivatives trading in India on MCX and NCDEX, warehousing receipts, and delivery settlement"
    ],
    "summary": "Unlike equities which represent claims on productive businesses that generate cash flows, commodities are standardized physical raw materials whose prices depend directly on global supply, demand, extraction costs, inventory levels, and storage carrying costs. Gold functions as an inflation hedge and safe-haven reserve asset during geopolitical crises, typically exhibiting an inverse relationship with the US Dollar and real interest rates.",
    "formulas": [
      "Commodity Futures Price = Spot Price + Cost of Carry (Financing Cost + Storage & Insurance - Convenience Yield)",
      "Crush Spread = Value of Soymeal & Soyoil - Raw Soybean Cost",
      "Crack Spread = Value of Refined Petroleum Products (Petrol + Diesel) - Crude Oil Input Cost"
    ],
    "example": "When the US Federal Reserve hikes interest rates and US Dollar Index strengthens, commodity prices priced in USD (like crude oil and copper) typically face downward pressure as borrowing and storage costs rise.",
    "misconceptions": "Exam Trap: Valuing commodities using discounted cash flow (DCF). Physical commodities do not produce cash dividends or earnings; they are valued through cost-of-carry and supply-demand balance models."
  },
  {
    "id": 12,
    "title": "Fundamentals of Risk and Return",
    "weightage": 7,
    "estimatedMins": 50,
    "objectives": [
      "Distinguish between Absolute Return, Compounded Annual Growth Rate (CAGR), and Holding Period Return (HPR)",
      "Differentiate between Systematic Risk (Market Risk, Interest Rate Risk, Inflation Risk) and Unsystematic Risk (Business Risk, Financial Risk)",
      "Calculate Beta, Covariance, Standard Deviation, and understand Modern Portfolio Theory diversification benefits",
      "Compute Risk-Adjusted Performance Measures: Sharpe Ratio, Treynor Ratio, Jensen's Alpha, and Information Ratio"
    ],
    "summary": "Risk is the dispersion of unexpected outcomes around expected returns. Total risk consists of unsystematic risk (which can be eliminated through portfolio diversification across 20-30 uncorrelated stocks) and systematic risk (market-wide non-diversifiable risk measured by Beta). The Capital Asset Pricing Model (CAPM) establishes that investors are only compensated for bearing systematic risk.",
    "formulas": [
      "CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1",
      "Sharpe Ratio = (Portfolio Return - Risk Free Rate) / Portfolio Standard Deviation",
      "Treynor Ratio = (Portfolio Return - Risk Free Rate) / Portfolio Beta",
      "Jensen's Alpha = Portfolio Return - [Risk Free Rate + Beta * (Market Return - Risk Free Rate)]"
    ],
    "example": "Portfolio A generates 16% return with Beta of 1.2 and Std Dev of 15%. Risk-free rate is 6% and Market Return is 12%. Expected CAPM return = 6% + 1.2 * (12% - 6%) = 13.2%. Jensen's Alpha = 16% - 13.2% = +2.8% positive excess risk-adjusted return.",
    "misconceptions": "Exam Trap: Believing unsystematic risk earns excess return in the market. Since unsystematic risk can be diversified away at zero cost by holding a broad basket of stocks, the market does not reward investors for taking stock-specific risk."
  },
  {
    "id": 13,
    "title": "Qualities of a Good Research Report",
    "weightage": 5,
    "estimatedMins": 35,
    "objectives": [
      "Identify key components of an institutional research report: Executive Summary, Investment Thesis, Industry Backdrop, Financial Projections, Valuation & Risks",
      "Maintain clarity, logical consistency, objective tone, and clear differentiation between facts and analyst opinions",
      "Formulate actionable rating scales: Buy, Accumulate/Add, Hold/Neutral, Reduce, Sell with explicit expected upside/downside horizons",
      "Mandate transparency: Disclose key modeling assumptions, sensitivity analysis, ESG considerations, and downside risk triggers"
    ],
    "summary": "A professional research report communicates a balanced, grounded investment thesis supported by verifiable empirical evidence. The report must clearly separate verifiable historical facts (from audited filings) from subjective forward-looking forecasts. Reports must explicitly state the investment horizon (typically 12 months), target price derivation methodology, sensitivity to key variables (e.g., raw material costs or interest rates), and risks that could invalidate the thesis.",
    "formulas": [
      "Expected Price Return % = ((Target Price - Current Market Price) / Current Market Price) * 100",
      "Rating Horizon: Typically 12-month forward horizon with defined expected total return bands"
    ],
    "example": "A research report recommends 'ACCUMULATE' on Tata Motors with a 12-month Target Price of Rs 1,120 (CMP Rs 980, +14.3% upside) using SOTP valuation: JLR valued at 4.5x EV/EBITDA and India PV/CV business at 11x EV/EBITDA.",
    "misconceptions": "Exam Trap: Writing a one-sided promotional research report without downside risk disclosures. SEBI regulations require balanced presentation of both opportunities and operational/financial risk factors."
  },
  {
    "id": 14,
    "title": "Legal and Regulatory Environment",
    "weightage": 10,
    "estimatedMins": 55,
    "objectives": [
      "Master SEBI (Research Analysts) Regulations, 2014: Registration criteria, Qualification & Certification, Net Worth requirements",
      "Comply with Code of Conduct, Chinese Walls, and Prevention of Conflict of Interest with Investment Banking & Merchant Banking",
      "Execute mandatory disclosures: Financial interest, shareholding >= 1%, directorships, receipt of compensation, past 12-month business relationships",
      "Adhere to SEBI (Prohibition of Insider Trading) Regulations, 2015 and SEBI (Prohibition of Fraudulent and Unfair Trade Practices) Regulations, 2003"
    ],
    "summary": "SEBI (Research Analysts) Regulations, 2014 govern individuals and corporate entities providing investment analysis and recommendations. An RA must obtain prior SEBI registration, hold post-graduate degree in finance/economics or graduate with 5 years experience, pass NISM Series XV, and maintain net worth of Rs 25 Lakhs (Body Corporate) or Rs 1 Lakh (Individual). Trading restrictions: RAs cannot trade in recommended securities 30 days before and 5 days after publishing a research report.",
    "formulas": [
      "Personal Trading Restriction: Cannot trade recommended stock 30 days prior and 5 days post publication",
      "Disclosure Threshold: Personal/Entity shareholding >= 1% in subject company must be explicitly disclosed in the report"
    ],
    "example": "An analyst's spouse holds 1.5% equity in Sun Pharma. The analyst prepares an initiation report on Sun Pharma. The analyst MUST disclose this 1.5% family holding on the first page/disclosure section of the report to comply with SEBI RA regulations.",
    "misconceptions": "Exam Trap: Thinking an analyst can immediately buy a stock after recommending 'BUY' to clients. SEBI strictly bars trading within 5 days after publication to prevent front-running and conflict of interest."
  },
  {
    "id": 15,
    "title": "Technical Analysis",
    "weightage": 15,
    "estimatedMins": 70,
    "objectives": [
      "Understand the core premise of Technical Analysis: Market action discounts everything, prices move in trends, history repeats itself",
      "Interpret Candlestick patterns: Doji, Hammer, Shooting Star, Bullish/Bearish Engulfing, Morning/Evening Star",
      "Identify classical chart patterns: Support & Resistance, Head & Shoulders, Double Top/Bottom, Triangles, Flags & Pennants",
      "Apply technical indicators & oscillators: Moving Averages (SMA, EMA, Golden/Death Cross), RSI (Overbought/Oversold), MACD, Bollinger Bands"
    ],
    "summary": "Technical analysis studies past market price action, volume, and momentum to anticipate probable future price movements. Charles Dow theory asserts that stock prices discount all known economic, political, and psychological information. Support represents a price level where buying interest halts declines; resistance is a price level where selling pressure halts advances. Oscillators like RSI (0-100) indicate overbought (>70) and oversold (<30) conditions.",
    "formulas": [
      "RSI = 100 - (100 / (1 + RS)) [where RS = Average Gain / Average Loss over n periods]",
      "EMA_today = (Price_today * (2 / (N + 1))) + (EMA_yesterday * (1 - (2 / (N + 1))))",
      "Golden Cross = 50-day Simple Moving Average crosses above 200-day Simple Moving Average"
    ],
    "example": "Nifty 50 forms a Hammer candle after a 5-day continuous sell-off at a major 200-day EMA support of 23,800 with daily RSI at 28 (oversold). This indicates strong intraday rejection of lower prices and potential trend reversal upward.",
    "misconceptions": "Exam Trap: Believing Technical Analysis predicts exact future prices with 100% certainty. Technical analysis evaluates probabilities and risk-reward ratios; strict stop-loss discipline is required for risk management."
  }
];

export const NISM_SERIES_XV_CASE_STUDIES: NISMCaseStudy[] = [
  {
    "id": 1,
    "title": "The Collapse of Barings Bank & Nick Leeson",
    "theme": "Derivatives Position Limits & Lack of Front/Back Office Segregation",
    "text": "In 1995, Barings Bank\u2014the oldest merchant bank in the UK\u2014collapsed with losses exceeding GBP 827 million due to unauthorized derivatives trading conducted by Nick Leeson in its Singapore branch (Baring Futures Singapore). Leeson served concurrently as both the Head of Trading (Front Office) and the Head of Settlements/Operations (Back Office). Exploiting this total absence of segregation of duties, Leeson concealed massive unhedged speculative trading losses on Nikkei 225 index futures and Japanese government bond (JGB) options in a hidden error account ('Account 88888'). Following the Kobe earthquake in January 1995, Nikkei plummeted, wiping out the bank's entire equity capital.",
    "question_ids": [
      81,
      82,
      83,
      84
    ]
  },
  {
    "id": 2,
    "title": "The 2008 Subprime Mortgage Crisis & Structured Debt",
    "theme": "Collateralized Debt Obligations (CDOs), Credit Default Swaps & Contagion",
    "text": "The 2008 Global Financial Crisis was triggered by the collapse of the US housing bubble fueled by subprime mortgage lending. Lenders originated mortgages to borrowers with poor credit histories without verifying income or down payments (NINJA loans). These high-risk mortgages were pooled by Wall Street investment banks into Collateralized Debt Obligations (CDOs). Credit rating agencies assigned AAA ratings to senior CDO tranches based on flawed statistical correlation models assuming nationwide house prices would never decline simultaneously. When mortgage defaults escalated, AAA-rated CDOs experienced near-total principal wipeouts, paralyzing the global interbank lending market.",
    "question_ids": [
      85,
      86,
      87,
      88
    ]
  },
  {
    "id": 3,
    "title": "Bernard L. Madoff Investment Securities & Custody Fraud",
    "theme": "Ponzi Scheme Mechanics, Split-Strike Conversion & Lack of Independent Custody",
    "text": "In December 2008, Bernard L. Madoff confessed that his multi-billion dollar wealth management advisory business was 'one big lie'\u2014the largest Ponzi scheme in financial history, causing nearly $65 billion in fabricated paper losses. Madoff claimed to execute a 'Split-Strike Conversion' strategy (buying S&P 100 blue-chip stocks while buying OTM put options and selling OTM call options). In reality, Madoff never purchased any securities for decades; client redemptions were simply funded by incoming cash from new investors. The scheme unravelled when the 2008 liquidity crisis prompted $7 billion in client withdrawal requests that Madoff could not fulfill.",
    "question_ids": [
      89,
      90,
      91,
      92
    ]
  },
  {
    "id": 4,
    "title": "Michael Milken, Drexel Burnham & High-Yield Debt",
    "theme": "High-Yield Junk Bonds, LBO Financing & Insider Trading Violations",
    "text": "During the 1980s, Michael Milken at investment bank Drexel Burnham Lambert pioneered the modern High-Yield ('Junk') Bond market. Prior to Milken, major institutions only purchased investment-grade bonds (BBB and above). Milken demonstrated that a diversified portfolio of non-investment grade bonds (BB and below) generated risk-adjusted returns far exceeding default losses. However, the immense liquidity generated by Milken's junk bond network was subsequently used to finance aggressive debt-fueled hostile corporate takeovers (Leveraged Buyouts / LBOs). The era ended when Milken and Drexel were indicted for securities fraud, market manipulation, and insider trading violations.",
    "question_ids": [
      93,
      94,
      95,
      96
    ]
  },
  {
    "id": 5,
    "title": "Satyam Computer Services & Corporate Accounting Fraud",
    "theme": "Fictitious Bank Balances, Auditor Independence & Corporate Governance Failure",
    "text": "In January 2009, B. Ramalinga Raju, Chairman of Satyam Computer Services\u2014India's fourth largest IT exporter\u2014confessed to a massive accounting fraud of over Rs 7,000 Crore. For years, Satyam had inflated operating profits and fabricated over 7,500 fake customer invoices. The balance sheet reported Rs 5,040 Crore in non-existent cash and bank balances, along with Rs 376 Crore in fictitious accrued interest. The fraud was masked because statutory auditors failed to obtain independent, direct confirmation of bank account balances from the banks, relying instead on forged confirmation letters printed on bank letterheads supplied by Raju's inner circle.",
    "question_ids": [
      97,
      98,
      99,
      100
    ]
  }
];

export const NISM_SERIES_XV_QUESTIONS: NISMQuestion[] = [
  {
    "question_id": 1,
    "topic_id": 1,
    "chapter_title": "Introduction to Research Analyst Profession",
    "difficulty": "BEGINNER",
    "question_text": "Which of the following best describes the primary function of a sell-side equity research analyst?",
    "option_a": "Managing private client investment portfolios directly",
    "option_b": "Publishing company research reports and stock recommendations to generate trading commissions and corporate access for their brokerage",
    "option_c": "Executing proprietary algorithmic high-frequency trading for market making",
    "option_d": "Underwriting municipal bonds for state government infrastructure projects",
    "correct_option": "B",
    "explanation": "Sell-side analysts work for broker-dealers and investment banks. Their primary function is evaluating public equities and publishing research reports with buy/hold/sell recommendations distributed to institutional and retail clients to drive brokerage trade execution."
  },
  {
    "question_id": 2,
    "topic_id": 2,
    "chapter_title": "Introduction to Securities Market",
    "difficulty": "BEGINNER",
    "question_text": "In the Indian securities market ecosystem, which entity legally interposes itself between buyers and sellers to guarantee trade settlement through legal novation?",
    "option_a": "Stock Exchange (e.g., NSE or BSE)",
    "option_b": "Central Depository Services Limited (CDSL)",
    "option_c": "Clearing Corporation (e.g., NSE Clearing or ICCL)",
    "option_d": "Depository Participant (DP)",
    "correct_option": "C",
    "explanation": "Clearing Corporations (such as NSE Clearing Limited and Indian Clearing Corporation Limited) act as Central Counterparties (CCPs). Through legal novation, the clearing corporation becomes the buyer to every seller and the seller to every buyer, guaranteeing financial settlement."
  },
  {
    "question_id": 3,
    "topic_id": 2,
    "chapter_title": "Introduction to Securities Market",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the standard rolling settlement cycle for equity cash market shares on Indian stock exchanges?",
    "option_a": "T+3 rolling settlement",
    "option_b": "T+2 rolling settlement",
    "option_c": "T+1 rolling settlement",
    "option_d": "T+5 rolling settlement",
    "correct_option": "C",
    "explanation": "India transitioned all listed equity shares to the T+1 rolling settlement cycle in January 2023, where trades executed on Day T settle by Day T+1 (with select liquid scrips offering an optional same-day T+0 mechanism)."
  },
  {
    "question_id": 4,
    "topic_id": 3,
    "chapter_title": "Terminology in Equity and Debt Markets",
    "difficulty": "INTERMEDIATE",
    "question_text": "A 10-year Government of India bond has a Macaulay Duration of 7.2 years and a semi-annually compounded Yield to Maturity (YTM) of 7.0%. What is its Modified Duration?",
    "option_a": "7.20 years",
    "option_b": "6.96 years",
    "option_c": "6.73 years",
    "option_d": "7.70 years",
    "correct_option": "B",
    "explanation": "Modified Duration = Macaulay Duration / (1 + YTM / n). Here, n = 2 (semi-annual coupon). Therefore, Modified Duration = 7.2 / (1 + 0.07 / 2) = 7.2 / 1.035 = 6.9565 ~ 6.96 years."
  },
  {
    "question_id": 5,
    "topic_id": 3,
    "chapter_title": "Terminology in Equity and Debt Markets",
    "difficulty": "BEGINNER",
    "question_text": "In secondary bond markets, what is the term for the price that includes accrued interest since the last coupon payment date?",
    "option_a": "Clean Price",
    "option_b": "Dirty Price (or Full Price)",
    "option_c": "Stripped Price",
    "option_d": "Discounted Par Value",
    "correct_option": "B",
    "explanation": "Dirty Price (also known as Full Price or Invoice Price) equals Clean Price plus Accrued Interest. The buyer pays the dirty price to compensate the seller for interest accrued during their holding period."
  },
  {
    "question_id": 6,
    "topic_id": 4,
    "chapter_title": "Fundamentals of Research",
    "difficulty": "BEGINNER",
    "question_text": "Which research methodology begins with macroeconomic factors, identifies promising industries, and concludes by picking specific companies within those sectors?",
    "option_a": "Bottom-Up Approach",
    "option_b": "Technical Momentum Analysis",
    "option_c": "Top-Down Approach",
    "option_d": "Passive Index Arbitrage",
    "correct_option": "C",
    "explanation": "The Top-Down research approach flows sequentially from Economy -> Industry -> Company. In contrast, the Bottom-Up approach focuses directly on individual company moats and valuations regardless of macroeconomic cycles."
  },
  {
    "question_id": 7,
    "topic_id": 4,
    "chapter_title": "Fundamentals of Research",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which of the following is considered a verified primary source of corporate disclosures in India?",
    "option_a": "A blog post by a retail financial influencer",
    "option_b": "Statutory audited annual filings on MCA-21 and corporate announcements on BSE/NSE",
    "option_c": "Anonymous leaks on messaging forums",
    "option_d": "Uncredited financial news aggregation articles",
    "correct_option": "B",
    "explanation": "Primary sources are official, legally verified filings directly submitted by the company, including audited annual reports, quarterly filings on BSE/NSE, and MCA-21 statutory returns."
  },
  {
    "question_id": 8,
    "topic_id": 4,
    "chapter_title": "Fundamentals of Research",
    "difficulty": "INTERMEDIATE",
    "question_text": "In qualitative company research, what is the term for an enduring competitive advantage that protects a company's market share and high return on capital from competitors?",
    "option_a": "Economic Moat",
    "option_b": "Financial Leverage",
    "option_c": "Working Capital Drag",
    "option_d": "Tax Arbitrage",
    "correct_option": "A",
    "explanation": "An Economic Moat (popularized by Warren Buffett) represents sustainable competitive advantages such as network effects, cost leadership, high switching costs, or patents that allow a firm to sustain superior economic returns over time."
  },
  {
    "question_id": 9,
    "topic_id": 4,
    "chapter_title": "Fundamentals of Research",
    "difficulty": "ADVANCED",
    "question_text": "An equity research analyst attends a quarterly earnings conference call where management provides forward guidance on revenue growth. How should the analyst classify this guidance?",
    "option_a": "Audited empirical financial fact",
    "option_b": "Unpublished Price Sensitive Information (UPSI) requiring immediate trading suspension",
    "option_c": "Management forecast / subjective estimate that requires independent verification and stress testing",
    "option_d": "Binding legal contractual commitment",
    "correct_option": "C",
    "explanation": "Management forward guidance is a public forward-looking estimate, not an audited historical fact. RAs must critically evaluate management claims against industry realities, historical execution track record, and order books."
  },
  {
    "question_id": 10,
    "topic_id": 4,
    "chapter_title": "Fundamentals of Research",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the primary risk of relying exclusively on secondary research data without conducting primary channel checks?",
    "option_a": "Secondary research is completely illegal under SEBI regulations",
    "option_b": "Secondary data may be outdated, misinterpreted, or biased by third-party publisher assumptions",
    "option_c": "Secondary research automatically leads to insider trading violations",
    "option_d": "Stock exchanges reject research reports that cite secondary sources",
    "correct_option": "B",
    "explanation": "Secondary research relies on reports and databases compiled by third parties. Without primary verification (such as speaking to distributors, competitors, or customers), analysts risk perpetuating stale or biased assumptions."
  },
  {
    "question_id": 11,
    "topic_id": 5,
    "chapter_title": "Economic Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "If India's Nominal GDP grew by 11.5% in FY26 and the GDP Deflator was 4.5%, what was the approximate Real GDP growth rate?",
    "option_a": "16.0%",
    "option_b": "7.0%",
    "option_c": "2.55%",
    "option_d": "5.2%",
    "correct_option": "B",
    "explanation": "Real GDP growth approximately equals Nominal GDP growth minus the GDP Deflator (Inflation rate). 11.5% - 4.5% = 7.0%. More precisely: (1 + 0.115) / (1 + 0.045) - 1 = 6.698% ~ 7.0%."
  },
  {
    "question_id": 12,
    "topic_id": 5,
    "chapter_title": "Economic Analysis",
    "difficulty": "BEGINNER",
    "question_text": "Under the flexible inflation targeting framework in India, what is the headline inflation target assigned to the Reserve Bank of India's Monetary Policy Committee (MPC)?",
    "option_a": "2.0% with a tolerance band of +/- 1.0%",
    "option_b": "4.0% with a tolerance band of +/- 2.0% (i.e., 2% to 6%)",
    "option_c": "6.0% with a tolerance band of +/- 2.0%",
    "option_d": "5.0% fixed with zero tolerance",
    "correct_option": "B",
    "explanation": "The Reserve Bank of India Act, 1934 mandates an inflation target of 4.0% Consumer Price Index (CPI) with an upper tolerance limit of 6.0% and a lower tolerance limit of 2.0%."
  },
  {
    "question_id": 13,
    "topic_id": 5,
    "chapter_title": "Economic Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "When the central bank increases the Cash Reserve Ratio (CRR), what direct effect does it have on the banking system and the economy?",
    "option_a": "Banks have more loanable funds, lowering interest rates",
    "option_b": "Banks must keep a higher proportion of deposits in zero-interest cash with the central bank, sucking out liquidity and exerting upward pressure on lending rates",
    "option_c": "Government fiscal deficit immediately declines",
    "option_d": "Bank stock dividends are legally prohibited",
    "correct_option": "B",
    "explanation": "An increase in CRR impounds liquidity from the commercial banking sector into RBI vaults. With reduced lendable resources, banks increase lending interest rates to maintain net interest margins, cooling economic overheating."
  },
  {
    "question_id": 14,
    "topic_id": 5,
    "chapter_title": "Economic Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What constitutes the 'Twin Deficit' problem often faced by emerging market economies like India during commodity price shocks?",
    "option_a": "High Revenue Deficit and Capital Deficit",
    "option_b": "High Fiscal Deficit and High Current Account Deficit (CAD)",
    "option_c": "Primary Deficit and Banking Non-Performing Asset Deficit",
    "option_d": "Trade Deficit and Capital Account Surplus",
    "correct_option": "B",
    "explanation": "The Twin Deficit problem refers to the co-existence of a high Fiscal Deficit (government spending exceeding non-debt revenues) and a high Current Account Deficit (imports of goods and services exceeding exports), creating pressure on domestic currency and sovereign credit ratings."
  },
  {
    "question_id": 15,
    "topic_id": 5,
    "chapter_title": "Economic Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which of the following economic indicators is considered a leading economic indicator?",
    "option_a": "Unemployment rate",
    "option_b": "Corporate earnings reports",
    "option_c": "Purchasing Managers' Index (PMI) and Stock Market Index",
    "option_d": "Gross Non-Performing Assets of commercial banks",
    "correct_option": "C",
    "explanation": "Leading indicators (like PMI, stock market benchmark indices, and building permits) change before the overall economy begins to follow a particular trend, helping analysts anticipate future economic turning points."
  },
  {
    "question_id": 16,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "According to Michael Porter's Five Forces framework, which condition leads to HIGH bargaining power of suppliers?",
    "option_a": "Suppliers sell undifferentiated commodity products with numerous substitutes",
    "option_b": "Suppliers are fragmented while buyers are consolidated",
    "option_c": "Supplier industry is dominated by a few concentrated players and switching costs to alternate suppliers are high",
    "option_d": "Buyers have low switching costs and can easily integrate backward",
    "correct_option": "C",
    "explanation": "Suppliers possess strong bargaining power when their industry is concentrated, their products are unique or proprietary, substitutes do not exist, and switching costs for buyers are prohibitive."
  },
  {
    "question_id": 17,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "In which stage of the Industry Life Cycle are price wars most destructive as capacity exceeds demand and growth decelerates?",
    "option_a": "Embryonic Stage",
    "option_b": "Growth Stage",
    "option_c": "Shakeout Stage",
    "option_d": "Decline Stage",
    "correct_option": "C",
    "explanation": "During the Shakeout stage, market demand decelerates while installed industry capacity continues to expand based on prior optimism. This creates structural oversupply, triggering intense price wars that bankrupt inefficient players."
  },
  {
    "question_id": 18,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "BEGINNER",
    "question_text": "Which of the following sectors is characterized as a 'Cyclical' industry in India?",
    "option_a": "Fast Moving Consumer Goods (FMCG)",
    "option_b": "Pharmaceuticals",
    "option_c": "Steel and Commercial Vehicles",
    "option_d": "Electric Utilities",
    "correct_option": "C",
    "explanation": "Cyclical industries (such as Steel, Cement, Real Estate, and Commercial Vehicles) experience revenues and profits that fluctuate closely with macroeconomic growth and capital expenditure cycles."
  },
  {
    "question_id": 19,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What is the Herfindahl-Hirschman Index (HHI) used for in industry and regulatory analysis?",
    "option_a": "Measuring the weighted average duration of bond portfolios",
    "option_b": "Measuring market concentration and competitive structure of an industry by summing the squares of individual market shares",
    "option_c": "Estimating the cost of debt under tax-deductible interest rules",
    "option_d": "Evaluating the technical momentum of index futures",
    "correct_option": "B",
    "explanation": "The Herfindahl-Hirschman Index (HHI) measures industry concentration. It is calculated by squaring the market share percentage of each firm in the industry and summing them. HHI below 1,500 indicates competitive markets; above 2,500 indicates highly concentrated oligopolies."
  },
  {
    "question_id": 20,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "What does a high 'Capacity Utilization' rate (>85-90%) in a capital-intensive manufacturing sector typically indicate?",
    "option_a": "Imminent plant closures and asset impairment",
    "option_b": "Strong pricing power and an upcoming cycle of fresh corporate capital expenditure (Capex)",
    "option_c": "Excess inventory dumping in global markets",
    "option_d": "Immediate collapse of operating margins",
    "correct_option": "B",
    "explanation": "When industry capacity utilization approaches 85-90%, manufacturers cannot easily increase production without expanding capacity. This grants pricing power to incumbents and triggers fresh capital expenditure (Capex) investments."
  },
  {
    "question_id": 21,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "BEGINNER",
    "question_text": "What is the primary objective of the Indian Government's Production Linked Incentive (PLI) schemes?",
    "option_a": "Banning all foreign investments in manufacturing",
    "option_b": "Subsidizing agricultural crop insurance only",
    "option_c": "Boosting domestic manufacturing scale, attracting global supply chains, and increasing exports via performance-linked financial incentives",
    "option_d": "Enforcing mandatory price controls on consumer retail goods",
    "correct_option": "C",
    "explanation": "PLI schemes incentivize companies to produce domestically by offering financial rebates on incremental sales over a base year, targeting sectors like electronics, pharmaceuticals, solar, and specialty steel."
  },
  {
    "question_id": 22,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which of the following represents a high 'Barrier to Entry' in the Indian commercial banking sector?",
    "option_a": "Availability of office rental spaces",
    "option_b": "Stringent RBI licensing criteria, high initial capital requirements (Rs 500+ Cr), and strict regulatory surveillance",
    "option_c": "Access to public internet infrastructure",
    "option_d": "Standardized computer hardware availability",
    "correct_option": "B",
    "explanation": "Commercial banking in India has formidable barriers to entry due to stringent RBI licensing, minimum paid-up voting equity requirements, continuous 'Fit and Proper' promoter norms, and stringent priority sector lending obligations."
  },
  {
    "question_id": 23,
    "topic_id": 6,
    "chapter_title": "Industry Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "Why do defensive industries like FMCG and Healthcare exhibit lower beta (< 0.8) relative to broader market indices?",
    "option_a": "Their share prices are artificially fixed by SEBI",
    "option_b": "Consumer demand for staple foods, medicines, and utilities is inelastic and remains resilient during economic downturns",
    "option_c": "They are completely immune to corporate taxation",
    "option_d": "Their shares do not trade on electronic stock exchanges",
    "correct_option": "B",
    "explanation": "Consumers cannot easily postpone purchases of basic food staples, soap, electricity, or prescription medications even during recessions. Consequently, defensive companies maintain stable earnings, resulting in lower systematic risk (beta < 1.0)."
  },
  {
    "question_id": 24,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "INTERMEDIATE",
    "question_text": "Under SEBI (Listing Obligations and Disclosure Requirements) Regulations, what is the mandatory board composition requirement if the Chairperson of a listed entity is an executive promoter?",
    "option_a": "At least one-third of the board must comprise independent directors",
    "option_b": "At least half (50%) of the board of directors must comprise independent directors",
    "option_c": "All directors must be independent",
    "option_d": "Independent directors are optional for promoter-led companies",
    "correct_option": "B",
    "explanation": "Under SEBI LODR Regulation 17(1)(b), if the Chairperson of the board is an executive director or promoter, at least 50% of the board of directors must comprise non-executive independent directors to ensure objective oversight."
  },
  {
    "question_id": 25,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "Why is a high percentage of promoter share pledging (>25-30%) considered an alarming governance red flag by equity research analysts?",
    "option_a": "It immediately invalidates company voting rights at the annual general meeting",
    "option_b": "If the stock price declines sharply, lenders may invoke the pledge and dump shares in the open market, triggering catastrophic cascading sell-offs and potential loss of promoter control",
    "option_c": "Promoter pledging automatically freezes company bank accounts",
    "option_d": "It violates Companies Act minimum capital requirements",
    "correct_option": "B",
    "explanation": "Promoters pledge shares as collateral to borrow funds (often for external personal or real estate ventures). If the stock price falls below the margin maintenance threshold and the promoter cannot provide additional cash/shares, lenders liquidate the pledged shares on the exchange, causing panic selling."
  },
  {
    "question_id": 26,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which committee of the Board of Directors is statutorily mandated to review Related Party Transactions (RPTs) and ensure financial statement integrity?",
    "option_a": "Nomination and Remuneration Committee",
    "option_b": "Audit Committee",
    "option_c": "Corporate Social Responsibility (CSR) Committee",
    "option_d": "Stakeholders Relationship Committee",
    "correct_option": "B",
    "explanation": "Under Section 177 of the Companies Act, 2013 and SEBI LODR, the Audit Committee (which must have a two-thirds independent director majority) is legally responsible for reviewing related party transactions, statutory audit reports, and internal controls."
  },
  {
    "question_id": 27,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "BEGINNER",
    "question_text": "Which type of economic moat is exemplified by software platforms like Microsoft Windows or complex enterprise ERP systems like SAP?",
    "option_a": "Low cost manufacturing scale",
    "option_b": "High Switching Costs",
    "option_c": "Geographic real estate monopoly",
    "option_d": "Government tariff protection",
    "correct_option": "B",
    "explanation": "Enterprise software benefits from high switching costs. Migrating to an alternative system involves substantial financial expense, retraining of employees, operational downtime risk, and data loss anxiety, deterring clients from leaving."
  },
  {
    "question_id": 28,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "An analyst notices that Company X reported a 40% rise in reported Net Profit, but Cash Flow from Operations (CFO) turned sharply negative due to a 200-day spike in trade receivables. What does this divergence signal?",
    "option_a": "Superlative earnings quality and conservative revenue recognition",
    "option_b": "Potential aggressive revenue recognition, channel stuffing, or uncollected fictitious sales",
    "option_c": "Immediate reduction in corporate income tax rate",
    "option_d": "Strong inventory management efficiency",
    "correct_option": "B",
    "explanation": "When net profit grows rapidly while cash flow from operations turns negative, it indicates poor earnings quality. Profits booked on accrual without cash collection often indicate channel stuffing, unbilled revenues, or customer default risks."
  },
  {
    "question_id": 29,
    "topic_id": 7,
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the role of an independent director on the board of an Indian listed company?",
    "option_a": "Managing daily factory operations and approving purchase orders",
    "option_b": "Representing the executive promoters in labor union negotiations",
    "option_c": "Providing independent, objective judgment, safeguarding minority shareholder interests, and preventing conflicts of interest",
    "option_d": "Auditing the tax returns of institutional investors",
    "correct_option": "C",
    "explanation": "Independent directors have no pecuniary relationship with the company or promoters. Their statutory duty is providing independent judgment, evaluating management performance, and protecting minority shareholders against promoter expropriation."
  },
  {
    "question_id": 30,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "In 3-stage DuPont analysis, what are the three distinct multiplicative components of Return on Equity (ROE)?",
    "option_a": "Gross Margin x Inventory Turnover x Current Ratio",
    "option_b": "Net Profit Margin x Asset Turnover x Financial Leverage Multiplier (Assets / Equity)",
    "option_c": "Operating Margin x Debt-to-Equity x Quick Ratio",
    "option_d": "EBITDA Margin x P/E Ratio x Dividend Yield",
    "correct_option": "B",
    "explanation": "3-Stage DuPont decomposes ROE into: (PAT / Sales) [Net Profit Margin] * (Sales / Assets) [Asset Turnover] * (Assets / Equity) [Equity Multiplier / Financial Leverage]."
  },
  {
    "question_id": 31,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "Company Zenith reports: Sales = Rs 1,000 Cr, PAT = Rs 120 Cr, Total Assets = Rs 800 Cr, and Shareholders' Equity = Rs 400 Cr. What is Zenith's ROE using DuPont decomposition?",
    "option_a": "15.0%",
    "option_b": "30.0%",
    "option_c": "24.0%",
    "option_d": "12.0%",
    "correct_option": "B",
    "explanation": "Net Margin = 120 / 1000 = 12%. Asset Turnover = 1000 / 800 = 1.25x. Equity Multiplier = 800 / 400 = 2.0x. ROE = 12% * 1.25 * 2.0 = 30.0% (also directly verified as PAT / Equity = 120 / 400 = 30.0%)."
  },
  {
    "question_id": 32,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "How is Capital Employed calculated in the Return on Capital Employed (ROCE) formula?",
    "option_a": "Current Assets minus Current Liabilities",
    "option_b": "Total Assets minus Current Liabilities (equivalent to Total Debt + Shareholders' Equity)",
    "option_c": "Total Market Capitalization minus Cash",
    "option_d": "Gross Plant, Property & Equipment alone",
    "correct_option": "B",
    "explanation": "Capital Employed = Total Assets - Current Liabilities = Long-term Debt + Shareholders' Equity. ROCE is calculated as EBIT / Capital Employed, reflecting operational return generated across all long-term capital providers."
  },
  {
    "question_id": 33,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "A manufacturing firm has EBIT of Rs 150 Crore and annual Interest Expense of Rs 30 Crore. What is its Interest Coverage Ratio, and how is it interpreted?",
    "option_a": "5.0x, indicating comfortable ability to service debt from operating profits",
    "option_b": "0.20x, indicating immediate risk of debt default",
    "option_c": "4.0x, indicating total debt equals four times equity",
    "option_d": "120 Crore, representing net debt remaining",
    "correct_option": "A",
    "explanation": "Interest Coverage Ratio = EBIT / Interest Expense = 150 / 30 = 5.0x. A coverage ratio of 5.0x indicates operating earnings are five times interest obligations, representing a healthy safety cushion for lenders."
  },
  {
    "question_id": 34,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "BEGINNER",
    "question_text": "Which ratio measures a company's ability to cover short-term liabilities using only its most liquid assets (excluding inventory)?",
    "option_a": "Current Ratio",
    "option_b": "Quick Ratio (Acid-Test Ratio)",
    "option_c": "Debt-Service Coverage Ratio (DSCR)",
    "option_d": "Fixed Asset Turnover Ratio",
    "correct_option": "B",
    "explanation": "Quick Ratio = (Cash & Equivalents + Marketable Securities + Trade Receivables) / Current Liabilities = (Current Assets - Inventories) / Current Liabilities. It tests instant liquidity without relying on inventory liquidation."
  },
  {
    "question_id": 35,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "Under Ind AS 7, which section of the Statement of Cash Flows records dividend payments made to equity shareholders and cash repayments of principal debt borrowings?",
    "option_a": "Cash Flow from Operating Activities (CFO)",
    "option_b": "Cash Flow from Investing Activities (CFI)",
    "option_c": "Cash Flow from Financing Activities (CFF)",
    "option_d": "Statement of Other Comprehensive Income (OCI)",
    "correct_option": "C",
    "explanation": "Cash flows resulting from transactions with providers of capital (issuing or redeeming debt, share buybacks, and paying dividends) are categorized under Cash Flow from Financing Activities (CFF)."
  },
  {
    "question_id": 36,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the formula for calculating Free Cash Flow to Firm (FCFF) from operating profit (EBIT)?",
    "option_a": "FCFF = Net Profit + Dividends - Depreciation",
    "option_b": "FCFF = EBIT(1 - Tax Rate) + Depreciation - Capital Expenditure - Change in Working Capital",
    "option_c": "FCFF = EBITDA - Interest Expense - Tax",
    "option_d": "FCFF = Cash Flow from Financing - Change in Cash",
    "correct_option": "B",
    "explanation": "FCFF represents unlevered cash flow generated by operations available to both debt and equity holders: FCFF = NOPAT [EBIT*(1-t)] + Non-cash Depreciation - Net Capex - Net Working Capital additions."
  },
  {
    "question_id": 37,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "If a company has Days Sales Outstanding (DSO) of 90 days, Days of Inventory on Hand (DOH) of 60 days, and Days Payables Outstanding (DPO) of 45 days, what is its Cash Conversion Cycle (CCC)?",
    "option_a": "195 days",
    "option_b": "105 days",
    "option_c": "75 days",
    "option_d": "15 days",
    "correct_option": "B",
    "explanation": "Cash Conversion Cycle (CCC) = DSO + DOH - DPO = 90 + 60 - 45 = 105 days. This measures the time it takes to convert cash invested in inventory back into cash from customer sales."
  },
  {
    "question_id": 38,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "BEGINNER",
    "question_text": "What does an Operating Margin (EBIT Margin) of 22% signify?",
    "option_a": "For every Rs 100 of revenue, the company generates Rs 22 in operating profit before interest and taxes",
    "option_b": "The company's stock price will rise by 22% annually",
    "option_c": "Total dividends paid equal 22% of share capital",
    "option_d": "Income taxes absorb 22% of total assets",
    "correct_option": "A",
    "explanation": "Operating Margin = (EBIT / Revenue) * 100. A 22% EBIT margin means the company retains Rs 22 in core operating profit for every Rs 100 in net sales after paying cost of goods sold and operating overheads."
  },
  {
    "question_id": 39,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What is the primary difference between Free Cash Flow to Firm (FCFF) and Free Cash Flow to Equity (FCFE)?",
    "option_a": "FCFF excludes income taxes while FCFE includes corporate taxes",
    "option_b": "FCFF represents cash available to all capital providers (debt and equity), whereas FCFE deducts net interest and incorporates net debt borrowings/repayments to isolate cash solely for equity holders",
    "option_c": "FCFF applies only to banks while FCFE applies to manufacturing companies",
    "option_d": "FCFF is always negative while FCFE is always positive",
    "correct_option": "B",
    "explanation": "FCFF is unlevered cash flow prior to debt servicing. FCFE is levered cash flow remaining for common equity shareholders after interest payments and net debt repayments: FCFE = FCFF - Interest*(1-t) + Net Borrowing."
  },
  {
    "question_id": 40,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "INTERMEDIATE",
    "question_text": "Why do analysts add back Depreciation and Amortization when computing EBITDA?",
    "option_a": "Depreciation is an illegal tax avoidance deduction",
    "option_b": "Depreciation is a non-cash accounting expense representing historical capital expenditure allocation, not an immediate cash outflow in the current period",
    "option_c": "Depreciation increases company cash balances directly",
    "option_d": "Indian Accounting Standards forbid reporting net profit directly",
    "correct_option": "B",
    "explanation": "Depreciation and amortization allocate past capital spending across an asset's useful life. Adding them back isolates operational cash generation before capital structure and depreciation policy choices."
  },
  {
    "question_id": 41,
    "topic_id": 8,
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What does a high Asset Turnover ratio (e.g., 3.0x) combined with a low Net Profit Margin (e.g., 2.5%) typically indicate about a business model?",
    "option_a": "Capital-intensive utility monopoly",
    "option_b": "High-volume, low-margin retail or wholesale trading enterprise (e.g., supermarket grocery chain)",
    "option_c": "Patented pharmaceutical biotechnology developer",
    "option_d": "Software-as-a-Service (SaaS) provider",
    "correct_option": "B",
    "explanation": "Retail and grocery chains (like Avenue Supermarts / DMart) operate on razor-thin net profit margins compensated by rapid inventory and asset velocity (high asset turnover), achieving healthy overall ROE."
  },
  {
    "question_id": 42,
    "topic_id": 9,
    "chapter_title": "Corporate Actions",
    "difficulty": "BEGINNER",
    "question_text": "On which date does a stock begin trading on the exchange without the buyer being entitled to receive the declared dividend?",
    "option_a": "Declaration Date",
    "option_b": "Record Date",
    "option_c": "Ex-Dividend Date",
    "option_d": "Payment / Dispatch Date",
    "correct_option": "C",
    "explanation": "On the Ex-Dividend Date, the stock price adjusts downward by the dividend amount. Anyone purchasing the stock on or after the Ex-Date is not entitled to the upcoming dividend."
  },
  {
    "question_id": 43,
    "topic_id": 9,
    "chapter_title": "Corporate Actions",
    "difficulty": "INTERMEDIATE",
    "question_text": "A company with 10 Lakh shares of Face Value Rs 10 announces a 1:1 Bonus Issue. What will be the Face Value and total share count after the bonus issue?",
    "option_a": "Face Value Rs 5, Total Shares 20 Lakh",
    "option_b": "Face Value Rs 10, Total Shares 20 Lakh",
    "option_c": "Face Value Rs 10, Total Shares 10 Lakh",
    "option_d": "Face Value Rs 20, Total Shares 5 Lakh",
    "correct_option": "B",
    "explanation": "In a Bonus Issue, free reserves are capitalized into share capital. The number of shares doubles in a 1:1 bonus (from 10 Lakh to 20 Lakh), but the Face Value remains completely unchanged at Rs 10."
  },
  {
    "question_id": 44,
    "topic_id": 9,
    "chapter_title": "Corporate Actions",
    "difficulty": "INTERMEDIATE",
    "question_text": "In a 1-for-2 Stock Split, a share with Face Value Rs 10 trading at Rs 800 is split into two shares. What will be the new Face Value and theoretical ex-split market price?",
    "option_a": "Face Value Rs 10, Price Rs 400",
    "option_b": "Face Value Rs 5, Price Rs 400",
    "option_c": "Face Value Rs 5, Price Rs 800",
    "option_d": "Face Value Rs 2, Price Rs 160",
    "correct_option": "B",
    "explanation": "In a stock split, existing shares are divided into a larger number of shares with a proportionally reduced Face Value. Here, Face Value halves from Rs 10 to Rs 5, and the theoretical stock price halves from Rs 800 to Rs 400."
  },
  {
    "question_id": 45,
    "topic_id": 9,
    "chapter_title": "Corporate Actions",
    "difficulty": "ADVANCED",
    "question_text": "Company Beta shares trade at Rs 300. The company announces a Rights Issue offering 1 new share for every 4 shares held at a subscription price of Rs 200. What is the Theoretical Ex-Rights Price (TERP)?",
    "option_a": "Rs 250",
    "option_b": "Rs 280",
    "option_c": "Rs 240",
    "option_d": "Rs 290",
    "correct_option": "B",
    "explanation": "Value of 4 existing shares = 4 * 300 = Rs 1,200. Rights proceeds for 1 new share = 1 * 200 = Rs 200. Total value of 5 shares post-rights = 1,200 + 200 = Rs 1,400. TERP = 1,400 / 5 = Rs 280.00."
  },
  {
    "question_id": 46,
    "topic_id": 9,
    "chapter_title": "Corporate Actions",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the primary financial impact of a share buyback executed at a premium to market price on a company's financial statements?",
    "option_a": "Increases total cash and increases shares outstanding",
    "option_b": "Decreases cash balance, reduces equity share count, and typically enhances future Earnings Per Share (EPS) and ROE",
    "option_c": "Converts all equity capital into secured debentures",
    "option_d": "Increases statutory corporate income tax liability",
    "correct_option": "B",
    "explanation": "Share buybacks use cash to retire outstanding shares. With a reduced denominator of outstanding shares, future net profit is divided across fewer shares, increasing EPS and improving Return on Equity (ROE)."
  },
  {
    "question_id": 47,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "INTERMEDIATE",
    "question_text": "Using the Capital Asset Pricing Model (CAPM), if the Risk-Free Rate (Rf) is 6.5%, Market Return (Rm) is 13.5%, and stock Beta is 1.20, what is the Cost of Equity (Ke)?",
    "option_a": "14.9%",
    "option_b": "16.2%",
    "option_c": "12.7%",
    "option_d": "15.5%",
    "correct_option": "A",
    "explanation": "CAPM formula: Ke = Rf + Beta * (Rm - Rf) = 6.5% + 1.20 * (13.5% - 6.5%) = 6.5% + 1.20 * 7.0% = 6.5% + 8.4% = 14.9%."
  },
  {
    "question_id": 48,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "Company Alpha has: Equity Market Cap = Rs 6,000 Cr, Total Debt = Rs 4,000 Cr, Cost of Equity (Ke) = 15.0%, Pre-tax Cost of Debt (Kd) = 9.0%, and Corporate Tax Rate = 25%. What is Alpha's Weighted Average Cost of Capital (WACC)?",
    "option_a": "12.0%",
    "option_b": "11.7%",
    "option_c": "10.5%",
    "option_d": "13.2%",
    "correct_option": "B",
    "explanation": "Total Capital V = 6,000 + 4,000 = Rs 10,000 Cr. Weight of Equity E/V = 60%, Weight of Debt D/V = 40%. After-tax Cost of Debt = 9.0% * (1 - 0.25) = 6.75%. WACC = (0.60 * 15.0%) + (0.40 * 6.75%) = 9.0% + 2.70% = 11.70%."
  },
  {
    "question_id": 49,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "Under the Gordon Constant Growth Dividend Discount Model, a stock paid a dividend of Rs 10 last year (D0), has a constant expected dividend growth rate (g) of 6%, and an investor required return (Ke) of 11%. What is its intrinsic value P0?",
    "option_a": "Rs 200",
    "option_b": "Rs 212",
    "option_c": "Rs 185",
    "option_d": "Rs 250",
    "correct_option": "B",
    "explanation": "D1 = D0 * (1 + g) = 10 * (1 + 0.06) = Rs 10.60. P0 = D1 / (Ke - g) = 10.60 / (0.11 - 0.06) = 10.60 / 0.05 = Rs 212.00."
  },
  {
    "question_id": 50,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "INTERMEDIATE",
    "question_text": "A stock trades at Rs 600 with an annual EPS of Rs 25. If its EPS is expected to grow at a sustainable rate of 20% per year, what is its Price/Earnings-to-Growth (PEG) ratio?",
    "option_a": "1.20",
    "option_b": "0.80",
    "option_c": "1.50",
    "option_d": "2.40",
    "correct_option": "A",
    "explanation": "P/E Ratio = 600 / 25 = 24.0x. PEG Ratio = P/E / Growth Rate = 24.0 / 20 = 1.20. (Peter Lynch benchmark suggests PEG near 1.0 represents fair value)."
  },
  {
    "question_id": 51,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "INTERMEDIATE",
    "question_text": "How is Enterprise Value (EV) calculated from Market Capitalization?",
    "option_a": "EV = Market Cap - Total Debt + Cash",
    "option_b": "EV = Market Cap + Total Debt + Minority Interest - Cash & Liquid Investments",
    "option_c": "EV = Market Cap + Total Inventory",
    "option_d": "EV = Total Assets - Total Equity",
    "correct_option": "B",
    "explanation": "Enterprise Value represents the theoretical takeover cost of the entire business: EV = Equity Market Capitalization + Total Debt + Preferred Stock + Minority Interest - Cash and Cash Equivalents."
  },
  {
    "question_id": 52,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "Why is the EV/EBITDA multiple preferred over the P/E ratio when comparing capital-intensive companies operating with vastly different debt leverage?",
    "option_a": "EV/EBITDA is immune to currency fluctuations",
    "option_b": "EV/EBITDA evaluates total enterprise value independent of capital structure (debt vs equity) and differences in depreciation accounting",
    "option_c": "EV/EBITDA applies only to debt-free technology startups",
    "option_d": "SEBI mandates the use of EV/EBITDA for all manufacturing companies",
    "correct_option": "B",
    "explanation": "EV reflects both debt and equity claimants, and EBITDA is calculated before interest expense and non-cash depreciation. This makes EV/EBITDA capital-structure neutral and depreciation-neutral across peer firms."
  },
  {
    "question_id": 53,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which valuation metric is standard and most appropriate for valuing commercial banks and non-banking financial companies (NBFCs)?",
    "option_a": "EV/EBITDA",
    "option_b": "Price-to-Book Value (P/B) and Return on Assets (ROA) / Return on Equity (ROE)",
    "option_c": "Enterprise Value to Sales (EV/Sales)",
    "option_d": "Free Cash Flow to Firm (FCFF)",
    "correct_option": "B",
    "explanation": "For banks, debt constitutes operating inventory (deposits borrowed to lend) rather than financial leverage. Furthermore, bank assets and liabilities are marked-to-market financial instruments, making Book Value (Net Worth) and ROE the gold-standard valuation anchors."
  },
  {
    "question_id": 54,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "In a DCF model, projected FCFF in Year 5 (terminal year) is Rs 500 Crore. If the terminal growth rate is 5% and WACC is 12%, what is the Terminal Value at the end of Year 5?",
    "option_a": "Rs 7,143 Cr",
    "option_b": "Rs 7,500 Cr",
    "option_c": "Rs 4,167 Cr",
    "option_d": "Rs 5,500 Cr",
    "correct_option": "B",
    "explanation": "Terminal Value = FCFF_5 * (1 + g) / (WACC - g) = 500 * (1 + 0.05) / (0.12 - 0.05) = 525 / 0.07 = Rs 7,500 Crore."
  },
  {
    "question_id": 55,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "BEGINNER",
    "question_text": "What does a high Price-to-Book (P/B) ratio of 8.0x typically reflect about a company?",
    "option_a": "High debt default risk and impending insolvency",
    "option_b": "High return on equity (ROE), strong intellectual property/branding moats, and substantial future growth opportunities not captured on historical balance sheet book value",
    "option_c": "The company has zero intangible assets",
    "option_d": "The stock is guaranteed to decline by 80%",
    "correct_option": "B",
    "explanation": "Companies generating exceptionally high ROE (like FMCG or IT leaders) trade at high P/B multiples because their intrinsic earning power relies on uncapitalized brand equity and human capital rather than heavy physical assets."
  },
  {
    "question_id": 56,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "What is the primary danger of using a Terminal Growth Rate (g) in a DCF model that exceeds the projected long-term nominal GDP growth rate of the country?",
    "option_a": "Excel displays a mathematical division error",
    "option_b": "It creates an economically impossible assumption that the single company will eventually become larger than the entire national economy",
    "option_c": "Income tax rates are automatically doubled by tax authorities",
    "option_d": "The model produces a negative cost of equity",
    "correct_option": "B",
    "explanation": "A company cannot grow faster than the overall economy indefinitely in perpetuity. Setting terminal growth above long-term GDP growth implies the company will mathematically swallow the entire economy, distorting valuation."
  },
  {
    "question_id": 57,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is Sum-of-the-Parts (SOTP) valuation, and when is it most appropriately applied?",
    "option_a": "Valuing each physical machine on the factory floor individually",
    "option_b": "Valuing diversified conglomerates or holding companies by valuing each distinct operating business unit separately using its relevant industry peer multiple and aggregating them",
    "option_c": "Adding dividend yield to stock trading volume",
    "option_d": "Summing the historic daily share price changes over 365 days",
    "correct_option": "B",
    "explanation": "SOTP is used for conglomerates (e.g., L&T, Tata Motors, Reliance) operating across disparate segments (e.g., retail, telecom, petrochemicals, infrastructure). Each segment is valued using its appropriate metric before subtracting net debt and applying holding company discounts."
  },
  {
    "question_id": 58,
    "topic_id": 10,
    "chapter_title": "Valuation Principles",
    "difficulty": "BEGINNER",
    "question_text": "A stock trades at Rs 450 and pays an annual dividend of Rs 18 per share. What is its Dividend Yield?",
    "option_a": "4.0%",
    "option_b": "2.5%",
    "option_c": "18.0%",
    "option_d": "8.0%",
    "correct_option": "A",
    "explanation": "Dividend Yield = (Annual Dividend per share / Current Market Price) * 100 = (18 / 450) * 100 = 4.0%."
  },
  {
    "question_id": 59,
    "topic_id": 11,
    "chapter_title": "Fundamental Analysis of Commodities",
    "difficulty": "INTERMEDIATE",
    "question_text": "In commodity futures pricing, what is the term for a market structure where futures contract prices trade HIGHER than immediate spot prices?",
    "option_a": "Backwardation",
    "option_b": "Contango",
    "option_c": "Short Squeeze",
    "option_d": "Inverse Parity",
    "correct_option": "B",
    "explanation": "Contango occurs when futures prices exceed spot prices. The premium reflects the cost of carry: financing interest, physical warehousing, and insurance required to store the physical commodity until delivery."
  },
  {
    "question_id": 60,
    "topic_id": 11,
    "chapter_title": "Fundamental Analysis of Commodities",
    "difficulty": "INTERMEDIATE",
    "question_text": "Under what physical market conditions does a commodity market flip into 'Backwardation' (Spot Price > Futures Price)?",
    "option_a": "Severe global oversupply and brimming storage facilities",
    "option_b": "Acute immediate physical supply shortage driving very high convenience yield for possessing physical inventory today",
    "option_c": "When interest rates drop to exactly zero",
    "option_d": "When all commodity exchanges are closed for holidays",
    "correct_option": "B",
    "explanation": "Backwardation occurs when immediate physical demand far outstrips spot supply. Buyers pay a premium for immediate physical delivery (high convenience yield), resulting in spot prices trading above distant futures."
  },
  {
    "question_id": 61,
    "topic_id": 11,
    "chapter_title": "Fundamental Analysis of Commodities",
    "difficulty": "BEGINNER",
    "question_text": "Which base metal is widely known in macroeconomic research as 'Doctor Copper'?",
    "option_a": "Because it is used exclusively in surgical medical equipment",
    "option_b": "Because its broad industrial applications make its price a reliable leading indicator of global economic manufacturing and construction health",
    "option_c": "Because it has a fixed statutory floor price set by the IMF",
    "option_d": "Because it never declines during economic recessions",
    "correct_option": "B",
    "explanation": "Copper has widespread applications across electrical grids, infrastructure, automotive, and electronics. Because demand tracks economic activity, its price movements reliably diagnose the health of the global economy."
  },
  {
    "question_id": 62,
    "topic_id": 11,
    "chapter_title": "Fundamental Analysis of Commodities",
    "difficulty": "ADVANCED",
    "question_text": "In oil refining economics, what does the 'Crack Spread' measure?",
    "option_a": "The geological depth of offshore crude drilling rigs",
    "option_b": "The pricing difference between raw crude oil input cost and the market value of refined petroleum products (petrol, diesel, jet fuel)",
    "option_c": "The shipping insurance cost through piracy zones",
    "option_d": "The pipeline friction loss during transport",
    "correct_option": "B",
    "explanation": "Crack spread represents the theoretical gross refining margin (GRM) earned by oil refineries by 'cracking' crude oil barrels into high-value refined products like gasoline (petrol) and diesel."
  },
  {
    "question_id": 63,
    "topic_id": 11,
    "chapter_title": "Fundamental Analysis of Commodities",
    "difficulty": "INTERMEDIATE",
    "question_text": "What relationship typically exists between the US Dollar Index (DXY) and global commodity prices denominated in USD?",
    "option_a": "Direct positive 1:1 correlation",
    "option_b": "Inverse relationship: A stronger US dollar makes commodities more expensive for non-dollar importing nations, dampening global demand and softening commodity prices",
    "option_c": "Zero correlation under all economic cycles",
    "option_d": "US Dollar movements affect only agricultural grains, not metals",
    "correct_option": "B",
    "explanation": "Most global commodities (Crude, Gold, Copper) are priced in USD. When the Dollar strengthens, commodities become more expensive in local currency terms for emerging market importers, reducing demand and weighing on USD prices."
  },
  {
    "question_id": 64,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "BEGINNER",
    "question_text": "An equity investment of Rs 1,00,000 grew to Rs 1,44,000 over exactly 2 years. What was its Compounded Annual Growth Rate (CAGR)?",
    "option_a": "22.0%",
    "option_b": "20.0%",
    "option_c": "44.0%",
    "option_d": "18.5%",
    "correct_option": "B",
    "explanation": "CAGR = (Ending Value / Beginning Value)^(1/n) - 1 = (1,44,000 / 1,00,000)^(1/2) - 1 = (1.44)^0.5 - 1 = 1.20 - 1 = 20.0% per annum."
  },
  {
    "question_id": 65,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "INTERMEDIATE",
    "question_text": "According to Modern Portfolio Theory, what type of investment risk can be virtually eliminated by constructing a well-diversified portfolio of 25-30 uncorrelated stocks?",
    "option_a": "Systematic Market Risk (Beta)",
    "option_b": "Unsystematic (Idiosyncratic / Company-Specific) Risk",
    "option_c": "Inflation and Interest Rate Risk",
    "option_d": "Sovereign Currency Risk",
    "correct_option": "B",
    "explanation": "Unsystematic risk is company- or sector-specific (e.g., labor strike, management departure, factory fire). Because these events occur independently across companies, holding 25-30 uncorrelated stocks diversifies away unsystematic risk."
  },
  {
    "question_id": 66,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "ADVANCED",
    "question_text": "Portfolio Blue generates an annual return of 18.0% with a Standard Deviation of 15.0%. If the Risk-Free Rate is 6.0%, what is the Sharpe Ratio of Portfolio Blue?",
    "option_a": "1.20",
    "option_b": "0.80",
    "option_c": "1.50",
    "option_d": "0.60",
    "correct_option": "B",
    "explanation": "Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation = (18.0% - 6.0%) / 15.0% = 12.0% / 15.0% = 0.80. It measures excess return per unit of total risk."
  },
  {
    "question_id": 67,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "ADVANCED",
    "question_text": "Portfolio Gold has a return of 17.0% and a Beta of 1.10. If Risk-Free Rate is 6.0% and Benchmark Market Return is 14.0%, what is Jensen's Alpha of Portfolio Gold?",
    "option_a": "+2.2%",
    "option_b": "+3.0%",
    "option_c": "+1.5%",
    "option_d": "-1.2%",
    "correct_option": "A",
    "explanation": "Expected Return under CAPM = Rf + Beta*(Rm - Rf) = 6.0% + 1.10*(14.0% - 6.0%) = 6.0% + 8.8% = 14.8%. Jensen's Alpha = Actual Return - Expected Return = 17.0% - 14.8% = +2.2% excess risk-adjusted return."
  },
  {
    "question_id": 68,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "INTERMEDIATE",
    "question_text": "What does a stock Beta of 1.45 imply about its volatility relative to the benchmark index?",
    "option_a": "The stock has 45% less risk than the market",
    "option_b": "On average, for every 1.0% change in the benchmark index, the stock price is expected to move by 1.45% in the same direction",
    "option_c": "The company's earnings will grow at 1.45 times GDP",
    "option_d": "The stock has zero unsystematic risk",
    "correct_option": "B",
    "explanation": "Beta measures systematic sensitivity to market benchmark moves. A Beta of 1.45 means the stock is 45% more volatile than the market: If Nifty rises by 10%, the stock is expected to rise by ~14.5%."
  },
  {
    "question_id": 69,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "ADVANCED",
    "question_text": "Which risk-adjusted performance measure uses Beta (Systematic Risk) as its risk denominator rather than Standard Deviation (Total Risk)?",
    "option_a": "Sharpe Ratio",
    "option_b": "Treynor Ratio",
    "option_c": "Sortino Ratio",
    "option_d": "Value at Risk (VaR)",
    "correct_option": "B",
    "explanation": "Treynor Ratio = (Rp - Rf) / Beta. It evaluates excess return per unit of systematic market risk, making it particularly suitable for assessing well-diversified portfolios where unsystematic risk has already been eliminated."
  },
  {
    "question_id": 70,
    "topic_id": 12,
    "chapter_title": "Fundamentals of Risk and Return",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the primary conceptual difference between the Sharpe Ratio and the Sortino Ratio?",
    "option_a": "Sortino ratio ignores interest rates",
    "option_b": "Sharpe ratio penalizes both upside and downside volatility equally, whereas Sortino ratio penalizes only downside volatility below a target return",
    "option_c": "Sortino ratio applies only to government bonds",
    "option_d": "Sharpe ratio is banned by SEBI",
    "correct_option": "B",
    "explanation": "Investors welcome upside volatility (large sudden gains). Standard deviation penalizes both upside and downside moves. The Sortino Ratio uses downside semi-deviation, focusing solely on harmful downside volatility."
  },
  {
    "question_id": 71,
    "topic_id": 13,
    "chapter_title": "Qualities of a Good Research Report",
    "difficulty": "INTERMEDIATE",
    "question_text": "In a professional equity research report, why must an analyst clearly distinguish between verifiable empirical facts and subjective analyst projections?",
    "option_a": "To satisfy formatting requirements of printing software",
    "option_b": "To ensure transparency so readers can separate historical audited financial data from forward-looking modeling assumptions and judgment",
    "option_c": "Subjective forecasts are completely illegal under Indian company law",
    "option_d": "To avoid paying copyright fees to the stock exchange",
    "correct_option": "B",
    "explanation": "SEBI Code of Conduct requires analysts to maintain intellectual honesty. Conflating management projections with audited historical numbers misleads investors regarding the objective certainty of the investment thesis."
  },
  {
    "question_id": 72,
    "topic_id": 13,
    "chapter_title": "Qualities of a Good Research Report",
    "difficulty": "BEGINNER",
    "question_text": "What is the typical time horizon assumed for stock price targets published in standard institutional initiation research reports?",
    "option_a": "1 to 3 days intraday",
    "option_b": "12 months (1 year forward)",
    "option_c": "15 to 20 years",
    "option_d": "Until the next full moon",
    "correct_option": "B",
    "explanation": "Institutional equity research reports standardly formulate 12-month forward price targets based on fundamental annual earnings projections and target multiple discounting."
  },
  {
    "question_id": 73,
    "topic_id": 13,
    "chapter_title": "Qualities of a Good Research Report",
    "difficulty": "INTERMEDIATE",
    "question_text": "Which of the following sections is MANDATORY in an institutional equity research report under SEBI Regulations?",
    "option_a": "A guarantee of zero financial loss",
    "option_b": "Explicit disclosure of analyst financial interest, shareholding, and potential conflicts of interest",
    "option_c": "Personal astrological forecasts of company directors",
    "option_d": "Discount coupons for corporate products",
    "correct_option": "B",
    "explanation": "SEBI (Research Analysts) Regulations, 2014 mandate comprehensive conflict-of-interest disclosures, including whether the analyst or their firm holds 1% or more equity, has received merchant banking fees, or serves as an officer."
  },
  {
    "question_id": 74,
    "topic_id": 13,
    "chapter_title": "Qualities of a Good Research Report",
    "difficulty": "ADVANCED",
    "question_text": "What is the purpose of conducting 'Sensitivity Analysis' within a research report valuation section?",
    "option_a": "Testing how emotional language affects investor sentiment",
    "option_b": "Demonstrating how target valuation and earnings change when core assumptions (such as WACC, terminal growth, or raw material prices) vary across a matrix",
    "option_c": "Determining maximum server capacity for PDF downloads",
    "option_d": "Calculating broker commissions across various trade sizes",
    "correct_option": "B",
    "explanation": "Sensitivity analysis provides a multi-variable scenario table showing target price sensitivity to changes in critical inputs (e.g., +/- 100 bps in WACC or +/- 50 bps in terminal growth), illustrating valuation margin of safety."
  },
  {
    "question_id": 75,
    "topic_id": 13,
    "chapter_title": "Qualities of a Good Research Report",
    "difficulty": "BEGINNER",
    "question_text": "What should an analyst do if an unexpected adverse regulatory ban materially invalidates their published 'BUY' thesis on a covered stock?",
    "option_a": "Ignore the event and hope the stock recovers",
    "option_b": "Publish an immediate flash note or rating downgrade revising financial estimates, target price, and recommendation",
    "option_c": "Quietly delete the previous report from the firm's website without notifying clients",
    "option_d": "File a lawsuit against the client for selling shares",
    "correct_option": "B",
    "explanation": "When material events alter the fundamentals of a covered company, an analyst must issue a prompt research update revising earnings estimates, target price, and recommendation to ensure clients are informed."
  },
  {
    "question_id": 76,
    "topic_id": 14,
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "Under SEBI (Research Analysts) Regulations, 2014, what are the personal trading restrictions imposed on an analyst regarding securities they actively cover?",
    "option_a": "Analysts can trade at any time without restriction",
    "option_b": "Analysts cannot trade in securities of the subject company within 30 days prior to and 5 days after publishing a research report",
    "option_c": "Analysts must trade only during post-market auction sessions",
    "option_d": "Analysts can trade only on overseas foreign exchanges",
    "correct_option": "B",
    "explanation": "Regulation 16 of SEBI (RA) Regulations prohibits research analysts and their associates from trading in securities that they recommend or cover within 30 days prior to publication and 5 days post-publication to prevent front-running."
  },
  {
    "question_id": 77,
    "topic_id": 14,
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the minimum net worth requirement prescribed by SEBI for a body corporate or LLP seeking registration as a Research Analyst?",
    "option_a": "Rs 1 Lakh",
    "option_b": "Rs 5 Lakhs",
    "option_c": "Rs 25 Lakhs",
    "option_d": "Rs 1 Crore",
    "correct_option": "C",
    "explanation": "Under Regulation 8 of SEBI (Research Analysts) Regulations, a body corporate or LLP must maintain a continuous net worth of at least Rs 25 Lakhs, whereas an individual or partnership firm requires Rs 1 Lakh."
  },
  {
    "question_id": 78,
    "topic_id": 14,
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "INTERMEDIATE",
    "question_text": "What threshold of shareholding in the subject company requires mandatory explicit disclosure by the Research Analyst or research entity under SEBI regulations?",
    "option_a": "Any holding of 5% or more",
    "option_b": "Holding of 1% or more of total equity shares at the end of the month preceding publication",
    "option_c": "Only holdings exceeding 10%",
    "option_d": "Shareholding disclosures are voluntary",
    "correct_option": "B",
    "explanation": "Under Regulation 19, the research analyst and research entity must explicitly disclose whether they, their associates, or relatives hold 1% or more securities of the subject company at the end of the month preceding publication."
  },
  {
    "question_id": 79,
    "topic_id": 14,
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "Under SEBI (Prohibition of Insider Trading) Regulations, 2015, what constitutes Unpublished Price Sensitive Information (UPSI)?",
    "option_a": "Public news articles published on national financial portals",
    "option_b": "Any non-public information relating to a company that, if made generally available, is likely to materially affect the market price of its securities",
    "option_c": "Historical audited annual balance sheets from five years ago",
    "option_d": "Standard statistical macroeconomic surveys released by MOSPI",
    "correct_option": "B",
    "explanation": "UPSI is any information relating to a company or its securities, directly or indirectly, that is not generally available, which upon becoming generally available, is likely to materially affect the price (e.g., financial results, dividends, mergers, demergers)."
  },
  {
    "question_id": 80,
    "topic_id": 14,
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "INTERMEDIATE",
    "question_text": "What is the structural organizational concept of 'Chinese Walls' in financial institutions?",
    "option_a": "A firewall software blocking overseas internet connections",
    "option_b": "Physical and operational information barriers separating research departments from investment banking and merchant banking desks to prevent confidential UPSI leaks",
    "option_c": "A bilateral trade agreement between SEBI and Chinese regulators",
    "option_d": "A physical wall built around the stock exchange trading floor",
    "correct_option": "B",
    "explanation": "Chinese Walls are operational, physical, and electronic barriers established within financial firms to segregate departments that possess confidential corporate advisory information (investment banking) from public sales and research analysts."
  },
  {
    "question_id": 81,
    "topic_id": 14,
    "case_study_id": 1,
    "case_study_title": "Case Study 1: The Collapse of Barings Bank & Nick Leeson",
    "case_study_text": "In 1995, Barings Bank\u2014the oldest merchant bank in the UK\u2014collapsed with losses exceeding GBP 827 million due to unauthorized derivatives trading conducted by Nick Leeson in its Singapore branch (Baring Futures Singapore). Leeson served concurrently as both the Head of Trading (Front Office) and the Head of Settlements/Operations (Back Office). Exploiting this total absence of segregation of duties, Leeson concealed massive unhedged speculative trading losses on Nikkei 225 index futures and Japanese government bond (JGB) options in a hidden error account ('Account 88888'). Following the Kobe earthquake in January 1995, Nikkei plummeted, wiping out the bank's entire equity capital.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What was the fundamental internal operational control failure at Barings Bank that enabled Nick Leeson to conceal massive losses for years?",
    "option_a": "Using electronic computerized trading terminals instead of paper tickets",
    "option_b": "Failure to segregate duties by allowing Leeson to control both Front Office trading execution and Back Office accounting settlement and error accounts",
    "option_c": "Paying trading commissions in Singapore dollars rather than British pounds",
    "option_d": "Operating on an exchange with T+1 settlement cycles",
    "correct_option": "B",
    "explanation": "The critical corporate control breakdown was the dual role Leeson occupied. By controlling both trade execution and back-office settlement reconciliation, he fabricated trade entries and hid loss-making positions in Account 88888 without independent verification."
  },
  {
    "question_id": 82,
    "topic_id": 14,
    "case_study_id": 1,
    "case_study_title": "Case Study 1: The Collapse of Barings Bank & Nick Leeson",
    "case_study_text": "In 1995, Barings Bank\u2014the oldest merchant bank in the UK\u2014collapsed with losses exceeding GBP 827 million due to unauthorized derivatives trading conducted by Nick Leeson in its Singapore branch (Baring Futures Singapore). Leeson served concurrently as both the Head of Trading (Front Office) and the Head of Settlements/Operations (Back Office). Exploiting this total absence of segregation of duties, Leeson concealed massive unhedged speculative trading losses on Nikkei 225 index futures and Japanese government bond (JGB) options in a hidden error account ('Account 88888'). Following the Kobe earthquake in January 1995, Nikkei plummeted, wiping out the bank's entire equity capital.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What options trading strategy did Leeson implement that exposed Barings Bank to catastrophic unlimited losses when market volatility exploded following the Kobe earthquake?",
    "option_a": "Long protective put options on Nikkei",
    "option_b": "Selling massive unhedged Short Straddles (selling both ATM calls and ATM puts simultaneously)",
    "option_c": "Buying Out-of-The-Money call options",
    "option_d": "Hedging cash equities with index futures",
    "correct_option": "B",
    "explanation": "Leeson aggressively sold short straddles to collect premium income, betting that the Nikkei 225 would remain range-bound. A short straddle has limited upside (the premium collected) and unlimited catastrophic downside risk if the underlying moves sharply in either direction."
  },
  {
    "question_id": 83,
    "topic_id": 14,
    "case_study_id": 1,
    "case_study_title": "Case Study 1: The Collapse of Barings Bank & Nick Leeson",
    "case_study_text": "In 1995, Barings Bank\u2014the oldest merchant bank in the UK\u2014collapsed with losses exceeding GBP 827 million due to unauthorized derivatives trading conducted by Nick Leeson in its Singapore branch (Baring Futures Singapore). Leeson served concurrently as both the Head of Trading (Front Office) and the Head of Settlements/Operations (Back Office). Exploiting this total absence of segregation of duties, Leeson concealed massive unhedged speculative trading losses on Nikkei 225 index futures and Japanese government bond (JGB) options in a hidden error account ('Account 88888'). Following the Kobe earthquake in January 1995, Nikkei plummeted, wiping out the bank's entire equity capital.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "Under modern SEBI derivatives regulations, which surveillance mechanism directly prevents a single proprietary trading desk from building rogue concentrated positions exceeding exchange safety thresholds?",
    "option_a": "Voluntary annual self-reporting",
    "option_b": "Mandatory real-time Client-level and Trading Member-level Position Limits, Margin Monitoring, and automated Peak Margin reporting",
    "option_c": "Allowing brokers to set their own margin requirements without exchange oversight",
    "option_d": "Eliminating clearing corporation margin calls",
    "correct_option": "B",
    "explanation": "Modern risk frameworks enforce rigid Trading Member and Client-level Position Limits (e.g., maximum % of market-wide position limits), SPAN margining, and real-time electronic trade feeds that trigger automatic square-offs before broker insolvency."
  },
  {
    "question_id": 84,
    "topic_id": 14,
    "case_study_id": 1,
    "case_study_title": "Case Study 1: The Collapse of Barings Bank & Nick Leeson",
    "case_study_text": "In 1995, Barings Bank\u2014the oldest merchant bank in the UK\u2014collapsed with losses exceeding GBP 827 million due to unauthorized derivatives trading conducted by Nick Leeson in its Singapore branch (Baring Futures Singapore). Leeson served concurrently as both the Head of Trading (Front Office) and the Head of Settlements/Operations (Back Office). Exploiting this total absence of segregation of duties, Leeson concealed massive unhedged speculative trading losses on Nikkei 225 index futures and Japanese government bond (JGB) options in a hidden error account ('Account 88888'). Following the Kobe earthquake in January 1995, Nikkei plummeted, wiping out the bank's entire equity capital.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What critical corporate governance lesson from the Barings collapse applies to institutional research and financial entities today?",
    "option_a": "Senior management and risk committees must enforce strict independent internal audits, risk limits, and never exempt high-producing traders from oversight",
    "option_b": "All international branch offices should be abolished",
    "option_c": "Derivatives trading should be banned globally",
    "option_d": "Error accounts should be handled directly by the chief executive officer",
    "correct_option": "A",
    "explanation": "Senior executives ignored warning signs because Leeson appeared to generate enormous profits. Independent risk oversight, strict separation of front and back office functions, and independent audit reconciliation are non-negotiable governance principles."
  },
  {
    "question_id": 85,
    "topic_id": 8,
    "case_study_id": 2,
    "case_study_title": "Case Study 2: The 2008 Subprime Mortgage Crisis & Structured Debt",
    "case_study_text": "The 2008 Global Financial Crisis was triggered by the collapse of the US housing bubble fueled by subprime mortgage lending. Lenders originated mortgages to borrowers with poor credit histories without verifying income or down payments (NINJA loans: No Income, No Job, No Assets). These high-risk mortgages were pooled by Wall Street investment banks into Collateralized Debt Obligations (CDOs). Credit rating agencies assigned AAA ratings to senior CDO tranches based on flawed statistical correlation models assuming nationwide house prices would never decline simultaneously. When mortgage defaults escalated, AAA-rated CDOs experienced near-total principal wipeouts, paralyzing the global interbank lending market.",
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What was the fundamental flaw in the credit rating agencies' statistical models when evaluating Collateralized Debt Obligations (CDOs)?",
    "option_a": "Assuming interest rates would rise to over 50%",
    "option_b": "Assuming historical regional home price non-correlation would hold, failing to model systemic nationwide housing declines and default contagion",
    "option_c": "Using simple arithmetic addition instead of calculus",
    "option_d": "Rating only municipal debt rather than corporate mortgages",
    "correct_option": "B",
    "explanation": "Rating agencies modeled home defaults as uncorrelated idiosyncratic regional events. When nationwide home prices declined simultaneously, defaults spiked across all loan pools simultaneously, shattering the diversification assumptions supporting AAA tranche ratings."
  },
  {
    "question_id": 86,
    "topic_id": 8,
    "case_study_id": 2,
    "case_study_title": "Case Study 2: The 2008 Subprime Mortgage Crisis & Structured Debt",
    "case_study_text": "The 2008 Global Financial Crisis was triggered by the collapse of the US housing bubble fueled by subprime mortgage lending. Lenders originated mortgages to borrowers with poor credit histories without verifying income or down payments (NINJA loans: No Income, No Job, No Assets). These high-risk mortgages were pooled by Wall Street investment banks into Collateralized Debt Obligations (CDOs). Credit rating agencies assigned AAA ratings to senior CDO tranches based on flawed statistical correlation models assuming nationwide house prices would never decline simultaneously. When mortgage defaults escalated, AAA-rated CDOs experienced near-total principal wipeouts, paralyzing the global interbank lending market.",
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "What conflict of interest compromised the objectivity of credit rating agencies during the pre-2008 securitization boom?",
    "option_a": "Rating agencies were state-owned government departments",
    "option_b": "The 'Issuer-Pays' model, where investment banks structuring the CDOs paid the rating agency fees, incentivizing rating agencies to provide generous AAA ratings to retain lucrative advisory business",
    "option_c": "Investors paid subscription fees to read credit ratings",
    "option_d": "Rating agencies were forbidden from employing credit analysts",
    "correct_option": "B",
    "explanation": "Under the Issuer-Pays model, rating agencies competed with each other for fee revenue from investment banks issuing CDOs ('Rating Shopping'). Issuers could take their structured deals to whichever agency granted the most lenient credit criteria."
  },
  {
    "question_id": 87,
    "topic_id": 8,
    "case_study_id": 2,
    "case_study_title": "Case Study 2: The 2008 Subprime Mortgage Crisis & Structured Debt",
    "case_study_text": "The 2008 Global Financial Crisis was triggered by the collapse of the US housing bubble fueled by subprime mortgage lending. Lenders originated mortgages to borrowers with poor credit histories without verifying income or down payments (NINJA loans: No Income, No Job, No Assets). These high-risk mortgages were pooled by Wall Street investment banks into Collateralized Debt Obligations (CDOs). Credit rating agencies assigned AAA ratings to senior CDO tranches based on flawed statistical correlation models assuming nationwide house prices would never decline simultaneously. When mortgage defaults escalated, AAA-rated CDOs experienced near-total principal wipeouts, paralyzing the global interbank lending market.",
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "How did Credit Default Swaps (CDS) amplify systemic risk during the financial crisis, notably at institutions like AIG?",
    "option_a": "CDS contracts were traded only with central banks",
    "option_b": "AIG wrote massive volumes of unhedged CDS insurance on CDO tranches without posting collateral, creating catastrophic insolvency when multi-notch rating downgrades triggered billions in cash collateral margin calls",
    "option_c": "CDS contracts paid zero interest to sovereign bondholders",
    "option_d": "CDS was strictly limited to agricultural commodities",
    "correct_option": "B",
    "explanation": "AIG Financial Products treated CDS as free premium income, believing AAA tranches would never default. When CDO ratings were downgraded, contractual collateral clauses required AIG to post tens of billions in cash margin immediately, causing insolvency."
  },
  {
    "question_id": 88,
    "topic_id": 8,
    "case_study_id": 2,
    "case_study_title": "Case Study 2: The 2008 Subprime Mortgage Crisis & Structured Debt",
    "case_study_text": "The 2008 Global Financial Crisis was triggered by the collapse of the US housing bubble fueled by subprime mortgage lending. Lenders originated mortgages to borrowers with poor credit histories without verifying income or down payments (NINJA loans: No Income, No Job, No Assets). These high-risk mortgages were pooled by Wall Street investment banks into Collateralized Debt Obligations (CDOs). Credit rating agencies assigned AAA ratings to senior CDO tranches based on flawed statistical correlation models assuming nationwide house prices would never decline simultaneously. When mortgage defaults escalated, AAA-rated CDOs experienced near-total principal wipeouts, paralyzing the global interbank lending market.",
    "chapter_title": "Company Analysis \u2014 Financial Analysis",
    "difficulty": "ADVANCED",
    "question_text": "For an equity research analyst evaluating financial institutions, what balance sheet metric was most dangerously stretched at firms like Lehman Brothers (reaching 31:1)?",
    "option_a": "Current Ratio",
    "option_b": "Financial Leverage Multiplier (Total Assets / Tangible Equity)",
    "option_c": "Dividend Payout Ratio",
    "option_d": "Return on Capital Employed",
    "correct_option": "B",
    "explanation": "Lehman Brothers operated with financial leverage exceeding 30:1. At 31:1 leverage, a mere 3.3% decline in asset portfolio value completely wipes out 100% of the firm's equity net worth, leading to immediate insolvency."
  },
  {
    "question_id": 89,
    "topic_id": 14,
    "case_study_id": 3,
    "case_study_title": "Case Study 3: Bernard L. Madoff Investment Securities & Custody Fraud",
    "case_study_text": "In December 2008, Bernard L. Madoff confessed that his multi-billion dollar wealth management advisory business was 'one big lie'\u2014the largest Ponzi scheme in financial history, causing nearly $65 billion in fabricated paper losses. Madoff claimed to execute a 'Split-Strike Conversion' strategy (buying S&P 100 blue-chip stocks while buying OTM put options and selling OTM call options). In reality, Madoff never purchased any securities for decades; client redemptions were simply funded by incoming cash from new investors. The scheme unravelled when the 2008 liquidity crisis prompted $7 billion in client withdrawal requests that Madoff could not fulfill.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What was the most glaring institutional due diligence red flag regarding the custody and execution of client assets at Madoff's firm?",
    "option_a": "The firm operated its website on public servers",
    "option_b": "Madoff served as his own investment manager, executing broker-dealer, and custodian simultaneously, with no independent third-party custodian verifying asset existence",
    "option_c": "The firm charged management fees in US dollars",
    "option_d": "Madoff refused to attend social galas",
    "correct_option": "B",
    "explanation": "In legitimate wealth management, institutional custody is separated from the investment manager (e.g., assets held at independent custodians like BNY Mellon or State Street). Madoff self-custodied client assets, allowing him to fabricate fake trade statements without external checks."
  },
  {
    "question_id": 90,
    "topic_id": 14,
    "case_study_id": 3,
    "case_study_title": "Case Study 3: Bernard L. Madoff Investment Securities & Custody Fraud",
    "case_study_text": "In December 2008, Bernard L. Madoff confessed that his multi-billion dollar wealth management advisory business was 'one big lie'\u2014the largest Ponzi scheme in financial history, causing nearly $65 billion in fabricated paper losses. Madoff claimed to execute a 'Split-Strike Conversion' strategy (buying S&P 100 blue-chip stocks while buying OTM put options and selling OTM call options). In reality, Madoff never purchased any securities for decades; client redemptions were simply funded by incoming cash from new investors. The scheme unravelled when the 2008 liquidity crisis prompted $7 billion in client withdrawal requests that Madoff could not fulfill.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What quantitative anomaly in Madoff's reported returns should have immediately signaled mathematical impossibility to professional financial analysts?",
    "option_a": "Reported returns were highly volatile with frequent 30% drawdowns",
    "option_b": "A virtually unbroken 45-degree straight line of consistent positive monthly returns (10-12% annually) with zero down months, regardless of whether the market crashed or rallied",
    "option_c": "The Sharpe ratio was exactly zero",
    "option_d": "Beta was greater than 5.0",
    "correct_option": "B",
    "explanation": "Financial markets inherently exhibit volatility. Madoff reported consistent 1% monthly gains across 15+ years during dot-com crashes and recessionary bear markets. An equity strategy cannot generate completely smooth positive returns without volatility."
  },
  {
    "question_id": 91,
    "topic_id": 14,
    "case_study_id": 3,
    "case_study_title": "Case Study 3: Bernard L. Madoff Investment Securities & Custody Fraud",
    "case_study_text": "In December 2008, Bernard L. Madoff confessed that his multi-billion dollar wealth management advisory business was 'one big lie'\u2014the largest Ponzi scheme in financial history, causing nearly $65 billion in fabricated paper losses. Madoff claimed to execute a 'Split-Strike Conversion' strategy (buying S&P 100 blue-chip stocks while buying OTM put options and selling OTM call options). In reality, Madoff never purchased any securities for decades; client redemptions were simply funded by incoming cash from new investors. The scheme unravelled when the 2008 liquidity crisis prompted $7 billion in client withdrawal requests that Madoff could not fulfill.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "What auditing red flag was ignored by institutional 'feeder funds' who channeled billions of dollars into Madoff's firm?",
    "option_a": "The statutory audit was conducted by a Big Four international accounting firm",
    "option_b": "A multi-billion dollar complex hedge fund was audited by 'Friehling & Horowitz'\u2014a tiny strip-mall accounting firm with only one active elderly accountant and no peer review",
    "option_c": "The auditor refused to accept cash payments",
    "option_d": "The audit report was published on the front page of the Wall Street Journal",
    "correct_option": "B",
    "explanation": "A multi-billion dollar asset manager requires sophisticated institutional auditing to verify complex derivative trades. Madoff employed a two-person strip-mall firm that rubber-stamped financial statements without performing independent trade confirmations."
  },
  {
    "question_id": 92,
    "topic_id": 14,
    "case_study_id": 3,
    "case_study_title": "Case Study 3: Bernard L. Madoff Investment Securities & Custody Fraud",
    "case_study_text": "In December 2008, Bernard L. Madoff confessed that his multi-billion dollar wealth management advisory business was 'one big lie'\u2014the largest Ponzi scheme in financial history, causing nearly $65 billion in fabricated paper losses. Madoff claimed to execute a 'Split-Strike Conversion' strategy (buying S&P 100 blue-chip stocks while buying OTM put options and selling OTM call options). In reality, Madoff never purchased any securities for decades; client redemptions were simply funded by incoming cash from new investors. The scheme unravelled when the 2008 liquidity crisis prompted $7 billion in client withdrawal requests that Madoff could not fulfill.",
    "chapter_title": "Legal and Regulatory Environment",
    "difficulty": "ADVANCED",
    "question_text": "How does SEBI regulatory framework protect Indian mutual fund and PMS investors against Madoff-style custody fraud?",
    "option_a": "Fund managers are required to keep client shares in physical paper certificates at their personal residence",
    "option_b": "Statutory segregation of duties: Fund managers execute trades, but all investor securities and funds must be held by an independent, SEBI-registered Custodian / Depository (NSDL/CDSL)",
    "option_c": "Investors are forbidden from redeeming capital during market corrections",
    "option_d": "Mutual funds are legally exempt from statutory audits",
    "correct_option": "B",
    "explanation": "SEBI Mutual Fund and PMS regulations legally mandate strict segregation between the Asset Management Company (AMC) and an independent SEBI-registered Custodian. The AMC cannot access investor funds directly; all custody and settlements flow through independent depository infrastructure."
  },
  {
    "question_id": 93,
    "topic_id": 10,
    "case_study_id": 4,
    "case_study_title": "Case Study 4: Michael Milken, Drexel Burnham & High-Yield Debt",
    "case_study_text": "During the 1980s, Michael Milken at investment bank Drexel Burnham Lambert pioneered the modern High-Yield ('Junk') Bond market. Prior to Milken, major institutions only purchased investment-grade bonds (BBB and above). Milken demonstrated that a diversified portfolio of non-investment grade bonds (BB and below) generated risk-adjusted returns far exceeding default losses. However, the immense liquidity generated by Milken's junk bond network was subsequently used to finance aggressive debt-fueled hostile corporate takeovers (Leveraged Buyouts / LBOs). The era ended when Milken and Drexel were indicted for securities fraud, market manipulation, and insider trading violations.",
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "What was the core financial premise of Michael Milken's original high-yield bond research?",
    "option_a": "Junk bonds carry zero risk of credit default",
    "option_b": "The wide yield spread (credit risk premium) offered by high-yield bonds over US Treasuries was more than sufficient to compensate for historical default loss rates in a diversified portfolio",
    "option_c": "Corporate debt should always be converted into common stock",
    "option_d": "High-yield bonds are backed by sovereign gold guarantees",
    "correct_option": "B",
    "explanation": "Milken proved empirically that while high-yield bonds experienced higher default rates than AAA bonds, the generous interest credit spread (often 300-600 bps above Treasuries) generated higher net risk-adjusted returns when held across a diversified portfolio."
  },
  {
    "question_id": 94,
    "topic_id": 10,
    "case_study_id": 4,
    "case_study_title": "Case Study 4: Michael Milken, Drexel Burnham & High-Yield Debt",
    "case_study_text": "During the 1980s, Michael Milken at investment bank Drexel Burnham Lambert pioneered the modern High-Yield ('Junk') Bond market. Prior to Milken, major institutions only purchased investment-grade bonds (BBB and above). Milken demonstrated that a diversified portfolio of non-investment grade bonds (BB and below) generated risk-adjusted returns far exceeding default losses. However, the immense liquidity generated by Milken's junk bond network was subsequently used to finance aggressive debt-fueled hostile corporate takeovers (Leveraged Buyouts / LBOs). The era ended when Milken and Drexel were indicted for securities fraud, market manipulation, and insider trading violations.",
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "In a Leveraged Buyout (LBO) financed by high-yield debt, which financial statement metric is critical for ensuring the acquired company can survive its post-acquisition debt service?",
    "option_a": "Gross Profit Margin alone",
    "option_b": "EBITDA-to-Interest Coverage Ratio and Free Cash Flow to Debt Servicing",
    "option_c": "Price to Earnings Ratio",
    "option_d": "Trailing 12-month Stock Price Momentum",
    "correct_option": "B",
    "explanation": "In an LBO, target company cash flows are used to pay down substantial acquisition debt. Analysts prioritize cash generation and EBITDA interest coverage to ensure operating earnings comfortably exceed mandatory debt amortizations."
  },
  {
    "question_id": 95,
    "topic_id": 10,
    "case_study_id": 4,
    "case_study_title": "Case Study 4: Michael Milken, Drexel Burnham & High-Yield Debt",
    "case_study_text": "During the 1980s, Michael Milken at investment bank Drexel Burnham Lambert pioneered the modern High-Yield ('Junk') Bond market. Prior to Milken, major institutions only purchased investment-grade bonds (BBB and above). Milken demonstrated that a diversified portfolio of non-investment grade bonds (BB and below) generated risk-adjusted returns far exceeding default losses. However, the immense liquidity generated by Milken's junk bond network was subsequently used to finance aggressive debt-fueled hostile corporate takeovers (Leveraged Buyouts / LBOs). The era ended when Milken and Drexel were indicted for securities fraud, market manipulation, and insider trading violations.",
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "What regulatory violation committed by Milken involves executing pre-arranged trades with an accomplice to hide true beneficial ownership or circumvent capital adequacy rules?",
    "option_a": "Front-running",
    "option_b": "Stock Parking",
    "option_c": "Wash Trading",
    "option_d": "Cornering the Market",
    "correct_option": "B",
    "explanation": "'Stock parking' is an illegal practice where an investor transfers shares to another party with a secret agreement to buy them back later, concealing true beneficial ownership to evade disclosure thresholds or regulatory net capital requirements."
  },
  {
    "question_id": 96,
    "topic_id": 10,
    "case_study_id": 4,
    "case_study_title": "Case Study 4: Michael Milken, Drexel Burnham & High-Yield Debt",
    "case_study_text": "During the 1980s, Michael Milken at investment bank Drexel Burnham Lambert pioneered the modern High-Yield ('Junk') Bond market. Prior to Milken, major institutions only purchased investment-grade bonds (BBB and above). Milken demonstrated that a diversified portfolio of non-investment grade bonds (BB and below) generated risk-adjusted returns far exceeding default losses. However, the immense liquidity generated by Milken's junk bond network was subsequently used to finance aggressive debt-fueled hostile corporate takeovers (Leveraged Buyouts / LBOs). The era ended when Milken and Drexel were indicted for securities fraud, market manipulation, and insider trading violations.",
    "chapter_title": "Valuation Principles",
    "difficulty": "ADVANCED",
    "question_text": "How does credit rating degradation from 'Investment Grade' (e.g., BBB-) to 'Junk' (e.g., BB+) affect a corporate bond's secondary market price?",
    "option_a": "Bond price increases because yield rises",
    "option_b": "Bond price collapses sharply because many pension funds and institutional mandates are legally forced to liquidate 'fallen angels' immediately",
    "option_c": "The bond's coupon payment is cancelled by the exchange",
    "option_d": "The bond is converted into common stock at face value",
    "correct_option": "B",
    "explanation": "Bonds downgraded from investment grade to junk are termed 'Fallen Angels'. Many institutional investors (insurance, pension funds) are legally barred from holding speculative debt and must dump these bonds, driving steep price drops and surging yields."
  },
  {
    "question_id": 97,
    "topic_id": 7,
    "case_study_id": 5,
    "case_study_title": "Case Study 5: Satyam Computer Services & Corporate Accounting Fraud",
    "case_study_text": "In January 2009, B. Ramalinga Raju, Chairman of Satyam Computer Services\u2014India's fourth largest IT exporter\u2014confessed to a massive accounting fraud of over Rs 7,000 Crore. For years, Satyam had inflated operating profits and fabricated over 7,500 fake customer invoices. The balance sheet reported Rs 5,040 Crore in non-existent cash and bank balances, along with Rs 376 Crore in fictitious accrued interest. The fraud was masked because statutory auditors failed to obtain independent, direct confirmation of bank account balances from the banks, relying instead on forged confirmation letters printed on bank letterheads supplied by Raju's inner circle.",
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "What fundamental audit procedure was negligently bypassed by statutory auditors that allowed Satyam's fictitious Rs 5,040 Crore cash balance to remain undetected for years?",
    "option_a": "Failing to attend the company annual general meeting",
    "option_b": "Failing to obtain independent, direct external bank confirmation from banks without management mediation",
    "option_c": "Refusing to verify office computer monitor brands",
    "option_d": "Failing to compute EBITDA margins",
    "correct_option": "B",
    "explanation": "Standard auditing standards require auditors to obtain direct external confirmations directly from financial institutions (bank balance confirmations) without management handling the documents. Satyam management supplied forged bank letters directly to compliant auditors."
  },
  {
    "question_id": 98,
    "topic_id": 7,
    "case_study_id": 5,
    "case_study_title": "Case Study 5: Satyam Computer Services & Corporate Accounting Fraud",
    "case_study_text": "In January 2009, B. Ramalinga Raju, Chairman of Satyam Computer Services\u2014India's fourth largest IT exporter\u2014confessed to a massive accounting fraud of over Rs 7,000 Crore. For years, Satyam had inflated operating profits and fabricated over 7,500 fake customer invoices. The balance sheet reported Rs 5,040 Crore in non-existent cash and bank balances, along with Rs 376 Crore in fictitious accrued interest. The fraud was masked because statutory auditors failed to obtain independent, direct confirmation of bank account balances from the banks, relying instead on forged confirmation letters printed on bank letterheads supplied by Raju's inner circle.",
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "What desperate corporate transaction attempted by Satyam's management in December 2008 triggered institutional shareholder revolt and led directly to the fraud confession?",
    "option_a": "A 1:1 bonus issue to retail shareholders",
    "option_b": "An attempt to spend $1.6 billion of fictitious cash to acquire Maytas Properties and Maytas Infra (entities promoted by Raju's sons) to replace non-existent cash with real estate assets",
    "option_c": "Filing for bankruptcy in the UK courts",
    "option_d": "A hostile takeover bid for Infosys",
    "correct_option": "B",
    "explanation": "Raju attempted to acquire Maytas (promoted by his family) for $1.6 billion. The objective was absorbing real physical assets (land/infrastructure) to plug the fictitious cash hole before auditors discovered the missing billions. Institutional shareholders rebelled, forcing the deal cancellation and confession."
  },
  {
    "question_id": 99,
    "topic_id": 7,
    "case_study_id": 5,
    "case_study_title": "Case Study 5: Satyam Computer Services & Corporate Accounting Fraud",
    "case_study_text": "In January 2009, B. Ramalinga Raju, Chairman of Satyam Computer Services\u2014India's fourth largest IT exporter\u2014confessed to a massive accounting fraud of over Rs 7,000 Crore. For years, Satyam had inflated operating profits and fabricated over 7,500 fake customer invoices. The balance sheet reported Rs 5,040 Crore in non-existent cash and bank balances, along with Rs 376 Crore in fictitious accrued interest. The fraud was masked because statutory auditors failed to obtain independent, direct confirmation of bank account balances from the banks, relying instead on forged confirmation letters printed on bank letterheads supplied by Raju's inner circle.",
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "What financial statement ratio anomaly in Satyam's P&L and Balance Sheet should have raised immediate suspicion for forensic research analysts?",
    "option_a": "EBITDA margin was negative for ten consecutive years",
    "option_b": "The company reported thousands of crores in liquid cash earning meager interest income while simultaneously borrowing high-cost debt and paying high interest rates",
    "option_c": "The dividend yield exceeded 50%",
    "option_d": "Inventory turnover was higher than retail supermarkets",
    "correct_option": "B",
    "explanation": "A classic forensic red flag: Satyam claimed to hold over Rs 5,000 Crore in idle cash deposits earning low yields, yet paid substantial interest on short-term bank borrowings. If a company truly holds massive surplus cash, borrowing expensive debt is irrational."
  },
  {
    "question_id": 100,
    "topic_id": 7,
    "case_study_id": 5,
    "case_study_title": "Case Study 5: Satyam Computer Services & Corporate Accounting Fraud",
    "case_study_text": "In January 2009, B. Ramalinga Raju, Chairman of Satyam Computer Services\u2014India's fourth largest IT exporter\u2014confessed to a massive accounting fraud of over Rs 7,000 Crore. For years, Satyam had inflated operating profits and fabricated over 7,500 fake customer invoices. The balance sheet reported Rs 5,040 Crore in non-existent cash and bank balances, along with Rs 376 Crore in fictitious accrued interest. The fraud was masked because statutory auditors failed to obtain independent, direct confirmation of bank account balances from the banks, relying instead on forged confirmation letters printed on bank letterheads supplied by Raju's inner circle.",
    "chapter_title": "Company Analysis \u2014 Business and Governance",
    "difficulty": "ADVANCED",
    "question_text": "Following the Satyam fraud, what key institutional reform was introduced into Indian corporate governance under the Companies Act, 2013 and SEBI regulations?",
    "option_a": "Complete elimination of independent directors",
    "option_b": "Mandatory rotation of statutory audit firms every 10 years, establishment of the National Financial Reporting Authority (NFRA), and stricter penal liability for auditor negligence",
    "option_c": "Allowing company chairmen to audit their own financial statements",
    "option_d": "Exempting IT companies from publishing balance sheets",
    "correct_option": "B",
    "explanation": "The Satyam debacle triggered landmark reforms: Mandatory statutory audit firm rotation (maximum two terms of 5 years), strict independent oversight via the National Financial Reporting Authority (NFRA), and criminal liability for negligent auditors."
  }
];

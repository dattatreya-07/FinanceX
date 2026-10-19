// ============================================================================
// NISM SERIES XV: RESEARCH ANALYST EXAMINATION FULL CURRICULUM & QUESTION BANK
// Extracted from official SEBI / NISM Workbook (February 2026 Edition)
// Total 15 Chapters | 100 Marks Weightage | Comprehensive Quizzes
// ============================================================================

export interface NISMChapterFormula {
  label: string;
  formula: string;
  explanation: string;
}

export interface NISMChapterQuestion {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface NISMChapter {
  chapterNumber: number;
  chapterTitle: string;
  weightageMarks: number;
  estimatedMinutes: number;
  icon: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  summary: string;
  detailedBody: string;
  keyTakeaways: string[];
  formulas: NISMChapterFormula[];
  caseStudy: {
    title: string;
    narrative: string;
    keyLesson: string;
  };
  reviewQuestions: NISMChapterQuestion[];
}

export const NISM_XV_CHAPTERS: NISMChapter[] = [
  {
    chapterNumber: 1,
    chapterTitle: "Introduction to Research Analyst Profession",
    weightageMarks: 1,
    estimatedMinutes: 25,
    icon: "Briefcase",
    difficulty: "BEGINNER",
    summary: "Role and primary responsibilities of a Research Analyst, core qualities, sell-side vs buy-side vs independent analysts, and ethical obligations.",
    detailedBody: `## Chapter 1: Introduction to Research Analyst Profession

### 1.1 Primary Role of a Research Analyst (RA)
A **Research Analyst (RA)** plays a foundational role in modern financial markets by gathering, verifying, and analyzing qualitative and quantitative data about economies, industries, and listed companies to assist institutional and retail clients in making informed, disciplined investment decisions.

The process of security research parallels consumer product evaluation:
1. **Research (Data Collection):** Sourcing authoritative information from audited annual reports, regulatory exchange filings (SEBI, NSE, BSE), industry databases, management discussions, and economic publications.
2. **Analysis (Data Processing & Synthesis):** Applying rigorous statistical, financial, and accounting models to evaluate competitive advantages, governance integrity, earnings sustainability, and intrinsic valuation.

### 1.2 Categories of Research Analysts
- **Sell-Side Analysts:** Work for registered stock brokers, investment banks, and institutional equities firms. They publish research reports and recommendations (e.g., BUY, HOLD, ACCUMULATE, SELL) distributed to institutional clients and the investing public to generate trading flow and institutional brokerage.
- **Buy-Side Analysts:** Work for institutional asset managers, including Mutual Funds, Alternative Investment Funds (AIFs), Pension Funds, and Insurance Companies. Their proprietary research directly guides their portfolio managers' capital deployment and is typically not published externally.
- **Independent Analysts:** Provide objective, conflict-free paid research directly to retail investors, wealth managers, or institutional clients via subscription fee models without investment banking or proprietary trading affiliations.

### 1.3 Key Qualities Required in a Research Analyst
- **Quantitative & Financial Acumen:** Deep mastery of financial statement mechanics (Balance Sheet, P&L, Cash Flows) and ratio analysis.
- **Industry & Economic Domain Knowledge:** Understanding industry value drivers, regulatory changes, and competitive moats.
- **Intellectual Integrity & Objectivity:** Unbiased, evidence-based opinions free from external corporate or investment banking pressure.
- **Clarity in Communication:** Ability to articulate complex investment theses through concise, structured research reports.`,
    keyTakeaways: [
      "Research Analysts help clients make informed investment decisions through disciplined data collection and analysis.",
      "Sell-side analysts publish research for brokerage clients; buy-side analysts support internal portfolio managers.",
      "Integrity, accounting expertise, and objectivity are the most critical professional virtues of an RA."
    ],
    formulas: [],
    caseStudy: {
      title: "Objective Research vs. Investment Banking Conflict",
      narrative: "During the Dot-Com bubble, Wall Street research analysts were pressured by their firms' investment banking departments to issue glowing 'Strong Buy' ratings on unprofitable internet companies to win lucrative underwriting fees, leading to catastrophic retail investor losses when the bubble burst.",
      keyLesson: "SEBI RA Regulations 2014 mandate strict Chinese Walls separating equity research from investment banking to guarantee analytical independence."
    },
    reviewQuestions: [
      {
        questionId: 101,
        questionText: "What is the primary role of a Research Analyst under SEBI guidelines?",
        optionA: "RAs are only involved in the collection of raw market data",
        optionB: "RAs are only involved in executing high-frequency algorithmic trades",
        optionC: "RAs help their clients take informed investment decisions through systematic research and analysis",
        optionD: "RAs manage client bank accounts and execute discretionary financial planning",
        correctOption: "C",
        explanation: "As stated in Chapter 1 of the NISM Workbook, the primary function of Research Analysts is to collect and process data to help clients take informed investment decisions.",
        difficulty: "EASY"
      },
      {
        questionId: 102,
        questionText: "Which category of analysts works for institutional asset managers such as Mutual Funds and Pension Funds to guide their internal portfolio managers?",
        optionA: "Sell-Side Analysts",
        optionB: "Buy-Side Analysts",
        optionC: "Media Financial Commentators",
        optionD: "Underwriting Syndicates",
        correctOption: "B",
        explanation: "Buy-side analysts work for institutional buy-side firms (mutual funds, hedge funds, insurers) and prepare research solely for internal fund management decisions.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 2,
    chapterTitle: "Introduction to Securities Market",
    weightageMarks: 2,
    estimatedMinutes: 30,
    icon: "Building2",
    difficulty: "BEGINNER",
    summary: "Definition of securities under SCRA 1956, structure of primary and secondary markets, market intermediaries, and T+1 rolling settlement.",
    detailedBody: `## Chapter 2: Introduction to Securities Market

### 2.1 Definition of Securities
Under **Section 2(h) of the Securities Contracts (Regulation) Act, 1956 (SCRA)**, 'securities' include:
- Shares, scrips, stocks, bonds, debentures, debenture stock, or other marketable securities of a like nature in or of any incorporated company or body corporate.
- Derivative instruments (futures, options, index contracts).
- Units or any other instrument issued by any collective investment scheme (mutual funds, REITs, InvITs).
- Government securities (G-Secs, Treasury Bills, State Development Loans).
- Rights or interests in securities.

### 2.2 Primary Market vs. Secondary Market
- **Primary Market (New Issue Market):** Facilitates direct capital formation where issuers (corporates or governments) issue new securities directly to investors to raise fresh equity or debt capital. Methods include:
  - **Initial Public Offering (IPO):** Unlisted company's first public offering.
  - **Follow-on Public Offering (FPO):** Already listed company issuing additional fresh shares.
  - **Rights Issue:** Offering additional shares to existing shareholders in proportion to their holding.
  - **Qualified Institutions Placement (QIP):** Private issuance to Qualified Institutional Buyers (QIBs) under Chapter VI of SEBI ICDR.
  - **Preferential Allotment:** Bulk allotment to identified strategic investors.
- **Secondary Market:** The platform (NSE, BSE, MSEI) where existing securities are traded among investors without changing the issuing company's paid-up capital. Provides **liquidity** and continuous **price discovery**.

### 2.3 Key Market Intermediaries
1. **Stock Exchanges:** Nationwide screen-based automated trading platforms providing anonymous electronic order matching (NEAT on NSE, BOLT on BSE).
2. **Clearing Corporations (CC):** (e.g., NSE Clearing Ltd, ICCL) Guarantee settlement of all trades, acting as the central counterparty (novations) to eliminate counterparty credit risk.
3. **Depositories (NSDL & CDSL):** Institutions that hold securities in electronic (dematerialized) book-entry form, facilitating paperless transfers.
4. **Depository Participants (DPs):** Agents of depositories (banks, brokers) acting as the bridge between retail investors and the depository.
5. **Stock Brokers & Trading Members:** Registered intermediaries who facilitate order routing and clearing for clients.

### 2.4 Settlement Cycle in India
India operates on the world-leading **T+1 Rolling Settlement** cycle across all listed equity cash transactions. Trades executed on Monday (T) settle completely on Tuesday (T+1), when funds and securities are exchanged between clearing members.`,
    keyTakeaways: [
      "Securities are defined under Section 2(h) of SCRA 1956 to include shares, bonds, derivatives, and government paper.",
      "The primary market raises fresh capital for issuers; the secondary market provides liquidity and price discovery among investors.",
      "Indian equity markets execute on T+1 rolling settlement, with clearing corporations acting as legal central counterparties."
    ],
    formulas: [],
    caseStudy: {
      title: "Transition to Paperless Demat Settlement (1996)",
      narrative: "Before 1996, Indian stock exchanges traded physical paper share certificates. Up to 20% of share deliveries suffered from bad deliveries, fake certificates, forged transfer signatures, or transit theft, paralyzing settlement.",
      keyLesson: "The Depositories Act 1996 created NSDL and CDSL, revolutionizing Indian capital markets through instantaneous electronic book-entry settlement."
    },
    reviewQuestions: [
      {
        questionId: 201,
        questionText: "As per the Securities Contracts and Regulations Act (SCRA), the term 'securities' includes which of the following?",
        optionA: "Government Securities",
        optionB: "Derivatives",
        optionC: "Shares, scrips, stocks, and bonds",
        optionD: "All of the given options",
        correctOption: "D",
        explanation: "Section 2(h) of the SCRA 1956 broadly defines securities to encompass shares, bonds, government securities, derivatives, and units of mutual funds.",
        difficulty: "EASY"
      },
      {
        questionId: 202,
        questionText: "Where the entire face value of a debenture is converted into equity shares upon maturity, it is classified as a:",
        optionA: "Fully Convertible Debenture (FCD)",
        optionB: "Partly Convertible Debenture (PCD)",
        optionC: "Non-Convertible Debenture (NCD)",
        optionD: "Zero-Coupon Bond",
        correctOption: "A",
        explanation: "A Fully Convertible Debenture (FCD) is an instrument whose entire principal value is converted into equity shares at a predetermined price and timeline.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 3,
    chapterTitle: "Terminology in Equity and Debt Markets",
    weightageMarks: 2,
    estimatedMinutes: 30,
    icon: "Coins",
    difficulty: "BEGINNER",
    summary: "Fundamental concepts of equity capital, face value, book value, enterprise value, debt instruments, coupon rates, and clean vs dirty bond pricing.",
    detailedBody: `## Chapter 3: Terminology in Equity and Debt Markets

### 3.1 Equity Terminology
- **Face Value (Par Value):** Nominal value of a share stated in the corporate charter (typically ₹10, ₹5, ₹2, or ₹1 in India). Accounting share capital = Face Value × Number of Outstanding Shares.
- **Book Value per Share (BVPS):** Net worth belonging to ordinary equity shareholders divided by the number of outstanding shares:
  $$\text{BVPS} = \frac{\text{Total Shareholders' Equity} - \text{Preference Capital}}{\text{Total Common Shares Outstanding}}$$
- **Market Capitalization:** Total market valuation of a listed company:
  $$\text{Market Cap} = \text{Current Market Price (CMP)} \times \text{Total Number of Shares}$$
  - **Large Cap:** Top 100 companies by market cap (SEBI classification).
  - **Mid Cap:** 101st to 250th companies.
  - **Small Cap:** 251st company onwards.
- **Enterprise Value (EV):** The theoretical takeover price of an entire business, neutral to capital structure:
  $$\text{EV} = \text{Market Capitalization} + \text{Total Debt} + \text{Minority Interest} + \text{Preferred Stock} - \text{Cash \& Cash Equivalents}$$

### 3.2 Debt Terminology
- **Par / Face Value:** Amount paid back to the bondholder at redemption (typically ₹1,000 or ₹100).
- **Coupon Rate:** Contractual annual interest rate paid by the issuer on the bond's face value.
- **Current Yield:** Annual coupon payment divided by the bond's current market price:
  $$\text{Current Yield} = \frac{\text{Annual Coupon}}{\text{Current Market Price}}$$
- **Yield to Maturity (YTM):** The internal rate of return (IRR) earned by an investor who holds the bond to its final maturity date, assuming all coupons are reinvested at the same yield.
- **Clean Price vs. Dirty Price:**
  $$\text{Dirty Price} = \text{Clean Price} + \text{Accrued Interest}$$
  - Clean price is the quoted market price excluding interest accumulated since the last coupon payment date.
  - Dirty price (cash price) is the actual gross amount paid by the buyer.
- **Bond Price & Interest Rate Inverse Relation:** When benchmark interest rates rise in the economy, existing bonds with lower fixed coupons become less attractive, and their prices fall below face value (discount).`,
    keyTakeaways: [
      "Enterprise Value measures the total operating firm value, adding net debt to equity market cap.",
      "Dirty Price includes accrued interest and is the actual settlement amount paid by a bond purchaser.",
      "Bond prices and prevailing interest rates share an inverse relationship."
    ],
    formulas: [
      {
        label: "Enterprise Value",
        formula: "EV = Market Cap + Total Debt - Cash & Cash Equivalents",
        explanation: "Reflects the total economic cost to acquire an operating enterprise free of debt."
      },
      {
        label: "Dirty Price of a Bond",
        formula: "Dirty Price = Clean Price + Accrued Interest",
        explanation: "Calculates the total settlement cash required to purchase a bond between coupon dates."
      }
    ],
    caseStudy: {
      title: "Clean vs. Dirty Price Dispute in Inter-Bank Repo",
      narrative: "During the 1990s debt boom, inexperienced treasury traders booked bond purchases based on quoted clean prices without accounting for 178 days of accrued interest, leading to unexpected multimillion-rupee cash shortages on settlement date.",
      keyLesson: "Institutional debt transactions always settle at the Dirty Price, adding accrued interest to the quoted clean price."
    },
    reviewQuestions: [
      {
        questionId: 301,
        questionText: "A bond is issued at a face value of ₹100 and a coupon of 10% p.a. Prevailing interest rates in the market have increased subsequently to 12%. This bond is likely to quote:",
        optionA: "At a price above face value (Premium)",
        optionB: "Exactly at the face value (Par)",
        optionC: "At a price announced by the issuer",
        optionD: "At a price below face value (Discount)",
        correctOption: "D",
        explanation: "Bond prices and interest rates move inversely. When market interest rates rise above the coupon rate (12% > 10%), the bond must trade at a discount (below ₹100) to offer a competitive yield.",
        difficulty: "EASY"
      },
      {
        questionId: 302,
        questionText: "Calculate Enterprise Value: Market Cap = ₹5,000 Cr, Total Debt = ₹1,200 Cr, Cash & Cash Equivalents = ₹300 Cr. What is the EV?",
        optionA: "₹5,900 Crore",
        optionB: "₹6,500 Crore",
        optionC: "₹4,100 Crore",
        optionD: "₹3,500 Crore",
        correctOption: "A",
        explanation: "EV = Market Cap + Debt - Cash = 5,000 + 1,200 - 300 = ₹5,900 Crore.",
        difficulty: "MEDIUM"
      }
    ]
  },
  {
    chapterNumber: 4,
    chapterTitle: "Fundamentals of Research",
    weightageMarks: 5,
    estimatedMinutes: 35,
    icon: "Compass",
    difficulty: "BEGINNER",
    summary: "Distinction between investing, speculating, and arbitrage; Fundamental vs Technical Analysis; Top-down vs Bottom-up frameworks; and psychological cognitive biases.",
    detailedBody: `## Chapter 4: Fundamentals of Research

### 4.1 Investing vs. Speculating vs. Arbitrage
- **Investing:** A disciplined, long-term allocation of capital based on thorough analysis of a business's fundamental earning power, cash flows, and intrinsic worth to achieve capital preservation and satisfactory real returns.
- **Speculating:** Taking high-risk, short-term positions, often using financial leverage, to profit from transient price fluctuations without regard to fundamental intrinsic business value.
- **Arbitrage:** Simultaneous purchase and sale of an identical or equivalent security in different markets (e.g., Cash vs Futures, or NSE vs BSE) to capture a risk-free pricing discrepancy.

### 4.2 Approaches to Securities Research
1. **Top-Down Approach (E-I-C):**
   - **Economy:** Analyze macroeconomic growth, monetary policy, inflation, interest rates, and fiscal health.
   - **Industry:** Identify sectors benefiting from structural macroeconomic trends (e.g., infrastructure during capex booms).
   - **Company:** Screen for leading firms within that industry boasting competitive moats, superior return on capital, and attractive valuations.
2. **Bottom-Up Approach:**
   - Starts with individual corporate analysis, searching for high-quality businesses or deep value opportunities regardless of broader economic or sector headwinds.

### 4.3 Behavioral Biases in Security Analysis
Human cognitive errors frequently distort analytical objectivity:
- **Anchoring Bias:** Over-relying on the first piece of information encountered (e.g., fixating on the 52-week high or purchase price).
- **Confirmation Bias:** Selectively seeking evidence that confirms pre-existing opinions while ignoring contradicting red flags.
- **Herd Mentality:** Following market sentiment and crowd consensus instead of independent financial verification.
- **Loss Aversion:** Experiencing pain from losses roughly twice as intensely as pleasure from equivalent gains, causing analysts to hold losing positions too long.
- **Overconfidence Bias:** Overestimating the precision of one's own forecasts and underestimating market uncertainty.`,
    keyTakeaways: [
      "Speculation is a short-term leveraged wager on price movement, whereas investing is a disciplined long-term search for intrinsic value.",
      "The Top-Down approach filters from Economy to Industry to Company (E-I-C).",
      "Cognitive biases like anchoring, confirmation bias, and loss aversion undermine rational research objectivity."
    ],
    formulas: [],
    caseStudy: {
      title: "Anchoring to Historical Peak Prices",
      narrative: "During the 2008 correction, investors aggressively bought shares of real estate and infrastructure firms because they had fallen 60% from their January 2008 peaks, anchoring to past prices without recognizing that massive balance sheet debt rendered them insolvent.",
      keyLesson: "Analysts must value businesses on forward cash flow potential, never on historical stock price peaks."
    },
    reviewQuestions: [
      {
        questionId: 401,
        questionText: "Speculation is a _________ call made with leveraged funds, unlike Investment which is a _________ disciplined activity for creating wealth.",
        optionA: "Short Term; Long Term",
        optionB: "Long Term; Medium Term",
        optionC: "Long Term; Short Term",
        optionD: "Medium Term; Long Term",
        correctOption: "A",
        explanation: "As stated in Chapter 4, speculation is a short-term wager using leverage, whereas investing is a long-term disciplined wealth creation process.",
        difficulty: "EASY"
      },
      {
        questionId: 402,
        questionText: "Which behavioral bias causes an analyst to selectively seek out data that supports an initial thesis while ignoring contrary financial evidence?",
        optionA: "Anchoring Bias",
        optionB: "Confirmation Bias",
        optionC: "Herd Mentality",
        optionD: "Hindsight Bias",
        correctOption: "B",
        explanation: "Confirmation bias is the psychological tendency to process information by searching for, or interpreting, information that is consistent with one's existing beliefs.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 5,
    chapterTitle: "Economic Analysis",
    weightageMarks: 5,
    estimatedMinutes: 40,
    icon: "TrendingUp",
    difficulty: "INTERMEDIATE",
    summary: "Macroeconomic variables, GDP measurement methods, monetary policy tools of the RBI, fiscal deficit, inflation (CPI/WPI), and leading vs lagging indicators.",
    detailedBody: `## Chapter 5: Economic Analysis

### 5.1 Macroeconomic Influences on Securities Markets
Economic performance establishes the macro foundation for corporate revenue growth and profit margins. Two primary institutions govern macroeconomic policy:
1. **The Government (Fiscal Policy):** Manages government spending, taxation, infrastructure investment, and national borrowing.
2. **The Central Bank (RBI - Monetary Policy):** Manages money supply, liquidity, and benchmark interest rates to ensure price stability while supporting sustainable economic growth.

### 5.2 National Income & Gross Domestic Product (GDP)
GDP measures the total monetary value of all finished goods and services produced within a country's borders during a specific period.
- **Expenditure Method:**
  $$\text{GDP} = C + I + G + (X - M)$$
  Where:
  - $C$: Private Final Consumption Expenditure
  - $I$: Gross Capital Formation / Private Investment
  - $G$: Government Consumption Expenditure
  - $(X - M)$: Net Exports (Exports minus Imports)
- **Real vs. Nominal GDP:**
  $$\text{Real GDP} = \frac{\text{Nominal GDP}}{\text{GDP Deflator}} \times 100$$
  Real GDP adjusts for inflation, isolating actual physical volume growth.

### 5.3 Inflation & Monetary Policy Instruments
- **Consumer Price Index (CPI):** Measures retail inflation experienced by consumers. The RBI's Monetary Policy Committee (MPC) is statutorily mandated to maintain retail CPI inflation within the target band of **4% with a tolerance band of ±2% (2% to 6%)**.
- **Wholesale Price Index (WPI):** Measures inflation at the factory gate / wholesale level.
- **Monetary Policy Tools:**
  - **Repo Rate:** Rate at which RBI lends short-term funds to banks against G-Sec collateral.
  - **Reverse Repo / SDF (Standing Deposit Facility):** Rate at which RBI absorbs surplus liquidity from banks without collateral.
  - **Cash Reserve Ratio (CRR):** Percentage of net demand and time liabilities (NDTL) banks must hold as cash reserves with the RBI.
  - **Statutory Liquidity Ratio (SLR):** Percentage of deposits banks must invest in approved securities (primarily G-Secs).

### 5.4 Economic Indicators
- **Leading Indicators:** Shift before the overall economy changes (e.g., Stock market indices, Manufacturing PMI, New building permits, Money supply M3).
- **Lagging Indicators:** Shift only after the economic cycle has already turned (e.g., Unemployment rate, Corporate loan default rates, Bank non-performing assets).
- **Coincident Indicators:** Move simultaneously with aggregate economic activity (e.g., Gross Value Added - GVA, Index of Industrial Production - IIP, Retail sales).`,
    keyTakeaways: [
      "The two major influencers of economic policies are the Government (fiscal) and the Central Bank (monetary).",
      "GDP through the expenditure method equals C + I + G + (X - M).",
      "RBI MPC targets retail CPI inflation at 4% with a ±2% tolerance band using Repo Rate as its key operating rate."
    ],
    formulas: [
      {
        label: "GDP Expenditure Equation",
        formula: "GDP = C + I + G + (X - M)",
        explanation: "Consumption + Private Investment + Government Outlays + Net Exports."
      },
      {
        label: "Real Interest Rate",
        formula: "Real Rate = Nominal Interest Rate - Expected Inflation",
        explanation: "Determines the true purchasing-power growth of debt capital."
      }
    ],
    caseStudy: {
      title: "RBI's Monetary Response to Global Inflation (2022-2023)",
      narrative: "When post-COVID supply shocks and the Ukraine conflict drove Indian CPI inflation above 7.5% in early 2022, the RBI aggressively hiked the Repo Rate from 4.00% to 6.50% over multiple MPC meetings, containing inflationary expectations and defending the Rupee against steep depreciation.",
      keyLesson: "Rising policy interest rates increase corporate cost of capital (WACC) and trigger equity valuation multiple contractions."
    },
    reviewQuestions: [
      {
        questionId: 501,
        questionText: "Two major influencers of the economic policies in an economy are ________ & ________.",
        optionA: "Government; Central Bank (RBI)",
        optionB: "Stock Exchanges; Government",
        optionC: "Central Bank; Stock Exchanges",
        optionD: "State Bank of India; National Stock Exchange",
        correctOption: "A",
        explanation: "As highlighted on Page 104 of the NISM Workbook, the Government (through fiscal policy) and the Central Bank (through monetary policy) are the two major policy influencers.",
        difficulty: "EASY"
      },
      {
        questionId: 502,
        questionText: "National income of an economy can be measured through which of the following standard methods?",
        optionA: "Product / Value Added Method",
        optionB: "Income Method",
        optionC: "Expenditure Method",
        optionD: "All of the given methods",
        correctOption: "D",
        explanation: "Macroeconomics calculates National Income using three conceptually equivalent methods: Product/Output, Factor Income, and Aggregate Expenditure.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 6,
    chapterTitle: "Industry Analysis",
    weightageMarks: 8,
    estimatedMinutes: 45,
    icon: "Factory",
    difficulty: "INTERMEDIATE",
    summary: "Michael Porter's 5 Forces Framework, Industry Life Cycle Stages, Cyclical vs Defensive sectors, and industry market share estimation.",
    detailedBody: `## Chapter 6: Industry Analysis

### 6.1 Importance of Industry Analysis in Fundamental Research
Industry analysis bridges macroeconomics and individual company evaluation. Even an exceptionally run company will struggle to generate shareholder value if its broader industry faces severe pricing erosion, regulatory bans, or technology obsolescence.

### 6.2 Michael Porter's 5 Forces Model of Industry Structure
Harvard Professor Michael Porter identified five competitive forces that dictate the long-term profitability and return on invested capital (ROIC) of an industry:
1. **Threat of New Entrants:** High barriers to entry (high capex, patents, regulatory licenses, network effects, brand equity) shield existing players from profit erosion.
2. **Bargaining Power of Buyers:** Buyers have high power when they are few in number, purchase in large volumes, or face negligible switching costs, driving prices down.
3. **Bargaining Power of Suppliers:** Suppliers possess pricing leverage when raw materials are rare, concentrated in few hands, or have no viable substitutes.
4. **Threat of Substitute Products or Services:** Availability of alternative products with superior price-performance ratios caps industry margins (e.g., OTT streaming substituting movie theaters).
5. **Intensity of Competitive Rivalry:** Saturated markets with high fixed costs and slow growth trigger brutal price wars (e.g., Indian telecom sector 2016-2019).

### 6.3 Industry Life Cycle
Industries progress through four distinct phases:
1. **Pioneering / Introduction:** High technological uncertainty, high R&D outlays, limited customer adoption, negative cash flows.
2. **Growth Stage:** Rapidly accelerating demand, expanding margins, significant capital investment, rising profitability (e.g., Electric Vehicles, Renewable Energy).
3. **Maturity Stage:** Growth slows to aggregate GDP growth rate, industry consolidation, fierce market share battles, high dividend yields and free cash flow generation (e.g., FMCG, Commercial Banking).
4. **Decline Stage:** Shrinking demand due to technological obsolescence or shifting consumer habits, margin collapse, exits and bankruptcies.

### 6.4 Cyclical vs. Defensive Sectors
- **Cyclical Sectors:** Revenues and earnings fluctuate sharply with economic cycles (e.g., Automobiles, Real Estate, Steel, Capital Goods, Luxury Goods).
- **Defensive (Non-Cyclical) Sectors:** Demand remains stable across all economic conditions (e.g., Pharmaceuticals, FMCG staples, Utilities).`,
    keyTakeaways: [
      "Porter's 5 Forces determine the sustainable long-term profit pool and ROIC of an industry.",
      "Industries progress through Pioneering, Growth, Maturity, and Decline stages.",
      "Cyclical sectors require bottom-of-the-cycle valuation metrics, whereas defensive sectors deliver stable non-cyclical cash flows."
    ],
    formulas: [],
    caseStudy: {
      title: "Telecom Price War & Industry Consolidation (2016-2020)",
      narrative: "The entry of Reliance Jio with free 4G voice and hyper-low data tariffs triggered intense competitive rivalry in Indian telecom. Industry ARPU plunged from ₹150 to ₹80, bankrupting 8 smaller operators (Aircel, Tata Teleservices, Reliance Communications) and turning a 12-player market into a consolidated private duopoly (Jio & Airtel).",
      keyLesson: "Hyper-competitive rivalry destroys industry ROIC until capacity rationalization and market consolidation occur."
    },
    reviewQuestions: [
      {
        questionId: 601,
        questionText: "The tyre industry in a country comprised three organized players and several unorganized players. A survey revealed that 20% of sales came from the unorganized sector. The three major companies reported revenues of ₹6,000 Cr, ₹8,000 Cr, and ₹10,000 Cr. What is the total industry size?",
        optionA: "₹24,000 Crore",
        optionB: "₹30,000 Crore",
        optionC: "₹28,800 Crore",
        optionD: "₹32,000 Crore",
        correctOption: "B",
        explanation: "Organized revenue = 6,000 + 8,000 + 10,000 = ₹24,000 Cr. Since organized represents 80% (100% - 20%), Total Industry Size = 24,000 / 0.80 = ₹30,000 Crore.",
        difficulty: "HARD"
      },
      {
        questionId: 602,
        questionText: "Which of Porter's 5 Forces is characterized by high capital requirements, intellectual property patents, and steep regulatory licensing hurdles?",
        optionA: "Bargaining Power of Buyers",
        optionB: "Threat of Substitute Products",
        optionC: "Barriers to Entry (Threat of New Entrants)",
        optionD: "Bargaining Power of Suppliers",
        correctOption: "C",
        explanation: "Patents, massive capital expenditure requirements, and regulatory licenses serve as protective barriers to entry against new competitors.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 7,
    chapterTitle: "Company Analysis – Business and Governance",
    weightageMarks: 6,
    estimatedMinutes: 40,
    icon: "ShieldCheck",
    difficulty: "INTERMEDIATE",
    summary: "Qualitative business model evaluation, competitive advantages (economic moats), SWOT analysis, management integrity, and corporate governance scrutiny.",
    detailedBody: `## Chapter 7: Company Analysis – Business and Governance

### 7.1 Qualitative vs. Quantitative Business Analysis
Security analysis requires evaluating both the numbers (financial statements) and the human/structural context behind those numbers:
- **Qualitative Analysis:** Evaluating business model sustainability, competitive advantage (moats), customer brand loyalty, pricing power, and corporate governance integrity.
- **Quantitative Analysis:** Audited financial ratios, historical revenue growth, operating profit margins, debt leverage ratios, and capital turnover metrics.

### 7.2 Competitive Advantages (Economic Moats)
Billionaire investor Warren Buffett popularized the concept of an **economic moat**—a structural business advantage that protects long-term return on invested capital from competitor erosion:
- **Brand Power & Intangibles:** Consumer brand loyalty allowing price increases without losing sales volume (e.g., Titan, Asian Paints).
- **Network Effects:** Value of the product or service multiplies as more users join (e.g., BSE/NSE exchanges, payment networks).
- **Cost Advantage:** Scale efficiencies, proprietary technology, or access to cheaper raw materials (e.g., D-Mart's everyday low-cost retail operations).
- **High Switching Costs:** Customer lock-in where transitioning to a competitor entails severe operational friction or monetary expense (e.g., enterprise ERP software).

### 7.3 Corporate Governance Scrutiny
Corporate governance represents the institutional system of checks and balances governing corporate directors and executives:
1. **Board Composition:** Balanced proportion of Executive, Non-Executive, and independent Directors. Under SEBI LODR, at least one-third (or half) of the board must comprise Independent Directors.
2. **Audit Committee:** Must comprise independent directors with financial literacy to oversee statutory audit appointments and internal risk controls.
3. **Related Party Transactions (RPTs):** High volume of transactions between listed company and promoter-owned private entities is a major red flag for profit siphoning.
4. **Promoter Share Pledging:** High percentage of promoter equity pledged with NBFCs or banks to secure personal loans creates severe downside liquidation risk if stock prices fall.
5. **Auditor Quality & Tenures:** Resignation of statutory auditors before completing their term signals accounting irregularities.`,
    keyTakeaways: [
      "SWOT analysis evaluates internal Strengths & Weaknesses alongside external Opportunities & Threats.",
      "Economic moats (pricing power, switching costs, network effects) protect ROIC from competitor erosion.",
      "Corporate governance red flags include promoter share pledging, excessive related party transactions, and sudden auditor resignations."
    ],
    formulas: [],
    caseStudy: {
      title: "Satyam Computer Services Governance Fraud (2009)",
      narrative: "In January 2009, Satyam Chairman B. Ramalinga Raju confessed to fabricating over ₹5,000 Crore of non-existent cash and bank balances, inflated accrued interest, and ghost employees on the company's books. The independent board and statutory auditor (PwC) had failed to independently verify bank balance confirmation certificates.",
      keyLesson: "Research analysts must independently cross-verify bank balances and auditor qualifications rather than taking management presentations at face value."
    },
    reviewQuestions: [
      {
        questionId: 701,
        questionText: "For conducting a SWOT analysis of a company, which of the following is the standard first approach?",
        optionA: "Identifying internal Strengths and Weaknesses",
        optionB: "Identifying external Strengths and Opportunities",
        optionC: "Identifying Weaknesses and Threats",
        optionD: "Identifying Macroeconomic Inflation Trends",
        correctOption: "A",
        explanation: "SWOT analysis begins internally by assessing the internal Strengths and Weaknesses of the business before mapping external Opportunities and Threats.",
        difficulty: "EASY"
      },
      {
        questionId: 702,
        questionText: "Corporate Governance primarily evaluates which crucial qualitative dimension of a corporate management?",
        optionA: "Ethical Integrity and Fiduciary Responsibility",
        optionB: "Short-term Operating Margin Maximization",
        optionC: "Marketing and Advertising Efficiency",
        optionD: "Stock Price Volatility Hedging",
        correctOption: "A",
        explanation: "Corporate governance evaluates management integrity, shareholder alignment, transparent reporting, and fiduciary responsibility.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 8,
    chapterTitle: "Company Analysis – Financial Analysis",
    weightageMarks: 12,
    estimatedMinutes: 50,
    icon: "FileSpreadsheet",
    difficulty: "ADVANCED",
    summary: "The Three Financial Statements, Quality of Earnings, Cash Flow verification, Solvency & Profitability Ratios, and DuPont 3-Step ROE Decomposition.",
    detailedBody: `## Chapter 8: Company Analysis – Financial Analysis

### 8.1 The Three Core Financial Statements
1. **Balance Sheet:** Point-in-time snapshot of economic resources and obligations:
   $$\text{Assets} = \text{Liabilities} + \text{Shareholders' Equity}$$
   - Non-current Assets (PP&E, Intangibles) vs. Current Assets (Cash, Receivables, Inventories).
   - Equity Share Capital + Reserves & Surplus vs. Non-current Debt and Current Liabilities.
2. **Profit and Loss Account (P&L):** Performance summary over a financial reporting period:
   - Revenue from Operations minus Operating Expenses = **EBITDA**
   - EBITDA minus Depreciation & Amortization = **EBIT** (Operating Profit)
   - EBIT minus Finance Costs = **PBT** (Profit Before Tax)
   - PBT minus Tax Expense = **PAT** (Profit After Tax / Net Income)
3. **Cash Flow Statement (CFS):** Accrual net income reconciled to actual bank cash generation:
   - **Cash Flow from Operating Activities (CFO):** Core operational cash flow generation after working capital changes.
   - **Cash Flow from Investing Activities (CFI):** Capital expenditures (CapEx), acquisitions, and investments.
   - **Cash Flow from Financing Activities (CFF):** Debt borrowings/repayments, equity issuance, and dividend disbursements.

### 8.2 Comprehensive Financial Ratio Analysis
1. **Liquidity Ratios:**
   $$\text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}} \quad (\text{Ideal } \ge 1.33)$$
   $$\text{Quick Ratio} = \frac{\text{Current Assets} - \text{Inventories}}{\text{Current Liabilities}}$$
2. **Solvency & Leverage Ratios:**
   $$\text{Debt-to-Equity (D/E)} = \frac{\text{Total Debt}}{\text{Total Shareholders' Equity}}$$
   $$\text{Interest Coverage Ratio (ICR)} = \frac{\text{EBIT}}{\text{Interest Expense}} \quad (\text{Higher is safer})$$
3. **Profitability & Capital Efficiency Ratios:**
   $$\text{Return on Capital Employed (ROCE)} = \frac{\text{EBIT}}{\text{Total Capital Employed}} = \frac{\text{EBIT}}{\text{Total Debt} + \text{Total Equity} - \text{Cash}}$$
   $$\text{Return on Equity (ROE)} = \frac{\text{Net Income (PAT)}}{\text{Average Shareholders' Equity}}$$

### 8.3 DuPont 3-Step ROE Decomposition
DuPont analysis breaks down ROE into three operating and financial drivers:
$$\text{ROE} = \\underbrace{\frac{\text{PAT}}{\text{Revenue}}}_{\text{Net Profit Margin}} \times \\underbrace{\frac{\text{Revenue}}{\text{Total Assets}}}_{\text{Asset Turnover}} \times \\underbrace{\frac{\text{Total Assets}}{\text{Shareholders' Equity}}}_{\text{Financial Leverage}}$$
This reveals whether high ROE stems from pricing power (margin), asset efficiency (turnover), or dangerous balance sheet debt (leverage).`,
    keyTakeaways: [
      "Financial statement analysis requires triangulating the Balance Sheet, P&L, and Cash Flow Statement.",
      "Operating Cash Flow (CFO) must consistently track or exceed Net Income (PAT) to verify quality of earnings.",
      "DuPont analysis decomposes ROE into Net Margin × Asset Turnover × Financial Leverage."
    ],
    formulas: [
      {
        label: "DuPont 3-Step ROE",
        formula: "ROE = Net Profit Margin × Asset Turnover × Financial Leverage",
        explanation: "Deconstructs equity returns into operational profitability, asset efficiency, and debt leverage."
      },
      {
        label: "Interest Coverage Ratio",
        formula: "ICR = EBIT / Interest Expense",
        explanation: "Measures how many times operating earnings cover annual corporate debt interest."
      }
    ],
    caseStudy: {
      title: "Quality of Earnings: PAT vs. Operating Cash Flow Divergence",
      narrative: "An infrastructure developer reported soaring Net Profits (PAT) of ₹400 Crore for three consecutive years while Operating Cash Flow (CFO) was negative (-₹250 Crore) due to massive unbilled revenue and ballooning trade receivables.",
      keyLesson: "When earnings growth is not supported by real cash flow generation, a liquidity crisis or massive asset write-down is inevitable."
    },
    reviewQuestions: [
      {
        questionId: 801,
        questionText: "Which of the following items is found on an Income Statement (Profit & Loss Account)?",
        optionA: "Changes in Trade Accounts Receivable",
        optionB: "Changes in Long-term Borrowings",
        optionC: "Cost of Materials Consumed and Employee Benefit Expenses",
        optionD: "Cash paid for Capital Expenditure",
        correctOption: "C",
        explanation: "Operating expenses like raw material consumption and employee costs appear on the Income Statement; receivables changes and capex appear in the Cash Flow Statement.",
        difficulty: "EASY"
      },
      {
        questionId: 802,
        questionText: "Which section in the Cash Flow Statement provides information regarding funds borrowed or repaid by a company during the fiscal year?",
        optionA: "Cash Flow from Operating Activities",
        optionB: "Cash Flow from Investing Activities",
        optionC: "Cash Flow from Financing Activities",
        optionD: "Accrued Working Capital Reconciliation",
        correctOption: "C",
        explanation: "Financing activities (CFF) captures transactions involving debt borrowings, bond issuances, debt repayments, equity infusions, and dividend payments.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 9,
    chapterTitle: "Corporate Actions",
    weightageMarks: 5,
    estimatedMinutes: 35,
    icon: "Layers",
    difficulty: "INTERMEDIATE",
    summary: "Mechanics and price adjustments for Dividends, Stock Splits, Bonus Issues, Rights Issues, Share Buybacks, and Mergers & Demergers.",
    detailedBody: `## Chapter 9: Corporate Actions

### 9.1 Types and Purpose of Corporate Actions
A **corporate action** is an event initiated by a public company that impacts its shareholders, capital structure, or financial profile.
- **Mandatory Corporate Actions:** Implemented automatically by the company across all eligible shareholdings (e.g., Stock Splits, Mergers, Cash Dividends).
- **Voluntary Corporate Actions:** Shareholders choose whether to participate (e.g., Rights Issues, Tender Offer Share Buybacks).

### 9.2 Key Dates in Corporate Actions
1. **Declaration Date:** The date the Board of Directors approves and publicly announces the corporate action.
2. **Record Date:** The cutoff date established by the company to determine which shareholders listed in the depository register (NSDL/CDSL) are entitled to the benefit.
3. **Ex-Date (Ex-Dividend / Ex-Bonus / Ex-Split):** The trading date on or after which the stock trades without entitlement to the corporate action. Under India's **T+1 settlement**, the Ex-Date is **the exact same business day as the Record Date**.

### 9.3 Major Corporate Action Mechanisms
- **Cash Dividend:** Distribution of audited net profits directly into shareholders' bank accounts. Does not change shares outstanding or face value.
- **Stock Split:** Dividing existing shares into multiple shares to lower the per-share trading price and improve retail market liquidity:
  - Example: A 5-for-1 stock split on a share with ₹10 Face Value reduces Face Value to ₹2 and quintuples outstanding shares. Total net worth remains unchanged.
- **Bonus Issue:** Issuing free additional shares to existing shareholders by capitalizing accumulated free reserves:
  - Paid-up capital increases; reserves decrease by an equivalent amount. Face value remains unchanged.
- **Rights Issue:** Permitting existing shareholders to purchase new shares at a discounted subscription price in proportion to their holding before offering them to the public.
- **Share Buyback:** Company repurchases its own shares from the open market or tender offer, extinguishing the shares, reducing equity capital, and boosting future Earnings Per Share (EPS).`,
    keyTakeaways: [
      "Under Indian T+1 rolling settlement, the Ex-Date is identical to the Record Date.",
      "Stock Splits reduce face value; Bonus Issues leave face value unchanged while capitalizing free reserves.",
      "Share buybacks extinguish equity capital, which increases forward EPS and ROE."
    ],
    formulas: [
      {
        label: "Ex-Bonus Share Price Adjustment",
        formula: "P_ex = P_cum × [N_existing / (N_existing + N_bonus)]",
        explanation: "Adjusts stock market price on ex-date to reflect the expanded share count from a bonus issue."
      }
    ],
    caseStudy: {
      title: "Stock Split Market Psychology",
      narrative: "When a high-priced industrial stock trading at ₹10,000 executed a 10:1 stock split, its face value fell from ₹10 to ₹1, and market price adjusted to ₹1,000. Retail order volumes surged 300% over the next quarter despite zero change in the company's underlying enterprise value.",
      keyLesson: "Stock splits do not alter intrinsic business value; they merely divide the corporate pie into smaller slices to improve liquidity."
    },
    reviewQuestions: [
      {
        questionId: 901,
        questionText: "When companies issue free additional shares to their existing shareholders without receiving any monetary consideration, it is known as a:",
        optionA: "Special Cash Dividend",
        optionB: "Interim Dividend",
        optionC: "Bonus Issue (Stock Dividend)",
        optionD: "Rights Issue",
        correctOption: "C",
        explanation: "A Bonus Issue (or stock dividend) distributes free shares to shareholders by transferring funds from accumulated free reserves to paid-up share capital.",
        difficulty: "EASY"
      },
      {
        questionId: 902,
        questionText: "Under the Companies Act, when a company raises further capital through new shares, it must first offer them to existing shareholders in proportion to their holding. This is known as a:",
        optionA: "Rights Issue",
        optionB: "Initial Public Offering (IPO)",
        optionC: "Preferential Allotment to Promoters",
        optionD: "Sweat Equity Issuance",
        correctOption: "A",
        explanation: "Under Section 62 of the Companies Act 2013, fresh capital issuances must first be offered to existing shareholders as a Rights Issue (pre-emptive rights).",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 10,
    chapterTitle: "Valuation Principles",
    weightageMarks: 12,
    estimatedMinutes: 50,
    icon: "Calculator",
    difficulty: "ADVANCED",
    summary: "Intrinsic DCF Valuation, FCFF vs FCFE, WACC calculation, Relative Multiples (P/E, EV/EBITDA, P/B, PEG), and Sum-of-the-Parts (SOTP) methodology.",
    detailedBody: `## Chapter 10: Valuation Principles

### 10.1 The Core Logic of Valuation
Valuation is the analytical process of determining the present economic worth of an asset or business enterprise.
- **Intrinsic Value:** What an asset is genuinely worth based on its underlying cash flows, risk profile, and future growth prospects.
- **Market Price:** The clearing price at which buyers and sellers currently transact on an exchange.
$$\text{If Intrinsic Value} > \text{Market Price} \implies \text{Undervalued (BUY)}$$
$$\text{If Intrinsic Value} < \text{Market Price} \implies \text{Overvalued (SELL)}$$

### 10.2 Discounted Cash Flow (DCF) Model
DCF is the gold standard of fundamental intrinsic valuation. It posits that a firm's value equals the sum of its future cash flows discounted back to the present at its opportunity cost of capital:
$$\text{Enterprise Value} = \sum_{t=1}^n \frac{\text{FCFF}_t}{(1 + \text{WACC})^t} + \frac{\text{Terminal Value}_n}{(1 + \text{WACC})^n}$$

1. **Free Cash Flow to Firm (FCFF):** Cash generated by core operations available to ALL providers of capital (debt holders and equity holders):
   $$\text{FCFF} = \text{EBIT}(1 - t) + \text{Depreciation} - \text{CapEx} - \Delta\text{Net Working Capital}$$
2. **Free Cash Flow to Equity (FCFE):** Cash flow available solely to common equity shareholders after debt servicing:
   $$\text{FCFE} = \text{Net Income} + \text{Depreciation} - \text{CapEx} - \Delta\text{NWC} + \text{Net Debt Issued}$$
3. **Weighted Average Cost of Capital (WACC):**
   $$\text{WACC} = w_e K_e + w_d K_d (1 - t)$$
   Where Cost of Equity ($K_e$) is derived using CAPM:
   $$K_e = R_f + \beta (R_m - R_f)$$

### 10.3 Relative Valuation Multiples
1. **Price-to-Earnings (P/E):** Market Price per share divided by Earnings Per Share (EPS).
   $$\text{Earnings Yield} = \frac{\text{EPS}}{\text{Market Price}} = \frac{1}{\text{P/E}}$$
2. **PEG Ratio:** P/E divided by expected EPS annual growth rate. Values below 1.0 indicate growth at a reasonable price (GARP).
3. **EV/EBITDA:** Enterprise Value divided by EBITDA. Essential for capital-intensive firms with heavy debt and varied depreciation policies.
4. **Price-to-Book (P/B):** Market Price per share divided by Book Value per share. Standard valuation metric for financial institutions (banks, NBFCs).`,
    keyTakeaways: [
      "FCFF discounts cash flows at WACC to calculate Enterprise Value; FCFE discounts at Cost of Equity to calculate Equity Value.",
      "Earnings Yield is the reciprocal of the P/E ratio: EPS / Price.",
      "EV/EBITDA is capital-structure neutral and standard for heavy industrial valuation; P/B is mandatory for banks and NBFCs."
    ],
    formulas: [
      {
        label: "FCFF Formula",
        formula: "FCFF = EBIT(1 - t) + D&A - CapEx - ΔNWC",
        explanation: "Unlevered cash flow available to debt and equity providers."
      },
      {
        label: "Earnings Yield",
        formula: "Earnings Yield = (EPS / CMP) × 100",
        explanation: "The percentage return earned by a share price at current earnings."
      },
      {
        label: "PEG Ratio",
        formula: "PEG = (P/E Ratio) / Annual EPS Growth Rate (%)",
        explanation: "Standardizes valuation multiples against underlying earnings growth velocity."
      }
    ],
    caseStudy: {
      title: "Dot-Com EV/Eyeball Failure vs. Cash Flow Reality",
      narrative: "In 1999, analysts invented speculative multiples like 'EV/Clicks' or 'Price/Eyeballs' to justify astronomical valuations for internet firms with zero revenue. When cash reserves vanished, firms without positive operating cash flows suffered 98% share collapses.",
      keyLesson: "Valuations must always anchor to real cash flows (FCFF/FCFE) rather than non-financial vanity metrics."
    },
    reviewQuestions: [
      {
        questionId: 1001,
        questionText: "If the price of a stock is ₹195 and its Earnings Per Share (EPS) is ₹13, what is its Earnings Yield?",
        optionA: "15.00 percent",
        optionB: "6.67 percent",
        optionC: "0.067 percent",
        optionD: "13.00 percent",
        correctOption: "B",
        explanation: "Earnings Yield = (EPS / Price) × 100 = (13 / 195) × 100 = 6.666% ≈ 6.67%. (Notice P/E = 195/13 = 15x, and 1/15 = 6.67%).",
        difficulty: "MEDIUM"
      },
      {
        questionId: 1002,
        questionText: "Company A has a P/E of 21x with 20% expected earnings growth (PEG = 1.05x). Company B has a P/E of 14.5x with 16% expected earnings growth (PEG = 0.91x). Which company is cheaper on a growth-adjusted basis?",
        optionA: "Company A is cheaper because its PEG is 1.05x",
        optionB: "Company B is cheaper because its PEG of 0.91x is lower",
        optionC: "Both companies are equally valued",
        optionD: "PEG cannot be used to compare companies across different growth rates",
        correctOption: "B",
        explanation: "A lower PEG ratio signifies that an investor is paying less per unit of earnings growth. Company B with a PEG of 0.91x is cheaper than Company A (1.05x).",
        difficulty: "MEDIUM"
      }
    ]
  },
  {
    chapterNumber: 11,
    chapterTitle: "Fundamental Analysis of Commodities",
    weightageMarks: 5,
    estimatedMinutes: 35,
    icon: "Gem",
    difficulty: "INTERMEDIATE",
    summary: "Commodity categories, supply-demand balances, storage costs, seasonal agricultural cycles, currency sensitivity, and Contango vs Backwardation.",
    detailedBody: `## Chapter 11: Fundamental Analysis of Commodities

### 11.1 Characteristics of Commodities
Unlike equities (which represent fractional ownership in ongoing operating businesses generating cash flows), **commodities** are physical raw materials and primary agricultural products.
- Commodities do not pay dividends, coupons, or interest.
- Commodity returns depend entirely on physical demand-supply dynamics, geopolitical disruptions, carrying costs, and macroeconomic price trends.

### 11.2 Major Commodity Classes
1. **Agricultural Commodities (Agri):** Soybeans, Wheat, Cotton, Chana, Spices, Palm Oil. Characterized by high seasonality (monsoon rains, planting/harvest cycles, government minimum support prices - MSP).
2. **Energy Commodities:** Crude Oil, Natural Gas, Coal. Highly sensitive to OPEC+ production quotas, geopolitical conflicts, and global manufacturing demand.
3. **Base Metals (Industrial):** Copper, Aluminum, Zinc, Nickel. Heavily tied to global economic infrastructure capex, automotive production, and industrial growth (especially in China).
4. **Precious Metals:** Gold, Silver, Platinum. Function as universal monetary reserves, inflation hedges, and safe-haven assets during geopolitical crises.

### 11.3 Market Structures: Contango vs. Backwardation
- **Contango (Normal Market):** Futures Price > Spot Price. Occurs when there is ample current supply, and futures reflect the positive **Cost of Carry** (financing rate + storage/warehousing costs + insurance).
- **Backwardation (Inverted Market):** Spot Price > Futures Price. Occurs during acute physical shortages or immediate supply disruptions where buyers pay a premium for immediate physical delivery (convenience yield > carrying cost).

### 11.4 Currency Impact on Commodity Prices
Most international commodities are priced globally in U.S. Dollars (USD). A **weakening Indian Rupee (INR)** against the USD makes imported commodities (crude oil, edible oils, copper) more expensive in domestic terms, fueling domestic cost-push inflation.`,
    keyTakeaways: [
      "Commodity valuations depend entirely on physical supply-demand equilibrium rather than discounted corporate cash flows.",
      "Contango occurs when Futures trade higher than Spot due to positive carrying costs (storage, insurance, finance).",
      "A depreciating domestic currency against the US Dollar exacerbates domestic commodity import inflation."
    ],
    formulas: [
      {
        label: "Commodity Futures Pricing",
        formula: "F = S × e^{(r + s - c) × T}",
        explanation: "Futures price incorporates risk-free rate r, storage cost s, and convenience yield c."
      }
    ],
    caseStudy: {
      title: "Negative Crude Oil Futures (-$37.63/bbl) on April 20, 2020",
      narrative: "When COVID-19 lockdowns collapsed global petroleum demand, commercial crude storage tanks at Cushing, Oklahoma reached 100% capacity. Speculative ETF holders of May 2020 WTI futures who could not take physical delivery were forced to pay buyers $37 per barrel to take delivery off their hands.",
      keyLesson: "Commodity futures must settle physically or cash-settle against physical reality; storage limitations can cause extreme dislocation."
    },
    reviewQuestions: [
      {
        questionId: 1101,
        questionText: "The fundamental analysis of commodities is largely dependent on which of the following primary drivers?",
        optionA: "Corporate Earnings Per Share (EPS) and P/E ratios",
        optionB: "Physical Supply and Demand dynamics of the specific commodity",
        optionC: "Promoter share pledging disclosures",
        optionD: "DuPont Return on Equity decomposition",
        correctOption: "B",
        explanation: "As stated on Page 227 of the NISM Workbook, commodities generate no corporate cash flows; their values depend on physical supply and demand balances.",
        difficulty: "EASY"
      },
      {
        questionId: 1102,
        questionText: "A _________ domestic currency against the U.S. dollar makes commodity imports more expensive in a scenario of rising global prices.",
        optionA: "Weakening / Depreciation of",
        optionB: "Strengthening / Appreciation of",
        optionC: "Completely stable",
        optionD: "Zero-volatility pegging of",
        correctOption: "A",
        explanation: "When the domestic currency (INR) weakens against the USD, more rupees are required to buy each dollar of commodities, increasing landed import costs.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 12,
    chapterTitle: "Fundamentals of Risk and Return",
    weightageMarks: 7,
    estimatedMinutes: 40,
    icon: "ShieldAlert",
    difficulty: "ADVANCED",
    summary: "Systematic vs Unsystematic risk, Standard Deviation, Beta, Sharpe Ratio, Treynor Ratio, Jensen's Alpha, and Benjamin Graham's Margin of Safety.",
    detailedBody: `## Chapter 12: Fundamentals of Risk and Return

### 12.1 Total Risk: Systematic vs. Unsystematic Risk
Total investment risk consists of two distinct components:
$$\text{Total Risk} = \text{Systematic Risk} + \text{Unsystematic Risk}$$
1. **Systematic Risk (Market Risk):** Caused by macroeconomic events impacting the entire financial system (e.g., recessions, interest rate hikes, wars, pandemics). Cannot be eliminated by diversification. Measured by **Beta ($\beta$)**.
2. **Unsystematic Risk (Idiosyncratic / Company-Specific Risk):** Caused by factors specific to a single company or industry (e.g., labor strikes, management fraud, patent expiration). **Can be diversified away** by holding a broad portfolio of 20-30 uncorrelated stocks.

### 12.2 Risk-Adjusted Performance Measures
1. **Sharpe Ratio:** Measures excess return earned per unit of **Total Risk (Standard Deviation $\sigma_p$)**:
   $$\text{Sharpe Ratio} = \frac{R_p - R_f}{\sigma_p}$$
   Ideal for evaluating non-diversified portfolios where investors bear total volatility.
2. **Treynor Ratio:** Measures excess return earned per unit of **Systematic Risk (Beta $\beta_p$)**:
   $$\text{Treynor Ratio} = \frac{R_p - R_f}{\beta_p}$$
   Ideal for evaluating well-diversified institutional portfolios.
3. **Jensen's Alpha ($\alpha$):** The abnormal return generated by a fund manager over and above the return predicted by the Capital Asset Pricing Model (CAPM):
   $$\alpha = R_p - [R_f + \beta_p (R_m - R_f)]$$
   Positive alpha indicates superior stock-picking skill.

### 12.3 Benjamin Graham's 'Margin of Safety'
The legendary father of value investing, Benjamin Graham, defined the **Margin of Safety** as the difference between a security's intrinsic value and its market price. Purchasing securities at a substantial discount to intrinsic worth buffers against forecasting errors, bad luck, and market panics.`,
    keyTakeaways: [
      "Unsystematic risk is company-specific and diversifiable; systematic risk is market-wide and non-diversifiable.",
      "Sharpe Ratio uses Total Risk (Standard Deviation); Treynor Ratio uses Systematic Risk (Beta).",
      "Margin of Safety is the discount between intrinsic worth and market purchase price."
    ],
    formulas: [
      {
        label: "Sharpe Ratio",
        formula: "Sharpe = (R_p - R_f) / σ_p",
        explanation: "Excess return earned per unit of total portfolio volatility."
      },
      {
        label: "Treynor Ratio",
        formula: "Treynor = (R_p - R_f) / β_p",
        explanation: "Excess return earned per unit of systematic equity beta."
      },
      {
        label: "Jensen's Alpha",
        formula: "α = R_p - [R_f + β_p(R_m - R_f)]",
        explanation: "Manager value-add above CAPM benchmark return."
      }
    ],
    caseStudy: {
      title: "Portfolio Diversification in the 2020 Crash",
      narrative: "During the March 2020 COVID sell-off, investors holding only hospitality and aviation stocks lost 70% of capital, while portfolios diversified across IT, Pharmaceuticals, and Consumer Staples rebounded to new highs within four months.",
      keyLesson: "Diversifying across uncorrelated sectors eliminates idiosyncratic company risk."
    },
    reviewQuestions: [
      {
        questionId: 1201,
        questionText: "Which risk-adjusted performance metric evaluates excess returns by standardizing against Systematic Risk using Equity Beta?",
        optionA: "Jensen's Alpha",
        optionB: "Sharpe Ratio",
        optionC: "Treynor Ratio",
        optionD: "Standard Deviation Variance",
        correctOption: "C",
        explanation: "The Treynor Ratio divides excess portfolio return by Beta (systematic risk), unlike the Sharpe Ratio which divides by total standard deviation.",
        difficulty: "MEDIUM"
      },
      {
        questionId: 1202,
        questionText: "The _________ refers to the difference between intrinsic value and market price, ensuring securities are acquired at a favorable discount to protect against downside error.",
        optionA: "Margin of Safety",
        optionB: "Sensitivity Variance",
        optionC: "Beta Leverage",
        optionD: "Holding Period Return",
        correctOption: "A",
        explanation: "Benjamin Graham established the 'Margin of Safety' as the discount between conservative intrinsic value and the market price.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 13,
    chapterTitle: "Qualities of a Good Research Report",
    weightageMarks: 5,
    estimatedMinutes: 30,
    icon: "FileCheck2",
    difficulty: "BEGINNER",
    summary: "Essential sections of institutional equity research reports, checklist-based verification, authentic primary data sources, and regulatory disclosures.",
    detailedBody: `## Chapter 13: Qualities of a Good Research Report

### 13.1 Core Elements of an Institutional Research Report
A professional equity research report serves as an authoritative investment document. Essential components include:
1. **Investment Summary & Recommendation:** Clear statement of rating (e.g., BUY, ACCUMULATE, HOLD, REDUCE, SELL), 12-month target price, current market price, and expected total percentage upside/downside.
2. **Company Background & Business Model:** Plain-language description of how the company generates revenue, primary products/services, and customer segments.
3. **Industry Thesis:** Macro tailwinds, sector growth drivers, and market share trends.
4. **Financial Projections (3-Year Estimates):** Detailed financial statement model forecasting revenue, EBITDA, PAT, EPS, and ROCE for at least the next 2-3 fiscal years.
5. **Valuation Methodology:** Transparent justification of valuation models used (DCF assumptions, WACC, terminal growth, peer relative multiples).
6. **Key Investment Risks:** Explicit disclosure of downside threats (raw material inflation, regulatory shifts, currency risk, promoter pledging).
7. **Statutory Disclosures & Certifications:** Analyst certification confirming views accurately reflect personal beliefs, plus disclosures of financial interests or business relationships.

### 13.2 Authentic Sources of Research Information
Analysts must rely strictly on verifiable, authoritative primary sources:
- **Audited Annual Reports & Regulatory Filings:** Balance Sheets, Notes to Accounts, Director's Report, and Auditor's Opinion.
- **Stock Exchange Disclosures:** Quarterly financial results submitted under SEBI LODR Regulations.
- **Official Government & Central Bank Data:** Ministry of Statistics (MOSPI), RBI Bulletin, SEBI Bulletins.
- *Unverified media rumors or uncorroborated social media tips must never be used as facts in research reports.*`,
    keyTakeaways: [
      "Institutional research reports must balance investment thesis with explicit downside risk disclosures.",
      "Audited annual reports and stock exchange regulatory filings are the authentic primary sources for facts.",
      "Reports must disclose analyst ownership, conflicts of interest, and compensation linkages."
    ],
    formulas: [],
    caseStudy: {
      title: "The Importance of Notes to Accounts",
      narrative: "An equity research analyst published a bullish report solely based on reported top-line revenue growth without reading Note 34 in the Annual Report, which revealed that 45% of revenues were disputed contingent claims rejected by arbitration. When the claims were disallowed, the stock collapsed 75%.",
      keyLesson: "A thorough research report must thoroughly examine the Notes to Accounts and Auditor's comments."
    },
    reviewQuestions: [
      {
        questionId: 1301,
        questionText: "For professional research analysts, which of the following is the most authentic primary source to verify corporate facts and financials?",
        optionA: "Audited Annual Reports and Stock Exchange Filings",
        optionB: "Social media forum posts and influencer channels",
        optionC: "Anonymous market whisper tips",
        optionD: "Unverified business portal tabloids",
        correctOption: "A",
        explanation: "Audited annual reports, notes to accounts, and official stock exchange filings under SEBI LODR are the authentic primary sources for company facts.",
        difficulty: "EASY"
      },
      {
        questionId: 1302,
        questionText: "Leverage and solvency ratios are part of which analytical parameter of corporate analysis?",
        optionA: "Qualitative Parameter",
        optionB: "Quantitative Parameter",
        optionC: "Behavioral Parameter",
        optionD: "Speculative Parameter",
        correctOption: "B",
        explanation: "Financial ratios derived from numerical accounting statements (like Debt-to-Equity and Interest Coverage) are quantitative analytical parameters.",
        difficulty: "EASY"
      }
    ]
  },
  {
    chapterNumber: 14,
    chapterTitle: "Legal and Regulatory Environment",
    weightageMarks: 10,
    estimatedMinutes: 50,
    icon: "Scale",
    difficulty: "ADVANCED",
    summary: "SEBI RA Regulations 2014, SEBI (PIT) Insider Trading Laws, PFUTP Regulations, Code of Conduct for RAs, Conflict of Interest, and Chinese Walls.",
    detailedBody: `## Chapter 14: Legal and Regulatory Environment

### 14.1 Regulatory Framework in Indian Capital Markets
- **Ministry of Finance (MoF):** Oversees macro financial architecture and sovereign fiscal policy.
- **Securities and Exchange Board of India (SEBI):** Statutory regulator established under the **SEBI Act, 1992** to protect investor interests, promote market development, and regulate the securities market.
- **Reserve Bank of India (RBI):** Regulates banking system, currency, government securities, and monetary policy.
- **PFRDA & IRDAI:** Regulate pension funds and insurance sectors respectively.

### 14.2 SEBI (Research Analysts) Regulations, 2014
SEBI introduced specific regulations to govern RAs and eliminate conflicts of interest:
1. **Mandatory Registration:** No person shall act as a research analyst or research entity without obtaining a valid certificate of registration from SEBI.
2. **Qualification & Certification:** RAs must hold a post-graduate degree or professional qualification in finance/economics and obtain the **NISM Series XV: Research Analyst Certification**.
3. **Capital Adequacy:** Individuals/partnerships must maintain net tangible assets of ₹1 Lakh (or as amended); body corporates must maintain net worth of at least ₹25 Lakhs.
4. **Internal Policies & Chinese Walls:** Research entities must maintain written internal policies and physical/digital barriers separating research staff from investment banking and sales departments.

### 14.3 Personal Trading Restrictions on Research Analysts
- **30-Day Pre-Trading Restriction:** An RA cannot trade in securities of a company that the analyst has covered within 30 days prior to the publication of a research report.
- **5-Day Post-Trading Restriction:** An RA cannot trade in securities of a covered company within 5 days after the publication of the report.
- **No Trading Contrary to Recommendation:** RAs cannot trade contrary to their own published recommendations unless facing personal financial emergency with prior compliance approval.

### 14.4 SEBI (Prohibition of Insider Trading - PIT) Regulations, 2015
- **Unpublished Price Sensitive Information (UPSI):** Any non-public information relating to financial results, dividends, capital structure changes, mergers, acquisitions, or key personnel changes that would materially impact market price if made public.
- **Insider Trading Prohibition:** No insider shall communicate or counsel UPSI, nor trade securities while in possession of UPSI.
- **Trading Window Closure:** Trading window closes from the end of each quarter until **48 hours after financial results are made publicly available**.

### 14.5 SEBI (PFUTP) Regulations, 2003
Prohibits Fraudulent and Unfair Trade Practices including:
- **Front Running:** Buying or selling securities prior to executing a large client block order.
- **Circular Trading & Wash Sales:** Transacting without change in beneficial ownership to artificially inflate trading volumes.
- **Pump and Dump:** Spreading false positive information to drive up prices before dumping shares onto retail buyers.`,
    keyTakeaways: [
      "SEBI RA Regulations 2014 mandate NISM XV certification, registration, and strict Chinese Walls.",
      "RAs face a 30-day pre-publication and 5-day post-publication personal trading restriction.",
      "Trading windows close quarterly and remain shut until 48 hours after financial results are publicly disclosed."
    ],
    formulas: [],
    caseStudy: {
      title: "Front Running Enforcement Action",
      narrative: "SEBI investigated a dealer at an institutional mutual fund who tipped off family trading accounts minutes before the fund executed massive equity block purchase orders, netting illicit profits from the predictable market price surge.",
      keyLesson: "SEBI's surveillance systems detect algorithmic front-running; violators face complete market bans and disgorgement penalties under PFUTP regulations."
    },
    reviewQuestions: [
      {
        questionId: 1401,
        questionText: "Which of the following is strictly categorized as an illegal, unhealthy market practice in Securities Markets under SEBI regulations?",
        optionA: "Timely Material Disclosures",
        optionB: "Corporate Transparency",
        optionC: "Insider Trading and Front Running",
        optionD: "Exchange Market Surveillance",
        correctOption: "C",
        explanation: "Insider trading and front running violate SEBI PIT and PFUTP regulations and carry civil and criminal penalties.",
        difficulty: "EASY"
      },
      {
        questionId: 1402,
        questionText: "Under SEBI (Prohibition of Insider Trading) Regulations, the trading window remains closed until how many hours after unpublished price sensitive information (UPSI) is made publicly available?",
        optionA: "12 Hours",
        optionB: "24 Hours",
        optionC: "48 Hours",
        optionD: "7 Days",
        correctOption: "C",
        explanation: "Under SEBI PIT regulations, the trading window remains closed until 48 hours after financial results or UPSI are publicly disseminated.",
        difficulty: "MEDIUM"
      }
    ]
  },
  {
    chapterNumber: 15,
    chapterTitle: "Technical Analysis",
    weightageMarks: 15,
    estimatedMinutes: 55,
    icon: "CandlestickChart",
    difficulty: "ADVANCED",
    summary: "Dow Theory Tenets, Candlestick Chart Patterns (Hammer, Hanging Man, Engulfing), Support/Resistance, Moving Averages, RSI, MACD, and divergences.",
    detailedBody: `## Chapter 15: Technical Analysis

### 15.1 Core Tenets of Dow Theory
Technical analysis studies past market data (primarily price and volume) to forecast the direction of future price trends. Charles Dow established its foundational axioms:
1. **The Market Discounts Everything:** All macroeconomic news, company earnings, and collective psychological sentiment are instantly assimilated into market prices.
2. **The Market Has Three Trends:**
   - **Primary Trend:** Long-term trend lasting one to several years (Bull or Bear market).
   - **Secondary Trend:** Corrections retracing 33% to 66% of the primary move lasting 3 weeks to 3 months.
   - **Minor Trend:** Daily random fluctuations (noise) lasting less than 3 weeks.
3. **Trends Have Three Phases:** Accumulation (smart money) $\to$ Public Participation (markup) $\to$ Distribution (smart money selling to euphoria).
4. **Averages Must Confirm Each Other:** A bull move on the industrial average must be validated by the transportation average.
5. **Volume Must Confirm the Trend:** Volume expands in the direction of the primary trend.
6. **A Trend Remains in Effect Until Definite Reversal Signals Occur.**

### 15.2 Candlestick Formations
- **Real Body:** Difference between Open and Close. Green/White indicates Close > Open (bullish); Red/Black indicates Open > Close (bearish).
- **Shadows (Wicks):** Upper shadow shows intraday high; lower shadow shows intraday low.
- **Hammer:** Bullish reversal pattern occurring at the bottom of a downtrend. Small body near the top, long lower shadow at least twice the real body length, showing buyers rejected lower prices.
- **Hanging Man:** Identical shape to a hammer, but appears at the top of an uptrend, signaling selling pressure entering the market.
- **Bullish Engulfing:** Large green body completely covers the preceding day's smaller red body after a downtrend.
- **Doji:** Open and Close are identical, reflecting complete equilibrium between bulls and bears.

### 15.3 Technical Indicators & Oscillators
1. **Moving Averages:**
   - **Simple Moving Average (SMA):** Arithmetic average of closing prices over $N$ periods.
   - **Exponential Moving Average (EMA):** Gives exponentially greater weight to recent prices.
   - **Golden Cross:** 50-day EMA crosses above 200-day EMA (Major Bullish signal).
   - **Death Cross:** 50-day EMA crosses below 200-day EMA (Major Bearish signal).
2. **Relative Strength Index (RSI):** Momentum oscillator ranging between 0 and 100:
   $$RSI = 100 - \left[ \frac{100}{1 + RS} \right], \quad RS = \frac{\text{Average Gain}}{\text{Average Loss}}$$
   - **Overbought:** RSI > 70 (Potential top or consolidation).
   - **Oversold:** RSI < 30 (Potential bottom or rebound).
   - **Bullish Divergence:** Price makes a lower low while RSI makes a higher low.
   - **Bearish Divergence:** Price makes a higher high while RSI makes a lower high.
3. **MACD (Moving Average Convergence Divergence):**
   $$\text{MACD Line} = 12\text{-period EMA} - 26\text{-period EMA}$$
   $$\text{Signal Line} = 9\text{-period EMA of MACD Line}$$
   $$\text{MACD Histogram} = \text{MACD Line} - \text{Signal Line}$$`,
    keyTakeaways: [
      "Dow Theory posits that the market discounts everything and trends persist until clear reversal signals emerge.",
      "The default MACD line equals the 12-period EMA minus the 26-period EMA.",
      "Bullish divergence occurs when stock price makes a lower low but the oscillator (RSI/MACD) makes a higher low."
    ],
    formulas: [
      {
        label: "RSI Calculation",
        formula: "RSI = 100 - [100 / (1 + (Avg Gain / Avg Loss))]",
        explanation: "Normalizes 14-period directional momentum between 0 and 100."
      },
      {
        label: "MACD Line",
        formula: "MACD = 12-Day EMA - 26-Day EMA",
        explanation: "Tracks convergence and divergence between short and medium term moving averages."
      }
    ],
    caseStudy: {
      title: "RSI Bearish Divergence at All-Time Highs",
      narrative: "When the benchmark Nifty Index reached new record highs above 26,000, the 14-week RSI formed a lower peak at 64 compared to its previous peak of 82. This classic bearish divergence signaled waning momentum, preceding a sharp 8% market pullback.",
      keyLesson: "Divergence between price action and momentum oscillators warns of impending trend fatigue."
    },
    reviewQuestions: [
      {
        questionId: 1501,
        questionText: "Which of the following is NOT one of the classic tenets of the Dow Theory?",
        optionA: "The market discounts everything",
        optionB: "The market has four trends: micro, mini, maxi, and mega",
        optionC: "The averages must confirm each other",
        optionD: "A trend remains in effect until a clear reversal occurs",
        correctOption: "B",
        explanation: "Dow Theory specifies exactly three trends (Primary, Secondary, and Minor trends), not four trends.",
        difficulty: "EASY"
      },
      {
        questionId: 1502,
        questionText: "The default standard MACD line is calculated as the difference between:",
        optionA: "The 12-period EMA and the 9-period EMA",
        optionB: "The 26-period EMA and the 9-period EMA",
        optionC: "The 12-period EMA and the 26-period EMA",
        optionD: "The 50-period SMA and the 200-period SMA",
        correctOption: "C",
        explanation: "The standard MACD line is the 12-period Exponential Moving Average minus the 26-period Exponential Moving Average.",
        difficulty: "EASY"
      },
      {
        questionId: 1503,
        questionText: "Which of the following observations regarding RSI divergence is TRUE?",
        optionA: "When the stock makes a new lower low and RSI doesn't (makes a higher low), it is called 'Bullish Divergence'",
        optionB: "When the stock makes a new high and RSI doesn't, it is called 'Bullish Divergence'",
        optionC: "RSI values frequently rise above 100 during strong bull runs",
        optionD: "RSI operates with zero sensitivity to price change magnitude",
        correctOption: "A",
        explanation: "A Bullish Divergence occurs when prices print lower lows while the RSI prints higher lows, signaling weakening downward momentum.",
        difficulty: "MEDIUM"
      }
    ]
  }
];

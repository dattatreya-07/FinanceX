import {
  User,
  Achievement,
  UserAchievement,
  UserSocialLink,
  KnowledgeLevel,
  Goal,
  Topic,
  Course,
  Lesson,
  Quiz,
  MockExam,
  Certification,
  Certificate,
  AIConversation,
  AIMessage,
  AIRecommendation,
  StudyPlan,
  StudyPlanItem,
  DiscussionThread,
  DiscussionReply,
  Tag,
  DiscussionThreadTag,
  Notification,
  DemoAccount,
  Instrument,
  DemoHolding,
  DemoTransaction,
  QuizAttempt,
  MockExamAttempt,
  Question,
  QuizQuestion,
  MockExamQuestion,
  LessonContent,
  LessonResource
} from '../types/schema';

// 5. KNOWLEDGE_LEVEL
export const MOCK_KNOWLEDGE_LEVELS: KnowledgeLevel[] = [
  { level_id: 1, level_name: 'Novice Saver', min_score: 0, max_score: 250, badge_color: '#94A3B8' },
  { level_id: 2, level_name: 'Market Explorer', min_score: 251, max_score: 600, badge_color: '#06B6D4' },
  { level_id: 3, level_name: 'Derivative Analyst', min_score: 601, max_score: 1100, badge_color: '#00E599' },
  { level_id: 4, level_name: 'Portfolio Strategist', min_score: 1101, max_score: 1800, badge_color: '#A855F7' },
  { level_id: 5, level_name: 'Chartered Master', min_score: 1801, max_score: 3000, badge_color: '#FF2E7E' }
];

// 1. USER
export const MOCK_CURRENT_USER: User = {
  user_id: 101,
  full_name: 'Kannan M',
  email: 'mkannankannanmkannan@gmail.com',
  phone_number: '+91 98401 23456',
  account_status: 'ACTIVE',
  knowledge_level_id: 3,
  current_streak: 14,
  longest_streak: 28,
  social_links: ['https://linkedin.com/in/kannan-finance', 'https://twitter.com/kannan_fx'],
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp_points: 840
};

// 4. USER_SOCIAL_LINK
export const MOCK_USER_SOCIAL_LINKS: UserSocialLink[] = [
  { social_link_id: 1, user_id: 101, platform: 'LINKEDIN', url: 'https://linkedin.com/in/kannan-finance' },
  { social_link_id: 2, user_id: 101, platform: 'TWITTER', url: 'https://twitter.com/kannan_fx' },
  { social_link_id: 3, user_id: 101, platform: 'GITHUB', url: 'https://github.com/kannan-m' }
];

// 2. ACHIEVEMENT
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { achievement_id: 1, achievement_name: '7-Day Market Streak', description: 'Maintained a 7-day continuous learning streak', icon_name: 'Flame', category: 'STREAK', xp_reward: 150 },
  { achievement_id: 2, achievement_name: 'Option Greek Guru', description: 'Mastered Delta, Gamma, Theta, and Vega with 100% quiz accuracy', icon_name: 'BrainCircuit', category: 'LEARNING', xp_reward: 200 },
  { achievement_id: 3, achievement_name: 'First Virtual Trade', description: 'Executed your first paper trade order in Practice Lab', icon_name: 'TrendingUp', category: 'TRADING', xp_reward: 100 },
  { achievement_id: 4, achievement_name: 'NISM Mock Champion', description: 'Scored >85% on NISM Series VIII full-length mock exam', icon_name: 'Award', category: 'EXAM', xp_reward: 350 },
  { achievement_id: 5, achievement_name: 'Community Contributor', description: 'Shared an accepted answer in the financial discussion forum', icon_name: 'MessageSquareCheck', category: 'COMMUNITY', xp_reward: 120 },
  { achievement_id: 6, achievement_name: 'Risk Manager Elite', description: 'Constructed a delta-neutral options straddle in the simulator', icon_name: 'ShieldCheck', category: 'TRADING', xp_reward: 250 },
  { achievement_id: 7, achievement_name: 'Money Evolution Pioneer', description: 'Completed all 9 chapters of the Evolution of Money story', icon_name: 'Coins', category: 'LEARNING', xp_reward: 180 },
  { achievement_id: 8, achievement_name: '14-Day Iron Discipline', description: 'Studied every day for 2 consecutive weeks', icon_name: 'Zap', category: 'STREAK', xp_reward: 300 }
];

// 3. USER_ACHIEVEMENT
export const MOCK_USER_ACHIEVEMENTS: UserAchievement[] = [
  { user_id: 101, achievement_id: 1, earned_at: '2026-08-10' },
  { user_id: 101, achievement_id: 3, earned_at: '2026-08-12' },
  { user_id: 101, achievement_id: 7, earned_at: '2026-08-14' },
  { user_id: 101, achievement_id: 8, earned_at: '2026-08-17' }
];

// 6. GOAL
export const MOCK_GOALS: Goal[] = [
  { goal_id: 1, user_id: 101, goal_title: 'Clear NISM Series VIII Certification', target_date: '2026-09-15', status: 'IN_PROGRESS', current_progress_percent: 68, category: 'CERTIFICATION' },
  { goal_id: 2, user_id: 101, goal_title: 'Achieve 30-Day Learning Streak', target_date: '2026-09-01', status: 'IN_PROGRESS', current_progress_percent: 46, category: 'STREAK' },
  { goal_id: 3, user_id: 101, goal_title: 'Build ₹12,00,000 Virtual Portfolio with <1.2 Beta', target_date: '2026-09-30', status: 'IN_PROGRESS', current_progress_percent: 75, category: 'SIMULATION' },
  { goal_id: 4, user_id: 101, goal_title: 'Complete Fixed Income & Yield Curve Module', target_date: '2026-08-15', status: 'COMPLETED', current_progress_percent: 100, category: 'LESSONS' }
];

// 7. TOPIC (All 15 Official NISM Series XV Chapters + Advanced Derivatives)
export const MOCK_TOPICS: Topic[] = [
  { topic_id: 1, topic_name: 'Introduction to Research Analyst Profession', difficulty_level: 'BEGINNER', icon: 'Briefcase', description: 'Primary responsibilities of RAs, sell-side vs buy-side, and code of conduct.' },
  { topic_id: 2, topic_name: 'Introduction to Securities Market', difficulty_level: 'BEGINNER', icon: 'Building2', description: 'Primary and secondary markets, SCRA 1956, exchanges, depositories, and T+1 settlement.' },
  { topic_id: 3, topic_name: 'Terminology in Equity and Debt Markets', difficulty_level: 'BEGINNER', icon: 'Coins', description: 'Face value, Enterprise Value, clean vs dirty bond pricing, and yield to maturity.' },
  { topic_id: 4, topic_name: 'Fundamentals of Research', difficulty_level: 'BEGINNER', icon: 'Compass', description: 'Top-down (E-I-C) vs bottom-up research, investing vs speculating, and behavioral biases.' },
  { topic_id: 5, topic_name: 'Economic Analysis', difficulty_level: 'INTERMEDIATE', icon: 'TrendingUp', description: 'Macro variables, GDP expenditure equation, inflation targeting, and monetary policy.' },
  { topic_id: 6, topic_name: 'Industry Analysis', difficulty_level: 'INTERMEDIATE', icon: 'Factory', description: 'Porter 5 Forces, industry life cycle stages, and cyclical vs defensive dynamics.' },
  { topic_id: 7, topic_name: 'Company Analysis – Business and Governance', difficulty_level: 'INTERMEDIATE', icon: 'ShieldCheck', description: 'Economic moats, qualitative SWOT analysis, promoter pledging, and corporate governance.' },
  { topic_id: 8, topic_name: 'Company Analysis – Financial Analysis', difficulty_level: 'ADVANCED', icon: 'FileSpreadsheet', description: 'Three statements, quality of earnings, DuPont 3-step ROE, and liquidity/solvency ratios.' },
  { topic_id: 9, topic_name: 'Corporate Actions', difficulty_level: 'INTERMEDIATE', icon: 'Layers', description: 'Dividends, stock splits, bonus issues, rights offerings, buybacks, and ex-dates.' },
  { topic_id: 10, topic_name: 'Valuation Principles', difficulty_level: 'ADVANCED', icon: 'Calculator', description: 'DCF models, FCFF/FCFE, WACC, relative multiples (P/E, EV/EBITDA, P/B), and PEG.' },
  { topic_id: 11, topic_name: 'Fundamental Analysis of Commodities', difficulty_level: 'INTERMEDIATE', icon: 'Gem', description: 'Supply-demand balances, storage carry cost, currency impact, contango, and backwardation.' },
  { topic_id: 12, topic_name: 'Fundamentals of Risk and Return', difficulty_level: 'ADVANCED', icon: 'ShieldAlert', description: 'Systematic vs unsystematic risk, Sharpe Ratio, Treynor Ratio, Alpha, and Margin of Safety.' },
  { topic_id: 13, topic_name: 'Qualities of a Good Research Report', difficulty_level: 'BEGINNER', icon: 'FileCheck2', description: 'Key report sections, checklist verification, authentic data sources, and disclosures.' },
  { topic_id: 14, topic_name: 'Legal and Regulatory Environment', difficulty_level: 'ADVANCED', icon: 'Scale', description: 'SEBI RA Regs 2014, Insider Trading (PIT 2015), PFUTP, and Chinese Walls.' },
  { topic_id: 15, topic_name: 'Technical Analysis', difficulty_level: 'ADVANCED', icon: 'CandlestickChart', description: 'Dow Theory axioms, candlesticks, support/resistance, RSI, MACD, and divergences.' },
  { topic_id: 16, topic_name: 'Equity Derivatives & Futures Pricing', difficulty_level: 'INTERMEDIATE', icon: 'TrendingUp', description: 'Forward contracts, cash-and-carry arbitrage, basis, and open interest.' },
  { topic_id: 17, topic_name: 'Options Strategies & The Greeks', difficulty_level: 'ADVANCED', icon: 'Layers', description: 'Delta, Gamma, Theta, Vega, Rho, Bull Call Spreads, and Iron Condors.' },
  { topic_id: 18, topic_name: 'Fixed Income, Bonds & Duration', difficulty_level: 'INTERMEDIATE', icon: 'Percent', description: 'Bond pricing, YTM, Macaulay Duration, Modified Duration, and convexity.' }
];

// 8. COURSE
export const MOCK_COURSES: Course[] = [
  {
    course_id: 1,
    course_title: 'NISM Series VIII: Equity Derivatives Certification Masterclass',
    price: 0,
    certification_id: 1,
    rating: 4.9,
    total_lessons: 18,
    estimated_hours: 14,
    level: 'INTERMEDIATE',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive preparation for the NISM-Series-VIII: Equity Derivatives Certification Examination recognized by SEBI.',
    author: 'Dr. Arvind Swaminathan, CFA'
  },
  {
    course_id: 2,
    course_title: 'Fixed Income & Debt Securities Analysis',
    price: 0,
    certification_id: 3,
    rating: 4.8,
    total_lessons: 12,
    estimated_hours: 10,
    level: 'INTERMEDIATE',
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
    description: 'Master sovereign yield curves, corporate bonds, duration risk, and interest rate sensitivity.',
    author: 'Pooja Verma, FRM'
  },
  {
    course_id: 3,
    course_title: 'NISM Series XV: Research Analyst Certification',
    price: 0,
    certification_id: 2,
    rating: 4.9,
    total_lessons: 15,
    estimated_hours: 12,
    level: 'ADVANCED',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    description: 'Prepare to publish institutional equity research with rigorous valuation methods and regulatory compliance.',
    author: 'Rajesh Mehta, Senior Research Analyst'
  },
  {
    course_id: 4,
    course_title: 'Financial Fundamentals: The Evolution of Money & Markets',
    price: 0,
    certification_id: 4,
    rating: 5.0,
    total_lessons: 9,
    estimated_hours: 6,
    level: 'BEGINNER',
    image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    description: 'From ancient barter and minted bullion to fractional reserve banking and algorithmic capital markets.',
    author: 'FinanceX Core Editorial'
  }
];

// 9. LESSON
export const MOCK_LESSONS: Lesson[] = [
  {
    lesson_id: 1,
    course_id: 1,
    topic_id: 2,
    title: 'Fundamentals of Futures Contracts & Cost of Carry Model',
    resource_links: ['https://financex.academy/resources/cost-of-carry.pdf', 'https://nseindia.com/products-services/equity-derivatives'],
    estimated_mins: 22,
    is_completed: false,
    order_index: 1
  },
  {
    lesson_id: 2,
    course_id: 1,
    topic_id: 3,
    title: 'Option Greeks Deep Dive: Delta, Gamma & Theta Decay',
    resource_links: ['https://financex.academy/resources/option-greeks-cheatsheet.pdf', 'https://financex.academy/models/black-scholes.xlsx'],
    estimated_mins: 35,
    is_completed: false,
    order_index: 2
  },
  {
    lesson_id: 3,
    course_id: 1,
    topic_id: 3,
    title: 'Multi-Leg Strategies: Bull Spreads, Straddles & Iron Condors',
    resource_links: ['https://financex.academy/resources/volatility-strategies.pdf'],
    estimated_mins: 28,
    is_completed: false,
    order_index: 3
  },
  {
    lesson_id: 4,
    course_id: 1,
    topic_id: 5,
    title: 'Regulatory Safeguards, Margining & SEBI Risk Framework',
    resource_links: ['https://sebi.gov.in/legal/regulations/derivatives-framework.pdf'],
    estimated_mins: 25,
    is_completed: false,
    order_index: 4
  },
  {
    lesson_id: 5,
    course_id: 2,
    topic_id: 4,
    title: 'Bond Pricing Mechanics, Spot Rates & Yield to Maturity (YTM)',
    resource_links: ['https://financex.academy/resources/ytm-calculator.xlsx'],
    estimated_mins: 30,
    is_completed: true,
    order_index: 1
  },
  {
    lesson_id: 6,
    course_id: 2,
    topic_id: 4,
    title: 'Macaulay Duration, Modified Duration & Convexity Hedging',
    resource_links: ['https://financex.academy/resources/duration-convexity-guide.pdf'],
    estimated_mins: 32,
    is_completed: false,
    order_index: 2
  },
  // NISM Series XV: Research Analyst Certification Course (Course ID 3 - All 15 Chapters)
  {
    lesson_id: 101,
    course_id: 3,
    topic_id: 1,
    title: 'Chapter 1: Introduction to the Research Analyst Profession',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 25,
    is_completed: false,
    order_index: 1
  },
  {
    lesson_id: 102,
    course_id: 3,
    topic_id: 2,
    title: 'Chapter 2: Introduction to Securities Markets',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 35,
    is_completed: false,
    order_index: 2
  },
  {
    lesson_id: 103,
    course_id: 3,
    topic_id: 3,
    title: 'Chapter 3: Terminology in Equity and Debt Markets',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 40,
    is_completed: false,
    order_index: 3
  },
  {
    lesson_id: 104,
    course_id: 3,
    topic_id: 4,
    title: 'Chapter 4: Fundamentals of Research & Top-Down (E-I-C) Approach',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 30,
    is_completed: false,
    order_index: 4
  },
  {
    lesson_id: 105,
    course_id: 3,
    topic_id: 5,
    title: 'Chapter 5: Economic Analysis & Macroeconomic Variables',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 45,
    is_completed: false,
    order_index: 5
  },
  {
    lesson_id: 106,
    course_id: 3,
    topic_id: 6,
    title: 'Chapter 6: Industry Analysis (Porter’s 5 Forces & Life Cycle)',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 40,
    is_completed: false,
    order_index: 6
  },
  {
    lesson_id: 107,
    course_id: 3,
    topic_id: 7,
    title: 'Chapter 7: Company Analysis – Qualitative Dimensions & Governance',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 50,
    is_completed: false,
    order_index: 7
  },
  {
    lesson_id: 108,
    course_id: 3,
    topic_id: 8,
    title: 'Chapter 8: Company Analysis – Quantitative & Financial Statements',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 55,
    is_completed: false,
    order_index: 8
  },
  {
    lesson_id: 109,
    course_id: 3,
    topic_id: 9,
    title: 'Chapter 9: Corporate Actions, Mergers & Governance Adjustments',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 35,
    is_completed: false,
    order_index: 9
  },
  {
    lesson_id: 110,
    course_id: 3,
    topic_id: 10,
    title: 'Chapter 10: Valuation Principles (DCF, FCFF, FCFE, WACC & Multiples)',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 60,
    is_completed: false,
    order_index: 10
  },
  {
    lesson_id: 111,
    course_id: 3,
    topic_id: 11,
    title: 'Chapter 11: Fundamentals of Risk and Return (CAPM, Beta & Ratios)',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 45,
    is_completed: false,
    order_index: 11
  },
  {
    lesson_id: 112,
    course_id: 3,
    topic_id: 12,
    title: 'Chapter 12: Qualities of a Good Research Report',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 30,
    is_completed: false,
    order_index: 12
  },
  {
    lesson_id: 113,
    course_id: 3,
    topic_id: 13,
    title: 'Chapter 13: Legal & Regulatory Framework (SEBI RA Regs 2014)',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 50,
    is_completed: false,
    order_index: 13
  },
  {
    lesson_id: 114,
    course_id: 3,
    topic_id: 14,
    title: 'Chapter 14: Mutual Funds, Passive Funds & Alternative Investments',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 30,
    is_completed: false,
    order_index: 14
  },
  {
    lesson_id: 115,
    course_id: 3,
    topic_id: 15,
    title: 'Chapter 15: Derivatives Markets & Institutional Risk Hedging',
    resource_links: ['/assets/nism-series-xv-workbook-feb-2026.pdf'],
    estimated_mins: 35,
    is_completed: false,
    order_index: 15
  }
];

// 33. LESSON_CONTENT
export const MOCK_LESSON_CONTENTS: LessonContent[] = [
  {
    content_id: 1,
    lesson_id: 2,
    content_type: 'MARKDOWN_TEXT',
    content_url: 'https://financex.academy/content/lesson-2.md',
    raw_body: `## Option Greeks: Delta, Gamma, Theta & Vega

In options trading, **Greeks** measure the sensitivity of an option's price to various underlying parameters such as the spot price, time decay, volatility, and interest rates.

### 1. Delta (Δ) — Price Sensitivity
Delta measures the expected change in option premium for every **₹1 change** in the underlying stock price.
- **Call Option Delta:** Ranges from **0.0 to +1.0**
- **Put Option Delta:** Ranges from **-1.0 to 0.0**
- *At-The-Money (ATM) options typically have a Delta near ±0.50.*

### 2. Gamma (Γ) — Acceleration of Delta
Gamma measures the rate of change of Delta per ₹1 move in the underlying asset. Think of Delta as speed and Gamma as acceleration.
- Highest for ATM options near expiry.
- High Gamma implies high risk for option sellers as Delta shifts rapidly.

### 3. Theta (Θ) — Time Decay
Theta represents the amount by which the option price declines each day as expiration approaches (time decay).
- Option buyers **lose** Theta each day (*negative Theta*).
- Option sellers **benefit** from Theta decay (*positive Theta*).

### 4. Vega (ν) — Volatility Sensitivity
Vega measures the change in option price for a **1% change in Implied Volatility (IV)**.
- Both Call and Put buyers are Long Vega (profit when volatility surges).`,
    key_takeaways: [
      'Delta measures direction and probability of expiring in-the-money.',
      'Gamma is the curvature of option payoff and peaks at ATM strikes.',
      'Theta decay accelerates exponentially during the final 10 days before expiry.',
      'Option sellers capture Theta decay while accepting tail Gamma risk.'
    ],
    formulas: [
      {
        label: 'Delta Formula (Black-Scholes)',
        formula: 'Δ_{Call} = N(d_1), \\quad Δ_{Put} = N(d_1) - 1',
        explanation: 'Where N(d1) is the standard normal cumulative distribution function.'
      },
      {
        label: 'Theta Daily Decay Approximation',
        formula: 'Θ \\approx -\\frac{S_0 \\cdot σ \\cdot n(d_1)}{2\\sqrt{T}} - r K e^{-rT} N(d_2)',
        explanation: 'Negative derivative with respect to time to maturity T.'
      }
    ]
  },
  {
    content_id: 2,
    lesson_id: 1,
    content_type: 'VIDEO',
    content_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    raw_body: `## Cost of Carry Model & Arbitrage Equilibrium
When pricing a futures contract on an underlying equity or index, the theoretical price is governed by the **Cost of Carry Model**.

### Core Equation:
$$F = S \\times e^{(r + s - q) \\times T}$$

- **S:** Current Spot Price
- **r:** Risk-free interest rate (e.g. RBI 91-day T-Bill yield)
- **s:** Storage costs (for commodities)
- **q:** Dividend yield expected during period T
- **T:** Time to maturity in years

### Arbitrage Conditions:
1. **If Futures Price > Theoretical Fair Value:** Cash and Carry Arbitrage (Buy Spot, Sell Futures, Borrow Cash).
2. **If Futures Price < Theoretical Fair Value:** Reverse Cash and Carry Arbitrage (Sell Spot, Buy Futures, Invest Cash).`,
    key_takeaways: [
      'Futures price equals Spot price compounded at the cost of financing minus dividend yield.',
      'Basis is defined as Spot Price minus Futures Price.',
      'Contango occurs when Futures > Spot; Backwardation occurs when Spot > Futures.'
    ]
  },
  {
    content_id: 3,
    lesson_id: 3,
    content_type: 'MARKDOWN_TEXT',
    content_url: 'https://financex.academy/content/lesson-3.md',
    raw_body: `## Multi-Leg Option Strategies & Volatility Architectures

Professional option traders combine multiple strikes and expiries to shape risk-reward profiles tailored to specific volatility regimes.

### 1. Bull Call Spread (Defined Risk Debit Strategy)
- **Construction:** Buy Lower Strike Call ($K_1$) + Sell Higher Strike Call ($K_2$).
- **Net Debit:** $\\text{Premium}(K_1) - \\text{Premium}(K_2)$.
- **Max Profit:** $(K_2 - K_1) - \\text{Net Debit}$.
- **Breakeven:** $K_1 + \\text{Net Debit}$.

### 2. Market-Neutral Iron Condor (Range Bound Volatility Harvest)
- **Construction:** Out-of-The-Money (OTM) Bull Put Spread + OTM Bear Call Spread.
- **Max Profit:** Total Net Credit received.
- **Max Loss:** Wing Width - Net Credit.

### 3. Historical Case Study: The 2021 GameStop (GME) Gamma Squeeze
In January 2021, retail traders aggressively purchased Deep OTM Call Options on GameStop (GME). Market makers who sold these Calls were forced to dynamically delta-hedge by buying underlying shares in the spot market ($S$). As the stock surged, Call Delta ($\Delta$) rapidly increased toward 1.0 (driven by extreme **Gamma**), triggering a feedback loop forcing billions of dollars of institutional spot buying.`,
    key_takeaways: [
      'Bull Spreads cap maximum risk and eliminate tail assignment liability.',
      'Iron Condors profit from theta decay in range-bound low-IV environments.',
      'Gamma squeezes occur when market maker delta-hedging overwhelms spot market liquidity.'
    ],
    formulas: [
      {
        label: 'Iron Condor Upper Breakeven',
        formula: '\\text{BE}_{upper} = \\text{Short Call Strike} + \\text{Net Credit}',
        explanation: 'The upper spot price beyond which the short call spread incurs loss.'
      },
      {
        label: 'Iron Condor Lower Breakeven',
        formula: '\\text{BE}_{lower} = \\text{Short Put Strike} - \\text{Net Credit}',
        explanation: 'The lower spot price below which the short put spread incurs loss.'
      }
    ]
  },
  {
    content_id: 4,
    lesson_id: 4,
    content_type: 'MARKDOWN_TEXT',
    content_url: 'https://financex.academy/content/lesson-4.md',
    raw_body: `## Regulatory Risk Safeguards & SEBI Peak Margin Framework

Following SEBI circular \`SEBI/HO/MRD/DP/CIR/P/2020/145\`, Indian equity derivatives require 100% upfront collection of total margins across all client accounts.

### 1. SPAN Margin (Standard Portfolio Analysis of Risk)
Calculated by the Clearing Corporation (NSE Clearing Ltd / ICCL) using 16 simulated market scenarios measuring worst-case one-day portfolio loss based on price volatility shifts.

### 2. Extreme Loss Margin (ELM) & Exposure Margin
An additional buffer (typically 3.5% for equity index futures and 5% for single-stock futures) to absorb black-swan tail-risk gap openings.

### 3. Historical Case Study: 1992 Harshad Mehta Securities Scam
In 1992, brokers exploited settlement delays in inter-bank government securities trading using fake **Bank Receipts (BRs)** to siphon over ₹4,000 Crore into equity speculation, driving ACC Cement from ₹200 to ₹9,000. This systemic failure led to the creation of **SEBI statutory powers (SEBI Act 1992)**, electronic depositories (NSDL/CDSL), T+2 rolling settlement, and real-time electronic order matching.`,
    key_takeaways: [
      'SPAN margin computes risk across 16 scenarios, adjusting for cross-margin correlations.',
      '100% peak margin rules prevent brokers from offering unfunded intra-day leverage.',
      'The 1992 scam drove India to transition from physical paper certificates to electronic screen trading.'
    ]
  },
  {
    content_id: 5,
    lesson_id: 5,
    content_type: 'MARKDOWN_TEXT',
    content_url: 'https://financex.academy/content/lesson-5.md',
    raw_body: `## Bond Pricing Mechanics & Yield to Maturity (YTM)

A fixed-income bond represents a series of contractual future cash flows discounted back to the present at the market discount rate ($y$).

### Core Valuation Equation:
$$P_0 = \\sum_{t=1}^{n} \\frac{C}{(1 + y)^t} + \\frac{F}{(1 + y)^n}$$

Where:
- $P_0$: Current dirty market price of the bond
- $C$: Coupon payment per period ($F \\times c / m$)
- $F$: Par / Face Value at maturity (typically ₹1,000 or ₹100)
- $y$: Yield to Maturity (YTM) per compounding period
- $n$: Total number of compounding periods ($Years \\times m$)

### Historical Case Study: April 20, 2020 Negative Crude Oil Futures (-$37.63/bbl)
On April 20, 2020, WTI May 2020 crude futures plunged to **-$37.63 per barrel** on the NYMEX/MCX. Demand destruction from COVID-19 lockdowns filled Cushing storage facilities to maximum capacity. Financial ETF longs unable to take physical delivery were forced into panic liquidation at any price to avoid physical delivery default.`,
    key_takeaways: [
      'Bond prices move inversely to market interest rates (yields).',
      'When Coupon Rate > YTM, bond trades at a Premium (Price > Face Value).',
      'When Coupon Rate < YTM, bond trades at a Discount (Price < Face Value).'
    ]
  },
  {
    content_id: 6,
    lesson_id: 6,
    content_type: 'MARKDOWN_TEXT',
    content_url: 'https://financex.academy/content/lesson-6.md',
    raw_body: `## Macaulay Duration, Modified Duration & Convexity Hedging

While maturity measures time until final principal repayment, **Duration** measures the weighted average time until all cash flows are received.

### 1. Macaulay Duration:
$$D_{mac} = \\frac{\\sum_{t=1}^n \\frac{t \\cdot CF_t}{(1 + y)^t}}{P_0}$$

### 2. Modified Duration & Interest Rate Sensitivity:
$$D_{mod} = \\frac{D_{mac}}{1 + y/m}, \\quad \\frac{\\Delta P}{P} \\approx -D_{mod} \\times \\Delta y$$

### 3. Convexity Adjustment:
$$\\frac{\\Delta P}{P} \\approx -D_{mod} \\Delta y + \\frac{1}{2} \\text{Convexity} \\times (\\Delta y)^2$$

### Historical Case Study: The 2008 Lehman Brothers CDS & Collateral Spiral
In September 2008, Lehman Brothers held over $600 billion in assets funded with overnight repo debt against subprime mortgage-backed securities (MBS). When credit rating agencies downgraded MBS tranches, collateral haircuts surged, triggering liquidity failure and bankruptcy.`,
    key_takeaways: [
      'Modified Duration directly estimates % price change per 100 bps shift in yield.',
      'Convexity is always positive for non-callable bonds, buffering losses when yields rise.',
      'Immunization requires matching asset duration to liability duration.'
    ]
  }
];

// 34. LESSON_RESOURCE
export const MOCK_LESSON_RESOURCES: LessonResource[] = [
  { resource_id: 1, lesson_id: 2, resource_title: 'Option Greeks Cheat Sheet (PDF)', resource_url: 'https://financex.academy/resources/option-greeks-cheatsheet.pdf', resource_type: 'PDF_CHEAT_SHEET' },
  { resource_id: 2, lesson_id: 2, resource_title: 'Black-Scholes-Merton Calculator (.xlsx)', resource_url: 'https://financex.academy/models/black-scholes.xlsx', resource_type: 'EXCEL_MODEL' },
  { resource_id: 3, lesson_id: 1, resource_title: 'SEBI Circular on Derivatives Risk Margins', resource_url: 'https://sebi.gov.in/legal/circulars/risk-margins.pdf', resource_type: 'SEBI_CIRCULAR' },
  { resource_id: 4, lesson_id: 5, resource_title: 'Yield to Maturity Dynamic Simulator Sheet', resource_url: 'https://financex.academy/resources/ytm-calculator.xlsx', resource_type: 'EXCEL_MODEL' }
];

// 10. QUIZ (15 Official NISM Series XV Mastery Quizzes + 3 Advanced Derivatives Quizzes)
export const MOCK_QUIZZES: Quiz[] = [
  { quiz_id: 101, topic_id: 1, title: 'Chapter 1: Intro to Research Analyst Profession', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 102, topic_id: 2, title: 'Chapter 2: Securities Market Structure & Intermediaries', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 103, topic_id: 3, title: 'Chapter 3: Equity & Debt Market Terminology', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 104, topic_id: 4, title: 'Chapter 4: Fundamentals of Research & Biases', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 105, topic_id: 5, title: 'Chapter 5: Economic Analysis & Monetary Policy', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 106, topic_id: 6, title: 'Chapter 6: Industry Analysis & Porter 5 Forces', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 107, topic_id: 7, title: 'Chapter 7: Company Analysis – Business & Governance', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 108, topic_id: 8, title: 'Chapter 8: Financial Analysis & DuPont ROE', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 109, topic_id: 9, title: 'Chapter 9: Corporate Actions & Capital Structure', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 110, topic_id: 10, title: 'Chapter 10: Valuation Principles (DCF, FCFF & Multiples)', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 111, topic_id: 11, title: 'Chapter 11: Fundamental Analysis of Commodities', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 112, topic_id: 12, title: 'Chapter 12: Risk & Return (Beta, Sharpe & Alpha)', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 113, topic_id: 13, title: 'Chapter 13: Qualities of a Good Research Report', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 114, topic_id: 14, title: 'Chapter 14: Legal & Regulatory Environment (SEBI RA & PIT)', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 115, topic_id: 15, title: 'Chapter 15: Technical Analysis & Candlestick Indicators', passing_score_percent: 60, time_limit_mins: 15, total_questions: 5 },
  { quiz_id: 1, topic_id: 17, title: 'Option Greeks & Volatility Mastery Quiz', passing_score_percent: 75, time_limit_mins: 10, total_questions: 5 },
  { quiz_id: 2, topic_id: 16, title: 'Futures Pricing & Cash-and-Carry Quiz', passing_score_percent: 70, time_limit_mins: 8, total_questions: 4 },
  { quiz_id: 3, topic_id: 18, title: 'Bond Duration & Yield Curve Checkpoint', passing_score_percent: 80, time_limit_mins: 12, total_questions: 5 }
];

// 30. QUESTION
export const MOCK_QUESTIONS: Question[] = [
  // Topic 3: Option Greeks & Strategies
  {
    question_id: 1,
    topic_id: 3,
    question_text: 'If a Call option has a Delta of 0.60 and the underlying stock price increases by ₹10, what is the theoretical expected change in the option premium?',
    option_a: 'Increases by ₹10.00',
    option_b: 'Increases by ₹6.00',
    option_c: 'Decreases by ₹6.00',
    option_d: 'Increases by ₹0.60',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'Delta (Δ) = Change in Option Price / Change in Stock Price. Therefore, Change in Option Price = 0.60 × ₹10 = +₹6.00.'
  },
  {
    question_id: 2,
    topic_id: 3,
    question_text: 'Which Option Greek reaches its maximum absolute value for At-The-Money (ATM) options approaching expiration?',
    option_a: 'Delta',
    option_b: 'Vega',
    option_c: 'Gamma',
    option_d: 'Rho',
    correct_option: 'C',
    difficulty: 'MEDIUM',
    explanation: 'Gamma represents the rate of change of Delta. For ATM options close to expiry, a tiny move in spot price switches the option rapidly between ITM and OTM, causing Gamma to spike.'
  },
  {
    question_id: 3,
    topic_id: 3,
    question_text: 'An investor buys a Nifty 24,000 Call and sells a Nifty 24,500 Call for the same expiry month. What is this multi-leg strategy called?',
    option_a: 'Bear Put Spread',
    option_b: 'Bull Call Spread',
    option_c: 'Long Straddle',
    option_d: 'Iron Condor',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'A Bull Call Spread consists of buying an In-The-Money/At-The-Money Call and financing part of the premium by selling a higher Strike Out-Of-The-Money Call.'
  },
  {
    question_id: 4,
    topic_id: 3,
    question_text: 'What happens to the Vega of an option as time to expiration approaches zero (T → 0)?',
    option_a: 'Vega increases exponentially',
    option_b: 'Vega approaches zero',
    option_c: 'Vega remains constant at 1.0',
    option_d: 'Vega equals the Delta',
    correct_option: 'B',
    difficulty: 'MEDIUM',
    explanation: 'With almost no time remaining, changes in implied volatility have little effect on the option value because the final payoff is determined immediately by the spot price.'
  },
  {
    question_id: 5,
    topic_id: 3,
    question_text: 'Which party in an option contract always has negative Theta (suffers from time decay)?',
    option_a: 'Option Seller / Writer',
    option_b: 'Option Buyer / Holder',
    option_c: 'Arbitrageur',
    option_d: 'Market Maker',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'Option buyers pay a premium that contains extrinsic (time) value. Each passing day erodes this time value, making Theta negative for long option positions.'
  },
  {
    question_id: 9,
    topic_id: 3,
    question_text: 'An institution is Long 10,000 shares of XYZ stock (Delta = +1.0 each) and wants to construct a Delta-neutral hedge using XYZ ATM Call options (Delta = +0.50 each). How many Call options must they sell?',
    option_a: 'Sell 5,000 Calls',
    option_b: 'Sell 10,000 Calls',
    option_c: 'Sell 20,000 Calls',
    option_d: 'Buy 20,000 Calls',
    correct_option: 'C',
    difficulty: 'HARD',
    explanation: 'Total Stock Delta = +10,000. To neutralize, required Call Delta = -10,000. Since each short Call provides -0.50 Delta, Short Calls needed = 10,000 / 0.50 = 20,000 contracts.'
  },

  // Topic 2: Equity Derivatives & Futures Pricing
  {
    question_id: 8,
    topic_id: 2,
    question_text: 'If the Spot price of Reliance is ₹3,000, risk-free interest rate is 7% p.a., and no dividends are expected for 3 months (0.25 years), what is the theoretical futures price?',
    option_a: '₹3,000.00',
    option_b: '₹3,052.50',
    option_c: '₹2,947.50',
    option_d: '₹3,210.00',
    correct_option: 'B',
    difficulty: 'HARD',
    explanation: 'Fair Value = S × (1 + r × t) = 3000 × (1 + 0.07 × 0.25) = 3000 × (1 + 0.0175) = ₹3,052.50.'
  },
  {
    question_id: 10,
    topic_id: 2,
    question_text: 'What defines a market in "Contango"?',
    option_a: 'Futures Price is lower than Spot Price',
    option_b: 'Futures Price is higher than Spot Price',
    option_c: 'Spot Price equals Strike Price',
    option_d: 'Options Implied Volatility is zero',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'Contango describes a market condition where the Futures price of a commodity or security is higher than the current spot price, reflecting positive cost of carry.'
  },
  {
    question_id: 11,
    topic_id: 2,
    question_text: 'A trader observes Spot at ₹1,000 and 1-month Futures trading at ₹1,030, while fair value is ₹1,008. What arbitrage strategy should they execute?',
    option_a: 'Reverse Cash-and-Carry (Sell Spot, Buy Futures)',
    option_b: 'Cash-and-Carry Arbitrage (Buy Spot, Sell Futures)',
    option_c: 'Long Straddle',
    option_d: 'Covered Call',
    correct_option: 'B',
    difficulty: 'MEDIUM',
    explanation: 'When Futures trade above theoretical fair value (₹1,030 > ₹1,008), the trader executes Cash-and-Carry: buy undervalued spot, sell overpriced futures, lock in riskless profit.'
  },

  // Topic 4: Fixed Income & Yield Curve
  {
    question_id: 6,
    topic_id: 4,
    question_text: 'If interest rates in the economy rise by 100 basis points, what happens to the market price of an existing fixed-rate 10-year Government Bond?',
    option_a: 'Bond price rises',
    option_b: 'Bond price falls',
    option_c: 'Bond price stays identical',
    option_d: 'Coupon rate decreases',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'Bond prices and interest rates share an inverse relationship. When prevailing market yields increase, existing lower-coupon bonds become less attractive and fall in price until their yield matches the market.'
  },
  {
    question_id: 12,
    topic_id: 4,
    question_text: 'A bond has a Macaulay Duration of 6.30 years and a YTM of 5.0% compounded annually. What is its Modified Duration?',
    option_a: '6.30 years',
    option_b: '6.00 years',
    option_c: '6.61 years',
    option_d: '5.98 years',
    correct_option: 'B',
    difficulty: 'MEDIUM',
    explanation: 'Modified Duration = Macaulay Duration / (1 + y) = 6.30 / (1 + 0.05) = 6.30 / 1.05 = 6.00 years.'
  },
  {
    question_id: 13,
    topic_id: 4,
    question_text: 'If a portfolio manager has a Modified Duration of 5.0 years on a ₹10 Crore portfolio and yields increase by 50 basis points (+0.50%), what is the approximate percentage change in portfolio value?',
    option_a: '+2.5%',
    option_b: '-2.5%',
    option_c: '-5.0%',
    option_d: '+1.25%',
    correct_option: 'B',
    difficulty: 'HARD',
    explanation: 'ΔP/P ≈ -Modified Duration × Δy = -5.0 × (+0.0050) = -0.025 = -2.5%.'
  },

  // Topic 5: SEBI Regulations & Risk Framework
  {
    question_id: 7,
    topic_id: 5,
    question_text: 'Under SEBI regulations, what is the mandatory cooling-off period required before an entity with unpublished price-sensitive information (UPSI) can execute trades?',
    option_a: 'Trading window is closed until 48 hours post-disclosure',
    option_b: '24 hours post-disclosure',
    option_c: '7 days',
    option_d: 'No cooling off is required if documented',
    correct_option: 'A',
    difficulty: 'HARD',
    explanation: 'Under SEBI (Prohibition of Insider Trading) Regulations, the trading window remains closed until 48 hours after the unpublished price sensitive information becomes generally available to the public.'
  },
  {
    question_id: 14,
    topic_id: 5,
    question_text: 'Which regulatory committee system in Indian exchanges computes real-time portfolio risk across 16 simulated market scenarios for derivatives?',
    option_a: 'VaR 99%',
    option_b: 'SPAN Margin System',
    option_c: 'Circuit Filter Engine',
    option_d: 'Repo Window',
    correct_option: 'B',
    difficulty: 'MEDIUM',
    explanation: 'Standard Portfolio Analysis of Risk (SPAN) computes risk across 16 scenarios simulating price shifts and volatility expansions to determine minimum upfront margin.'
  },

  // Topic 1: Introduction to Securities Markets
  {
    question_id: 15,
    topic_id: 1,
    question_text: 'What is the primary role of a Depository (e.g. NSDL, CDSL) in the Indian capital market?',
    option_a: 'Provide margin loans to retail traders',
    option_b: 'Hold securities in electronic (dematerialized) book-entry form',
    option_c: 'Determine the daily opening price of IPOs',
    option_d: 'Underwrite corporate bond issues',
    correct_option: 'B',
    difficulty: 'EASY',
    explanation: 'Depositories enable paperless holding and transfer of securities in electronic demat accounts, eliminating physical share certificates and forgery risks.'
  },
  {
    question_id: 16,
    topic_id: 1,
    question_text: 'What constitutes the settlement cycle for Indian equity cash transactions on NSE and BSE?',
    option_a: 'T+3 Rolling Settlement',
    option_b: 'T+2 Rolling Settlement',
    option_c: 'T+1 Rolling Settlement',
    option_d: 'T+0 for all institutional blocks',
    correct_option: 'C',
    difficulty: 'MEDIUM',
    explanation: 'India transitioned to the complete T+1 rolling settlement cycle across all listed equities, where trades settle on the next business day.'
  }
];

// Phase 28: Practice Lab Educational Scenarios with Verified Pedagogical Criteria
export const MOCK_PRACTICE_LAB_SCENARIOS: any[] = [
  {
    scenario_id: 'sc-delta-hedge',
    title: 'Option Greek Neutrality: Constructing a Delta-Neutral Straddle',
    topic_id: 3,
    topic_name: 'Option Greeks & Volatility Sensitivity',
    difficulty: 'INTERMEDIATE',
    objective: 'Demonstrate options delta-neutral risk management by executing balanced Call + Put legs or stock hedging.',
    required_action: 'DELTA_HEDGE',
    instruction: 'Select NIFTY options and establish a market-neutral posture with net Delta within ±0.15.',
    target_instrument_symbols: ['NIFTY-OPT', 'TCS', 'RELIANCE'],
    xp_reward: 250,
    mastery_contribution_pct: 15
  },
  {
    scenario_id: 'sc-cash-carry',
    title: 'Futures Arbitrage: Cash-and-Carry Basis Capture',
    topic_id: 2,
    topic_name: 'Equity Derivatives & Futures Pricing',
    difficulty: 'ADVANCED',
    objective: 'Exploit a positive basis divergence by purchasing spot equity and selling corresponding 1-month futures.',
    required_action: 'CASH_CARRY_ARBITRAGE',
    instruction: 'Identify a stock with futures trading above cost-of-carry fair value and execute simultaneous spot buy + futures sell.',
    target_instrument_symbols: ['RELIANCE', 'INFY', 'HDFCBANK'],
    xp_reward: 300,
    mastery_contribution_pct: 20
  },
  {
    scenario_id: 'sc-duration-hedge',
    title: 'Fixed Income Risk: Macaulay Duration Immunization',
    topic_id: 4,
    topic_name: 'Fixed Income & Debt Securities Analysis',
    difficulty: 'INTERMEDIATE',
    objective: 'Protect a bond portfolio against 100 bps interest rate hikes by matching portfolio duration to target horizon.',
    required_action: 'DURATION_IMMUNIZATION',
    instruction: 'Allocate capital between short-duration T-Bills and 10Y G-Secs to achieve a target portfolio Modified Duration of 3.5 years.',
    target_instrument_symbols: ['GS-10Y', 'TBILL-91D', 'CORP-AAA'],
    xp_reward: 200,
    mastery_contribution_pct: 15
  },
  {
    scenario_id: 'sc-diversification',
    title: 'Modern Portfolio Theory: Efficient Frontier Construction',
    topic_id: 1,
    topic_name: 'Introduction to Securities Markets',
    difficulty: 'BEGINNER',
    objective: 'Build a diversified 4-asset portfolio across uncorrelated sectors to reduce unsystematic variance.',
    required_action: 'PORTFOLIO_DIVERSIFICATION',
    instruction: 'Construct a multi-sector portfolio maintaining total Beta below 1.10.',
    target_instrument_symbols: ['NIFTY-50', 'HDFCBANK', 'TCS', 'ITC'],
    xp_reward: 150,
    mastery_contribution_pct: 10
  }
];

// 31. QUIZ_QUESTION
export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  { quiz_id: 1, question_id: 1, question_order: 1, mark: 2 },
  { quiz_id: 1, question_id: 2, question_order: 2, mark: 2 },
  { quiz_id: 1, question_id: 3, question_order: 3, mark: 2 },
  { quiz_id: 1, question_id: 4, question_order: 4, mark: 2 },
  { quiz_id: 1, question_id: 5, question_order: 5, mark: 2 }
];

// 11. MOCK_EXAM
export const MOCK_EXAMS: MockExam[] = [
  {
    exam_id: 1,
    course_id: 1,
    title: 'NISM Series VIII: Equity Derivatives Full Mock Examination',
    duration_minutes: 120,
    total_marks: 100,
    passing_percentage: 60,
    negative_marking: 0.25,
    exam_code: 'NISM-VIII-2026-MOCK1'
  },
  {
    exam_id: 2,
    course_id: 3,
    title: 'NISM Series XV: Research Analyst Full Mock Examination',
    duration_minutes: 120,
    total_marks: 100,
    passing_percentage: 60,
    negative_marking: 0.25,
    exam_code: 'NISM-XV-2026-MOCK1'
  },
  {
    exam_id: 3,
    course_id: 2,
    title: 'NCFM Financial Markets & Fixed Income Diagnostic',
    duration_minutes: 90,
    total_marks: 75,
    passing_percentage: 60,
    negative_marking: 0.25,
    exam_code: 'NCFM-FM-2026'
  }
];

// 32. MOCK_EXAM_QUESTION
export const MOCK_EXAM_QUESTIONS: MockExamQuestion[] = [
  { quiz_id: 1, question_id: 1, question_order: 1, mark: 1 },
  { quiz_id: 1, question_id: 2, question_order: 2, mark: 1 },
  { quiz_id: 1, question_id: 3, question_order: 3, mark: 1 },
  { quiz_id: 1, question_id: 4, question_order: 4, mark: 1 },
  { quiz_id: 1, question_id: 5, question_order: 5, mark: 1 },
  { quiz_id: 1, question_id: 6, question_order: 6, mark: 1 },
  { quiz_id: 1, question_id: 7, question_order: 7, mark: 1 },
  { quiz_id: 1, question_id: 8, question_order: 8, mark: 1 }
];

// 12. CERTIFICATION
export const MOCK_CERTIFICATIONS: Certification[] = [
  {
    certification_id: 1,
    certification_name: 'NISM-Series-VIII: Equity Derivatives Certification',
    exam_id: 1,
    governing_body: 'NISM',
    validity_years: 3,
    prerequisites: 'Basic understanding of Indian financial markets',
    badge_icon: 'Award',
    summary: 'The benchmark regulatory certification for derivative dealers, risk managers, and equity strategists across Indian stock exchanges.'
  },
  {
    certification_id: 2,
    certification_name: 'NISM-Series-XV: Research Analyst Certification',
    exam_id: 2,
    governing_body: 'NISM',
    validity_years: 3,
    prerequisites: 'Financial statement analysis & valuation principles',
    badge_icon: 'FileText',
    summary: 'Mandatory certification required under SEBI (Research Analysts) Regulations, 2014 for equity research professionals.'
  },
  {
    certification_id: 3,
    certification_name: 'NCFM: Debt & Fixed Income Markets Module',
    exam_id: 3,
    governing_body: 'NCFM',
    validity_years: 5,
    prerequisites: 'Bond math & interest rate fundamentals',
    badge_icon: 'Percent',
    summary: 'National Stock Exchange certification testing practical competence in sovereign securities, money market instruments, and credit spreads.'
  },
  {
    certification_id: 4,
    certification_name: 'FinanceX Certified Financial Strategist (FCFS)',
    exam_id: 1,
    governing_body: 'FINANCEX ACADEMY',
    validity_years: 10,
    prerequisites: 'Completion of 3 Core Modules + Virtual Trading Sandbox Milestone',
    badge_icon: 'GraduationCap',
    summary: 'Distinguished industry badge validating practical market simulation prowess, risk governance, and regulatory mastery.'
  }
];

// 13. CERTIFICATE
export const MOCK_CERTIFICATES: Certificate[] = [
  {
    certificate_id: 1,
    user_id: 101,
    certification_id: 4,
    certificate_number: 'FX-2026-NISM8-948217',
    issued_at: '2026-08-01',
    verification_url: 'https://financex.academy/verify/FX-2026-NISM8-948217',
    recipient_name: 'Kannan M',
    score_achieved: 88.5
  }
];

// 14. AI_CONVERSATION
export const MOCK_AI_CONVERSATIONS: AIConversation[] = [
  {
    conversation_id: 1,
    user_id: 101,
    topic_id: 3,
    title: 'Demystifying Delta Neutral Hedging & Gamma Scalping',
    created_at: '2026-08-16 14:32'
  },
  {
    conversation_id: 2,
    user_id: 101,
    topic_id: 4,
    title: 'Why Bond Prices Drop When Central Banks Hike Repo Rates',
    created_at: '2026-08-15 09:15'
  }
];

// 15. AI_MESSAGE
export const MOCK_AI_MESSAGES: AIMessage[] = [
  {
    message_id: 1,
    conversation_id: 1,
    sender_type: 'USER',
    content: 'Can you explain how a market maker maintains a delta-neutral portfolio when holding short call options?',
    created_at: '2026-08-16 14:32'
  },
  {
    message_id: 2,
    conversation_id: 1,
    sender_type: 'AI',
    content: `Great question, Kannan! Here is the step-by-step mechanism of **Delta Neutral Hedging**:

1. **The Initial Position:**
   - When a market maker sells **10 Call Options** (each representing 100 shares) with a Delta of **+0.50**, their position delta is:
   $$\\text{Position Delta} = -10 \\times 100 \\times 0.50 = -500 \\text{ shares}$$

2. **The Hedge Action:**
   - To neutralize this risk, they immediately **buy 500 shares** of the underlying spot stock ($+500$ delta).
   - Net Delta = $-500 + 500 = 0$ (Delta Neutral).

3. **Dynamic Rebalancing (Gamma Risk):**
   - If the stock price rises, the Delta of the short call increases from 0.50 to 0.65.
   - Now position delta is $-650$, so they must buy another **150 shares** to re-neutralize!`,
    created_at: '2026-08-16 14:33',
    suggested_actions: [
      'Show me a practice numerical problem on Delta Hedging',
      'Explain Gamma Scalping in simple terms',
      'How does Theta affect this delta hedge over time?'
    ],
    formula: '\\text{Net Delta} = \\sum (\\Delta_i \\times \\text{Quantity}_i) = 0'
  }
];

// 16. AI_RECOMMENDATION
export const MOCK_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    recommandation_id: 1,
    user_id: 101,
    topic_id: 3,
    recommandation_type: 'REVIEW_WEAK_CONCEPT',
    reason: 'You spent extra time on question #2 regarding Gamma sensitivity for ATM options.',
    action_label: 'Review Option Greeks Visualizer (5 mins)',
    target_url: '/learn/lesson/2',
    priority: 'HIGH'
  },
  {
    recommandation_id: 2,
    user_id: 101,
    topic_id: 2,
    recommandation_type: 'PRACTICE_SIMULATION',
    reason: 'Practice Lab: Test your understanding of Cash-and-Carry Arbitrage on Reliance Futures.',
    action_label: 'Execute Virtual Futures Arbitrage',
    target_url: '/practice-lab',
    priority: 'MEDIUM'
  },
  {
    recommandation_id: 3,
    user_id: 101,
    topic_id: 5,
    recommandation_type: 'TAKE_MOCK_EXAM',
    reason: 'You are 68% prepared for NISM-Series-VIII. Taking a full mock exam now will boost exam retention.',
    action_label: 'Start 120-min NISM Mock Exam #1',
    target_url: '/mock-exams/1',
    priority: 'HIGH'
  }
];

// 17. STUDY_PLAN
export const MOCK_STUDY_PLANS: StudyPlan[] = [
  {
    study_plan_id: 1,
    user_id: 101,
    certification_id: 1,
    status: 'ACTIVE',
    start_date: '2026-08-01',
    target_exam_date: '2026-09-15',
    daily_commitment_mins: 45,
    completion_rate_percent: 68
  }
];

// 18. STUDY_PLAN_ITEM
export const MOCK_STUDY_PLAN_ITEMS: StudyPlanItem[] = [
  { item_id: 1, study_plan_id: 1, lesson_id: 1, quiz_id: null, exam_id: null, sequence_no: 1, is_completed: true, scheduled_day: 1, title: 'Futures Contracts & Cost of Carry', item_type: 'LESSON' },
  { item_id: 2, study_plan_id: 1, lesson_id: 2, quiz_id: null, exam_id: null, sequence_no: 2, is_completed: true, scheduled_day: 3, title: 'Option Greeks: Delta & Gamma', item_type: 'LESSON' },
  { item_id: 3, study_plan_id: 1, lesson_id: null, quiz_id: 1, exam_id: null, sequence_no: 3, is_completed: true, scheduled_day: 5, title: 'Option Greeks Checkpoint Quiz', item_type: 'QUIZ' },
  { item_id: 4, study_plan_id: 1, lesson_id: 3, quiz_id: null, exam_id: null, sequence_no: 4, is_completed: false, scheduled_day: 8, title: 'Multi-Leg Options Strategies', item_type: 'LESSON' },
  { item_id: 5, study_plan_id: 1, lesson_id: 4, quiz_id: null, exam_id: null, sequence_no: 5, is_completed: false, scheduled_day: 11, title: 'SEBI Risk Regulations & SPAN Margining', item_type: 'LESSON' },
  { item_id: 6, study_plan_id: 1, lesson_id: null, quiz_id: null, exam_id: 1, sequence_no: 6, is_completed: false, scheduled_day: 14, title: 'Full Length NISM Series VIII Mock Exam #1', item_type: 'MOCK_EXAM' }
];

// 21. TAG
export const MOCK_TAGS: Tag[] = [
  { tag_id: 1, tag_name: 'NISM-Series-VIII' },
  { tag_id: 2, tag_name: 'Options-Trading' },
  { tag_id: 3, tag_name: 'Fixed-Income' },
  { tag_id: 4, tag_name: 'SEBI-Regulations' },
  { tag_id: 5, tag_name: 'Arbitrage' }
];

// 19. DISCUSSION_THREAD
export const MOCK_DISCUSSION_THREADS: DiscussionThread[] = [
  {
    thread_id: 1,
    user_id: 101,
    topic_id: 3,
    title: 'Why is Vega highest for ATM options with long expiries compared to short expiries?',
    tags: ['Options-Trading', 'NISM-Series-VIII'],
    content: 'While studying Black-Scholes formula, I noticed that Vega increases with square root of time (sqrt(T)). Can someone intuitively explain why longer-dated options are much more sensitive to IV changes than weekly options?',
    created_at: '2026-08-16 11:20',
    upvotes_count: 24,
    replies_count: 5,
    is_pinned: true,
    is_solved: true
  },
  {
    thread_id: 2,
    user_id: 102,
    topic_id: 4,
    title: 'Macaulay Duration vs Modified Duration in NISM exam calculations',
    tags: ['Fixed-Income'],
    content: 'Do we always divide Macaulay Duration by (1 + YTM/m) for Modified Duration in NISM exam questions? Is semi-annual compounding the standard default for GOI dated securities?',
    created_at: '2026-08-15 16:45',
    upvotes_count: 15,
    replies_count: 3,
    is_pinned: false,
    is_solved: true
  }
];

// 20. DISCUSSION_REPLY
export const MOCK_DISCUSSION_REPLIES: DiscussionReply[] = [
  {
    reply_id: 1,
    thread_id: 1,
    user_id: 103,
    content: 'Think of implied volatility as the speed of a car and time as the road distance. Over a 1-day road, higher speed changes the final location very little. Over a 1-year journey, a 5% increase in volatility expands the range of possible final stock prices dramatically! Hence, Vega is naturally proportional to sqrt(T).',
    created_at: '2026-08-16 12:05',
    upvotes: 18,
    is_accepted_answer: true
  }
];

// 22. DISCUSSION_THREAD_TAG
export const MOCK_DISCUSSION_THREAD_TAGS: DiscussionThreadTag[] = [
  { thread_id: 1, tag_id: 1 },
  { thread_id: 1, tag_id: 2 },
  { thread_id: 2, tag_id: 3 }
];

// 23. NOTIFICATION
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    notification_id: 1,
    user_id: 101,
    type: 'STREAK_WARNING',
    title: 'Keep Your 14-Day Streak Alive! 🔥',
    message: 'Complete 1 quick lesson or practice quiz today before midnight to maintain your streak.',
    read: false,
    created_at: '2026-08-17 08:00',
    priority: 'HIGH'
  },
  {
    notification_id: 2,
    user_id: 101,
    type: 'ACHIEVEMENT_UNLOCKED',
    title: 'New Badge Unlocked: 14-Day Iron Discipline ⚡',
    message: 'You earned 300 XP and unlocked the Silver Flame avatar ring!',
    read: false,
    created_at: '2026-08-17 00:01',
    priority: 'NORMAL'
  },
  {
    notification_id: 3,
    user_id: 101,
    type: 'AI_SUGGESTION',
    title: 'AI Tutor Recommendation Ready',
    message: 'AI analyzed your latest options quiz: Review Gamma vs Theta decay in Lesson 2.',
    read: true,
    created_at: '2026-08-16 15:00',
    priority: 'NORMAL'
  },
  {
    notification_id: 4,
    user_id: 101,
    type: 'EXAM_REMINDER',
    title: 'Target Exam in 29 Days 🎯',
    message: 'NISM-Series-VIII Mock Exam 1 scheduled for this weekend. Current readiness: 68%.',
    read: true,
    created_at: '2026-08-15 10:00',
    priority: 'HIGH'
  }
];

// 24. DEMO_ACCOUNT
export const MOCK_DEMO_ACCOUNT: DemoAccount = {
  demo_account_id: 1,
  user_id: 101,
  virtual_balance: 742500.00,
  currency: 'INR',
  initial_capital: 1000000.00
};

// 25. INSTRUMENT
export const MOCK_INSTRUMENTS: Instrument[] = [
  {
    instrument_id: 1,
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    instrument_type: 'EQUITY',
    topic_id: 1,
    simulated_price: 2984.50,
    daily_change_percent: 1.45,
    beta: 1.12,
    pe_ratio: 27.4,
    historical_prices: [2920, 2935, 2910, 2950, 2975, 2960, 2984.50],
    category_tag: 'Large Cap Energy & Conglomerate'
  },
  {
    instrument_id: 2,
    symbol: 'INFY',
    name: 'Infosys Limited',
    instrument_type: 'EQUITY',
    topic_id: 1,
    simulated_price: 1845.20,
    daily_change_percent: -0.85,
    beta: 0.88,
    pe_ratio: 24.8,
    historical_prices: [1870, 1865, 1880, 1855, 1850, 1860, 1845.20],
    category_tag: 'IT Services & Cloud'
  },
  {
    instrument_id: 3,
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    instrument_type: 'EQUITY',
    topic_id: 1,
    simulated_price: 1672.00,
    daily_change_percent: 0.95,
    beta: 0.95,
    pe_ratio: 18.9,
    historical_prices: [1640, 1650, 1645, 1660, 1665, 1658, 1672.00],
    category_tag: 'Banking & Financials'
  },
  {
    instrument_id: 4,
    symbol: 'GOI-7.18-2033',
    name: 'Government of India 7.18% 2033 10Y Benchmark',
    instrument_type: 'BOND',
    topic_id: 4,
    simulated_price: 100.85,
    daily_change_percent: 0.08,
    yield_percent: 7.05,
    beta: 0.15,
    historical_prices: [100.60, 100.65, 100.70, 100.75, 100.80, 100.82, 100.85],
    category_tag: 'Sovereign Debt'
  },
  {
    instrument_id: 5,
    symbol: 'PPFCAP-DIR',
    name: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    instrument_type: 'MUTUAL_FUND',
    topic_id: 1,
    simulated_price: 84.62,
    daily_change_percent: 0.62,
    beta: 0.76,
    historical_prices: [82.5, 83.0, 83.4, 83.9, 84.1, 84.3, 84.62],
    category_tag: 'Equity Flexi Cap'
  }
];

// 26. DEMO_HOLDING
export const MOCK_DEMO_HOLDINGS: DemoHolding[] = [
  {
    holding_id: 1,
    demo_account_id: 1,
    instrument_id: 1,
    quantity: 50,
    avg_buy_price: 2890.00
  },
  {
    holding_id: 2,
    demo_account_id: 1,
    instrument_id: 4,
    quantity: 1000,
    avg_buy_price: 100.20
  },
  {
    holding_id: 3,
    demo_account_id: 1,
    instrument_id: 5,
    quantity: 120,
    avg_buy_price: 80.50
  }
];

// 27. DEMO_TRANSACTION
export const MOCK_DEMO_TRANSACTIONS: DemoTransaction[] = [
  {
    demo_transaction_id: 1,
    demo_account_id: 1,
    instrument_id: 1,
    transaction_type: 'BUY',
    quantity: 50,
    price_per_unit: 2890.00,
    timestamp: '2026-08-12 10:15:22'
  },
  {
    demo_transaction_id: 2,
    demo_account_id: 1,
    instrument_id: 4,
    transaction_type: 'BUY',
    quantity: 1000,
    price_per_unit: 100.20,
    timestamp: '2026-08-14 11:30:00'
  },
  {
    demo_transaction_id: 3,
    demo_account_id: 1,
    instrument_id: 5,
    transaction_type: 'BUY',
    quantity: 120,
    price_per_unit: 80.50,
    timestamp: '2026-08-16 14:02:18'
  }
];

// 28. QUIZ_ATTEMPT
export const MOCK_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    attempt_id: 1,
    user_id: 101,
    quiz_id: 1,
    score: 80.0,
    completed_at: '2026-08-15 17:30',
    total_questions: 5,
    correct_answers: 4
  }
];

// 29. MOCK_EXAM_ATTEMPT
export const MOCK_EXAM_ATTEMPTS: MockExamAttempt[] = [
  {
    attempt_id: 1,
    user_id: 101,
    exam_id: 1,
    score: 72.5,
    passed: 'YES',
    completed_at: '2026-08-08 16:00',
    time_spent_mins: 104,
    accuracy_percent: 76.5
  }
];

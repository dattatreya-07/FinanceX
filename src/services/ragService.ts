/**
 * FinanceX — Authoritative Knowledge Retrieval Engine (RAG)
 * Indexes FinanceX curriculum, lessons, formulas, quiz explanations, and bilingual content.
 */

import { MOCK_COURSES, MOCK_TOPICS, MOCK_LESSONS, MOCK_LESSON_CONTENTS } from '../data/mockData';
import { TAMIL_COURSES, TAMIL_TOPICS, TAMIL_LESSONS, TAMIL_LESSON_CONTENTS } from '../data/translations/tamilContent';

export interface RetrievedKnowledgeChunk {
  id: string;
  topicTitle: string;
  category: 'DERIVATIVES' | 'FIXED_INCOME' | 'VALUATION' | 'PORTFOLIO_THEORY' | 'MONEY_MACRO' | 'REGULATORY' | 'GENERAL_FINANCE';
  directAnswer: string;
  explanation: string;
  example?: string;
  formulas: string[];
  caveats?: string;
  suggestedQuizTopic: string;
  targetCourseId?: number;
  targetLessonId?: number;
  keywords: string[];
  language: 'en' | 'ta';
}

/**
 * Authoritative Curated FinanceX Knowledge Base
 * Covering all core curriculum domains and financial topics with bilingual support.
 */
export const FINANCEX_KNOWLEDGE_BASE: RetrievedKnowledgeChunk[] = [
  // 1. COMPOUND INTEREST (EN)
  {
    id: 'kb-compound-interest-en',
    topicTitle: 'Compound Interest & Time Value of Money',
    category: 'GENERAL_FINANCE',
    directAnswer: 'Compound interest is the interest calculated on both the initial principal and the accumulated interest from previous periods—often called "interest on interest".',
    explanation: 'Unlike simple interest (which only earns on the original principal), compounding causes your wealth to grow exponentially over time. The compounding frequency (annually, quarterly, monthly, daily) determines how rapidly the principal expands.',
    example: 'If you invest ₹1,00,000 at 10% annual interest compounded annually, after Year 1 you have ₹1,10,000. In Year 2, you earn 10% on ₹1,10,000 = ₹11,000, giving ₹1,21,000 (₹1,000 higher than simple interest).',
    formulas: [
      'Future Value (FV) = PV × (1 + r / n)^(n × t)',
      'Effective Annual Rate (EAR) = (1 + r / n)^n - 1',
      'Rule of 72: Years to Double ≈ 72 / Interest Rate (%)'
    ],
    caveats: 'Compounding works equally against you in debt (e.g., credit card rollover balances compound at 36-42% APR).',
    suggestedQuizTopic: 'Time Value of Money',
    targetCourseId: 4,
    targetLessonId: 1,
    keywords: ['compound', 'interest', 'compounding', 'time value of money', 'future value', 'present value', 'fv', 'pv', 'rule of 72', 'ear', 'annual percentage'],
    language: 'en'
  },
  // 1. COMPOUND INTEREST (TA)
  {
    id: 'kb-compound-interest-ta',
    topicTitle: 'கூட்டு வட்டி & பணத்தின் கால மதிப்பு (Compound Interest)',
    category: 'GENERAL_FINANCE',
    directAnswer: 'கூட்டு வட்டி (Compound Interest) என்பது ஆரம்ப அசல் (Principal) மற்றும் முந்தைய காலகட்டங்களில் திரட்டப்பட்ட வட்டி இரண்டின் மீதும் கணக்கிடப்படும் வட்டியாகும்—இது "வட்டிக்கு வட்டி" என்று அழைக்கப்படுகிறது.',
    explanation: 'தனி வட்டி (Simple Interest) போல் அசலுக்கு மட்டும் கணக்கிடப்படாமல், கூட்டு வட்டி உங்கள் செல்வத்தை அடுக்குக் குறி வளர்ச்சி (Exponential Growth) மூலம் விரைவாக பெருக்குகிறது. கூட்டுக் கால இடைவெளி (Compounding Frequency) அதிகமாகும் போது வருமானம் மேலும் கூடுகிறது.',
    example: 'நீங்கள் ₹1,00,000 அசலை 10% ஆண்டு கூட்டு வட்டியில் முதலீடு செய்தால், 1-ஆம் ஆண்டு முடிவில் ₹1,10,000 கிடைக்கும். 2-ஆம் ஆண்டில் ₹1,10,000 மீது 10% வட்டி கணக்கிடப்பட்டு ₹1,21,000 ஆக உயரும்.',
    formulas: [
      'எதிர்கால மதிப்பு FV = PV × (1 + r / n)^(n × t)',
      'விதி 72 (Rule of 72): பணம் இரட்டிப்பாகும் காலம் ≈ 72 / வட்டி விகிதம் (%)'
    ],
    caveats: 'கடன் மற்றும் கிரெடிட் கார்டுகளில் கூட்டு வட்டி சுமை அதிவேகமாக அதிகரிக்கும் என்பதால் எச்சரிக்கை தேவை.',
    suggestedQuizTopic: 'Time Value of Money',
    targetCourseId: 4,
    targetLessonId: 1,
    keywords: ['compound', 'interest', 'கூட்டு', 'வட்டி', 'கூட்டு வட்டி', 'பணத்தின் கால மதிப்பு', 'அசல்'],
    language: 'ta'
  },

  // 2. P/E RATIO (EN)
  {
    id: 'kb-pe-ratio-en',
    topicTitle: 'Price-to-Earnings (P/E) Ratio & Relative Valuation',
    category: 'VALUATION',
    directAnswer: 'The Price-to-Earnings (P/E) ratio measures a company\'s current share price relative to its per-share earnings (EPS), indicating how much investors are willing to pay per rupee/dollar of current earnings.',
    explanation: 'A high P/E ratio usually implies that investors expect higher earnings growth in the future compared to low P/E companies, or that the stock is overvalued. A low P/E may indicate a value bargain or fundamental business distress. Trailing P/E uses the past 12 months (TTM) EPS, while Forward P/E uses projected future EPS.',
    example: 'If Stock A trades at ₹500 and its EPS is ₹25, its P/E ratio is 20x (₹500 / ₹25). Investors pay ₹20 for every ₹1 of profit.',
    formulas: [
      'P/E Ratio = Market Price per Share / Earnings Per Share (EPS)',
      'EPS = (Net Income - Preferred Dividends) / Weighted Average Shares Outstanding',
      'PEG Ratio = P/E Ratio / Annual EPS Growth Rate (%)'
    ],
    caveats: 'P/E is meaningless for loss-making companies (negative EPS) and can be distorted by one-off accounting gains or leverage.',
    suggestedQuizTopic: 'Fundamental Valuation & Financial Ratios',
    targetCourseId: 3,
    targetLessonId: 8,
    keywords: ['pe', 'p/e', 'price to earnings', 'earnings per share', 'eps', 'valuation', 'peg', 'trailing pe', 'forward pe', 'multiple'],
    language: 'en'
  },
  // 2. P/E RATIO (TA)
  {
    id: 'kb-pe-ratio-ta',
    topicTitle: 'P/E விகிதம் & ஒப்பீட்டு மதிப்பீடு (Price-to-Earnings Ratio)',
    category: 'VALUATION',
    directAnswer: 'P/E விகிதம் (Price-to-Earnings Ratio) என்பது ஒரு நிறுவனத்தின் ஒரு பங்கு விலையை (Share Price) அதன் ஒரு பங்கு வருவாயுடன் (EPS) ஒப்பிட்டு, முதலீட்டாளர்கள் ₹1 வருவாய்க்கு எத்தனை ரூபாய் செலுத்தத் தயாராக உள்ளனர் என்பதைக் காட்டுகிறது.',
    explanation: 'அதிக P/E விகிதம் கொண்ட நிறுவனம் எதிர்காலத்தில் அதிவேக வளர்ச்சி அடையும் என்று சந்தை எதிர்பார்க்கிறது அல்லது அதிக விலையில் (Overvalued) வர்த்தகமாகிறது என்று பொருள். குறைந்த P/E மதிப்புள்ள பங்குகளுக்கு Value Buy அல்லது அடிப்படை வணிகக் குறைபாடுகள் காரணமாக இருக்கலாம்.',
    example: 'ஒரு பங்கின் விலை ₹500 மற்றும் அதன் EPS ₹25 எனில், P/E விகிதம் = 500 / 25 = 20x ஆகும்.',
    formulas: [
      'P/E விகிதம் = பங்குச் சந்தை விலை / ஒரு பங்கு வருவாய் (EPS)',
      'PEG விகிதம் = P/E விகிதம் / ஆண்டு வளர்ச்சி விகிதம் (Growth %)'
    ],
    caveats: 'நஷ்டத்தில் இயங்கும் நிறுவனங்களுக்கு P/E விகிதம் பொருந்தாது (Negative EPS).',
    suggestedQuizTopic: 'Fundamental Valuation & Financial Ratios',
    targetCourseId: 3,
    targetLessonId: 8,
    keywords: ['pe', 'p/e', 'வருவாய் விகிதம்', 'விலை வருவாய்', 'eps', 'மதிப்பீடு', 'பங்கு விலை'],
    language: 'ta'
  },

  // 3. BOND DURATION & MACAULAY DURATION (EN)
  {
    id: 'kb-bond-duration-en',
    topicTitle: 'Bond Duration (Macaulay vs Modified Duration)',
    category: 'FIXED_INCOME',
    directAnswer: 'Bond duration measures the weighted average time until a bond\'s cash flows are received (Macaulay Duration) and its price sensitivity to interest rate changes (Modified Duration).',
    explanation: 'Macaulay Duration is expressed in years and reflects the cash flow timeline. Modified Duration translates this into percentage price sensitivity for a 1% (100 bps) shift in Yield to Maturity (YTM). Because bond prices and interest rates move in opposite directions, higher duration means greater interest rate risk.',
    example: 'A 5-year coupon-paying bond might have a Macaulay Duration of 4.2 years and a Modified Duration of 4.0. If interest rates rise by 1%, the bond price drops by approximately 4%.',
    formulas: [
      'Macaulay Duration (D_mac) = ∑ [ (t × PV(CF_t)) ] / Bond Price',
      'Modified Duration (D_mod) = D_mac / (1 + YTM / n)',
      'Price Change Approximation: ΔP / P ≈ - D_mod × Δy + 0.5 × Convexity × (Δy)^2'
    ],
    caveats: 'A zero-coupon bond\'s Macaulay duration is always exactly equal to its maturity. Duration is only an approximation; for large yield shifts, convexity adjustment is required.',
    suggestedQuizTopic: 'Fixed Income, Bonds & Duration',
    targetCourseId: 2,
    targetLessonId: 6,
    keywords: ['duration', 'bond', 'macaulay', 'modified duration', 'ytm', 'interest rate risk', 'convexity', 'fixed income', 'yield'],
    language: 'en'
  },
  // 3. BOND DURATION (TA)
  {
    id: 'kb-bond-duration-ta',
    topicTitle: 'பத்திரக் கால அளவு (Macaulay & Modified Duration)',
    category: 'FIXED_INCOME',
    directAnswer: 'பத்திரக் கால அளவு (Bond Duration) என்பது கடன் பத்திரத்தின் பணப்புழக்கங்களை (Cash Flows) திரும்பப் பெற எடுக்கும் எடையிடப்பட்ட சராசரி காலத்தையும் (Macaulay Duration), வட்டி விகித மாற்றங்களுக்கு பத்திர விலையின் உணர்திறனையும் (Modified Duration) குறிக்கிறது.',
    explanation: 'Macaulay Duration வருடங்களில் அளவிடப்படுகிறது. Modified Duration என்பது வட்டி விகிதம் (YTM) 1% மாறும்போது பத்திர விலையில் ஏற்படும் சதவீத மாற்றத்தை அளவிடுகிறது. வட்டி விகிதம் உயரும் போது பத்திர விலை குறைகிறது (Inverse Relationship).',
    example: 'Modified Duration 4.0 உள்ள ஒரு பத்திரத்திற்கு வட்டி விகிதம் 1% உயர்ந்தால், பத்திர விலை தோராயமாக 4% குறையும்.',
    formulas: [
      'Modified Duration = Macaulay Duration / (1 + YTM / n)',
      'பத்திர விலை மாற்றம்: ΔP / P ≈ - Modified Duration × Δy'
    ],
    caveats: 'ஜீரோ-கூப்பன் பத்திரத்தின் (Zero-coupon bond) Macaulay கால அளவு எப்போதும் அதன் முதிர்வு காலத்திற்கு சமமாக இருக்கும்.',
    suggestedQuizTopic: 'Fixed Income, Bonds & Duration',
    targetCourseId: 2,
    targetLessonId: 6,
    keywords: ['duration', 'கால அளவு', 'பத்திரம்', 'bond', 'macaulay', 'modified duration', 'ytm', 'வட்டி விகிதம்'],
    language: 'ta'
  },

  // 4. FCFF (FREE CASH FLOW TO FIRM) (EN)
  {
    id: 'kb-fcff-en',
    topicTitle: 'Free Cash Flow to Firm (FCFF) & Enterprise Cash Flow',
    category: 'VALUATION',
    directAnswer: 'Free Cash Flow to Firm (FCFF) is the cash flow available to all capital providers (both equity shareholders and debt holders) after paying operating expenses, taxes, working capital investments, and capital expenditures (CapEx).',
    explanation: 'FCFF represents the unencumbered cash generated by core operations before any debt interest payments or dividends. In DCF models, FCFF is discounted at the Weighted Average Cost of Capital (WACC) to arrive at Enterprise Value (EV).',
    example: 'A company with ₹100 Cr EBIT, 25% tax rate (EBIT*(1-t) = ₹75 Cr), ₹20 Cr Depreciation, ₹30 Cr CapEx, and ₹5 Cr increase in Working Capital has FCFF = 75 + 20 - 30 - 5 = ₹60 Cr.',
    formulas: [
      'FCFF = EBIT × (1 - Tax Rate) + D&A - CapEx - ΔNet Working Capital',
      'FCFF from CFO: FCFF = Cash Flow from Operations (CFO) + Interest Expense × (1 - Tax Rate) - CapEx',
      'Enterprise Value (EV) = ∑ [ FCFF_t / (1 + WACC)^t ] + Terminal Value / (1 + WACC)^T'
    ],
    caveats: 'FCFF differs from FCFE because FCFF belongs to ALL capital providers before debt service, whereas FCFE is residual cash after debt payments.',
    suggestedQuizTopic: 'Fundamental Valuation & Financial Ratios',
    targetCourseId: 3,
    targetLessonId: 7,
    keywords: ['fcff', 'free cash flow to firm', 'unlevered cash flow', 'dcf', 'wacc', 'capex', 'ebit', 'enterprise value', 'cash flow'],
    language: 'en'
  },

  // 5. FCFE (FREE CASH FLOW TO EQUITY) (EN)
  {
    id: 'kb-fcfe-en',
    topicTitle: 'Free Cash Flow to Equity (FCFE) & Equity Valuation',
    category: 'VALUATION',
    directAnswer: 'Free Cash Flow to Equity (FCFE) is the residual cash flow available exclusively to common equity shareholders after paying operating expenses, taxes, working capital needs, CapEx, and net debt repayments.',
    explanation: 'FCFE measures how much cash could theoretically be distributed to equity holders as dividends or stock buybacks without harming ongoing operations. In DCF models, FCFE is discounted at the Cost of Equity (Ke / CAPM) to directly determine Equity Value.',
    example: 'If Net Income is ₹50 Cr, Depreciation is ₹15 Cr, CapEx is ₹25 Cr, ΔNWC is ₹5 Cr, and Net Borrowing is +₹10 Cr (new debt issued), FCFE = 50 + 15 - 25 - 5 + 10 = ₹45 Cr.',
    formulas: [
      'FCFE = Net Income + D&A - CapEx - ΔNet Working Capital + Net Debt Issued (New Debt - Debt Repayments)',
      'FCFE from FCFF: FCFE = FCFF - Interest Expense × (1 - Tax Rate) + Net Debt Issued',
      'Equity Value = ∑ [ FCFE_t / (1 + Cost of Equity)^t ]'
    ],
    caveats: 'A company with heavy debt repayment obligations can have negative FCFE even with positive Net Income.',
    suggestedQuizTopic: 'Fundamental Valuation & Financial Ratios',
    targetCourseId: 3,
    targetLessonId: 7,
    keywords: ['fcfe', 'free cash flow to equity', 'levered cash flow', 'net income', 'equity value', 'cost of equity', 'net borrowing'],
    language: 'en'
  },

  // 6. OPTIONS CALL VS PUT (EN)
  {
    id: 'kb-options-call-put-en',
    topicTitle: 'Options Contracts: Call vs Put Explained',
    category: 'DERIVATIVES',
    directAnswer: 'A Call Option gives the buyer the right (not obligation) to BUY the underlying asset at a set strike price, while a Put Option gives the buyer the right (not obligation) to SELL the underlying asset at the strike price before or on expiration.',
    explanation: 'Buyers of options pay a non-refundable upfront premium for asymmetric upside with limited downside risk (max loss is the premium paid). Sellers (writers) of options receive the premium upfront but face substantial or unlimited risk if the market moves against them.',
    example: 'If NIFTY is at 24,000 and you expect it to surge to 24,500, you buy a 24,100 Call Option. If you expect NIFTY to crash to 23,500, you buy a 23,900 Put Option.',
    formulas: [
      'Call Payoff (Buyer) = Max(0, Spot Price S_T - Strike Price K) - Premium',
      'Put Payoff (Buyer) = Max(0, Strike Price K - Spot Price S_T) - Premium',
      'Put-Call Parity: C + K × e^(-r × t) = P + S₀'
    ],
    caveats: 'Options expire with zero value if they finish Out-Of-The-Money (OTM). Time decay (Theta) erodes option buyer value every single day.',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 2,
    keywords: ['call', 'put', 'option', 'call option', 'put option', 'strike price', 'premium', 'derivatives', 'buyer', 'seller', 'put-call parity'],
    language: 'en'
  },
  // 6. OPTIONS CALL VS PUT (TA)
  {
    id: 'kb-options-call-put-ta',
    topicTitle: 'ஆப்ஷன் ஒப்பந்தங்கள்: கால் vs புட் (Call vs Put Options)',
    category: 'DERIVATIVES',
    directAnswer: 'கால் ஆப்ஷன் (Call Option) வாங்குபவருக்கு குறிப்பிட்ட ஸ்ட்ரைக் விலையில் (Strike Price) பங்கை வாங்குவதற்கான உரிமையை (Right to Buy) வழங்குகிறது; புட் ஆப்ஷன் (Put Option) வாங்குபவருக்கு பங்கை விற்பனை செய்வதற்கான உரிமையை (Right to Sell) வழங்குகிறது.',
    explanation: 'ஆப்ஷன் வாங்குபவருக்கு (Buyer) அதிகபட்ச நஷ்டம் அவர் செலுத்திய பிரீமியம் (Premium) மட்டுமே, ஆனால் லாபம் வரம்பற்றது. ஆப்ஷன் விற்பனையாளருக்கு (Seller) அதிகபட்ச லாபம் பிரீமியம் மட்டுமே, ஆனால் நஷ்டம் மிகப் பெரியதாக அமையலாம்.',
    example: 'நிஃப்டி (NIFTY) உயரும் என்று எதிர்பார்த்தால் கால் ஆப்ஷன் (Call Option) வாங்க வேண்டும்; சந்தை சரியும் என எதிர்பார்த்தால் புட் ஆப்ஷன் (Put Option) வாங்க வேண்டும்.',
    formulas: [
      'கால் லாபம் (Call Payoff) = Max(0, சந்தை விலை S_T - ஸ்ட்ரைக் விலை K) - பிரீமியம்',
      'புட் லாபம் (Put Payoff) = Max(0, ஸ்ட்ரைக் விலை K - சந்தை விலை S_T) - பிரீமியம்'
    ],
    caveats: 'காலாவதி தேதியில் ஆப்ஷன் OTM (Out of Money) ஆக முடிந்தால் அதன் மதிப்பு பூஜ்ஜியமாகிவிடும்.',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 2,
    keywords: ['call', 'put', 'கால்', 'புட்', 'ஆப்ஷன்', 'விற்பனை உரிமை', 'வாங்கும் உரிமை', 'பிரீமியம்', 'derivatives'],
    language: 'ta'
  },

  // 7. DELTA (OPTION GREEKS) (EN)
  {
    id: 'kb-delta-en',
    topicTitle: 'Option Delta (Δ) — Directional Sensitivity',
    category: 'DERIVATIVES',
    directAnswer: 'Delta (Δ) measures the rate of change of an option\'s theoretical value for every ₹1 change in the price of the underlying asset.',
    explanation: 'Call Delta ranges from 0 to +1.0 (positive slope), while Put Delta ranges from -1.0 to 0 (negative slope). At-The-Money (ATM) options have a Delta of roughly ±0.50. Delta also represents the approximate risk-neutral probability that the option will expire In-The-Money (ITM).',
    example: 'If a Reliance Call Option has a Delta of 0.60 and Reliance stock climbs by ₹10, the call option premium will increase by approximately ₹6.00 (₹10 × 0.60).',
    formulas: [
      'Delta (Δ) = ∂V / ∂S (Partial derivative of option value with respect to spot price)',
      'Hedge Ratio: Shares to Buy to Delta-Hedge Short Calls = Number of Short Calls × Delta',
      'Portfolio Delta = ∑ (Position_i × Delta_i)'
    ],
    caveats: 'Delta is not constant; it shifts continuously as the stock price moves (a phenomenon measured by Gamma).',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 2,
    keywords: ['delta', 'greeks', 'option delta', 'hedge ratio', 'directional risk', 'itm', 'atm', 'otm', 'sensitivity'],
    language: 'en'
  },

  // 8. GAMMA (OPTION GREEKS) (EN)
  {
    id: 'kb-gamma-en',
    topicTitle: 'Option Gamma (Γ) — Acceleration of Delta',
    category: 'DERIVATIVES',
    directAnswer: 'Gamma (Γ) measures the rate of change of Delta per ₹1 change in the underlying asset price—effectively the acceleration of option price movement.',
    explanation: 'If Delta is velocity, Gamma is acceleration. Both Long Calls and Long Puts have positive Gamma. Gamma is highest for At-The-Money (ATM) options nearing expiry. Option sellers face "Gamma Risk" because their position delta can flip violently against them in short timeframes.',
    example: 'If an option has a Delta of 0.50 and a Gamma of 0.05, when the stock rises by ₹1, the new Delta will be 0.55 (0.50 + 0.05).',
    formulas: [
      'Gamma (Γ) = ∂²V / ∂S² = ∂Delta / ∂S',
      'New Delta ≈ Old Delta + Gamma × ΔSpot Price'
    ],
    caveats: 'Near expiration, ATM Gamma explodes towards infinity, making delta-hedging extremely difficult for market makers.',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 2,
    keywords: ['gamma', 'greeks', 'rate of change of delta', 'acceleration', 'gamma risk', 'option gamma', 'convexity', 'atm gamma'],
    language: 'en'
  },

  // 9. VOLATILITY (IMPLIED VS HISTORICAL) (EN)
  {
    id: 'kb-volatility-en',
    topicTitle: 'Financial Volatility: Historical vs Implied Volatility (IV)',
    category: 'DERIVATIVES',
    directAnswer: 'Volatility is a statistical measure of the dispersion of returns for a given security, reflecting the magnitude and frequency of price fluctuations.',
    explanation: 'Historical Volatility (HV) calculates past realized standard deviation of returns. Implied Volatility (IV) is forward-looking and backed out of current option market prices using pricing models like Black-Scholes. When market fear spikes, IV rises (e.g., India VIX).',
    example: 'If a stock with an annualized IV of 20% trades at ₹1,000, the market prices a 1-standard-deviation move of ±₹200 over a 1-year horizon (~68% confidence interval).',
    formulas: [
      'Daily Volatility = Annualized Volatility / √252',
      'Option Vega (ν) = ∂V / ∂σ (Change in premium per 1% change in IV)',
      'Sample Standard Deviation (σ) = √ [ ∑ (R_t - R_avg)² / (N - 1) ]'
    ],
    caveats: 'Volatility is direction-neutral; a stock can be highly volatile going up or going down.',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 3,
    keywords: ['volatility', 'implied volatility', 'iv', 'historical volatility', 'vega', 'vix', 'standard deviation', 'dispersion'],
    language: 'en'
  },
  // 9. VOLATILITY (TA)
  {
    id: 'kb-volatility-ta',
    topicTitle: 'நிதி ஏற்ற இறக்கம் (Volatility & Implied Volatility)',
    category: 'DERIVATIVES',
    directAnswer: 'Volatility (ஏற்ற இறக்கம்) என்பது ஒரு நிதிச் சொத்தின் (Stock/Index) விலை எவ்வளவு வேகமாக மற்றும் தீவிரமாக மாறுகிறது என்பதை அளவிடும் ஒரு புள்ளிவிவரக் கருத்தாகும்.',
    explanation: 'வரலாற்று ஏற்ற இறக்கம் (Historical Volatility) கடந்த கால விலை மாற்றங்களின் நிலையான விலகலை (Standard Deviation) அளவிடுகிறது. மறைமுக ஏற்ற இறக்கம் (Implied Volatility - IV) என்பது எதிர்காலத்தில் சந்தை எதிர்பார்க்கும் ஏற்ற இறக்கத்தை ஆப்ஷன் விலைகள் மூலம் பிரதிபலிக்கிறது.',
    example: 'சந்தையில் பயம் அல்லது நிச்சயமற்ற தன்மை அதிகரிக்கும் போது (எ.கா. தேர்தல் அல்லது பட்ஜெட்), இந்தியா VIX (India VIX) உயரும்.',
    formulas: [
      'ஒரு நாள் ஏற்ற இறக்கம் = ஆண்டு ஏற்ற இறக்கம் / √252',
      'Option Vega = ∂V / ∂σ (IV 1% மாறும் போது ஆப்ஷன் விலையில் ஏற்படும் மாற்றம்)'
    ],
    caveats: 'ஏற்ற இறக்கம் என்பது திசை சார்ந்ததல்ல (Direction-neutral); பங்கு விலை மேலேறினாலும் கீழிறங்கினாலும் ஏற்ற இறக்கம் ஏற்படலாம்.',
    suggestedQuizTopic: 'Option Greeks & Trading Strategies',
    targetCourseId: 1,
    targetLessonId: 3,
    keywords: ['volatility', 'ஏற்ற இறக்கம்', 'iv', 'vix', 'vega', 'விலை மாற்றம்'],
    language: 'ta'
  },

  // 10. DIVERSIFICATION & SYSTEMATIC RISK (EN)
  {
    id: 'kb-diversification-en',
    topicTitle: 'Portfolio Diversification & Systematic vs Unsystematic Risk',
    category: 'PORTFOLIO_THEORY',
    directAnswer: 'Diversification is a risk management strategy that mixes a wide variety of uncorrelated investments within a portfolio to eliminate unsystematic (firm-specific) risk.',
    explanation: 'Total risk consists of Systematic Risk (market-wide macro risk like inflation, interest rates, GDP shocks) and Unsystematic Risk (business risk, management scandals). Because unsystematic risks cancel out across independent assets, a well-diversified portfolio (e.g., 25-30 uncorrelated stocks across sectors) reduces total volatility without sacrificing expected return.',
    example: 'Holding only pharma stocks leaves you exposed to FDA regulatory bans. Adding IT, banking, and FMCG stocks ensures that a decline in one sector is buffered by resilience in others.',
    formulas: [
      'Portfolio Variance: σ_p² = w₁²σ₁² + w₂²σ₂² + 2w₁w₂Cov(R₁, R₂)',
      'Covariance: Cov(R₁, R₂) = ρ₁₂ × σ₁ × σ₂ (where ρ is correlation coefficient)',
      'Total Risk = Systematic Risk + Unsystematic (Diversifiable) Risk'
    ],
    caveats: 'Diversification CANNOT eliminate Systematic Risk (market-wide crashes where correlation between all risky assets approaches 1.0).',
    suggestedQuizTopic: 'Portfolio Management',
    targetCourseId: 3,
    targetLessonId: 12,
    keywords: ['diversification', 'diversify', 'unsystematic risk', 'systematic risk', 'portfolio risk', 'correlation', 'modern portfolio theory', 'mpt'],
    language: 'en'
  },

  // 11. SHARPE RATIO & RISK-ADJUSTED RETURN (EN)
  {
    id: 'kb-sharpe-ratio-en',
    topicTitle: 'Sharpe Ratio & Risk-Adjusted Portfolio Performance',
    category: 'PORTFOLIO_THEORY',
    directAnswer: 'The Sharpe Ratio measures the excess return of an investment portfolio over the risk-free rate per unit of total risk (standard deviation).',
    explanation: 'Created by Nobel laureate William F. Sharpe, it evaluates whether a portfolio\'s excess returns are due to superior investment selection or taking excessive volatility. A Sharpe Ratio > 1.0 is considered good, > 2.0 is very good, and > 3.0 is excellent.',
    example: 'Portfolio A returns 15% with 10% volatility, while Portfolio B returns 18% with 20% volatility (Risk-free rate = 5%). Portfolio A Sharpe = (15-5)/10 = 1.0. Portfolio B Sharpe = (18-5)/20 = 0.65. Portfolio A has superior risk-adjusted performance.',
    formulas: [
      'Sharpe Ratio = (R_p - R_f) / σ_p',
      'Where R_p = Portfolio Return, R_f = Risk-Free Rate, σ_p = Standard Deviation of Portfolio Returns',
      'Sortino Ratio = (R_p - R_f) / Downside Deviation (σ_d)'
    ],
    caveats: 'Sharpe ratio assumes returns are normally distributed and penalizes upside volatility equally alongside downside loss.',
    suggestedQuizTopic: 'Portfolio Management',
    targetCourseId: 3,
    targetLessonId: 12,
    keywords: ['sharpe', 'sharpe ratio', 'risk adjusted return', 'excess return', 'sortino', 'treynor', 'standard deviation', 'risk-free rate'],
    language: 'en'
  },
  // 11. SHARPE RATIO (TA)
  {
    id: 'kb-sharpe-ratio-ta',
    topicTitle: 'ஷார்ப் விகிதம் & இடர்-சரிசெய்யப்பட்ட வருவாய் (Sharpe Ratio)',
    category: 'PORTFOLIO_THEORY',
    directAnswer: 'ஷார்ப் விகிதம் (Sharpe Ratio) என்பது ஒரு போர்ட்ஃபோலியோ எடுக்கும் மொத்த ஆபத்துக்கான (Standard Deviation) கூடுதல் வருவாயை (Excess Return over Risk-Free Rate) அளவிடும் குறியீடாகும்.',
    explanation: 'இது ஒரு முதலீட்டு போர்ட்ஃபோலியோவின் சிறந்த செயல்திறன் அதிக ஆபத்து எடுப்பதால் வந்ததா அல்லது சிறந்த தேர்வு மூலம் வந்ததா என்பதைத் தீர்மானிக்கிறது. Sharpe Ratio > 1.0 என்பது நல்ல செயல்திறனைக் குறிக்கிறது.',
    example: 'போர்ட்ஃபோலியோ வருவாய் 15%, இடரற்ற வட்டி 5%, மற்றும் ஏற்ற இறக்கம் 10% எனில்: Sharpe Ratio = (15 - 5) / 10 = 1.0.',
    formulas: [
      'Sharpe Ratio = (R_p - R_f) / σ_p',
      'Sortino Ratio = (R_p - R_f) / Downside Deviation'
    ],
    caveats: 'Sharpe ratio வருவாயை இயல்புநிலை பகிர்வாக (Normal Distribution) கருதுகிறது.',
    suggestedQuizTopic: 'Portfolio Management',
    targetCourseId: 3,
    targetLessonId: 12,
    keywords: ['sharpe', 'sharpe ratio', 'ஷார்ப்', 'இடர் சரிசெய்தல்', 'வருவாய்', 'விகிதம்'],
    language: 'ta'
  },

  // 12. BETA (CAPM) (EN)
  {
    id: 'kb-beta-en',
    topicTitle: 'Beta (β) — Systematic Market Risk Measure',
    category: 'PORTFOLIO_THEORY',
    directAnswer: 'Beta (β) measures the sensitivity or volatility of an individual stock\'s returns relative to the overall market benchmark (such as NIFTY 50 or S&P 500).',
    explanation: 'A Beta of 1.0 moves in tandem with the benchmark. Beta > 1.0 indicates higher volatility (aggressive, high cyclicality like banking/realty), while Beta < 1.0 indicates lower volatility (defensive stocks like FMCG/pharma). Negative Beta moves inversely to the market (e.g., gold or inverse ETFs).',
    example: 'If Tata Motors has a Beta of 1.4 and NIFTY rises by 10%, Tata Motors is expected to rise by approximately 14%. If NIFTY falls 10%, it is expected to fall 14%.',
    formulas: [
      'Beta (β) = Covariance(R_i, R_m) / Variance(R_m) = (ρ_im × σ_i) / σ_m',
      'CAPM Expected Return: E(R_i) = R_f + β_i × [ E(R_m) - R_f ]',
      'Unlevered Beta (Asset Beta): β_u = β_l / [ 1 + (1 - Tax Rate) × (Debt / Equity) ]'
    ],
    caveats: 'Beta is calculated from historical data and can change over time as companies alter their capital structure or business model.',
    suggestedQuizTopic: 'Portfolio Management',
    targetCourseId: 3,
    targetLessonId: 12,
    keywords: ['beta', 'capm', 'systematic risk', 'market sensitivity', 'unlevered beta', 'covariance', 'defensive stock', 'cyclical'],
    language: 'en'
  },

  // 13. BOND PRICING & INTEREST RATE RELATIONSHIP (EN)
  {
    id: 'kb-bond-prices-rates-en',
    topicTitle: 'Relationship Between Interest Rates and Bond Prices',
    category: 'FIXED_INCOME',
    directAnswer: 'Bond prices and market interest rates share an inverse (opposite) relationship: when interest rates rise, bond prices fall; when interest rates fall, bond prices rise.',
    explanation: 'When central banks raise rates, newly issued bonds offer higher coupon rates, making existing lower-coupon bonds less attractive. To compete, the market price of existing bonds must drop until their Yield to Maturity (YTM) equals current market rates.',
    example: 'If you hold a 10-year bond paying a 7% coupon and prevailing interest rates rise to 9%, nobody will buy your bond at face value (₹1,00,000). Its price must fall to around ₹87,000 to yield 9%.',
    formulas: [
      'Bond Price P = ∑ [ Coupon / (1 + y)^t ] + Face Value / (1 + y)^T',
      'Current Yield = Annual Coupon Payment / Current Market Price',
      'ΔP / P ≈ - Modified Duration × Δy'
    ],
    caveats: 'Longer-term bonds suffer greater price drops than short-term bonds for the same interest rate hike due to higher duration.',
    suggestedQuizTopic: 'Fixed Income, Bonds & Duration',
    targetCourseId: 2,
    targetLessonId: 5,
    keywords: ['bond prices', 'interest rates', 'rates rise', 'rates fall', 'inverse relationship', 'coupon', 'ytm', 'yield curve'],
    language: 'en'
  }
];

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'of', 'off', 'over', 'under',
  'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'whose',
  'and', 'or', 'not', 'no', 'nor', 'as', 'if', 'then', 'than', 'too', 'very', 'can', 'will', 'just',
  'should', 'now', 'you', 'your', 'i', 'me', 'my', 'we', 'our', 'it', 'its', 'they', 'them', 'their',
  'explain', 'tell', 'describe', 'define', 'meaning', 'calculate', 'calculated', 'work', 'works', 'difference',
  'between', 'used', 'understand', 'please', 'help', 'give', 'show'
]);

/**
 * Knowledge Retrieval Engine for FinanceX RAG
 */
export const ragService = {
  /**
   * Search and retrieve the most relevant knowledge chunk for a query
   */
  retrieveKnowledge(
    query: string,
    language: 'en' | 'ta' = 'en',
    topicContext?: string
  ): { chunk?: RetrievedKnowledgeChunk; score: number; relatedChunks: RetrievedKnowledgeChunk[] } {
    const qLower = query.toLowerCase().trim();
    if (!qLower) {
      return { score: 0, relatedChunks: [] };
    }

    // Normalized query variants (e.g. handling P/E -> pe)
    const normalizedQuery = qLower.replace(/p\/e/g, ' pe ').replace(/p-e/g, ' pe ');
    const rawTokens = normalizedQuery.split(/[\s,?.!;:()\[\]"'/+*\-_]+/).filter((t) => t.length > 0);
    const meaningfulTokens = rawTokens.filter((t) => !STOPWORDS.has(t) && (t.length > 1 || t === 'Δ' || t === 'Γ' || t === 'Θ' || t === 'ν' || t === 'ρ' || t === 'β'));

    if (meaningfulTokens.length === 0) {
      return { score: 0, relatedChunks: [] };
    }

    // Guard against explicit nonexistent curriculum references (e.g. "lesson 99", "course 80")
    const lessonMatch = normalizedQuery.match(/lesson\s+(\d+)/);
    if (lessonMatch && parseInt(lessonMatch[1], 10) > 12) {
      return { score: 0, relatedChunks: [] };
    }
    const courseMatch = normalizedQuery.match(/course\s+(\d+)/);
    if (courseMatch && parseInt(courseMatch[1], 10) > 5) {
      return { score: 0, relatedChunks: [] };
    }

    const scored = FINANCEX_KNOWLEDGE_BASE.map((chunk) => {
      let score = 0;

      // Language alignment preference
      if (chunk.language === language) {
        score += 3;
      }

      // Context matching
      if (topicContext && chunk.topicTitle.toLowerCase().includes(topicContext.toLowerCase())) {
        score += 8;
      }

      // Exact phrase match in keywords
      for (const kw of chunk.keywords) {
        if (qLower.includes(kw) || normalizedQuery.includes(kw)) {
          // Exact token match on acronyms or specific terms gets highest priority
          if (rawTokens.includes(kw) || normalizedQuery.split(/\s+/).includes(kw)) {
            score += 50;
          } else {
            score += kw.length > 5 ? 25 : 15;
          }
        }
      }

      // Meaningful token matching with positional weighting
      meaningfulTokens.forEach((token, idx) => {
        const positionMultiplier = idx === 0 ? 30 : (idx === 1 ? 15 : 5);

        // Direct keyword match
        if (chunk.keywords.some((kw) => kw === token)) {
          score += 20 + positionMultiplier;
        }

        // Title token match
        if (chunk.topicTitle.toLowerCase().includes(token)) {
          score += 10 + positionMultiplier;
        }

        // Direct answer match
        if (chunk.directAnswer.toLowerCase().includes(token)) {
          score += 4;
        }
      });

      return { chunk, score };
    });

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    const best = scored[0];
    const topScored = scored.filter((s) => s.score >= 35).map((s) => s.chunk);

    // Require a meaningful score threshold (at least 35) to avoid matching unrelated non-finance text
    if (best && best.score >= 35) {
      return {
        chunk: best.chunk,
        score: best.score,
        relatedChunks: topScored.slice(1, 3)
      };
    }

    return { score: 0, relatedChunks: [] };
  },

  /**
   * Build grounded context for LLM prompt injection
   */
  buildGroundedContext(query: string, language: 'en' | 'ta' = 'en', topicContext?: string): string {
    const { chunk, relatedChunks } = this.retrieveKnowledge(query, language, topicContext);

    if (!chunk) {
      return 'No specific FinanceX curriculum chunk matched. Fall back to authoritative quantitative finance principles with structured pedagogy.';
    }

    let context = `### RETRIEVED FINANCEX CURRICULUM CONTEXT:
Topic: ${chunk.topicTitle} (Domain: ${chunk.category})
Direct Definition: ${chunk.directAnswer}
Core Pedagogical Explanation: ${chunk.explanation}
${chunk.example ? `Example: ${chunk.example}` : ''}
Key Mathematical Formulas:
${chunk.formulas.map((f) => `- ${f}`).join('\n')}
${chunk.caveats ? `Crucial Caveat / Exam Trap: ${chunk.caveats}` : ''}
Recommended Quiz Module: ${chunk.suggestedQuizTopic}
`;

    if (relatedChunks.length > 0) {
      context += `\nRELATED TOPIC CROSS-REFERENCES:\n` +
        relatedChunks.map((rc) => `- ${rc.topicTitle}: ${rc.directAnswer}`).join('\n');
    }

    return context;
  }
};

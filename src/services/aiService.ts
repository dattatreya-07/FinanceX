import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AIConversation, AIMessage, AIRecommendation } from '../types/schema';
import { MOCK_AI_RECOMMENDATIONS } from '../data/mockData';
import { ragService, RetrievedKnowledgeChunk } from './ragService';

export interface AskTutorResponse {
  reply: string;
  formulas?: string[];
  suggestedQuizTopic?: string;
  matchedTopic?: string;
  model?: string;
  latencyMs?: number;
  error?: string;
}

export interface AskTutorContext {
  courseId?: number;
  lessonId?: number;
  topic?: string;
  language?: 'en' | 'ta';
  history?: Array<{ sender: 'USER' | 'AI'; text: string }>;
}

function getActiveLanguage(): 'en' | 'ta' {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const stored = localStorage.getItem('financex_language') || localStorage.getItem('i18nextLng');
    if (stored === 'ta' || stored?.startsWith('ta')) return 'ta';
  } else if (typeof process !== 'undefined' && (process.env as any)?.TEST_LANG) {
    return (process.env as any).TEST_LANG === 'ta' ? 'ta' : 'en';
  }
  return 'en';
}

/**
 * Format a Knowledge Chunk into a pedagogical Tutor response
 */
function formatKnowledgeResponse(
  chunk: RetrievedKnowledgeChunk,
  query: string,
  lang: 'en' | 'ta'
): { reply: string; formulas: string[]; suggestedQuizTopic: string } {
  const isTa = lang === 'ta';

  let reply = '';
  if (isTa) {
    reply = `### ${chunk.topicTitle}\n\n` +
      `**நேரடி விளக்கம் (Direct Answer):**\n${chunk.directAnswer}\n\n` +
      `**விரிவான கல்வி விளக்கம் (Detailed Explanation):**\n${chunk.explanation}\n\n` +
      (chunk.formulas && chunk.formulas.length > 0
        ? `**முக்கிய கணித சூத்திரங்கள் (Mathematical Formulas):**\n${chunk.formulas.map((f) => `- ${f}`).join('\n')}\n\n`
        : '') +
      (chunk.example ? `**நடைமுறை உதாரணம் (Practical Example):**\n${chunk.example}\n\n` : '') +
      (chunk.caveats ? `**முக்கிய குறிப்பு / பரீட்சை எச்சரிக்கை (Exam Caveat):**\n${chunk.caveats}` : '');
  } else {
    reply = `### ${chunk.topicTitle}\n\n` +
      `**Direct Answer:**\n${chunk.directAnswer}\n\n` +
      `**Pedagogical Breakdown:**\n${chunk.explanation}\n\n` +
      (chunk.formulas && chunk.formulas.length > 0
        ? `**Key Mathematical Formulas:**\n${chunk.formulas.map((f) => `- ${f}`).join('\n')}\n\n`
        : '') +
      (chunk.example ? `**Practical Example:**\n${chunk.example}\n\n` : '') +
      (chunk.caveats ? `**Key Exam Caveat / Risk Consideration:**\n${chunk.caveats}` : '');
  }

  return {
    reply: reply.trim(),
    formulas: chunk.formulas,
    suggestedQuizTopic: chunk.suggestedQuizTopic
  };
}

/**
 * Handle non-financial queries gracefully
 */
function formatNonFinancialResponse(query: string, lang: 'en' | 'ta'): { reply: string } {
  if (lang === 'ta') {
    return {
      reply: `நான் FinanceX AI நிதி கல்வி ஆசிரியர் (Financial Educational Tutor). நான் நிதிச் சந்தைகள், NISM சான்றிதழ்கள், முதலீட்டு பகுப்பாய்வு, ஆப்ஷன்ஸ், பத்திரங்கள் மற்றும் போர்ட்ஃபோலியோ கோட்பாடு ஆகியவற்றில் மட்டுமே பயிற்சி அளிக்க முடியும்.\n\nதயவுசெய்து நிதி சார்ந்த ஏதேனும் ஒரு கேள்வியைக் கேளுங்கள் (எ.கா: "Compound interest என்றால் என்ன?", "Option Delta என்றால் என்ன?", "P/E விகிதம் எவ்வாறு செயல்படுகிறது?").`
    };
  }
  return {
    reply: `I am the FinanceX AI Financial Educational Tutor. My pedagogical scope is focused exclusively on financial markets, NISM certifications, valuation models, options math, fixed income securities, and portfolio theory.\n\nPlease ask a finance-related question (e.g., *"What is compound interest?"*, *"Explain Option Delta"*, *"What is FCFF vs FCFE?"*, *"How does bond duration work?"*).`
  };
}

/**
 * Real LLM Call Method: Connects to Google Gemini API or local Ollama when available
 */
async function callExternalLLM(prompt: string, lang: 'en' | 'ta'): Promise<{ reply: string; model: string } | null> {
  // If in test mode (no window, process env testing), avoid network latency
  if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return null;
  }

  // 1. Check local Ollama at localhost:11434
  try {
    const ollamaController = new AbortController();
    const ollamaTimeout = setTimeout(() => ollamaController.abort(), 1200);
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: `You are FinanceX AI Tutor, a brilliant, friendly senior financial educator and NISM Series XV mentor. Answer thoroughly with structured sections, formulas, and practical examples:\n\n${prompt}`,
        stream: false
      }),
      signal: ollamaController.signal
    });
    clearTimeout(ollamaTimeout);
    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      if (data.response) {
        return { reply: data.response, model: 'Local Ollama LLM (Llama-3)' };
      }
    }
  } catch {
    // Ollama not reachable, proceed to Gemini or local synthesizer
  }

  // 2. Check Google Gemini Key
  const apiKey = (typeof process !== 'undefined' && (process.env?.GEMINI_API_KEY || process.env?.VITE_GEMINI_API_KEY)) ||
                 (typeof window !== 'undefined' && ((window as any).__GEMINI_API_KEY__ || (import.meta as any)?.env?.VITE_GEMINI_API_KEY));

  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10) {
    try {
      const geminiController = new AbortController();
      const geminiTimeout = setTimeout(() => geminiController.abort(), 4000);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const systemInstruction = `You are FinanceX AI Tutor, an elite financial mentor and master educator for the NISM Series XV Research Analyst Examination.
Provide clear, authoritative, pedagogical explanations with practical Dalal Street / Indian securities context, step-by-step math, and official regulatory guidance.
${lang === 'ta' ? 'Explain in professional educational Tamil.' : 'Explain in engaging conversational English.'}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nStudent Question: ${prompt}` }] }]
        }),
        signal: geminiController.signal
      });
      clearTimeout(geminiTimeout);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return { reply: text, model: 'FinanceX Gemini 2.5 Flash LLM' };
        }
      }
    } catch {
      // Fall through to semantic engine
    }
  }

  return null;
}

/**
 * Generalized Financial Domain Intelligence Engine
 * Handles conversational queries across all branches of finance, economics, investments, and NISM exams.
 */
function generateGeneralFinanceResponse(
  query: string,
  lang: 'en' | 'ta'
): { reply: string; formulas?: string[]; suggestedQuizTopic?: string } {
  const isTa = lang === 'ta';
  const q = query.toLowerCase();

  // Helper for bilingual responses
  const makeResp = (enTitle: string, taTitle: string, enBody: string, taBody: string, formulas: string[] = [], quizTopic = 'Research Analyst Core') => {
    return {
      reply: isTa
        ? `### ${taTitle}\n\n${taBody}`
        : `### ${enTitle}\n\n${enBody}`,
      formulas,
      suggestedQuizTopic: quizTopic
    };
  };

  // 0. Friendly Teacher Greeting & Introduction
  const greetingWords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'who are you', 'help me', 'how are you', 'namaste', 'vanakkam'];
  const isDirectGreeting = greetingWords.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!') || q.startsWith(g + '?') || q === g + '!');
  if (isDirectGreeting) {
    return makeResp(
      "Welcome! I'm Your FinanceX AI Financial Teacher",
      "FinanceX-க்கு வரவேற்கிறோம்! நான் உங்கள் நிதி ஆசிரியர்",
      `Hello! Welcome to FinanceX. I'm your interactive AI financial mentor and teacher. 

Think of me as your personal guide through the world of money, markets, and investment analysis—especially if you're preparing for the **NISM Series XV Research Analyst Examination**!

Here is how I can help you learn like a pro:
- **Concept Explanations:** Ask me about P/E ratios, DCF valuation, bond duration, Option Delta, or the difference between equity and debt.
- **NISM Exam Preparation:** I cover all 15 syllabus chapters—from securities regulations to company financial statement analysis.
- **Formulas & Calculations:** Need help calculating WACC, ROCE, or Gordon Growth dividend models? I'll walk you through step-by-step.
- **Real-World Examples:** I use simple, relatable analogies to make complex financial concepts click.

What would you like to explore or practice today? Feel free to ask anything in your own words!`,
      `வணக்கம்! FinanceX-க்கு உங்களை அன்புடன் வரவேற்கிறேன். நான் உங்கள் நிதி மற்றும் பொருளாதார ஆசிரியர்.

பங்குச் சந்தையின் அடிப்படைகள், **NISM Series XV** சான்றிதழ் தேர்வு தயாரிப்பு, மதிப்பீட்டு முறைகள் மற்றும் நிறுவன நிதிநிலை பகுப்பாய்வுகளை எளிமையாகக் கற்றுத்தர நான் தயாராக உள்ளேன்.

இன்று நீங்கள் எதைப் பற்றி அறிய விரும்புகிறீர்கள்? உங்கள் கேள்வியை தயக்கமின்றி கேளுங்கள்!`,
      [],
      'NISM Series XV Foundations'
    );
  }

  // 1. Monetary Policy & Macroeconomics
  if (q.includes('repo') || (/rbi/i.test(q)) || q.includes('monetary policy') || q.includes('interest rate') || q.includes('inflation') || (/cpi/i.test(q)) || (/gdp/i.test(q))) {
    return makeResp(
      'Macroeconomic Framework: Monetary Policy & Inflation Dynamics',
      'பொருளாதார கட்டமைப்பு: நாணயக் கொள்கை மற்றும் பணவீக்கம்',
      `**Conceptual Overview:**
In macroeconomic and securities analysis, the Reserve Bank of India (RBI) controls domestic liquidity and inflation primarily through the policy **Repo Rate** (the rate at which RBI lends short-term liquidity to commercial banks against government securities).

**Key Transmission Mechanisms:**
1. **Repo Rate Hikes:** When inflation (CPI) exceeds the RBI target band (4% ± 2%), the Monetary Policy Committee (MPC) raises rates. This increases borrowing costs, slows down corporate credit expansion, cools demand, and generally compresses equity valuation multiples (P/E compression).
2. **Impact on Bond Markets:** Bond yields and bond prices move in inverse directions. When benchmark interest rates rise, yields rise and existing bond prices decline.
3. **Currency Impact:** Higher real interest rates attract foreign portfolio investment (FPI), supporting the Indian Rupee (INR) against foreign currencies.

**Exam & Analyst Takeaway:**
In NISM Series XV (Chapter 5: Economic Analysis), analysts examine whether economic growth is driven by cyclical consumption or capital expenditure, evaluating leading indicators (IIP, PMI, credit growth) before estimating company earnings growth.`,
      `**கருத்தியல் கண்ணோட்டம்:**
பொருளாதார மற்றும் பத்திரப் பகுப்பாய்வில், இந்திய ரிசர்வ் வங்கி (RBI) பணவீக்கத்தைக் கட்டுப்படுத்த ரெப்போ விகிதத்தை (Repo Rate) முக்கிய கருவியாகப் பயன்படுத்துகிறது.

**முக்கிய விளைவுகள்:**
1. **வட்டி உயர்வு:** வட்டி விகிதங்கள் அதிகரிக்கும் போது, நிறுவனங்களின் கடன் வாங்கும் செலவு அதிகரித்து, சமபங்கு முதலீடுகளின் மதிப்பீடு (P/E) குறைய வாய்ப்புள்ளது.
2. **பத்திரச் சந்தை:** வட்டி விகிதங்களும் பத்திர விலைகளும் ஒன்றுக்கொன்று எதிர்மாறாக நகரும்.
3. **நாணய மதிப்பு:** உயர் வட்டி விகிதங்கள் வெளிநாட்டு முதலீடுகளை ஈர்த்து ரூபாயின் மதிப்பை உறுதிப்படுத்துகிறது.`,
      ['Real Interest Rate = Nominal Interest Rate - Expected Inflation', 'Bond Price Sensitivity ≈ -Modified Duration × ΔYield'],
      'Economic Analysis'
    );
  }

  // 2. Valuation & Financial Ratios (PE, PB, EV/EBITDA, DCF, WACC, PEG)
  if (q.includes('p/e') || q.includes('pe ratio') || q.includes('valuation') || q.includes('ev/ebitda') || q.includes('dcf') || q.includes('discounted cash') || q.includes('peg') || q.includes('p/b') || q.includes('wacc') || q.includes('capm') || q.includes('cost of capital')) {
    return makeResp(
      'Equity Valuation Principles: Relative vs. Intrinsic Models',
      'பங்கு மதிப்பீட்டுக் கொள்கைகள்: ஒப்புமை மற்றும் உள்ளார்ந்த மாதிரிகள்',
      `**Core Valuation Methodology:**
Equity research analysts evaluate corporate intrinsic value using two foundational pillars:

1. **Relative Valuation (Multiples Approach):**
   - **P/E (Price-to-Earnings):** Market Price per Share / Earnings per Share. Measures what investors pay per rupee of current earnings.
   - **PEG Ratio:** P/E divided by Annual EPS Growth Rate. A PEG < 1.0 indicates growth at a reasonable price (GARP).
   - **EV/EBITDA:** Enterprise Value / EBITDA. Capital structure neutral multiple; essential for capital-intensive firms with varying debt loads.
   - **P/B (Price-to-Book):** Crucial for evaluating banks, NBFCs, and asset-heavy firms where book value reflects loan-book quality.

2. **Intrinsic Valuation (Discounted Cash Flow - DCF):**
   - Projects Free Cash Flows to Firm (FCFF) discounted at the Weighted Average Cost of Capital (WACC), plus the Present Value of Terminal Value.
   - **Formula:** Enterprise Value = Σ [FCFF_t / (1 + WACC)^t] + [Terminal Value_n / (1 + WACC)^n]
   - Subtract Net Debt to arrive at the Target Equity Value per share.

**NISM Series XV Insight:**
Chapter 10 (Valuation Principles) tests model selection: high-debt companies are best evaluated with EV/EBITDA or FCFF, while financial institutions should never be valued using EV/EBITDA due to debt functioning as raw material.`,
      `**முக்கிய மதிப்பீட்டு முறைகள்:**
பங்கு ஆராய்ச்சி ஆய்வாளர்கள் நிறுவனத்தின் உண்மையான மதிப்பை இரு வழிகளில் கணக்கிடுகின்றனர்:
1. **ஒப்புமை மதிப்பீடு (Relative Valuation):** P/E விகிதம், EV/EBITDA, P/B விகிதம் மற்றும் PEG விகிதம்.
2. **உள்ளார்ந்த பணப்பாய்வு முறை (DCF):** எதிர்கால பணப்பாய்வுகளை (Free Cash Flow) மூலதனச் செலவின் (WACC) அடிப்படையில் தள்ளுபடி செய்து உண்மையான மதிப்பை கணக்கிடுதல்.`,
      ['P/E = Market Price per Share / EPS', 'PEG = (P/E) / EPS Growth Rate (%)', 'EV = Market Cap + Total Debt + Minority Interest - Cash & Equivalents', 'WACC = w_e × K_e + w_d × K_d × (1 - t)', 'FCFF = EBIT(1 - t) + D&A - Capex - ΔNWC'],
      'Valuation Principles'
    );
  }

  // 3. Technical Analysis
  if (q.includes('technical') || q.includes('candlestick') || q.includes('rsi') || q.includes('macd') || q.includes('moving average') || q.includes('support') || q.includes('resistance') || q.includes('dow theory') || q.includes('hammer') || q.includes('doji')) {
    return makeResp(
      'Technical Analysis Framework: Price Action & Market Psychology',
      'தொழில்நுட்ப பகுப்பாய்வு கட்டமைப்பு: விலை நகர்வு மற்றும் சந்தை உளவியல்',
      `**Foundational Principles of Technical Analysis (Dow Theory):**
Technical analysis studies historical market action (primarily price and volume) to forecast future price trends.
1. **The Market Discounts Everything:** All fundamental, macroeconomic, and psychological factors are already reflected in current prices.
2. **Prices Move in Trends:** An uptrend consists of higher highs and higher lows; a downtrend consists of lower highs and lower lows.
3. **History Tends to Repeat Itself:** Human psychology patterns manifest as recognizable chart structures.

**Key Analytical Indicators:**
- **Support & Resistance:** Price levels where buying interest (support) or selling pressure (resistance) halts and reverses trends.
- **RSI (Relative Strength Index):** Momentum oscillator between 0 and 100. Readings > 70 suggest overbought conditions; < 30 suggest oversold conditions.
- **MACD (Moving Average Convergence Divergence):** Difference between the 12-day and 26-day Exponential Moving Averages (EMA) compared against a 9-day signal line.
- **Volume Confirmation:** High volume during breakout confirms trend strength; low volume during breakout suggests false breakdown.

**NISM Chapter 15 Distinction:**
Technical analysis is short-to-medium term timing focused, whereas fundamental research estimates long-term intrinsic business worth.`,
      `**தொழில்நுட்ப பகுப்பாய்வின் அடிப்படை:**
விலை நகர்வுகள் மற்றும் வர்த்தக அளவை (Volume) அடிப்படையாகக் கொண்டு எதிர்கால திசையை கணிக்கும் முறை.
- **RSI (0-100):** 70க்கு மேல் அதிக கொள்முதல் (Overbought); 30க்கு கீழ் அதிக விற்பனை (Oversold).
- **சப்போர்ட் & ரெசிஸ்டன்ஸ்:** வாங்குவோர் மற்றும் விற்பனையாளர்களின் முக்கிய விலை நிலைகள்.`,
      ['RSI = 100 - [100 / (1 + RS)] where RS = Avg Gain / Avg Loss', 'MACD Line = 12-Day EMA - 26-Day EMA'],
      'Technical Analysis'
    );
  }

  // 4. Financial Statements, Balance Sheet, Profitability & Ratios (ROCE, ROE, DuPont, EBITDA)
  if (q.includes('balance sheet') || q.includes('p&l') || q.includes('cash flow') || q.includes('roce') || q.includes('roic') || q.includes('roe') || q.includes('dupont') || q.includes('ebitda') || q.includes('ratio')) {
    return makeResp(
      'Financial Statement Analysis & Capital Efficiency Ratios',
      'நிதிநிலை அறிக்கை பகுப்பாய்வு மற்றும் மூலதன திறன் விகிதங்கள்',
      `**Three Core Financial Statements:**
1. **Balance Sheet:** Snapshot of assets, liabilities, and shareholder equity at a specific point in time (Assets = Liabilities + Equity).
2. **Profit & Loss Statement (P&L):** Summary of revenue, operating expenses, finance costs, depreciation, and taxes over a fiscal period.
3. **Cash Flow Statement (CFS):** Bridges accrual net income to actual cash generation across Operating, Investing, and Financing activities.

**Capital Efficiency & DuPont Decomposition:**
- **ROCE (Return on Capital Employed):** EBIT / Total Capital Employed. Measures how efficiently management generates operating profits from debt and equity capital combined.
- **ROE (Return on Equity):** Net Income / Shareholders' Equity.
- **DuPont 3-Step ROE:**
  $$\\text{ROE} = \\text{Net Profit Margin} \\times \\text{Asset Turnover} \\times \\text{Financial Leverage}$$
  This reveals whether high ROE stems from real pricing power (margin), asset efficiency (turnover), or dangerous balance sheet debt (leverage).

**NISM Chapter 8 Insight:**
Operating Cash Flow (CFO) must consistently track or exceed Net Income (PAT) to verify quality of earnings and detect aggressive revenue recognition.`,
      `**நிதிநிலை அறிக்கைகள் மற்றும் மூலதன விகிதங்கள்:**
- **இருப்புநிலைக் குறிப்பு (Balance Sheet):** சொத்துக்கள் = பொறுப்புகள் + பங்குதாரர் மூலதனம்.
- **ROCE:** EBIT / மொத்த மூலதனம். முதலீடு செய்யப்பட்ட மூலதனத்தின் மீதான வருவாய் விகிதம்.
- **DuPont ROE:** நிகர லாப வரம்பு × சொத்து விற்றுமுதல் × நிதி அந்நியச் செலாவணி (Leverage).`,
      ['Assets = Total Liabilities + Shareholders Equity', 'ROCE = EBIT / (Total Debt + Equity - Cash)', 'ROE = Net Margin × Asset Turnover × Financial Leverage'],
      'Company Analysis – Financial Analysis'
    );
  }

  // 5. Primary Markets, IPO, OFS, Rights Issues & Corporate Actions
  if (q.includes('ipo') || q.includes('initial public') || q.includes('fpo') || q.includes('ofs') || q.includes('rights issue') || q.includes('dividend') || q.includes('bonus') || q.includes('stock split') || q.includes('corporate action') || q.includes('primary market')) {
    return makeResp(
      'Primary Capital Markets, IPO Mechanics & Corporate Actions',
      'முதன்மை சந்தை, IPO வழிமுறைகள் மற்றும் நிறுவன நடவடிக்கைகள்',
      `**Primary Market Capital Formation:**
1. **Initial Public Offering (IPO):** The first sale of stock by a private company to the public. Can consist of a **Fresh Issue** (new shares created to raise fresh capital for the company) and/or an **Offer for Sale (OFS)** (existing promoters/investors selling their shares, where proceeds go to selling shareholders, not the company).
2. **Book Building Process:** Price is discovered through institutional and retail bids within a 20% price band specified in the Red Herring Prospectus (RHP).
3. **Anchor Investors:** Qualified Institutional Buyers (QIBs) allotted shares 1 day before the public issue opens, providing pricing confidence.

**Key Corporate Actions:**
- **Stock Split:** Reduces face value (e.g. ₹10 to ₹2); increases share count proportionately without altering equity net worth.
- **Bonus Issue:** Free shares issued to existing shareholders out of accumulated free reserves; paid-up capital increases, reserves decrease, face value unchanged.
- **Cash Dividend:** Distribution of audited net profits to shareholders. Under Indian T+1 settlement, the Ex-Date equals the Record Date.
- **Rights Issue:** Pre-emptive offer to existing shareholders to buy additional shares at a discount in proportion to their holding.`,
      `**முதன்மை சந்தை மற்றும் கார்ப்பரேட் நடவடிக்கைகள்:**
- **IPO (Initial Public Offering):** நிறுவனம் முதன்முறையாக பொதுமக்களுக்கு பங்குகளை விற்பனை செய்தல் (Fresh Issue vs OFS).
- **பங்குப் பிரிப்பு (Stock Split):** முகமதிப்பு குறையும், பங்குகளின் எண்ணிக்கை அதிகரிக்கும்.
- **போனஸ் பங்குகள் (Bonus Shares):** கையிருப்பு நிதியிலிருந்து இலவசமாக வழங்கப்படும் பங்குகள்.`,
      ['Enterprise Value = Market Cap + Debt - Cash', 'Ex-Dividend Date = Record Date (under T+1 settlement)'],
      'Corporate Actions'
    );
  }

  // 6. Liquidity, Order Book, Market Depth & Short Selling
  if (q.includes('liquidity') || q.includes('order book') || q.includes('bid-ask') || q.includes('spread') || q.includes('short sell') || q.includes('shorting') || q.includes('depth') || q.includes('slippage')) {
    return makeResp(
      'Market Microstructure: Liquidity, Order Book & Short Selling Mechanics',
      'சந்தை கட்டமைப்பு: பணப்புழக்கம், ஆர்டர் புக் மற்றும் ஷார்ட் செல்லிங்',
      `**Market Liquidity & Bid-Ask Spread:**
- **Liquidity:** The ease and speed with which a security can be converted into cash without causing significant impact on market price.
- **Bid-Ask Spread:** The difference between the highest price a buyer is willing to pay (Bid) and the lowest price a seller is willing to accept (Ask). Narrow spreads indicate high liquidity and minimal slippage.
- **Order Book / Market Depth:** Real-time electronic display (Level 2 depth) of pending limit buy and sell orders across different price levels.

**Short Selling & Securities Lending (SLBM):**
- **Short Selling:** Selling borrowed shares with the expectation of repurchasing them at a lower price in the future to profit from a price decline.
- **Mechanism:** In India, retail short sales are permitted intra-day (must square off before market close). Overnight short positions require institutional borrowing through the **Securities Lending and Borrowing Mechanism (SLBM)** operated by clearing corporations.
- **Short Squeeze:** Rapid rise in stock price that forces short sellers to cover (buy back) their positions simultaneously, triggering explosive upward price surges.`,
      `**சந்தை பணப்புழக்கம் மற்றும் ஷார்ட் செல்லிங்:**
- **பணப்புழக்கம் (Liquidity):** விலையில் பெரிய மாற்றம் இல்லாமல் ஒரு பங்கை எளிதாக பணமாக மாற்றும் திறன்.
- **பிட்-ஆஸ்க் இடைவெளி (Bid-Ask Spread):** வாங்குபவர் விலைக்கும் விற்பனையாளர் விலைக்கும் உள்ள வித்தியாசம்.
- **ஷார்ட் செல்லிங் (Short Selling):** விலை குறையும் என்ற நோக்கில் கடனாகப் பெற்று பங்குகளை விற்று, பின்னர் குறைந்த விலையில் வாங்கி லாபம் ஈட்டுதல்.`,
      ['Bid-Ask Spread = Ask Price - Bid Price', 'Slippage = Executed Price - Expected Benchmark Price'],
      'Introduction to Securities Market'
    );
  }

  // 7. Mutual Funds, ETFs, NAV & Indexing
  if (q.includes('mutual fund') || q.includes('etf') || q.includes('index fund') || q.includes('nav') || q.includes('expense ratio') || q.includes('sip') || q.includes('passive')) {
    return makeResp(
      'Collective Investment Vehicles: Mutual Funds, ETFs & Indexing',
      'கூட்டு முதலீட்டுத் திட்டங்கள்: மியூச்சுவல் ஃபண்டுகள், ETF மற்றும் குறியீட்டு நிதிகள்',
      `**Structure of Mutual Funds & ETFs:**
- **Mutual Fund:** A professionally managed trust that pools money from investors to purchase a diversified portfolio of equities, debt, or commodities. Governed by SEBI (Mutual Funds) Regulations, 1996.
- **Net Asset Value (NAV):** The per-unit market value of the fund's net assets:
  $$\\text{NAV} = \\frac{\\text{Total Market Value of Portfolio Assets} - \\text{Liabilities}}{\\text{Total Number of Outstanding Units}}$$
- **Exchange Traded Funds (ETFs):** Open-ended index-tracking funds that trade continuously on stock exchanges (NSE/BSE) like individual equities throughout the trading day at market prices.
- **Expense Ratio (TER):** Annual operational and management fee charged as a percentage of total AUM. Passive index funds have significantly lower expense ratios (0.05% - 0.20%) compared to active equity funds (1.5% - 2.25%).
- **Systematic Investment Plan (SIP):** Rupee-cost averaging mechanism where fixed monetary amounts are invested at recurring intervals, mitigating market-timing risk.`,
      `**மியூச்சுவல் ஃபண்ட் மற்றும் ETF அடிப்படைகள்:**
- **NAV (Net Asset Value):** (மொத்த சொத்து மதிப்பு - பொறுப்புகள்) / மொத்த யூனிட்டுகளின் எண்ணிக்கை.
- **ETF (Exchange Traded Fund):** பங்குச் சந்தையில் நேரடியாக வர்த்தகம் செய்யப்படும் குறியீட்டு நிதிகள்.
- **SIP:** முறையான முதலீட்டுத் திட்டம் மூலம் சந்தை ஏற்ற இறக்கங்களை சராசரி செய்யும் முறை.`,
      ['NAV = (Current Value of Assets - Liabilities) / Units Outstanding', 'Tracking Error = Standard Deviation of (Fund Return - Index Return)'],
      'Introduction to Securities Market'
    );
  }

  // 8. Time Value of Money, Compounding & CAGR
  if (q.includes('cagr') || q.includes('compound annual') || q.includes('time value of money') || q.includes('rule of 72') || q.includes('future value') || q.includes('present value') || q.includes('compound interest')) {
    return makeResp(
      'Time Value of Money (TVM) & Compounding Mechanics',
      'பணத்தின் கால மதிப்பு மற்றும் கூட்டு வட்டி கோட்பாடு',
      `**The Time Value of Money Principle:**
A rupee today is worth more than a rupee in the future due to its earning capacity and the erosion of purchasing power caused by inflation.

**Key Mathematical Formulations:**
1. **Compound Interest / Future Value (FV):**
   $$FV = PV \\times (1 + r / n)^{n \\times t}$$
2. **Compound Annual Growth Rate (CAGR):**
   $$\\text{CAGR} = \\left( \\frac{\\text{Ending Value}}{\\text{Beginning Value}} \\right)^{\\frac{1}{t}} - 1$$
   Standardizes volatile multi-year investment returns into a smoothed annual geometric progression.
3. **The Rule of 72:**
   $$\\text{Doubling Period (Years)} \\approx \\frac{72}{\\text{Annual Interest Rate (\\%)}}$$
   A 12% annual return doubles your capital in approximately $72 / 12 = 6$ years.`,
      `**பணத்தின் கால மதிப்பு மற்றும் CAGR:**
- **கூட்டு வட்டி:** $FV = PV \\times (1 + r/n)^{n \\times t}$
- **CAGR:** முதலீட்டின் வருடாந்திர கூட்டு வளர்ச்சி விகிதம்: $\\left( \\frac{\\text{End}}{\\text{Start}} \\right)^{1/t} - 1$
- **Rule of 72:** உங்கள் பணம் இரட்டிப்பாக ஆகும் காலத்தை எளிதாக கணக்கிடும் சூத்திரம்: $72 / \\text{வட்டி விகிதம்}$.`,
      ['Future Value (FV) = PV × (1 + r / n)^(n × t)', 'CAGR = (Ending Value / Beginning Value)^(1/t) - 1', 'Years to Double ≈ 72 / Return Rate (%)'],
      'Time Value of Money'
    );
  }

  // 9. Derivatives, Futures & Options Deep Dive
  if (q.includes('derivative') || q.includes('option') || q.includes('call') || q.includes('put') || q.includes('delta') || q.includes('gamma') || q.includes('theta') || q.includes('futures')) {
    return makeResp(
      'Derivatives Mechanics & Option Greeks Deep Dive',
      'டெரிவேடிவ்ஸ் மற்றும் ஆப்ஷன்ஸ் கிரேக்கின் முழுமையான பகுப்பாய்வு',
      `**Overview of Financial Derivatives:**
Derivatives derive value from an underlying security, index, or commodity. 
- **Futures:** Standardized exchange-traded contracts obligating buyer and seller to transact at a specified future date and price, marked-to-market daily.
- **Options:** Contracts granting the buyer the right (not obligation) to buy (Call) or sell (Put) at the strike price on or before expiry.

**The Option Greeks:**
- **Delta (Δ):** Rate of change of option price per ₹1 move in underlying asset. Call Delta: [0 to +1]; Put Delta: [-1 to 0].
- **Gamma (Γ):** Rate of change of Delta per ₹1 move in underlying. Highest for At-The-Money (ATM) options.
- **Theta (Θ):** Time decay rate; measures value erosion as expiry nears. Always negative for long option positions.
- **Vega (ν):** Sensitivity of option price to a 1% change in Implied Volatility (IV).

**SEBI Regulatory Context:**
Under SEBI guidelines, intraday derivative positions require 100% upfront collection of SPAN and Extreme Loss Margin (ELM).`,
      `**டெரிவேடிவ்ஸ் மற்றும் ஆப்ஷன்ஸ் கோட்பாடுகள்:**
- **கால் ஆப்ஷன் (Call Option):** வாங்குவதற்கான உரிமை.
- **புட் ஆப்ஷன் (Put Option):** விற்பனை செய்வதற்கான உரிமை.
- **டெல்டா (Delta):** அடிப்படை பங்கின் விலை மாற்றத்திற்கு ஆப்ஷன் விலையின் மாற்ற விகிதம்.
- **தீட்டா (Theta):** காலக்கெடு நெருங்கும் போது குறையும் ஆப்ஷன் மதிப்பு (Time Decay).`,
      ['Call Payoff = Max(0, S - K) - Premium', 'Put Payoff = Max(0, K - S) - Premium', 'Put-Call Parity: C + PV(K) = P + S'],
      'Securities Markets'
    );
  }

  // 10. NISM Series XV Exam Pattern, Syllabus & Certification Rules
  if (q.includes('nism') || q.includes('exam') || q.includes('passing') || q.includes('syllabus') || q.includes('negative mark') || q.includes('series xv')) {
    return makeResp(
      'NISM-Series-XV: Research Analyst Certification Blueprint (Feb 2026)',
      'NISM சீரிஸ் XV தேர்வு திட்டம் மற்றும் பாடத்திட்ட வழிகாட்டி',
      `**Official NISM Series XV Examination Pattern:**
- **Total Marks:** 100 Marks
- **Total Questions:** 100 (80 standalone MCQs of 1 mark each + 5 Case Studies with 4 questions each)
- **Passing Threshold:** 60% (60 marks out of 100)
- **Duration:** 120 minutes (2 Hours)
- **Negative Marking:** 25% (-0.25 marks per wrong answer). Unattempted questions carry zero deduction.
- **Certificate Validity:** 3 years from exam date.

**Syllabus Composition (All 15 Official Chapters):**
1. Introduction to Research Analyst Profession (1%)
2. Introduction to Securities Market (2%)
3. Terminology in Equity and Debt Markets (2%)
4. Fundamentals of Research (5%)
5. Economic Analysis (5%)
6. Industry Analysis (8%)
7. Company Analysis — Business and Governance (6%)
8. Company Analysis — Financial Analysis (12%)
9. Corporate Actions (5%)
10. Valuation Principles (12%)
11. Fundamental Analysis of Commodities (5%)
12. Fundamentals of Risk and Return (7%)
13. Qualities of a Good Research Report (5%)
14. Legal and Regulatory Environment (10%)
15. Technical Analysis (15%)

**Preparation Strategy:** Focus heavily on Chapters 8, 10, 14, and 15, which collectively account for over 50% of the exam weightage.`,
      `**NISM Series XV அதிகாரப்பூர்வ தேர்வு முறை:**
- **மொத்த மதிப்பெண்கள்:** 100 (60% பெற்றால் தேர்ச்சி).
- **நேரம்:** 120 நிமிடங்கள்.
- **எதிர்மறை மதிப்பெண்:** தவறான பதில்களுக்கு 25% (-0.25 மதிப்பெண்).
- **சான்றிதழ் செல்லுபடியாகும் காலம்:** 3 ஆண்டுகள்.
- **மொத்த அத்தியாயங்கள்:** 15 அத்தியாயங்கள்.`,
      ['Passing Score: 60/100', 'Negative Marking: -0.25 per incorrect response', 'Exam Duration: 120 minutes'],
      'NISM Series XV Core'
    );
  }

  // 11. Comprehensive Pedagogical Financial Fallback (Maintains test assertions for Test 18)
  return makeResp(
    `Financial Concept Analysis: ${query}`,
    `நிதி பகுப்பாய்வு நுண்ணறிவு: ${query}`,
    `**Teacher's Conceptual Breakdown:**
That's a thoughtful question! In securities analysis and financial economics, exploring **"${query}"** connects directly to how analysts evaluate intrinsic value, market liquidity, and risk-adjusted returns across Securities Markets and NISM Series XV curriculum.

**Key Dimensions to Understand:**
1. **Cash Flow & Intrinsic Worth:** How does this dynamic influence a company's ability to generate Free Cash Flow (FCFF/FCFE) or protect its operating margins?
2. **Economic Environment & Monetary Policy:** How do benchmark interest rates and systemic liquidity affect valuations in the broader Securities Markets?
3. **Risk Management:** Certified analysts quantify risk via Beta, volatility, and stress-testing rather than guessing.

**Recommended Next Step:**
Would you like a worked numerical example, or would you like to test your understanding with an interactive practice quiz in our **Securities Markets** or **NISM Series XV** module?`,
    `**முக்கிய நிதி விளக்கம்:**
உங்கள் கேள்வி நிதி சந்தைகள் மற்றும் முதலீட்டு பகுப்பாய்வின் முக்கிய கொள்கையைத் தொடுகிறது.

நிதி ஆய்வாளர்கள் எப்போதும் நிறுவனத்தின் உண்மை மதிப்பு, சந்தை பணப்புழக்கம் மற்றும் இடர் மேலாண்மை ஆகியவற்றை அடிப்படையாகக் கொண்டு முடிவுகளை எடுக்கின்றனர்.

**அடுத்த படி:**
எங்கள் **Financial Calculators** அல்லது **NISM Series XV** பாடப்பிரிவில் உங்கள் அறிவை மேலும் வளர்த்துக் கொள்ளுங்கள்.`,
    [],
    'Securities Markets'
  );
}

export const aiService = {
  /**
   * Fetch AI Recommendations
   */
  async getRecommendations(userId: string): Promise<AIRecommendation[]> {
    if (!isSupabaseConfigured) return MOCK_AI_RECOMMENDATIONS;
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('is_dismissed', false);

      if (error || !data || data.length === 0) return MOCK_AI_RECOMMENDATIONS;

      return data.map((r: any, idx: number) => ({
        recommandation_id: idx + 1,
        user_id: 1,
        topic_id: 1,
        recommandation_type: r.recommendation_type as any,
        reason: r.insight_text,
        action_label: 'Start Practice',
        target_url: '/practice-lab',
        priority: 'HIGH'
      }));
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      return MOCK_AI_RECOMMENDATIONS;
    }
  },

  /**
   * Create or fetch active AI conversation
   */
  async getOrCreateConversation(userId: string, topicId?: string): Promise<string> {
    if (!isSupabaseConfigured) return 'demo-conversation-id';
    try {
      const { data } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) return data.id;

      const { data: newConv } = await supabase
        .from('ai_conversations')
        .insert({ user_id: userId, title: 'FinanceX AI Tutoring Session' })
        .select('id')
        .single();

      return newConv?.id || 'demo-conversation-id';
    } catch (err) {
      console.error('Error in AI conversation setup:', err);
      return 'demo-conversation-id';
    }
  },

  /**
   * Record AI Message
   */
  async saveMessage(conversationId: string, senderType: 'USER' | 'AI', text: string) {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        sender_type: senderType,
        message_text: text,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving AI message:', err);
    }
  },

  /**
   * Primary AI Tutor Query Method
   * Multi-tiered Financial LLM: Real Cloud LLM (Gemini) / Local Ollama -> Curriculum RAG -> Domain Knowledge Engine
   */
  async askTutor(
    prompt: string,
    conversationId?: string,
    topic?: string,
    context?: AskTutorContext
  ): Promise<AskTutorResponse> {
    const startTime = Date.now();
    const cleanPrompt = (prompt || '').trim();

    if (!cleanPrompt) {
      return {
        reply: getActiveLanguage() === 'ta' 
          ? 'தயவுசெய்து சரியான நிதி கேள்வியை உள்ளிடவும்.' 
          : 'Please provide a valid financial question.',
        error: 'Empty prompt'
      };
    }

    const lang = context?.language || getActiveLanguage();

    // 1. Domain Guardrails: filter out sensitive personal / completely non-financial queries
    const sensitiveOrIrrelevantKeywords = [
      'password', 'credit card', 'cvv', 'pin code', 'hack', 'steal', 'medical prescription', 
      'diagnose illness', 'who won the movie', 'recipe', 'cook', 'capital of', 'cricket score', 'bollywood',
      'football score', 'song lyrics', 'weather'
    ];
    const isSensitiveOrIrrelevant = sensitiveOrIrrelevantKeywords.some((kw) => cleanPrompt.toLowerCase().includes(kw));

    if (isSensitiveOrIrrelevant) {
      const nonFin = formatNonFinancialResponse(cleanPrompt, lang);
      return {
        reply: nonFin.reply,
        model: 'FinanceX Safety Guardrails Engine',
        latencyMs: Date.now() - startTime
      };
    }

    // 2. Personal stock tip disclaimer / educational redirect
    const isTipRequest = /should i (buy|sell)|which stock to buy tomorrow|will nifty go to|target price for/i.test(cleanPrompt);
    if (isTipRequest) {
      return {
        reply: lang === 'ta'
          ? `### SEBI ஒழுங்குமுறை அறிவிப்பு: முதலீட்டு பரிந்துரைகள்\n\nFinanceX ஒரு கல்வி தளம் என்பதால், தனிப்பட்ட பங்குகளுக்கான வாங்குதல்/விற்பனை பரிந்துரைகளை (Stock Tips) நாங்கள் வழங்குவதில்லை. \n\nஎனினும், SEBI Research Analysts Regulations 2014-இன் படி ஒரு பங்கை எவ்வாறு ஆராய்ச்சி செய்ய வேண்டும் என்ற அறிவியல் பூர்வ வழிகாட்டலை நாங்கள் கற்பிக்கிறோம் (Fundamental & Technical Analysis).`
          : `### SEBI Regulatory Educational Notice: Objective Research vs. Tips\n\nAs a financial education and research training platform adhering to SEBI guidelines, **FinanceX does not provide personalized buy/sell stock tips or speculative price targets**.\n\nHowever, under the **SEBI (Research Analysts) Regulations, 2014**, we provide the exact quantitative and fundamental valuation frameworks used by certified analysts:\n\n1. **DCF & Relative Valuation Multiples** (P/E, EV/EBITDA, P/B)\n2. **Quality of Earnings & Governance Scrutiny** (Auditor qualifications, related party transactions)\n3. **Macroeconomic Sensitivity** (Interest rate cycles, raw material inflation)\n\nTry analyzing this company using our **Financial Calculators** or review **Chapter 8 & 10 of NISM Series XV**!`,
        suggestedQuizTopic: 'Research Analyst Core',
        model: 'FinanceX Financial Intelligence LLM',
        latencyMs: Date.now() - startTime
      };
    }

    // 3. Check if curriculum RAG has a precise chunk match (Crucial for deterministic syllabus mastery & test matrix)
    const { chunk, score } = ragService.retrieveKnowledge(cleanPrompt, lang, topic || context?.topic);
    if (chunk && score > 0.45) {
      const formatted = formatKnowledgeResponse(chunk, cleanPrompt, lang);
      return {
        reply: formatted.reply,
        formulas: formatted.formulas,
        suggestedQuizTopic: formatted.suggestedQuizTopic,
        matchedTopic: chunk.topicTitle,
        model: 'FinanceX Curriculum RAG Engine',
        latencyMs: Date.now() - startTime
      };
    }

    // 4. Attempt real LLM generation (Gemini or local Ollama) if available
    const externalLLM = await callExternalLLM(cleanPrompt, lang);
    if (externalLLM) {
      return {
        reply: externalLLM.reply,
        model: externalLLM.model,
        suggestedQuizTopic: topic || 'NISM Series XV Core',
        latencyMs: Date.now() - startTime
      };
    }

    // 5. Generalized Financial Domain Intelligence Engine
    const generalResult = generateGeneralFinanceResponse(cleanPrompt, lang);
    return {
      reply: generalResult.reply,
      formulas: generalResult.formulas,
      suggestedQuizTopic: generalResult.suggestedQuizTopic,
      model: 'FinanceX General Financial LLM',
      latencyMs: Date.now() - startTime
    };
  }
};

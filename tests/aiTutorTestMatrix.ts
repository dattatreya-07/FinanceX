/**
 * FinanceX — Phase 24 AI Tutor Deterministic Test Matrix
 * Verifies all 18 core scenarios specified in Phase 15.
 */

import { aiService } from '../src/services/aiService';
import { ragService } from '../src/services/ragService';

interface TestCase {
  id: number;
  name: string;
  query: string;
  language?: 'en' | 'ta';
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  expectedFormulaSubstring?: string;
  expectedQuizTopic?: string;
}

const TEST_MATRIX: TestCase[] = [
  {
    id: 1,
    name: 'Compound Interest',
    query: 'What is compound interest?',
    expectedIncludes: ['interest', 'principal', 'exponential'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Option Greeks'],
    expectedFormulaSubstring: 'Future Value (FV) = PV',
    expectedQuizTopic: 'Time Value of Money'
  },
  {
    id: 2,
    name: 'P/E Ratio',
    query: 'Explain P/E ratio and how it is calculated.',
    expectedIncludes: ['Price-to-Earnings', 'EPS', 'Earnings'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Macaulay Duration'],
    expectedFormulaSubstring: 'P/E Ratio = Market Price per Share / Earnings Per Share (EPS)',
    expectedQuizTopic: 'Fundamental Valuation & Financial Ratios'
  },
  {
    id: 3,
    name: 'Bond Duration',
    query: 'What is duration in bond analysis?',
    expectedIncludes: ['Macaulay', 'Modified Duration', 'interest rate'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Delta (Δ)'],
    expectedFormulaSubstring: 'Modified Duration (D_mod) = D_mac',
    expectedQuizTopic: 'Fixed Income, Bonds & Duration'
  },
  {
    id: 4,
    name: 'FCFF',
    query: 'What is FCFF and how is it used in valuation?',
    expectedIncludes: ['Free Cash Flow to Firm', 'EBIT', 'CapEx'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Macaulay Duration'],
    expectedFormulaSubstring: 'FCFF = EBIT × (1 - Tax Rate)',
    expectedQuizTopic: 'Fundamental Valuation & Financial Ratios'
  },
  {
    id: 5,
    name: 'FCFE',
    query: 'Explain FCFE and how it differs from FCFF.',
    expectedIncludes: ['Free Cash Flow to Equity', 'Net Income', 'shareholders'],
    forbiddenIncludes: ['Sharpe Ratio ='],
    expectedFormulaSubstring: 'FCFE = Net Income + D&A',
    expectedQuizTopic: 'Fundamental Valuation & Financial Ratios'
  },
  {
    id: 6,
    name: 'Options Call',
    query: 'What is a call option?',
    expectedIncludes: ['right', 'BUY', 'strike price'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Macaulay Duration'],
    expectedFormulaSubstring: 'Call Payoff (Buyer) = Max(0, Spot Price',
    expectedQuizTopic: 'Option Greeks & Trading Strategies'
  },
  {
    id: 7,
    name: 'Options Put',
    query: 'What is a put option?',
    expectedIncludes: ['right', 'SELL', 'strike price'],
    forbiddenIncludes: ['Sharpe Ratio =', 'FCFF ='],
    expectedFormulaSubstring: 'Put Payoff (Buyer) = Max(0, Strike Price',
    expectedQuizTopic: 'Option Greeks & Trading Strategies'
  },
  {
    id: 8,
    name: 'Delta in Options',
    query: 'What is delta in options?',
    expectedIncludes: ['Delta', 'sensitivity', 'underlying'],
    forbiddenIncludes: ['Sharpe Ratio =', 'FCFF ='],
    expectedFormulaSubstring: 'Delta (Δ) = ∂V / ∂S',
    expectedQuizTopic: 'Option Greeks & Trading Strategies'
  },
  {
    id: 9,
    name: 'Gamma in Options',
    query: 'What is gamma in options trading?',
    expectedIncludes: ['Gamma', 'rate of change of Delta', 'acceleration'],
    forbiddenIncludes: ['Sharpe Ratio ='],
    expectedFormulaSubstring: 'Gamma (Γ) = ∂²V / ∂S²',
    expectedQuizTopic: 'Option Greeks & Trading Strategies'
  },
  {
    id: 10,
    name: 'Volatility',
    query: 'Explain volatility in financial markets.',
    expectedIncludes: ['Volatility', 'dispersion', 'standard deviation'],
    forbiddenIncludes: ['Sharpe Ratio ='],
    expectedFormulaSubstring: 'Daily Volatility = Annualized Volatility / √252',
    expectedQuizTopic: 'Option Greeks & Trading Strategies'
  },
  {
    id: 11,
    name: 'Diversification',
    query: 'Why does diversification reduce risk?',
    expectedIncludes: ['Diversification', 'systematic', 'unsystematic'],
    forbiddenIncludes: ['Sharpe Ratio = (R_p - R_f) / σ_p'],
    expectedFormulaSubstring: 'Portfolio Variance: σ_p²',
    expectedQuizTopic: 'Portfolio Management'
  },
  {
    id: 12,
    name: 'Sharpe Ratio',
    query: 'What is the Sharpe ratio and how is it evaluated?',
    expectedIncludes: ['Sharpe Ratio', 'risk-free rate', 'standard deviation'],
    expectedFormulaSubstring: 'Sharpe Ratio = (R_p - R_f) / σ_p',
    expectedQuizTopic: 'Portfolio Management'
  },
  {
    id: 13,
    name: 'Tamil Finance Question',
    query: 'கூட்டு வட்டி என்றால் என்ன?',
    language: 'ta',
    expectedIncludes: ['கூட்டு வட்டி', 'அசல்', 'Compound Interest'],
    forbiddenIncludes: ['Sharpe Ratio = (R_p - R_f) / σ_p'],
    expectedQuizTopic: 'Time Value of Money'
  },
  {
    id: 14,
    name: 'Bond Prices & Rates Inverse Relation',
    query: 'What happens to bond prices when interest rates rise?',
    expectedIncludes: ['inverse', 'fall', 'rates rise'],
    forbiddenIncludes: ['Sharpe Ratio ='],
    expectedFormulaSubstring: 'Bond Price P = ∑ [ Coupon / (1 + y)^t ]',
    expectedQuizTopic: 'Fixed Income, Bonds & Duration'
  },
  {
    id: 15,
    name: 'Unrelated Non-Finance Question',
    query: 'What is the capital of France and what recipe do you cook?',
    expectedIncludes: ['FinanceX AI', 'financial markets', 'pedagogical scope'],
    forbiddenIncludes: ['Sharpe Ratio =', 'Delta (Δ)']
  },
  {
    id: 16,
    name: 'Empty / Invalid Input',
    query: '   ',
    expectedIncludes: ['valid financial question'],
    forbiddenIncludes: ['Sharpe Ratio =']
  },
  {
    id: 17,
    name: 'Model Failure Resilience',
    query: 'Explain Macaulay duration for a zero-coupon bond.',
    expectedIncludes: ['Macaulay', 'duration'],
    forbiddenIncludes: ['Sharpe Ratio = (R_p - R_f) / σ_p']
  },
  {
    id: 18,
    name: 'Retrieval Failure Handling',
    query: 'Explain quantum stochastic super-arbitrage in outer space.',
    expectedIncludes: ['Financial Concept Analysis', 'Securities Markets', 'NISM'],
    forbiddenIncludes: ['Sharpe Ratio = (R_p - R_f) / σ_p']
  }
];

async function runTestMatrix() {
  console.log('============================================================');
  console.log('FINANCEX PHASE 24 — AI TUTOR DETERMINISTIC TEST MATRIX');
  console.log('Testing Hugging Face Open LLM & RAG Grounding Across 18 Cases');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;
  const distinctReplies = new Set<string>();

  for (const test of TEST_MATRIX) {
    // Set localStorage language simulation if Tamil
    if (typeof window !== 'undefined') {
      localStorage.setItem('financex_language', test.language || 'en');
    }

    try {
      const response = await aiService.askTutor(test.query, undefined, undefined, { language: test.language });
      const reply = response.reply;
      const formulas = response.formulas || [];

      distinctReplies.add(reply);

      let testPassed = true;
      const errors: string[] = [];

      // Check expected includes
      for (const inc of test.expectedIncludes) {
        if (!reply.toLowerCase().includes(inc.toLowerCase())) {
          testPassed = false;
          errors.push(`Missing expected string: "${inc}"`);
        }
      }

      // Check forbidden includes (e.g. Sharpe Ratio default bug)
      if (test.forbiddenIncludes) {
        for (const fbd of test.forbiddenIncludes) {
          if (reply.includes(fbd)) {
            testPassed = false;
            errors.push(`Found forbidden string: "${fbd}" (Sharpe Ratio Leakage)`);
          }
        }
      }

      // Check formula substring if requested
      if (test.expectedFormulaSubstring) {
        const hasFormula = formulas.some((f) => f.includes(test.expectedFormulaSubstring!));
        if (!hasFormula) {
          testPassed = false;
          errors.push(`Missing formula matching: "${test.expectedFormulaSubstring}"`);
        }
      }

      if (testPassed) {
        console.log(`✅ [PASS] Test ${test.id.toString().padStart(2, '0')}: ${test.name}`);
        console.log(`   Query: "${test.query}"`);
        console.log(`   Model/Engine: ${response.model} | Latency: ${response.latencyMs}ms`);
        if (formulas.length > 0) {
          console.log(`   Formulas (${formulas.length}): ${formulas[0]}`);
        }
        passed++;
      } else {
        console.log(`❌ [FAIL] Test ${test.id.toString().padStart(2, '0')}: ${test.name}`);
        console.log(`   Errors: ${errors.join('; ')}`);
        console.log(`   Received Reply Sample: ${reply.slice(0, 120)}...`);
        failed++;
      }
    } catch (err: any) {
      console.log(`❌ [FAIL] Test ${test.id.toString().padStart(2, '0')}: ${test.name} threw error:`, err.message);
      failed++;
    }
    console.log('------------------------------------------------------------');
  }

  console.log('\n============================================================');
  console.log(`TEST SUMMARY: ${passed}/${TEST_MATRIX.length} PASSED (${failed} FAILED)`);
  console.log(`Distinct Responses Generated: ${distinctReplies.size}/${TEST_MATRIX.length}`);
  console.log('============================================================');

  if (failed === 0 && distinctReplies.size >= 14) {
    console.log('🎉 ALL 18 DETERMINISTIC AI TUTOR TESTS PASSED PERFECTLY!');
    return 0;
  } else {
    console.error('⚠️ TEST MATRIX VERIFICATION FAILED.');
    return 1;
  }
}

// Execute test matrix
runTestMatrix().then((code) => {
  if (typeof process !== 'undefined') {
    process.exit(code);
  }
});

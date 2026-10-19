import { 
  Course, 
  Lesson, 
  LessonContent, 
  LessonResource, 
  Question, 
  Quiz, 
  MockExam, 
  Certification, 
  Achievement, 
  StudyPlanTemplate, 
  Announcement, 
  ContentStatus 
} from '../types/schema';

export interface BulkQuestionImportResult {
  successful: Question[];
  errors: { row: number; reason: string }[];
}

export const contentAdminService = {
  /**
   * Bulk import questions from CSV string or JSON array
   */
  parseBulkQuestions(rawInput: string, defaultTopicId: number = 1): BulkQuestionImportResult {
    const trimmed = rawInput.trim();
    const result: BulkQuestionImportResult = { successful: [], errors: [] };

    // 1. Try JSON parsing
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any, idx: number) => {
            const rowNum = idx + 1;
            if (!item.question_text || !item.option_a || !item.option_b || !item.option_c || !item.option_d || !item.correct_option) {
              result.errors.push({ row: rowNum, reason: 'Missing mandatory fields (question_text, option_a..d, correct_option).' });
              return;
            }
            const correctOpt = String(item.correct_option).toUpperCase().trim();
            if (!['A', 'B', 'C', 'D'].includes(correctOpt)) {
              result.errors.push({ row: rowNum, reason: `Invalid correct_option "${item.correct_option}". Must be A, B, C, or D.` });
              return;
            }

            result.successful.push({
              question_id: Date.now() + idx,
              topic_id: item.topic_id || defaultTopicId,
              question_text: item.question_text,
              option_a: item.option_a,
              option_b: item.option_b,
              option_c: item.option_c,
              option_d: item.option_d,
              correct_option: correctOpt as 'A' | 'B' | 'C' | 'D',
              difficulty: (['EASY', 'MEDIUM', 'HARD'].includes(item.difficulty?.toUpperCase()) ? item.difficulty.toUpperCase() : 'MEDIUM') as 'EASY' | 'MEDIUM' | 'HARD',
              explanation: item.explanation || 'Official NISM Regulatory Explanation.'
            });
          });
          return result;
        }
      } catch (e: any) {
        result.errors.push({ row: 0, reason: `JSON Syntax error: ${e.message}` });
        return result;
      }
    }

    // 2. CSV parsing
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      result.errors.push({ row: 0, reason: 'CSV must contain at least a header row and 1 data row.' });
      return result;
    }

    // Expected format: question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,explanation
    const dataLines = lines.slice(1);
    dataLines.forEach((line, idx) => {
      const rowNum = idx + 2;
      // CSV regex to handle quotes
      const cells: string[] = [];
      let inQuotes = false;
      let currentCell = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());

      if (cells.length < 6) {
        result.errors.push({ row: rowNum, reason: `Row has ${cells.length} columns, expected at least 6.` });
        return;
      }

      const [qText, optA, optB, optC, optD, corr, diff, exp] = cells;
      const cleanCorr = corr?.toUpperCase()?.replace(/["']/g, '');

      if (!['A', 'B', 'C', 'D'].includes(cleanCorr)) {
        result.errors.push({ row: rowNum, reason: `Invalid correct option "${corr}". Expected A, B, C, or D.` });
        return;
      }

      result.successful.push({
        question_id: Date.now() + idx,
        topic_id: defaultTopicId,
        question_text: qText.replace(/^"|"$/g, ''),
        option_a: optA.replace(/^"|"$/g, ''),
        option_b: optB.replace(/^"|"$/g, ''),
        option_c: optC.replace(/^"|"$/g, ''),
        option_d: optD.replace(/^"|"$/g, ''),
        correct_option: cleanCorr as 'A' | 'B' | 'C' | 'D',
        difficulty: (['EASY', 'MEDIUM', 'HARD'].includes(diff?.toUpperCase()) ? diff.toUpperCase() : 'MEDIUM') as any,
        explanation: (exp || 'Standard NISM Assessment Explanation.').replace(/^"|"$/g, '')
      });
    });

    return result;
  },

  /**
   * AI Content Generation Helper - ALWAYS produces DRAFT content
   */
  async generateAIDraft(
    type: 'LESSON_OUTLINE' | 'QUIZ_QUESTIONS' | 'TAMIL_TRANSLATION' | 'SUMMARY_TAKEAWAYS',
    inputContext: {
      topicTitle?: string;
      lessonTitle?: string;
      sourceText?: string;
      difficulty?: string;
    }
  ): Promise<{ success: boolean; result: any; error?: string }> {
    // Artificial latency for realism
    await new Promise(r => setTimeout(r, 600));

    if (type === 'LESSON_OUTLINE') {
      const title = inputContext.lessonTitle || 'Derivatives Risk Management';
      return {
        success: true,
        result: {
          title: `Draft Outline: ${title}`,
          objectives: [
            `Understand the foundational principles of ${title}`,
            'Compute regulatory margin requirements per SEBI norms',
            'Analyze risk-return trade-offs under varying market volatilities'
          ],
          sections: [
            { heading: '1. Executive Regulatory Overview', points: ['Statutory framework', 'Eligibility criteria for market participants'] },
            { heading: '2. Mathematical Formulation & Greeks', points: ['Primary formula derivation', 'Sensitivity analysis with respect to underlying asset'] },
            { heading: '3. Institutional Practical Case Study', points: ['Real-world trade execution scenario', 'Stop-loss and tail-risk hedging mitigation'] }
          ],
          status: 'DRAFT' as ContentStatus
        }
      };
    }

    if (type === 'QUIZ_QUESTIONS') {
      const topic = inputContext.topicTitle || 'NISM Series VIII';
      return {
        success: true,
        result: [
          {
            question_text: `In the context of ${topic}, when an institutional trader goes long on an Out-of-The-Money (OTM) Call option with Delta = 0.25, what is the expected change in option premium for a ₹10 increase in the underlying spot price?`,
            option_a: '₹0.25',
            option_b: '₹2.50',
            option_c: '₹10.00',
            option_d: '₹25.00',
            correct_option: 'B',
            difficulty: 'MEDIUM',
            explanation: 'Option Delta (Δ) measures the rate of change of option premium with respect to a unit change in the underlying spot price. Expected Premium Change = Delta × Spot Change = 0.25 × ₹10 = ₹2.50.'
          },
          {
            question_text: `Under SEBI derivatives margining guidelines, what component of total margin is designed to cover the maximum loss that could occur over a specified liquidation period at a 99% confidence level?`,
            option_a: 'Extreme Loss Margin (ELM)',
            option_b: 'Value at Risk (VaR) SPAN Margin',
            option_c: 'Mark to Market (MTM) Margin',
            option_d: 'Delivery Margin',
            correct_option: 'B',
            difficulty: 'HARD',
            explanation: 'SPAN (Standard Portfolio Analysis of Risk) VaR margin is calculated at a 99% confidence level using portfolio risk scenarios across underlying price and volatility variations.'
          }
        ]
      };
    }

    if (type === 'TAMIL_TRANSLATION') {
      const english = inputContext.sourceText || '';
      return {
        success: true,
        result: {
          tamil_title: 'பங்குவழிப் பங்கீட்டு மற்றும் வழித்தோன்றல்கள் (Equity & Derivatives)',
          tamil_content: `### பாடத்தின் கண்ணோட்டம் (Overview)\n\n${english ? 'ஆங்கில மூலத்தின் அதிகாரப்பூர்வ மொழிபெயர்ப்பு:\n\n' : ''}பங்குச் சந்தை முதலீடுகள் மற்றும் டெரிவேடிவ்ஸ் சந்தைகளில் உள்ள நஷ்ட இடர்களை (Risks) சீராகக் கையாள செபி (SEBI) விதிமுறைகள் மிக இன்றியமையாதவை.\n\n$$\\Delta = \\frac{\\partial V}{\\partial S}$$\n\n**முக்கிய குறிப்புகள்:**\n- முதலீட்டு மூலதனப் பாதுகாப்பு\n- ஸ்பான் மார்ஜின் (SPAN Margin) கணக்கீடுகள்\n- நேரடி விலை நகர்வு உத்திகள்`,
          status: 'DRAFT' as ContentStatus
        }
      };
    }

    if (type === 'SUMMARY_TAKEAWAYS') {
      return {
        success: true,
        result: {
          key_takeaways: [
            'Regulatory compliance is mandatory prior to trading high-leverage derivative instruments.',
            'Delta, Gamma, Theta, and Vega govern option pricing decay and sensitivity.',
            'SPAN Margining protects clearing houses from tail-risk counterparty defaults.'
          ]
        }
      };
    }

    return { success: false, result: null, error: 'Unknown AI draft request type.' };
  }
};

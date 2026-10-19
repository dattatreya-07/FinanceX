import { 
  Question, 
  ItemAnalysisMetrics, 
  AIItemRevisionProposal, 
  QuestionOption,
  User
} from '../types/schema';
import { MOCK_QUESTIONS } from '../data/mockData';
import { adminService } from './adminService';

const STORAGE_KEY = 'fx_ai_item_revision_proposals';

const SEED_PROPOSALS: AIItemRevisionProposal[] = [
  {
    proposal_id: 'prop-rev-101',
    question_id: 1,
    question_text_original: 'What is the primary role of an equity derivatives market in financial systems?',
    question_text_proposed: 'In modern financial systems, which of the following best characterizes the dual economic function of exchange-traded equity derivatives?',
    options_original: [
      { key: 'A', text: 'To guarantee fixed annual profits for retail investors', is_correct: false },
      { key: 'B', text: 'Facilitating price discovery and hedging / transferring financial risk', is_correct: true },
      { key: 'C', text: 'Eliminating market volatility completely', is_correct: false },
      { key: 'D', text: 'Regulating credit rating agencies', is_correct: false }
    ],
    options_proposed: [
      { key: 'A', text: 'Eliminating systematic market risk through guaranteed central counterparty yields', is_correct: false },
      { key: 'B', text: 'Enhancing continuous price discovery and enabling efficient institutional risk transfer/hedging', is_correct: true },
      { key: 'C', text: 'Serving as the primary issuance mechanism for corporate initial public offerings (IPOs)', is_correct: false },
      { key: 'D', text: 'Establishing statutory reserve requirements for schedule commercial banks', is_correct: false }
    ],
    explanation_original: 'Derivatives exist for price discovery and risk management.',
    explanation_proposed: 'Equity derivatives primarily provide institutional price discovery and allow market participants to hedge and redistribute systemic and portfolio risks efficiently.',
    discrimination_index: 0.14,
    difficulty_index: 0.94,
    reason: 'Original item had overly obvious distractors (p=0.94, D=0.14). Distractors A, C, and D were implausible. Proposed revision enhances distractor plausibility and sharpens institutional focus.',
    status: 'PENDING_REVIEW',
    created_at: '2026-03-20T08:30:00Z'
  },
  {
    proposal_id: 'prop-rev-102',
    question_id: 2,
    question_text_original: 'Which option Greek measures the sensitivity of option price to changes in underlying asset volatility?',
    question_text_proposed: 'When constructing a delta-neutral options portfolio, which first-order Greek parameter quantifies the change in derivative contract value per 1% change in implied volatility (σ)?',
    options_original: [
      { key: 'A', text: 'Delta', is_correct: false },
      { key: 'B', text: 'Gamma', is_correct: false },
      { key: 'C', text: 'Vega', is_correct: true },
      { key: 'D', text: 'Theta', is_correct: false }
    ],
    options_proposed: [
      { key: 'A', text: 'Delta (∂V/∂S)', is_correct: false },
      { key: 'B', text: 'Gamma (∂²V/∂S²)', is_correct: false },
      { key: 'C', text: 'Vega (∂V/∂σ)', is_correct: true },
      { key: 'D', text: 'Rho (∂V/∂r)', is_correct: false }
    ],
    explanation_original: 'Vega measures sensitivity to volatility.',
    explanation_proposed: 'Vega (∂V/∂σ) measures the sensitivity of the option price with respect to changes in implied volatility of the underlying asset.',
    discrimination_index: 0.18,
    difficulty_index: 0.88,
    reason: 'Item had weak discrimination (D=0.18) due to direct recall. Proposed revision introduces formal partial derivative notation and portfolio context.',
    status: 'PENDING_REVIEW',
    created_at: '2026-03-20T09:15:00Z'
  }
];

let inMemoryProposals: AIItemRevisionProposal[] = [...SEED_PROPOSALS];

export const itemRevisionService = {
  /**
   * Load all item revision proposals (persisted or seed)
   */
  getAllProposals(): AIItemRevisionProposal[] {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Fallback to in-memory on parse error
        }
      }
    }
    return [...inMemoryProposals];
  },

  /**
   * Get proposals awaiting assessment manager review
   */
  getPendingProposals(): AIItemRevisionProposal[] {
    return this.getAllProposals().filter((p) => p.status === 'PENDING_REVIEW');
  },

  /**
   * Save proposals to localStorage and in-memory cache
   */
  saveProposals(proposals: AIItemRevisionProposal[]): void {
    inMemoryProposals = [...proposals];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    }
  },

  /**
   * Generate a proposed AI revision for an item flagged with psychometric issues
   */
  generateRevisionProposal(
    question: Question,
    metrics: ItemAnalysisMetrics
  ): AIItemRevisionProposal {
    const isTooEasy = metrics.difficulty_index_p > 0.90;
    const isPoorDiscrimination = metrics.discrimination_index_d < 0.20;
    const isTooHard = metrics.difficulty_index_p < 0.20;

    let reason = 'AI Psychometric Quality Optimization.';
    if (isTooEasy) {
      reason = `Item exhibits excessively high pass rate (p=${metrics.difficulty_index_p}). Distractors lack plausible competition; proposed revision strengthens financial distractor plausibility.`;
    } else if (isPoorDiscrimination) {
      reason = `Item exhibits low discrimination (D=${metrics.discrimination_index_d}). High and low performers answered similarly. Proposed revision removes potential ambiguity and sharpens the conceptual premise.`;
    } else if (isTooHard) {
      reason = `Item exhibits excessively low pass rate (p=${metrics.difficulty_index_p}). Proposed revision clarifies the question stem and eliminates unintended trick phrasing.`;
    }

    const originalOptions: QuestionOption[] = [
      { key: 'A', text: question.option_a, is_correct: question.correct_option === 'A' },
      { key: 'B', text: question.option_b, is_correct: question.correct_option === 'B' },
      { key: 'C', text: question.option_c, is_correct: question.correct_option === 'C' },
      { key: 'D', text: question.option_d, is_correct: question.correct_option === 'D' }
    ];

    // Propose enhanced options with clarified wording
    const proposedStem = `In institutional finance practice, ${question.question_text.charAt(0).toLowerCase() + question.question_text.slice(1)}`;
    const proposedOptions: QuestionOption[] = originalOptions.map((opt) => ({
      ...opt,
      text: opt.is_correct 
        ? `${opt.text} (aligned with standard institutional market conventions)`
        : `${opt.text} under non-standard market conditions`
    }));

    const newProposal: AIItemRevisionProposal = {
      proposal_id: `prop-rev-${Date.now()}-${question.question_id}`,
      question_id: question.question_id,
      question_text_original: question.question_text,
      question_text_proposed: proposedStem,
      options_original: originalOptions,
      options_proposed: proposedOptions,
      explanation_original: question.explanation,
      explanation_proposed: `${question.explanation} (Updated with rigorous psychometric rationale for standard institutional certification).`,
      discrimination_index: metrics.discrimination_index_d,
      difficulty_index: metrics.difficulty_index_p,
      reason,
      status: 'PENDING_REVIEW',
      created_at: new Date().toISOString()
    };

    const current = this.getAllProposals();
    // Replace existing pending proposal for same question or append
    const filtered = current.filter((p) => !(p.question_id === question.question_id && p.status === 'PENDING_REVIEW'));
    const updated = [newProposal, ...filtered];
    this.saveProposals(updated);

    return newProposal;
  },

  /**
   * Human-in-the-loop: Assessment manager approves proposal
   */
  approveProposal(proposalId: string, reviewer: User | string | number = 'admin-user'): AIItemRevisionProposal | null {
    // Check administrative authorization if reviewer is a User object
    if (typeof reviewer === 'object' && reviewer !== null) {
      if (!adminService.hasAdminPrivileges(reviewer)) {
        console.warn('Security Violation: Unauthorized user attempted to approve AI item revision.');
        return null;
      }
    }

    const reviewerUserId = typeof reviewer === 'object' && reviewer !== null ? reviewer.user_id : reviewer;
    const all = this.getAllProposals();
    const index = all.findIndex((p) => p.proposal_id === proposalId);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      status: 'APPROVED',
      reviewed_by_user_id: reviewerUserId,
      reviewed_at: new Date().toISOString()
    };

    this.saveProposals(all);

    // Record immutable audit action
    try {
      adminService.logAdminAction(
        reviewerUserId,
        'APPROVE',
        'QUESTION',
        all[index].question_id,
        `AI Revision Approved for Question #${all[index].question_id}`,
        {
          action: 'AI_ITEM_REVISION_APPROVED',
          proposal_id: proposalId,
          reviewer: reviewerUserId,
          reason: all[index].reason
        }
      );
    } catch {
      // Non-blocking in headless environments
    }

    return all[index];
  },

  /**
   * Human-in-the-loop: Assessment manager rejects proposal
   */
  rejectProposal(proposalId: string, reviewer: User | string | number = 'admin-user', rejectionNote?: string): AIItemRevisionProposal | null {
    // Check administrative authorization if reviewer is a User object
    if (typeof reviewer === 'object' && reviewer !== null) {
      if (!adminService.hasAdminPrivileges(reviewer)) {
        console.warn('Security Violation: Unauthorized user attempted to reject AI item revision.');
        return null;
      }
    }

    const reviewerUserId = typeof reviewer === 'object' && reviewer !== null ? reviewer.user_id : reviewer;
    const all = this.getAllProposals();
    const index = all.findIndex((p) => p.proposal_id === proposalId);
    if (index === -1) return null;

    all[index] = {
      ...all[index],
      status: 'REJECTED',
      reviewed_by_user_id: reviewerUserId,
      reviewed_at: new Date().toISOString(),
      reason: rejectionNote ? `${all[index].reason} [Rejected: ${rejectionNote}]` : all[index].reason
    };

    this.saveProposals(all);

    // Record immutable audit action
    try {
      adminService.logAdminAction(
        reviewerUserId,
        'REJECT',
        'QUESTION',
        all[index].question_id,
        `AI Revision Rejected for Question #${all[index].question_id}`,
        {
          action: 'AI_ITEM_REVISION_REJECTED',
          proposal_id: proposalId,
          reviewer: reviewerUserId,
          note: rejectionNote
        }
      );
    } catch {
      // Non-blocking in headless environments
    }

    return all[index];
  }
};

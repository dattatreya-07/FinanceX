import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Layers, 
  Search, 
  Filter, 
  Sparkles, 
  BrainCircuit, 
  HelpCircle, 
  ArrowUpRight, 
  Eye, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { 
  Question, 
  Topic, 
  Certification, 
  ItemAnalysisMetrics, 
  CohortBenchmark, 
  CohortDimension,
  PopulationTopicDifficulty,
  InterventionType
} from '../../types/schema';
import { assessmentIntelligenceService } from '../../services/assessmentIntelligenceService';
import { cohortAnalyticsService } from '../../services/cohortAnalyticsService';
import { learningLoopService } from '../../services/learningLoopService';
import { MOCK_QUESTIONS, MOCK_TOPICS, MOCK_CERTIFICATIONS } from '../../data/mockData';

interface InstitutionalAnalyticsViewProps {
  questions?: Question[];
  topics?: Topic[];
  certifications?: Certification[];
}

export const InstitutionalAnalyticsView: React.FC<InstitutionalAnalyticsViewProps> = ({
  questions = MOCK_QUESTIONS,
  topics = MOCK_TOPICS,
  certifications = MOCK_CERTIFICATIONS
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'ITEM_ANALYSIS' | 'COHORTS' | 'INTERVENTIONS'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
  const [cohortDimensionFilter, setCohortDimensionFilter] = useState<CohortDimension | 'ALL'>('ALL');

  // 1. Psychometric Item Analysis Metrics
  const itemMetrics: ItemAnalysisMetrics[] = assessmentIntelligenceService.computeItemAnalysis(questions);
  const itemSummary = assessmentIntelligenceService.getQuestionAnalysisSummary(itemMetrics);

  // 2. Cohort Benchmarks
  const cohortBenchmarks: CohortBenchmark[] = cohortAnalyticsService.getCohortBenchmarks(
    cohortDimensionFilter !== 'ALL' ? { dimension: cohortDimensionFilter } : undefined
  );

  // 3. Population Topic Difficulty Heatmap
  const populationDifficulty: PopulationTopicDifficulty[] = learningLoopService.computePopulationTopicDifficulty();

  // 4. Intervention Efficacy Summaries
  const interventionSummaries = learningLoopService.getInterventionEfficacySummary();

  // Filtered Item Metrics
  const filteredItemMetrics = itemMetrics.filter((m) => {
    const matchesSearch = m.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.topic_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.quality_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="institutional-analytics-view">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
              Evidence-Driven Assessment & Institutional Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-100 text-pink-700 dark:bg-[#00E599]/20 dark:text-[#00E599]">
              PHASE 29
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Psychometric item discrimination, privacy-preserving cohort distributions, and empirical intervention efficacy analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span>N ≥ 5 Privacy Guard Active</span>
          </span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 block">TOTAL POPULATION ASSESSMENTS</span>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-1">
            1,248 <span className="text-xs font-normal text-emerald-600 dark:text-[#00E599] font-bold">(+18% MoM)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Across 5 NISM & CFA modules</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 block">ITEM PSYCHOMETRIC HEALTH</span>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-[#00E599] mt-1">
            {itemSummary.healthyItemRatioPct}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {itemSummary.excellentCount} High Discrimination (D ≥ 0.40)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 block">POPULATION BENCHMARK PASS RATE</span>
          <div className="text-2xl font-mono font-black text-cyan-600 dark:text-cyan-400 mt-1">
            68.2%
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Mean Readiness: 72.4 / 100</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono font-bold text-slate-500 block">INTERVENTION NET EFFICACY</span>
          <div className="text-2xl font-mono font-black text-pink-600 dark:text-pink-400 mt-1">
            +28.5% Δ
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Average post-remediation score gain</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'OVERVIEW', label: 'Population Heatmap', icon: <Layers className="w-4 h-4" /> },
          { id: 'ITEM_ANALYSIS', label: 'Item Discrimination Matrix', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'COHORTS', label: 'Cohort Benchmarks & Distributions', icon: <Users className="w-4 h-4" /> },
          { id: 'INTERVENTIONS', label: 'Intervention Efficacy', icon: <BrainCircuit className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: OVERVIEW / POPULATION DIFFICULTY HEATMAP */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Population Concept Difficulty Heatmap
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregated learner error rates across curriculum domains. Pinpoints curriculum bottlenecks requiring instructional remediation.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                5 Curriculum Topics Evaluated
              </span>
            </div>

            <div className="space-y-3">
              {populationDifficulty.map((p) => {
                const isHard = p.error_rate_pct > 35;
                const isModerate = p.error_rate_pct >= 25 && p.error_rate_pct <= 35;
                return (
                  <div
                    key={p.topic_id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        p.difficulty_rank === 1 
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        #{p.difficulty_rank}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {p.topic_name}
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                          {p.total_assessments_taken} assessments • {p.learners_needing_remediation_count} learners needing remediation
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="w-48 hidden md:block">
                        <div className="flex justify-between text-[10px] font-mono mb-1">
                          <span className="text-slate-500">Accuracy</span>
                          <span className="font-bold text-slate-900 dark:text-white">{p.average_accuracy_pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isHard ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${p.average_accuracy_pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 block">ERROR RATE</span>
                        <span className={`text-sm font-mono font-bold ${isHard ? 'text-rose-600 dark:text-rose-400' : isModerate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-[#00E599]'}`}>
                          {p.error_rate_pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ITEM DISCRIMINATION MATRIX */}
      {activeSubTab === 'ITEM_ANALYSIS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Psychometric Question Bank Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Item difficulty ($p$-value), Discrimination index ($D$), and distractor distribution matrix.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="ALL">All Quality Statuses</option>
                  <option value="EXCELLENT">Excellent (D ≥ 0.40)</option>
                  <option value="GOOD">Good (D ≥ 0.30)</option>
                  <option value="FAIR">Fair (D ≥ 0.20)</option>
                  <option value="POOR_DISCRIMINATION">Poor Discrimination</option>
                  <option value="TOO_EASY">Too Easy (p &gt; 0.95)</option>
                  <option value="TOO_HARD">Too Hard (p &lt; 0.20)</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Item #</th>
                    <th className="py-2.5 px-3">Question Stem</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3">p-Value (Diff)</th>
                    <th className="py-2.5 px-3">D-Index (Discrim)</th>
                    <th className="py-2.5 px-3">Distractors (A/B/C/D)</th>
                    <th className="py-2.5 px-3">Quality Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredItemMetrics.map((m) => (
                    <tr key={m.question_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-bold text-slate-500">#{m.question_id}</td>
                      <td className="py-3 px-3 font-sans max-w-xs font-medium text-slate-900 dark:text-white truncate">
                        {m.question_text}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{m.topic_name}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{m.difficulty_index_p}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-[#00E599]">+{m.discrimination_index_d}</td>
                      <td className="py-3 px-3 text-slate-500 text-[10px]">
                        {m.distractor_distribution.A}% / {m.distractor_distribution.B}% / {m.distractor_distribution.C}% / {m.distractor_distribution.D}%
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.quality_status === 'EXCELLENT'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#00E599]'
                            : m.quality_status === 'GOOD'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}>
                          {m.quality_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COHORT BENCHMARKS */}
      {activeSubTab === 'COHORTS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Institutional Cohort Benchmark Distributions
                </h3>
                <p className="text-xs text-slate-500">
                  Privacy-preserving percentiles and pass-rate curves across certification cohorts ($N \ge 5$ threshold enforced).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCohortDimensionFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                    cohortDimensionFilter === 'ALL'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  All Dimensions
                </button>
                <button
                  onClick={() => setCohortDimensionFilter('CERTIFICATION_STREAM')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                    cohortDimensionFilter === 'CERTIFICATION_STREAM'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  Certification Stream
                </button>
                <button
                  onClick={() => setCohortDimensionFilter('INSTITUTIONAL_BATCH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                    cohortDimensionFilter === 'INSTITUTIONAL_BATCH'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  Institutional Batches
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cohortBenchmarks.map((c) => (
                <div
                  key={c.cohort_id}
                  className={`p-5 rounded-2xl border ${
                    c.is_privacy_suppressed
                      ? 'bg-slate-100/60 border-slate-300 dark:bg-slate-900/30 dark:border-slate-800/80 opacity-70'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.dimension}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Sample Size: N = {c.total_learners_n}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                    {c.cohort_name}
                  </h4>

                  {c.is_privacy_suppressed ? (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Privacy Threshold Protected: Sample size N &lt; 5. Aggregate distribution suppressed to prevent de-anonymization.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-[9px] text-slate-400 block">p25</span>
                          <span className="font-bold">{c.percentiles.p25}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">p50 (Median)</span>
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">{c.percentiles.p50}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">p75</span>
                          <span className="font-bold">{c.percentiles.p75}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">p90</span>
                          <span className="font-bold text-emerald-600 dark:text-[#00E599]">{c.percentiles.p90}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-slate-500">Pass Rate: <strong className="text-slate-900 dark:text-white">{c.pass_rate_pct}%</strong></span>
                        <span className="text-slate-500">Mean: <strong className="text-slate-900 dark:text-white">{c.percentiles.mean}%</strong> (σ={c.percentiles.std_dev})</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INTERVENTION EFFICACY */}
      {activeSubTab === 'INTERVENTIONS' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                Educational Intervention Efficacy Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Empirical pre/post score gain comparisons ($\Delta\%$) across Adaptive Practice, Spaced Review, and AI Coaching.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {interventionSummaries.map((inv) => (
                <div
                  key={inv.intervention_type}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                      {inv.intervention_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#00E599]">
                      +{inv.mean_delta}% Δ
                    </span>
                  </div>

                  <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                    {inv.success_rate_pct}%
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Intervention Success Rate ({inv.effective_count}/{inv.total_interventions} resolved gaps)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

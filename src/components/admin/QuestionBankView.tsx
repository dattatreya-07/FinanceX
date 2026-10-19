import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Trash2, 
  UploadCloud, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Code,
  FileSpreadsheet
} from 'lucide-react';
import { Question, Topic } from '../../types/schema';
import { contentAdminService, BulkQuestionImportResult } from '../../services/contentAdminService';

interface QuestionBankViewProps {
  questions: Question[];
  topics: Topic[];
  onSaveQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
  onDuplicateQuestion: (questionId: number) => void;
  onBulkImport: (importedQuestions: Question[]) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  topics,
  onSaveQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onBulkImport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<number | 'ALL'>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  // Question Creator Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qTopicId, setQTopicId] = useState<number>(topics[0]?.topic_id || 1);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [explanation, setExplanation] = useState('');

  // Bulk Import Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkResult, setBulkResult] = useState<BulkQuestionImportResult | null>(null);

  const openCreateModal = () => {
    setEditingQuestion(null);
    setQTopicId(topics[0]?.topic_id || 1);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectOpt('A');
    setDifficulty('MEDIUM');
    setExplanation('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setQTopicId(q.topic_id);
    setQText(q.question_text);
    setOptA(q.option_a);
    setOptB(q.option_b);
    setOptC(q.option_c);
    setOptD(q.option_d);
    setCorrectOpt(q.correct_option);
    setDifficulty(q.difficulty);
    setExplanation(q.explanation);
    setIsModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) return;

    const updated: Question = {
      question_id: editingQuestion ? editingQuestion.question_id : Date.now(),
      topic_id: qTopicId,
      question_text: qText.trim(),
      option_a: optA.trim(),
      option_b: optB.trim(),
      option_c: optC.trim(),
      option_d: optD.trim(),
      correct_option: correctOpt,
      difficulty,
      explanation: explanation.trim() || 'Standard regulatory examination rationalization.'
    };

    onSaveQuestion(updated);
    setIsModalOpen(false);
  };

  const handleBulkDryRun = () => {
    const res = contentAdminService.parseBulkQuestions(bulkInputText, Number(qTopicId) || 1);
    setBulkResult(res);
  };

  const handleConfirmBulkImport = () => {
    if (bulkResult && bulkResult.successful.length > 0) {
      onBulkImport(bulkResult.successful);
      setBulkInputText('');
      setBulkResult(null);
      setIsBulkModalOpen(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'ALL' || q.topic_id === topicFilter;
    const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesTopic && matchesDiff;
  });

  return (
    <div className="space-y-6" id="question-bank-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-pink-600 dark:text-[#00E599]" />
            Regulatory Question Bank
          </h1>
          <p className="text-xs text-slate-500">
            Authoritative assessment repository for NISM Series I, V-A, VIII, XV, and quant certification exams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBulkResult(null);
              setIsBulkModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-800 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-[#00E599]" />
            <span>Bulk CSV / JSON Import</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Question</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by scenario, calculation, or explanation keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Topics</option>
            {topics.map((t) => (
              <option key={t.topic_id} value={t.topic_id}>{t.topic_name}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const topic = topics.find(t => t.topic_id === q.topic_id);

          return (
            <div
              key={q.question_id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-pink-300 dark:hover:border-[#00E599]/40 transition group theme-transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      Q#{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      q.difficulty === 'HARD' ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' :
                      q.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' :
                      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {topic?.topic_name || 'Regulatory Fundamentals'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug pt-1">
                    {q.question_text}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title="Edit MCQ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDuplicateQuestion(q.question_id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                    title="Duplicate MCQ"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteQuestion(q.question_id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition"
                    title="Delete MCQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d },
                ].map((opt) => {
                  const isCorrect = q.correct_option === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span><strong className="mr-1">{opt.key})</strong> {opt.text}</span>
                      {isCorrect && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-[#00E599]/20 text-emerald-800 dark:text-[#00E599] font-bold">
                          CORRECT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    REGULATORY EXPLANATION & CALCULATION
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {editingQuestion ? 'Edit Regulatory MCQ' : 'Create Question'}
                </h3>
                <p className="text-xs text-slate-500">Configure choices, correct option, and regulatory explanation.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Regulatory Topic *
                  </label>
                  <select
                    value={qTopicId}
                    onChange={(e) => setQTopicId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    {topics.map((t) => (
                      <option key={t.topic_id} value={t.topic_id}>{t.topic_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Text (Supports LaTeX $$...$$) *
                </label>
                <textarea
                  rows={3}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. When an investor purchases a protective put, what is their maximum downside loss?"
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const val = opt === 'A' ? optA : opt === 'B' ? optB : opt === 'C' ? optC : optD;
                  const setVal = opt === 'A' ? setOptA : opt === 'B' ? setOptB : opt === 'C' ? setOptC : setOptD;

                  return (
                    <div key={opt}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Option {opt} *
                        </label>
                        <label className="flex items-center gap-1 text-[11px] font-mono cursor-pointer">
                          <input
                            type="radio"
                            name="correct_option"
                            checked={correctOpt === opt}
                            onChange={() => setCorrectOpt(opt as any)}
                          />
                          <span className={correctOpt === opt ? 'text-pink-600 dark:text-[#00E599] font-bold' : 'text-slate-400'}>
                            Correct Choice
                          </span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Regulatory Explanation & Rationalization
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Reference relevant SEBI guidelines or mathematical formula derivations..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV / JSON Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-[#00E599]" />
                  Bulk Question Importer
                </h3>
                <p className="text-xs text-slate-500">Paste CSV or JSON array with automatic validation and error reporting.</p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [✕]
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Expected CSV Header:</div>
                <div>question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,explanation</div>
              </div>

              <textarea
                rows={8}
                value={bulkInputText}
                onChange={(e) => setBulkInputText(e.target.value)}
                placeholder={`question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,explanation\n"What is Delta of an ATM call option?","0.0","0.5","1.0","-0.5","B","MEDIUM","ATM options have a delta close to 0.50."`}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
              />

              <button
                onClick={handleBulkDryRun}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Validate & Dry-Run Parse
              </button>

              {bulkResult && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-emerald-600 dark:text-[#00E599]">
                      ✓ {bulkResult.successful.length} Valid Records Ready
                    </span>
                    {bulkResult.errors.length > 0 && (
                      <span className="text-rose-500">
                        ✕ {bulkResult.errors.length} Rows with Errors
                      </span>
                    )}
                  </div>

                  {bulkResult.errors.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 space-y-1">
                      {bulkResult.errors.map((err, i) => (
                        <div key={i}>Row {err.row}: {err.reason}</div>
                      ))}
                    </div>
                  )}

                  {bulkResult.successful.length > 0 && (
                    <button
                      onClick={handleConfirmBulkImport}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      Confirm & Import {bulkResult.successful.length} Questions
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

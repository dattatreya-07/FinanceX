import React, { useState } from 'react';
import { Sparkles, Bot, Check, AlertCircle, Copy, ArrowRight, Loader2 } from 'lucide-react';
import { contentAdminService } from '../../services/contentAdminService';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (type: string, generatedData: any) => void;
  defaultTopic?: string;
  defaultTitle?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
  defaultTopic = 'NISM Series VIII: Equity Derivatives',
  defaultTitle = ''
}) => {
  const [taskType, setTaskType] = useState<'LESSON_OUTLINE' | 'QUIZ_QUESTIONS' | 'TAMIL_TRANSLATION' | 'SUMMARY_TAKEAWAYS'>('LESSON_OUTLINE');
  const [topicTitle, setTopicTitle] = useState(defaultTopic);
  const [lessonTitle, setLessonTitle] = useState(defaultTitle || 'Options Delta & Margining');
  const [sourceText, setSourceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null);

    try {
      const res = await contentAdminService.generateAIDraft(taskType, {
        topicTitle,
        lessonTitle,
        sourceText
      });

      if (res.success) {
        setGeneratedOutput(res.result);
      } else {
        setError(res.error || 'AI generation failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI tutor engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedOutput) {
      onApplyResult(taskType, generatedOutput);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-600 dark:bg-[#00E599]/15 dark:text-[#00E599]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
                AI Curriculum Assistant
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                  DRAFT ONLY
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-rigor NISM educational drafts. All AI content is marked DRAFT for manual review.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono cursor-pointer"
          >
            Close [✕]
          </button>
        </div>

        {/* Task Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'LESSON_OUTLINE', label: 'Lesson Outline' },
            { id: 'QUIZ_QUESTIONS', label: 'Quiz Questions' },
            { id: 'TAMIL_TRANSLATION', label: 'Tamil Draft' },
            { id: 'SUMMARY_TAKEAWAYS', label: 'Key Takeaways' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTaskType(tab.id as any);
                setGeneratedOutput(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer text-center border ${
                taskType === tab.id
                  ? 'bg-pink-600 text-white dark:bg-[#00E599] dark:text-slate-950 border-transparent shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Course / Regulatory Topic
              </label>
              <input
                type="text"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Lesson / Concept Title
              </label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
              />
            </div>
          </div>

          {(taskType === 'TAMIL_TRANSLATION' || taskType === 'SUMMARY_TAKEAWAYS') && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Source English Content / Text
              </label>
              <textarea
                rows={3}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste English text to summarize or translate into Tamil..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
              />
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-pink-500 dark:text-[#00E599]" />
                <span>Synthesizing NISM Curriculum Draft...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-pink-500 dark:text-[#00E599]" />
                <span>Generate Draft Content</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Output Preview */}
        {generatedOutput && (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Generated Draft Output:
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-[#00E599] font-bold">
                ✓ Ready for insertion
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {typeof generatedOutput === 'string' ? generatedOutput : JSON.stringify(generatedOutput, null, 2)}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Insert as Draft</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

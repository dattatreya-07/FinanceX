import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Trash2, 
  Plus, 
  Languages, 
  Code, 
  Check, 
  HelpCircle, 
  Link, 
  Video, 
  Download,
  AlertCircle
} from 'lucide-react';
import { Lesson, LessonContent, LessonResource, Course, Topic, ContentStatus } from '../../types/schema';
import { mediaService } from '../../services/mediaService';
import { AIAssistantModal } from './AIAssistantModal';

interface LessonEditorViewProps {
  lesson: Lesson;
  lessonContent?: LessonContent;
  lessonResources?: LessonResource[];
  courses: Course[];
  topics: Topic[];
  tamilContent?: string;
  tamilTitle?: string;
  onSaveLesson: (
    lesson: Lesson, 
    content: Partial<LessonContent>, 
    resources: LessonResource[],
    tamilData?: { title: string; content: string }
  ) => void;
  onPreview: () => void;
}

export const LessonEditorView: React.FC<LessonEditorViewProps> = ({
  lesson,
  lessonContent,
  lessonResources = [],
  courses,
  topics,
  tamilContent = '',
  tamilTitle = '',
  onSaveLesson,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'FORMULAS' | 'RESOURCES' | 'TAMIL'>('CONTENT');

  // Lesson Metadata
  const [title, setTitle] = useState(lesson.title);
  const [courseId, setCourseId] = useState(lesson.course_id);
  const [topicId, setTopicId] = useState(lesson.topic_id);
  const [estimatedMins, setEstimatedMins] = useState(lesson.estimated_mins || 15);
  const [status, setStatus] = useState<ContentStatus>(lesson.status || 'PUBLISHED');

  // Content
  const [rawBody, setRawBody] = useState(lessonContent?.raw_body || '');
  const [contentType, setContentType] = useState<'MARKDOWN_TEXT' | 'VIDEO' | 'INTERACTIVE_CALCULATOR' | 'FLOWCHART'>(lessonContent?.content_type || 'MARKDOWN_TEXT');
  const [contentUrl, setContentUrl] = useState(lessonContent?.content_url || '');

  // Formulas List
  const [formulas, setFormulas] = useState<{ label: string; formula: string; explanation: string }[]>(
    lessonContent?.formulas || [
      { label: 'Option Delta (Δ)', formula: '\\Delta = \\frac{\\partial V}{\\partial S}', explanation: 'Sensitivity of option price with respect to underlying spot.' }
    ]
  );

  // Key Takeaways
  const [takeaways, setTakeaways] = useState<string[]>(
    lessonContent?.key_takeaways || [
      'Regulatory SEBI framework compliance is mandatory for derivatives clearing.',
      'Margin requirements protect against extreme volatility anomalies.'
    ]
  );
  const [newTakeaway, setNewTakeaway] = useState('');

  // Resources
  const [resourcesList, setResourcesList] = useState<LessonResource[]>(lessonResources);
  const [isUploadingResource, setIsUploadingResource] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Tamil Bilingual State
  const [tTitle, setTTitle] = useState(tamilTitle || '');
  const [tBody, setTBody] = useState(tamilContent || '');

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Handle PDF / Asset Upload
  const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResource(true);
    setUploadProgress(20);

    try {
      const res = await mediaService.uploadFile(file, {
        bucket: 'educational-assets',
        folder: 'lessons',
        maxSizeBytes: 50 * 1024 * 1024,
        onProgress: (p) => setUploadProgress(p)
      });

      const newResource: LessonResource = {
        resource_id: Date.now(),
        lesson_id: lesson.lesson_id,
        resource_title: file.name.replace(/\.[^/.]+$/, ''),
        resource_url: res.url,
        resource_type: file.type.includes('pdf') ? 'PDF_CHEAT_SHEET' : 'EXTERNAL_ARTICLE',
        display_order: resourcesList.length + 1
      };

      setResourcesList(prev => [...prev, newResource]);
    } catch (err: any) {
      alert(`Resource upload failed: ${err.message}`);
    } finally {
      setIsUploadingResource(false);
      setUploadProgress(0);
    }
  };

  const handleAddFormula = () => {
    setFormulas(prev => [...prev, { label: 'New Formula', formula: 'E = mc^2', explanation: 'Description of mathematical variables.' }]);
  };

  const handleRemoveFormula = (idx: number) => {
    setFormulas(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setTakeaways(prev => [...prev, newTakeaway.trim()]);
    setNewTakeaway('');
  };

  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updatedLesson: Lesson = {
      ...lesson,
      title: title.trim(),
      course_id: courseId,
      topic_id: topicId,
      estimated_mins: Number(estimatedMins),
      status
    };

    const updatedContent: Partial<LessonContent> = {
      lesson_id: lesson.lesson_id,
      content_type: contentType,
      content_url: contentUrl,
      raw_body: rawBody,
      formulas,
      key_takeaways: takeaways
    };

    onSaveLesson(
      updatedLesson, 
      updatedContent, 
      resourcesList, 
      tTitle || tBody ? { title: tTitle, content: tBody } : undefined
    );
  };

  const handleAiApply = (type: string, data: any) => {
    if (type === 'LESSON_OUTLINE' && data?.sections) {
      const outlineText = `# ${data.title}\n\n## Learning Objectives\n` +
        data.objectives.map((o: string) => `- ${o}`).join('\n') +
        '\n\n' +
        data.sections.map((s: any) => `### ${s.heading}\n` + s.points.map((p: string) => `- ${p}`).join('\n')).join('\n\n');
      setRawBody(prev => prev ? `${prev}\n\n${outlineText}` : outlineText);
    } else if (type === 'TAMIL_TRANSLATION' && data?.tamil_content) {
      setTTitle(data.tamil_title || title);
      setTBody(data.tamil_content);
      setActiveTab('TAMIL');
    } else if (type === 'SUMMARY_TAKEAWAYS' && data?.key_takeaways) {
      setTakeaways(data.key_takeaways);
    }
  };

  return (
    <div className="space-y-6" id="lesson-editor-view">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-black text-slate-900 dark:text-white">
              Lesson Curriculum Editor
            </h1>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
              status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-[#00E599]/20 dark:text-[#00E599] dark:border-[#00E599]/40' :
              'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            LaTeX KaTeX Formula Support • Bilingual English & Tamil • Supabase PDF Vault
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-purple-200 dark:border-purple-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Draft Helper</span>
          </button>

          <button
            onClick={onPreview}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Commit</span>
          </button>
        </div>
      </div>

      {/* Metadata Configuration */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Lesson Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Publishing Lifecycle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599]"
            >
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Under Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Course Assignment
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>{c.course_title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Topic / Module
            </label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            >
              {topics.map((t) => (
                <option key={t.topic_id} value={t.topic_id}>{t.topic_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Estimated Duration (Mins)
            </label>
            <input
              type="number"
              value={estimatedMins}
              onChange={(e) => setEstimatedMins(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editor Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'CONTENT', label: 'Markdown & LaTeX Body', icon: <FileText className="w-4 h-4" /> },
          { id: 'FORMULAS', label: `Formulas (${formulas.length})`, icon: <Code className="w-4 h-4" /> },
          { id: 'RESOURCES', label: `PDFs & Assets (${resourcesList.length})`, icon: <UploadCloud className="w-4 h-4" /> },
          { id: 'TAMIL', label: 'Bilingual (Tamil) Content', icon: <Languages className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-pink-600 text-pink-600 dark:border-[#00E599] dark:text-[#00E599]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Markdown & LaTeX Body */}
      {activeTab === 'CONTENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Markdown & LaTeX KaTeX Editor</span>
              <span className="text-[10px] font-mono text-slate-400">Wrap math with $$...$$ or $...$</span>
            </div>
            <textarea
              rows={16}
              value={rawBody}
              onChange={(e) => setRawBody(e.target.value)}
              placeholder="# Introduction to Derivative Margining&#10;&#10;In Indian capital markets, SEBI mandates...&#10;&#10;$$\Delta = \frac{\partial V}{\partial S}$$"
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500 dark:focus:border-[#00E599] leading-relaxed"
            />

            {/* Key Takeaways Builder */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Key Takeaways List</span>
              <div className="space-y-1.5">
                {takeaways.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">• {t}</span>
                    <button onClick={() => handleRemoveTakeaway(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add learning outcome bullet..."
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
                  className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Pane */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Live Render Preview
            </span>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
              <div className="prose dark:prose-invert max-w-none text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                {rawBody || 'Type markdown content on the left to see live rendering preview here.'}
              </div>

              {takeaways.length > 0 && (
                <div className="p-4 rounded-xl bg-pink-50/50 dark:bg-[#00E599]/10 border border-pink-200 dark:border-[#00E599]/30 space-y-2">
                  <div className="text-xs font-bold text-pink-700 dark:text-[#00E599]">Key Takeaways</div>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                    {takeaways.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Formulas */}
      {activeTab === 'FORMULAS' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive Quantitative Formulas (KaTeX)
              </h3>
              <p className="text-xs text-slate-500">Formulas are rendered into interactive calculator cards on student lesson views.</p>
            </div>
            <button
              onClick={handleAddFormula}
              className="px-3 py-1.5 rounded-xl bg-pink-600 text-white dark:bg-[#00E599] dark:text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Formula</span>
            </button>
          </div>

          <div className="space-y-3">
            {formulas.map((form, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-pink-600 dark:text-[#00E599]">
                    Formula #{idx + 1}
                  </span>
                  <button onClick={() => handleRemoveFormula(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Formula Label</label>
                    <input
                      type="text"
                      value={form.label}
                      onChange={(e) => {
                        const updated = [...formulas];
                        updated[idx].label = e.target.value;
                        setFormulas(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">KaTeX / LaTeX Code</label>
                    <input
                      type="text"
                      value={form.formula}
                      onChange={(e) => {
                        const updated = [...formulas];
                        updated[idx].formula = e.target.value;
                        setFormulas(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-cyan-600 dark:text-cyan-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Theoretical Explanation</label>
                  <input
                    type="text"
                    value={form.explanation}
                    onChange={(e) => {
                      const updated = [...formulas];
                      updated[idx].explanation = e.target.value;
                      setFormulas(updated);
                    }}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Resources */}
      {activeTab === 'RESOURCES' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Downloadable Study Resources & PDFs
              </h3>
              <p className="text-xs text-slate-500">Upload official SEBI circulars, cheat sheets, and excel models directly into Supabase Storage.</p>
            </div>

            <label className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white dark:bg-[#00E599] dark:hover:bg-[#00B377] dark:text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
              <UploadCloud className="w-4 h-4" />
              <span>Upload PDF / File</span>
              <input
                type="file"
                accept="application/pdf,.xlsx,.csv,image/*"
                className="hidden"
                onChange={handleResourceUpload}
              />
            </label>
          </div>

          {isUploadingResource && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex justify-between text-xs font-mono text-blue-700 dark:text-blue-300">
                <span>Uploading asset to educational-assets bucket...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
                <div className="h-full bg-blue-600 dark:bg-[#00E599]" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resourcesList.map((res, idx) => (
              <div
                key={res.resource_id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="overflow-hidden space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {res.resource_title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {res.resource_type || 'PDF_CHEAT_SHEET'}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={res.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    title="Download / View Asset"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setResourcesList(prev => prev.filter(r => r.resource_id !== res.resource_id))}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Bilingual Tamil Content */}
      {activeTab === 'TAMIL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Tamil Localized Title & Body
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                tBody ? 'bg-emerald-100 text-emerald-800 dark:bg-[#00E599]/20 dark:text-[#00E599]' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {tBody ? 'TRANSLATION READY' : 'MISSING TRANSLATION (FALLBACK EN)'}
              </span>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Tamil Lesson Title</label>
              <input
                type="text"
                value={tTitle}
                onChange={(e) => setTTitle(e.target.value)}
                placeholder="எ.கா. வழித்தோன்றல்கள் மற்றும் மார்ஜின் கணக்கீடுகள்"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Tamil Content (Markdown & LaTeX)</label>
              <textarea
                rows={12}
                value={tBody}
                onChange={(e) => setTBody(e.target.value)}
                placeholder="தமிழில் உள்ள பாடப் பகுதிகள் மற்றும் சூத்திரங்கள்..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              English Reference Source
            </span>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 max-h-[380px] overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
              {rawBody || 'English source content will display here for comparison during translation.'}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyResult={handleAiApply}
        defaultTitle={title}
      />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  AlertCircle,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Globe,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { AppNavView } from '../../types/schema';
import { aiService, AskTutorResponse } from '../../services/aiService';
import { speechService, SpeechRate } from '../../services/speechService';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  formulas?: string[];
  suggestedQuizTopic?: string;
  matchedTopic?: string;
  model?: string;
  isError?: boolean;
}

interface AITutorViewProps {
  initialPrompt?: string;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialPrompt,
  onNavigate
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'ta'>('en');
  const [conversationId, setConversationId] = useState<string>('session-' + Date.now());
  const [inputQuery, setInputQuery] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [speechStatus, setSpeechStatus] = useState(speechService.getStatus());
  const [speechSpeed, setSpeechSpeed] = useState<SpeechRate>(1.0);

  // Subscribe to speechService updates
  useEffect(() => {
    const unsubscribe = speechService.subscribe((status) => {
      setSpeechStatus({ ...status, speed: speechService.getSpeed() });
    });
    return () => {
      speechService.stop();
      unsubscribe();
    };
  }, []);

  const toggleSpeechSpeed = () => {
    const nextSpeed: SpeechRate = speechSpeed === 1.0 ? 1.25 : speechSpeed === 1.25 ? 0.8 : 1.0;
    setSpeechSpeed(nextSpeed);
    speechService.setSpeed(nextSpeed);
  };

  // Sync language with localStorage / i18n
  useEffect(() => {
    const lang = localStorage.getItem('financex_language') || localStorage.getItem('i18nextLng') || 'en';
    const cleanLang = lang.startsWith('ta') ? 'ta' : 'en';
    setActiveLang(cleanLang);
  }, []);

  const initialGreetingEn = "Hello! I am your FinanceX AI Financial Educational Tutor powered by Open Financial LLM & Curriculum RAG. I specialize in NISM certifications (Series VIII, XV, V-A), quantitative derivatives math, SEBI regulations, fixed income duration, and portfolio theory.\n\nAsk any financial question or choose from the curated topics below!";
  const initialGreetingTa = "வணக்கம்! நான் உங்கள் FinanceX AI நிதி கல்வி ஆசிரியர் (AI Financial Tutor). NISM தேர்வுகள், ஆப்ஷன்ஸ் கணிதம், SEBI விதிகள், பத்திரக் கால அளவு மற்றும் போர்ட்ஃபோலியோ கோட்பாடுகளில் நான் உங்களுக்கு உதவத் தயாராக உள்ளேன்.\n\nஏதேனும் ஒரு நிதி கேள்வியைக் கேளுங்கள் அல்லது கீழே உள்ள தலைப்புகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்!";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'AI',
      text: activeLang === 'ta' ? initialGreetingTa : initialGreetingEn,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'FinanceX Knowledge RAG'
    }
  ]);

  // Update welcome message if language changes and only 1 message
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'AI',
          text: activeLang === 'ta' ? initialGreetingTa : initialGreetingEn,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'FinanceX Knowledge RAG'
        }
      ]);
    }
  }, [activeLang]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle initialPrompt trigger
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      setInputQuery(initialPrompt);
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const quickPromptsEn = [
    'What is compound interest?',
    'Explain Macaulay vs Modified Duration',
    'Difference between Call and Put options',
    'What is FCFF vs FCFE?',
    'What is Option Delta and Gamma?',
    'Explain P/E Ratio & PEG Ratio',
    'Why does diversification reduce risk?',
    'What is the Sharpe Ratio?'
  ];

  const quickPromptsTa = [
    'கூட்டு வட்டி (Compound Interest) என்றால் என்ன?',
    'பத்திரக் கால அளவு (Duration) என்றால் என்ன?',
    'கால் மற்றும் புட் ஆப்ஷன் வேறுபாடு என்ன?',
    'P/E விகிதம் எவ்வாறு கணக்கிடப்படுகிறது?',
    'Option Delta மற்றும் Gamma விளக்கம் தருக',
    'ஷார்ப் விகிதம் (Sharpe Ratio) என்றால் என்ன?'
  ];

  const quickPrompts = activeLang === 'ta' ? quickPromptsTa : quickPromptsEn;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    setLastFailedQuery(null);
    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // Build history payload for conversational continuity
      const historyContext = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res: AskTutorResponse = await aiService.askTutor(
        query,
        conversationId,
        undefined,
        { history: historyContext }
      );

      if (res.error && !res.reply) {
        throw new Error(res.error);
      }

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'AI',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formulas: res.formulas,
        suggestedQuizTopic: res.suggestedQuizTopic,
        matchedTopic: res.matchedTopic,
        model: res.model || 'Open Financial LLM'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('[AI Tutor] Send query failed:', err);
      setLastFailedQuery(query);

      const errorReply = activeLang === 'ta'
        ? 'மன்னிக்கவும், பதிலை உருவாக்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
        : 'An error occurred while formulating the financial explanation. Please try again.';

      const errorMsg: Message = {
        id: 'error-' + Date.now(),
        sender: 'AI',
        text: errorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setConversationId('session-' + Date.now());
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'AI',
        text: activeLang === 'ta' ? initialGreetingTa : initialGreetingEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'FinanceX Knowledge RAG'
      }
    ]);
    setLastFailedQuery(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="ai-tutor-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-xs theme-transition">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-[#FF2E7E]/20 text-[#FF2E7E] border border-pink-200 dark:border-[#FF2E7E]/40 shadow-xs">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
                FinanceX AI Financial Tutor
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-bold">
                GENERAL FINANCIAL LLM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-400 font-bold flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {activeLang.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {activeLang === 'ta'
                ? 'நிதி, பொருளாதாரம், முதலீட்டு பகுப்பாய்வு மற்றும் NISM தேர்வுகள் சார்ந்த அனைத்துக் கேள்விகளுக்கும் பதிலளிக்கும் பொது நுண்ணறிவு ஆசிரியர்.'
                : 'General conversational financial intelligence answering all questions on finance, economics, markets, valuation, accounting, and NISM exams.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-mono self-start sm:self-auto cursor-pointer"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{activeLang === 'ta' ? 'அழி' : 'Clear Chat'}</span>
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            {activeLang === 'ta' ? 'பிரபலமான நிதித் தலைப்புகள்' : 'CURATED FINANCE CONCEPTS & EXAM QUERIES'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeLang === 'ta' ? 'நேரடி பதில் + சூத்திரங்கள்' : 'Direct Answer + Formulas + Caveats'}
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-[#FF2E7E]/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs whitespace-nowrap transition cursor-pointer shadow-xs active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl min-h-[420px] max-h-[600px] overflow-y-auto space-y-4 theme-transition">
        {messages.map((msg) => {
          const isAI = msg.sender === 'AI';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isAI 
                  ? msg.isError 
                    ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                    : 'bg-pink-100 text-[#FF2E7E] dark:bg-gradient-to-br dark:from-[#FF2E7E] dark:to-[#00E599] dark:text-slate-950 font-black' 
                  : 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {isAI ? (
                  msg.isError ? <AlertCircle className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4 text-pink-600 dark:text-white" />
                ) : 'K'}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm space-y-3 shadow-xs ${
                isAI
                  ? msg.isError
                    ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
                    : 'bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-900 text-white font-medium dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:border dark:border-slate-700'
              }`}>
                {/* Topic Pill if matched */}
                {msg.matchedTopic && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-pink-600 dark:text-[#FF2E7E] uppercase font-bold pb-1 border-b border-slate-200 dark:border-slate-800">
                    <BookOpen className="w-3 h-3" />
                    <span>Topic: {msg.matchedTopic}</span>
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Mathematical formulas pillbox if any */}
                {msg.formulas && msg.formulas.length > 0 && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 space-y-1.5 font-mono text-xs shadow-xs">
                    <div className="text-[10px] text-emerald-700 dark:text-[#00E599] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{activeLang === 'ta' ? 'சூத்திர வழிகாட்டி (FORMULA CHEATSHEET):' : 'FORMULA CHEATSHEET:'}</span>
                    </div>
                    {msg.formulas.map((f, idx) => (
                      <div key={idx} className="text-cyan-700 dark:text-cyan-400 font-bold bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Quiz Action */}
                {msg.suggestedQuizTopic && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
                      <span>{activeLang === 'ta' ? 'பயிற்சி வினாடிவினா:' : 'Ready to test:'} <strong>{msg.suggestedQuizTopic}</strong></span>
                    </span>
                    <button
                      onClick={() => onNavigate('quizzes')}
                      className="px-3 py-1 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-[#00E599]/20 dark:hover:bg-[#00E599]/30 dark:text-[#00E599] font-bold text-xs border border-pink-200 dark:border-[#00E599]/40 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{activeLang === 'ta' ? 'வினாடி வினா எடுக்க' : 'Take Practice Quiz'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Audio Read-Aloud Player */}
                {isAI && !msg.isError && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => speechService.speak(msg.text, msg.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          speechStatus.isSpeaking && speechStatus.currentTextId === msg.id
                            ? speechStatus.isPaused
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] border border-emerald-300 dark:border-emerald-500/40 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                        title={
                          speechStatus.isSpeaking && speechStatus.currentTextId === msg.id
                            ? speechStatus.isPaused ? "Resume Reading" : "Pause Reading"
                            : "Speak Aloud (Text-to-Speech)"
                        }
                      >
                        {speechStatus.isSpeaking && speechStatus.currentTextId === msg.id ? (
                          speechStatus.isPaused ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current text-amber-500" />
                              <span>Resume</span>
                            </>
                          ) : (
                            <>
                              <span className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 bg-emerald-600 dark:bg-[#00E599] animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                                <span className="w-0.5 bg-emerald-600 dark:bg-[#00E599] animate-[bounce_0.8s_ease-in-out_infinite_0.1s] h-2" />
                                <span className="w-0.5 bg-emerald-600 dark:bg-[#00E599] animate-[bounce_0.5s_ease-in-out_infinite_0.2s] h-3.5" />
                              </span>
                              <Pause className="w-3 h-3 ml-0.5" />
                              <span>Pause</span>
                            </>
                          )
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Speak Aloud</span>
                          </>
                        )}
                      </button>

                      {speechStatus.isSpeaking && speechStatus.currentTextId === msg.id && (
                        <button
                          onClick={() => speechService.stop()}
                          title="Stop Reading"
                          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-bold transition cursor-pointer"
                        >
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={toggleSpeechSpeed}
                      title={`Cycle voice rate: ${speechSpeed}x`}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                    >
                      {speechSpeed}x
                    </button>
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span className="font-mono text-[9px] text-slate-500">
                    {msg.model ? `Engine: ${msg.model}` : ''}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono p-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E] animate-spin" />
            <span>
              {activeLang === 'ta'
                ? 'AI ஆசிரியர் நிதிப் பாடத்திட்டத்தை ஆய்வு செய்து பதிலை வடிவமைக்கிறார்...'
                : 'AI Tutor is analyzing curriculum grounding and formulating response...'}
            </span>
          </div>
        )}

        {lastFailedQuery && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <span>Query failed to complete. Would you like to retry?</span>
            <button
              onClick={() => handleSend(lastFailedQuery)}
              className="px-3 py-1 rounded-xl bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold hover:opacity-90 transition"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white dark:bg-[#0B0F19] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-pink-500 dark:focus-within:border-[#00E599] transition shadow-md theme-transition"
      >
        <input
          type="text"
          placeholder={activeLang === 'ta' ? 'நிதி, சூத்திரம் அல்லது பரீட்சை தொடர்பான எந்தக் கேள்வியையும் கேளுங்கள்...' : 'Ask AI Tutor any finance, formula, or exam question...'}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="px-5 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
        >
          <span>{activeLang === 'ta' ? 'அனுப்பு' : 'Send'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

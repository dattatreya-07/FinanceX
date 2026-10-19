import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles,
  Bot,
  GraduationCap,
  Play,
  Pause,
  Square,
  FastForward
} from 'lucide-react';
import { AppNavView } from '../../types/schema';
import { aiService, AskTutorResponse } from '../../services/aiService';
import { speechService, SpeechRate } from '../../services/speechService';

interface FloatingAITutorWidgetProps {
  onNavigate: (view: AppNavView, payload?: any) => void;
}

interface MiniMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

export const FloatingAITutorWidget: React.FC<FloatingAITutorWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState(speechService.getStatus());
  const [speechSpeed, setSpeechSpeed] = useState<SpeechRate>(1.0);
  const [messages, setMessages] = useState<MiniMessage[]>([
    {
      id: 'welcome',
      sender: 'AI',
      text: "Hi there! I'm your FinanceX AI Teacher. Need help with a concept, formula, or NISM Series XV question? Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Subscribe to speechService updates
  useEffect(() => {
    const unsubscribe = speechService.subscribe((status) => {
      setSpeechStatus({ ...status, speed: speechService.getSpeed() });
    });
    return () => unsubscribe();
  }, []);

  // Voice Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          handleSend(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your question.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  const handleSpeak = (text: string, id: string) => {
    speechService.speak(text, id);
  };

  const toggleSpeed = () => {
    const nextSpeed: SpeechRate = speechSpeed === 1.0 ? 1.25 : speechSpeed === 1.25 ? 0.8 : 1.0;
    setSpeechSpeed(nextSpeed);
    speechService.setSpeed(nextSpeed);
  };

  const handleSend = async (userQuery?: string) => {
    const textToSend = (userQuery || query).trim();
    if (!textToSend || isTyping) return;

    const userMsg: MiniMessage = {
      id: 'user-' + Date.now(),
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const res: AskTutorResponse = await aiService.askTutor(textToSend);
      const aiReply = res.reply || "I'm right here with you! Let me know what specific financial concept you'd like to dive into.";

      const aiMsg: MiniMessage = {
        id: 'ai-' + Date.now(),
        sender: 'AI',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'AI',
          text: "Let's try that again. What financial topic would you like to explore?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "What is P/E Ratio?",
    "Explain Call vs Put",
    "How does NISM scoring work?",
    "What is Bond Duration?"
  ];

  return (
    <div className="fixed right-4 sm:right-6 bottom-5 z-50 select-none">
      {/* Mini Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-[92vw] sm:w-[390px] h-[530px] max-h-[80vh] rounded-3xl bg-white dark:bg-[#08121E] shadow-[0_20px_50px_rgba(4,120,87,0.3)] border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col overflow-hidden theme-transition"
          >
            {/* Header: Emerald & Gold Wealth Theme */}
            <div className="p-4 bg-gradient-to-r from-[#032B25] via-[#064E3B] to-[#047857] text-white flex items-center justify-between shadow-md border-b border-amber-300/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-amber-300/30 shadow-inner">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                    <span>FinanceX AI Teacher</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-amber-200/90 font-medium">Interactive Financial & NISM Mentor</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Speech Speed Toggle */}
                <button
                  onClick={toggleSpeed}
                  title={`Speech Speed: ${speechSpeed}x (Click to cycle)`}
                  className="px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] font-mono text-amber-200 font-bold border border-white/20 transition cursor-pointer"
                >
                  {speechSpeed}x
                </button>
                <button
                  onClick={() => {
                    onNavigate('ai-tutor');
                    setIsOpen(false);
                  }}
                  title="Expand to Full AI Tutor Page"
                  className="p-1.5 hover:bg-white/20 rounded-xl transition text-white/90 hover:text-white cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 hover:bg-white/20 rounded-xl transition text-white/90 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer text-[10px] font-medium"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FCFCFD] dark:bg-[#070D18]">
              {messages.map((m) => {
                const isThisSpeaking = speechStatus.isSpeaking && speechStatus.currentTextId === m.id;
                const isThisPaused = isThisSpeaking && speechStatus.isPaused;

                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'AI' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'USER'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-xs shadow-sm font-medium'
                          : 'bg-white dark:bg-[#0B1526] border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      
                      <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{m.timestamp}</span>

                        {m.sender === 'AI' && (
                          <div className="flex items-center gap-1.5">
                            {/* Speak Aloud Control */}
                            <button
                              onClick={() => handleSpeak(m.text, m.id)}
                              title={isThisSpeaking ? (isThisPaused ? "Resume Reading" : "Pause Reading") : "Speak Aloud"}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition cursor-pointer ${
                                isThisSpeaking
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                                  : 'text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                              }`}
                            >
                              {isThisSpeaking ? (
                                isThisPaused ? (
                                  <>
                                    <Play className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                                    <span>Resume</span>
                                  </>
                                ) : (
                                  <>
                                    {/* Equalizer Sound Wave Animation */}
                                    <span className="flex items-end gap-0.5 h-3">
                                      <span className="w-0.5 bg-emerald-500 animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                                      <span className="w-0.5 bg-emerald-500 animate-[bounce_0.8s_ease-in-out_infinite_0.1s] h-2" />
                                      <span className="w-0.5 bg-emerald-500 animate-[bounce_0.5s_ease-in-out_infinite_0.2s] h-3.5" />
                                    </span>
                                    <span>Playing</span>
                                  </>
                                )
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>Speak Aloud</span>
                                </>
                              )}
                            </button>

                            {isThisSpeaking && (
                              <button
                                onClick={() => speechService.stop()}
                                title="Stop Reading"
                                className="p-0.5 hover:text-rose-500 text-slate-400 transition cursor-pointer"
                              >
                                <Square className="w-3 h-3 fill-current" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-emerald-600">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-200" />
                    <span className="text-[10px] text-slate-500 font-mono">Teacher is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Voice & Send */}
            <div className="p-3 bg-white dark:bg-[#0E1726] border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-slate-700'
                }`}
                title={isListening ? "Listening... click to stop" : "Speak to Teacher (Voice Input)"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening to your voice..." : "Ask your finance teacher..."}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition"
              />

              <button
                onClick={() => handleSend()}
                disabled={!query.trim() || isTyping}
                className="p-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:opacity-90 disabled:opacity-40 transition cursor-pointer shrink-0 shadow-md shadow-emerald-500/20"
                title="Send Question"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Floating Mascot Button */}
      <motion.button
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] text-white shadow-[0_10px_30px_rgba(5,150,105,0.45)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.55)] border-2 border-amber-300/40 cursor-pointer transition-all duration-300"
        title="FinanceX AI Tutor with Voice"
        aria-label="Open AI Tutor with Voice Assistance"
      >
        <div className="relative">
          <BrainCircuit className="w-5 h-5 animate-pulse text-amber-200" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-800 animate-ping" />
        </div>
        <span className="text-xs font-black tracking-wide hidden sm:inline text-white">AI Teacher</span>
        <div className="flex items-center gap-1 pl-1 border-l border-white/30">
          <Mic className="w-3.5 h-3.5 text-amber-200" />
        </div>
      </motion.button>
    </div>
  );
};

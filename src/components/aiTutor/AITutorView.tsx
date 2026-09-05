import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ChevronRight
} from 'lucide-react';
import { AppNavView } from '../../types/schema';

interface Message {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  formulas?: string[];
  suggestedQuizTopic?: string;
}

interface AITutorViewProps {
  initialPrompt?: string;
  onNavigate: (view: AppNavView, payload?: any) => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialPrompt,
  onNavigate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI',
      text: "Hello Kannan! I'm your FinanceX AI Financial Tutor. I specialize in NISM certifications (Series VIII, XV, V-A), quantitative derivatives math, SEBI regulations, and portfolio theory.\n\nAsk me anything or pick a quick topic below!",
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Explain Delta vs Theta decay using a simple analogy',
    'How does Cash-and-Carry Arbitrage work in Futures?',
    'What is the formula for Macaulay Duration of a Bond?',
    'Key SEBI insider trading rules for NISM Series VIII',
    'Difference between PE Ratio and PEG Ratio'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Dynamic Intelligent Financial AI Simulation
    setTimeout(() => {
      let aiReply = '';
      let formulas: string[] | undefined;
      let quizTopic: string | undefined;

      const lower = query.toLowerCase();

      if (lower.includes('delta') || lower.includes('theta') || lower.includes('greek')) {
        aiReply = `### Option Greeks: Delta vs. Theta Explained Simply\n\nThink of an option like an **ice-cream cone**:\n- **Delta (Δ)**: Measures how fast the ice-cream price changes when the temperature (underlying spot stock) goes up or down. A Call option with Delta 0.50 gains ₹0.50 for every ₹1 rise in spot stock.\n- **Theta (Θ)**: Measures the melting rate over time. Every day the market passes, your ice cream melts slightly—this is **time decay**.\n\n**Key Exam Rule (NISM Series VIII):**\nATM (At-The-Money) options suffer the *fastest* Theta decay in the final 10 days before expiry!`;
        formulas = ['Delta (Δ) = ∂V / ∂S', 'Theta (Θ) = ∂V / ∂t (Always negative for long options)'];
        quizTopic = 'Option Greeks';
      } else if (lower.includes('arbitrage') || lower.includes('futures') || lower.includes('cash')) {
        aiReply = `### Cash-and-Carry Arbitrage Payoff\n\nWhen Futures trade at an irrational premium over Fair Value:\n1. **Borrow funds** at risk-free rate ($r$).\n2. **Buy Spot Stock** at price $S_0$.\n3. **Sell Futures Contract** at higher price $F_0$.\n4. **At Expiry**: Deliver the spot stock against the futures contract and repay loan.\n\n**Theoretical Fair Futures Price Model:**`;
        formulas = ['Fair Value F = S₀ × e^(r × t) + Storage Costs - Dividend Yield'];
        quizTopic = 'Futures Pricing & Arbitrage';
      } else if (lower.includes('duration') || lower.includes('bond') || lower.includes('macaulay')) {
        aiReply = `### Macaulay Duration vs Modified Duration\n\n- **Macaulay Duration**: The weighted average time until all bond cashflows (coupons + principal) are received, measured in *years*.\n- **Modified Duration**: Measures the percentage change in bond price for a 1% change in yield-to-maturity (YTM).\n\n**Exam Trick**: A zero-coupon bond's Macaulay duration is *always exactly equal* to its maturity!`;
        formulas = ['Mod Duration = Macaulay Duration / (1 + YTM / n)', 'ΔP / P ≈ - Mod Duration × ΔY'];
        quizTopic = 'Fixed Income Duration';
      } else {
        aiReply = `### Concept Analysis: ${query}\n\nIn financial markets, this concept plays a fundamental role in risk allocation and valuation:\n1. **Mathematical Underpinning**: Evaluated using discounted cash flow (DCF) or risk-adjusted return ratios (Sharpe / Treynor).\n2. **Regulatory Mandate**: Regulated under SEBI guidelines for fair order matching and investor disclosure.\n3. **Practical Application**: Professional asset managers utilize this to minimize tracking error against benchmarks.`;
        formulas = ['Sharpe Ratio = (Rₚ - R_f) / σₚ'];
        quizTopic = 'Portfolio Management';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formulas,
        suggestedQuizTopic: quizTopic
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
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
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white">
                FinanceX AI Financial Tutor
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-[#00E599] font-bold">
                FINANCIAL LLM ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Personalized mentor for NISM prep, derivative mathematics, and market mechanics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 text-xs font-mono self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
          TRENDING EXAM & MATH QUERIES
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-[#FF2E7E]/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs whitespace-nowrap transition cursor-pointer shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 theme-transition">
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
                isAI ? 'bg-pink-100 text-[#FF2E7E] dark:bg-gradient-to-br dark:from-[#FF2E7E] dark:to-[#00E599] dark:text-slate-950 font-black' : 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {isAI ? <BrainCircuit className="w-4 h-4 text-pink-600 dark:text-white" /> : 'K'}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm space-y-3 shadow-xs ${
                isAI
                  ? 'bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-900 text-white font-medium dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900 dark:border dark:border-slate-700'
              }`}>
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Mathematical formulas pillbox if any */}
                {msg.formulas && msg.formulas.length > 0 && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 space-y-1.5 font-mono text-xs shadow-xs">
                    <div className="text-[10px] text-emerald-700 dark:text-[#00E599] font-bold uppercase">
                      FORMULA CHEATSHEET:
                    </div>
                    {msg.formulas.map((f, idx) => (
                      <div key={idx} className="text-cyan-700 dark:text-cyan-400 font-bold">
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Quiz Action */}
                {msg.suggestedQuizTopic && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Ready to test: <strong>{msg.suggestedQuizTopic}</strong>?
                    </span>
                    <button
                      onClick={() => onNavigate('quizzes')}
                      className="px-3 py-1 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-[#00E599]/20 dark:hover:bg-[#00E599]/30 dark:text-[#00E599] font-bold text-xs border border-pink-200 dark:border-[#00E599]/40 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Practice Quiz</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono p-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2E7E] animate-spin" />
            <span>AI Tutor is analyzing regulatory material and formulating response...</span>
          </div>
        )}
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
          placeholder="Ask AI Tutor any finance, formula, or exam question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#FF2E7E] hover:bg-[#E61E6D] text-white dark:bg-gradient-to-r dark:from-[#00E599] dark:to-[#00B377] dark:text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

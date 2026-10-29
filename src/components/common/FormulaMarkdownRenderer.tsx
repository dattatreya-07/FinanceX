import React, { useMemo } from 'react';
import katex from 'katex';
import { Copy, Check, Sparkles, BookOpen, Calculator } from 'lucide-react';

interface FormulaMarkdownRendererProps {
  content: string;
  className?: string;
}

export const FormulaMarkdownRenderer: React.FC<FormulaMarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Safely render LaTeX math string using KaTeX
  const renderMath = (tex: string, displayMode: boolean = false): string => {
    try {
      return katex.renderToString(tex, {
        displayMode,
        throwOnError: false,
        strict: false
      });
    } catch (err) {
      console.warn('KaTeX rendering error for:', tex, err);
      return `<code class="font-mono text-emerald-600 dark:text-[#00E599]">${escapeHtml(tex)}</code>`;
    }
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Helper to process inline formatting (bold, italics, inline code, inline math $...$)
  const renderInline = (text: string): React.ReactNode => {
    if (!text) return null;

    // Pattern matches:
    // 1. Inline math: $...$ (not preceded or followed by numbers like $50)
    // 2. Bold: **...**
    // 3. Italic: *...*
    // 4. Inline code: `...`
    const regex = /(\$(?!\d)[^$\n]+(?<!\d)\$|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Inline Math
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const tex = part.slice(1, -1).trim();
        const html = renderMath(tex, false);
        return (
          <span
            key={i}
            className="inline-math px-1 py-0.5 mx-0.5 rounded bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-serif border border-emerald-200/50 dark:border-emerald-800/40 align-middle text-[0.95em]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={i} className="italic text-slate-800 dark:text-slate-200">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Inline code
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-[#00E599] border border-slate-200 dark:border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return part;
    });
  };

  // Parse markdown into distinct logical blocks
  const blocks = useMemo(() => {
    if (!content) return [];
    
    // Normalize line endings
    const normalized = content.replace(/\r\n/g, '\n');
    
    // Split into raw blocks by double newlines or display math boundaries
    const rawBlocks = normalized.split(/\n\n+/);
    const result: Array<{
      type: 'h1' | 'h2' | 'h3' | 'h4' | 'math' | 'ordered-list' | 'unordered-list' | 'blockquote' | 'code' | 'table' | 'p' | 'hr';
      raw: string;
      items?: string[];
      lang?: string;
    }> = [];

    for (const b of rawBlocks) {
      const trimmed = b.trim();
      if (!trimmed) continue;

      // Display math $$ ... $$
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        result.push({
          type: 'math',
          raw: trimmed.slice(2, -2).trim()
        });
        continue;
      }

      // Multi-line code block ``` ... ```
      if (trimmed.startsWith('```')) {
        const lines = trimmed.split('\n');
        const lang = lines[0].replace('```', '').trim();
        const codeText = lines.slice(1, lines[lines.length - 1].startsWith('```') ? -1 : undefined).join('\n');
        result.push({
          type: 'code',
          raw: codeText,
          lang
        });
        continue;
      }

      // Horizontal rule
      if (trimmed === '---' || trimmed === '***') {
        result.push({ type: 'hr', raw: trimmed });
        continue;
      }

      // Headers
      if (trimmed.startsWith('#### ')) {
        result.push({ type: 'h4', raw: trimmed.replace(/^####\s+/, '') });
        continue;
      }
      if (trimmed.startsWith('### ')) {
        result.push({ type: 'h3', raw: trimmed.replace(/^###\s+/, '') });
        continue;
      }
      if (trimmed.startsWith('## ')) {
        result.push({ type: 'h2', raw: trimmed.replace(/^##\s+/, '') });
        continue;
      }
      if (trimmed.startsWith('# ')) {
        result.push({ type: 'h1', raw: trimmed.replace(/^#\s+/, '') });
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        result.push({
          type: 'blockquote',
          raw: trimmed.split('\n').map(l => l.replace(/^>\s*/, '')).join('\n')
        });
        continue;
      }

      // Markdown Tables
      if (trimmed.includes('|') && trimmed.split('\n').some(l => l.includes('|-') || l.includes('| -'))) {
        result.push({
          type: 'table',
          raw: trimmed
        });
        continue;
      }

      // Ordered list (1. ..., 2. ...)
      if (/^\d+\.\s+/.test(trimmed)) {
        const items: string[] = [];
        const lines = trimmed.split('\n');
        let currentItem = '';

        for (const line of lines) {
          if (/^\d+\.\s+/.test(line)) {
            if (currentItem) items.push(currentItem.trim());
            currentItem = line.replace(/^\d+\.\s+/, '');
          } else {
            currentItem += '\n' + line;
          }
        }
        if (currentItem) items.push(currentItem.trim());

        result.push({
          type: 'ordered-list',
          raw: trimmed,
          items
        });
        continue;
      }

      // Unordered list (- ... or * ...)
      if (/^[-*]\s+/.test(trimmed)) {
        const items: string[] = [];
        const lines = trimmed.split('\n');
        let currentItem = '';

        for (const line of lines) {
          if (/^[-*]\s+/.test(line)) {
            if (currentItem) items.push(currentItem.trim());
            currentItem = line.replace(/^[-*]\s+/, '');
          } else {
            currentItem += '\n' + line;
          }
        }
        if (currentItem) items.push(currentItem.trim());

        result.push({
          type: 'unordered-list',
          raw: trimmed,
          items
        });
        continue;
      }

      // Check if block contains an embedded display math block $$...$$ inside text
      if (trimmed.includes('$$')) {
        const subParts = trimmed.split(/(\$\$[\s\S]*?\$\$)/g);
        for (const part of subParts) {
          const pt = part.trim();
          if (!pt) continue;
          if (pt.startsWith('$$') && pt.endsWith('$$')) {
            result.push({
              type: 'math',
              raw: pt.slice(2, -2).trim()
            });
          } else {
            result.push({
              type: 'p',
              raw: pt
            });
          }
        }
        continue;
      }

      // Default paragraph
      result.push({
        type: 'p',
        raw: trimmed
      });
    }

    return result;
  }, [content]);

  return (
    <div className={`formula-markdown-container space-y-4 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1
                key={idx}
                className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white pt-4 pb-2 border-b border-emerald-500/20 tracking-tight"
              >
                {renderInline(block.raw)}
              </h1>
            );

          case 'h2':
            return (
              <h2
                key={idx}
                className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white pt-5 pb-1 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#047857] to-[#10B981]" />
                <span>{renderInline(block.raw)}</span>
              </h2>
            );

          case 'h3':
            return (
              <h3
                key={idx}
                className="text-base font-display font-black text-slate-900 dark:text-white pt-3 flex items-center gap-2"
              >
                <span className="text-emerald-600 dark:text-[#00E599] font-mono text-xs font-bold">§</span>
                <span>{renderInline(block.raw)}</span>
              </h3>
            );

          case 'h4':
            return (
              <h4
                key={idx}
                className="text-sm font-bold text-slate-800 dark:text-slate-200 pt-2 uppercase font-mono tracking-wide"
              >
                {renderInline(block.raw)}
              </h4>
            );

          case 'math': {
            const html = renderMath(block.raw, true);
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={idx}
                className="relative my-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/15 via-[#064E3B]/10 to-teal-950/15 dark:from-[#032B25]/40 dark:via-[#064E3B]/30 dark:to-slate-900/60 border border-emerald-500/30 dark:border-emerald-500/40 shadow-sm overflow-x-auto group"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20 text-[10px] font-mono text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>NISM Quantitative & Valuation Equation</span>
                  </div>
                  <button
                    onClick={() => handleCopy(block.raw, idx)}
                    className="opacity-0 group-hover:opacity-100 transition px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00E599] border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                    title="Copy LaTeX Formula"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy TeX'}</span>
                  </button>
                </div>

                <div
                  className="katex-display-wrapper py-2 text-center text-slate-900 dark:text-white overflow-x-auto text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          }

          case 'ordered-list':
            return (
              <ol key={idx} className="space-y-3 pl-1">
                {(block.items || []).map((item, itemIdx) => {
                  // Check if item contains sub-math or sub-bullets
                  const itemLines = item.split('\n');
                  const firstLine = itemLines[0];
                  const remainingLines = itemLines.slice(1);

                  return (
                    <li key={itemIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {itemIdx + 1}
                      </span>
                      <div className="flex-1 space-y-2 leading-relaxed">
                        <div>{renderInline(firstLine)}</div>
                        {remainingLines.length > 0 && (
                          <div className="pl-3 border-l-2 border-emerald-200 dark:border-emerald-900/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                            {remainingLines.map((subLine, sIdx) => {
                              const subTrim = subLine.trim();
                              if (subTrim.startsWith('$$') && subTrim.endsWith('$$')) {
                                const subHtml = renderMath(subTrim.slice(2, -2).trim(), true);
                                return (
                                  <div
                                    key={sIdx}
                                    className="my-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-center overflow-x-auto"
                                    dangerouslySetInnerHTML={{ __html: subHtml }}
                                  />
                                );
                              }
                              return (
                                <div key={sIdx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{renderInline(subTrim.replace(/^[-*]\s+/, ''))}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            );

          case 'unordered-list':
            return (
              <ul key={idx} className="space-y-2 pl-1">
                {(block.items || []).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#00E599] shrink-0 mt-2 shadow-xs" />
                    <div className="flex-1">{renderInline(item)}</div>
                  </li>
                ))}
              </ul>
            );

          case 'blockquote':
            return (
              <blockquote
                key={idx}
                className="my-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-500 text-slate-800 dark:text-amber-200 text-xs sm:text-sm italic leading-relaxed space-y-1"
              >
                <div className="font-mono not-italic font-bold text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regulatory Precedent & Institutional Insight</span>
                </div>
                <div>{renderInline(block.raw)}</div>
              </blockquote>
            );

          case 'code':
            return (
              <div
                key={idx}
                className="my-3 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-md"
              >
                {block.lang && (
                  <div className="text-[10px] uppercase text-slate-500 pb-2 border-b border-slate-800/80 mb-2 font-bold">
                    {block.lang}
                  </div>
                )}
                <pre className="leading-relaxed">{block.raw}</pre>
              </div>
            );

          case 'table': {
            const lines = block.raw.split('\n').filter(l => l.trim().length > 0);
            const headerLine = lines[0];
            const dataLines = lines.slice(2); // Skip separator line

            const parseCells = (line: string) => {
              return line
                .split('|')
                .map(c => c.trim())
                .filter((_, i, arr) => i > 0 && i < arr.length - 1);
            };

            const headers = parseCells(headerLine);

            return (
              <div key={idx} className="my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="p-3 font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {renderInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]">
                    {dataLines.map((row, rIdx) => {
                      const cells = parseCells(row);
                      return (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300">
                              {renderInline(cell)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'hr':
            return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;

          case 'p':
          default:
            return (
              <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {renderInline(block.raw)}
              </p>
            );
        }
      })}
    </div>
  );
};

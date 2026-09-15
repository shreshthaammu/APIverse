import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'json',
  title,
  showLineNumbers = false,
  maxHeight = '400px',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-700 inline-block" />
            <span>{title}</span>
            <span className="text-zinc-600">({language})</span>
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors p-1 rounded hover:bg-zinc-800"
            title="Copy snippet"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}

      <div className="relative group">
        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1 text-zinc-400 hover:text-zinc-200 bg-zinc-900/90 border border-zinc-800 px-2 py-1 rounded text-[11px] opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}

        <div
          className="p-3 overflow-x-auto overflow-y-auto font-mono text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
          style={{ maxHeight }}
        >
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40">
                    <td className="pr-4 select-none text-right text-zinc-600 text-[11px] w-8">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre">{line || ' '}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre className="whitespace-pre">{code}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

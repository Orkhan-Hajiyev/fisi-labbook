import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  label?: string;
}

export default function CodeBlock({ code, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden bg-[#0a0c10]">
      {label && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? "Kopiert" : "Kopieren"}
          </button>
        </div>
      )}
      {!label && (
        <div className="absolute top-2 right-2">
          <button onClick={handleCopy} className="text-slate-600 hover:text-slate-300 transition-colors p-1">
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        </div>
      )}
      <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

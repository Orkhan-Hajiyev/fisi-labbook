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
    <div className="relative rounded-xl border border-[#294963] overflow-hidden bg-[#143550] shadow-[0_16px_30px_-24px_rgba(17,53,83,0.6)]">
      {label && (
        <div className="px-4 py-2 bg-[#21435f] border-b border-[#315572] flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#a8cee9] uppercase tracking-wider">{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-[#a8cee9] hover:text-white transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
            {copied ? "Kopiert" : "Kopieren"}
          </button>
        </div>
      )}
      {!label && (
        <div className="absolute top-2 right-2">
          <button onClick={handleCopy} aria-label="Code kopieren" className="text-[#a8cee9] hover:text-white transition-colors p-1">
            {copied ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
          </button>
        </div>
      )}
      <pre className="p-4 text-sm text-[#d4eefa] font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

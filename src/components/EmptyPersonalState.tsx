"use client";

import { Plus } from "lucide-react";

interface Props {
  title: string;
  description: string;
  buttonLabel: string;
  onAction: () => void;
}

export default function EmptyPersonalState({ title, description, buttonLabel, onAction }: Props) {
  return (
    <div className="flex justify-center py-10">
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 max-w-md w-full text-center">
        <p className="text-sm font-medium text-slate-300 mb-2">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">{description}</p>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
        >
          <Plus size={14} />
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

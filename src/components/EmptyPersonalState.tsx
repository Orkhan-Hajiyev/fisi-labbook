"use client";

import { T } from "@/components/TranslatedText";
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
      <div className="rounded-xl border border-slate-200 bg-blue-50 p-8 max-w-md w-full text-center">
        <p className="text-sm font-medium text-slate-700 mb-2"><T>{title}</T></p>
        <p className="text-xs text-slate-600 leading-relaxed mb-6"><T>{description}</T></p>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors"
        >
          <Plus size={14} />
          <T>{buttonLabel}</T>
        </button>
      </div>
    </div>
  );
}

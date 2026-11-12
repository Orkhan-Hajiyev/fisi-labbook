import { T } from "@/components/TranslatedText";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Keine Einträge vorhanden",
  description = "Es wurden noch keine Daten angelegt.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
      <div className="w-12 h-12 rounded-full bg-blue-50 border border-slate-200 flex items-center justify-center mb-4">
        <Inbox size={22} className="text-slate-500" />
      </div>
      <p className="text-sm text-slate-600 font-medium mb-1"><T>{title}</T></p>
      <p className="text-xs text-slate-500 max-w-sm text-center"><T>{description}</T></p>
    </div>
  );
}

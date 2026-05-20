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
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <Inbox size={22} className="text-slate-600" />
      </div>
      <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
      <p className="text-xs text-slate-600 max-w-sm text-center">{description}</p>
    </div>
  );
}

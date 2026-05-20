import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({
  message = "Die Daten konnten nicht geladen werden. Bitte Seite neu laden.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <p className="text-sm text-red-400 font-medium mb-1">Fehler beim Laden</p>
      <p className="text-xs text-slate-500 max-w-sm text-center">{message}</p>
    </div>
  );
}

import { T } from "@/components/TranslatedText";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({
  message = "Die Daten konnten nicht geladen werden. Bitte Seite neu laden.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-red-700" />
      </div>
      <p className="text-sm text-red-700 font-medium mb-1"><T>Fehler beim Laden</T></p>
      <p className="text-xs text-slate-600 max-w-sm text-center"><T>{message}</T></p>
    </div>
  );
}

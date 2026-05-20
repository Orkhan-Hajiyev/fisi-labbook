import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
}

export default function LoadingState({ text = "Daten werden geladen..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <Loader2 size={28} className="animate-spin mb-3 text-blue-500" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

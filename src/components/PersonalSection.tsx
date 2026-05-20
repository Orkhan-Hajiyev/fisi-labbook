interface Props {
  title: string;
}

export default function PersonalSection({ title }: Props) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-amber-500/20 bg-amber-500/5 text-amber-500/70">
          In Vorbereitung
        </span>
      </div>
      <div className="rounded-xl border border-white/5 bg-white/[0.015] p-6 text-center">
        <p className="text-sm text-slate-600 leading-relaxed">
          Dieser Bereich wird in einer zukünftigen Version für persönliche Daten verfügbar sein.
        </p>
      </div>
    </div>
  );
}

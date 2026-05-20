interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ReferenceSection({ title, children }: Props) {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider shrink-0">{title}</h2>
        <div className="h-px flex-1 bg-white/5" />
        <span className="shrink-0 text-[10px] font-semibold text-slate-700 uppercase tracking-wider px-2.5 py-1 rounded border border-white/5">
          Referenz
        </span>
      </div>
      {children}
    </div>
  );
}

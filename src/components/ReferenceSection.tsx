interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ReferenceSection({ title, children }: Props) {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">{title}</h2>
        <div className="h-px flex-1 bg-blue-50" />
        <span className="shrink-0 text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2.5 py-1 rounded border border-slate-200">
          Referenz
        </span>
      </div>
      {children}
    </div>
  );
}

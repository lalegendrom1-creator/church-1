import { Church } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg ring-2 ring-amber-300/30">
        <Church className="h-6 w-6 text-white" strokeWidth={1.5} />
        <div className="absolute -inset-0.5 rounded-full bg-amber-400/20 blur-sm" />
      </div>
      <div className="leading-tight">
        <p className="font-serif text-sm font-bold tracking-wide text-stone-800 sm:text-base">
          Paroisse Saint Ignace
        </p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-amber-700 sm:text-xs">
          de Loyola
        </p>
      </div>
    </div>
  );
}

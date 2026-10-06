import { Calendar, Clock, MapPin, Church } from 'lucide-react';
import type { Program } from '@/types';
import { formatDateFR, formatTimeFR } from '@/lib/dates';

interface Props {
  program: Program;
}

export function ProgramCard({ program }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-500 to-amber-700 transition-all duration-300 group-hover:w-2" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 px-4 py-3 text-center text-white shadow-md sm:w-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            {program.day_name}
          </span>
          <span className="mt-1 text-2xl font-bold leading-none">
            {new Date(program.program_date + 'T00:00:00').getDate().toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase text-stone-400">
            {new Date(program.program_date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' })}
          </span>
        </div>

        <div className="flex-1">
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTimeFR(program.start_time)}</span>
          </div>

          <h3 className="mb-2 font-serif text-xl font-bold text-stone-800">
            {program.title}
          </h3>

          <div className="mb-3 flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
            <span>{program.location}</span>
          </div>

          {program.description && (
            <p className="text-sm leading-relaxed text-stone-500">
              {program.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateFR(program.program_date)}</span>
            <span className="text-stone-300">•</span>
            <Church className="h-3.5 w-3.5" />
            <span>{program.day_name}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

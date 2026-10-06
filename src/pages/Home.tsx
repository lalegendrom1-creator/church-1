import { useEffect, useState } from 'react';
import { ChevronDown, Calendar, MapPin } from 'lucide-react';
import { fetchPublishedPrograms } from '@/lib/programs';
import { formatWeekRange, isThisWeek } from '@/lib/dates';
import type { Program } from '@/types';
import { ProgramCard } from '@/components/ProgramCard';

export function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPublishedPrograms();
        if (!cancelled) {
          setPrograms(data);
        }
      } catch {
        if (!cancelled) {
          setError('Impossible de charger les programmes. Veuillez réessayer plus tard.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const thisWeekPrograms = programs.filter((p) => isThisWeek(p.program_date));
  const upcomingPrograms = programs.filter((p) => !isThisWeek(p.program_date));
  const weekRange = formatWeekRange();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/12013439/pexels-photo-12013439.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1920"
            alt="Intérieur d'église"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/60 to-stone-900/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300 ring-1 ring-amber-400/30 backdrop-blur-sm">
            <Calendar className="h-4 w-4" />
            <span>Programme hebdomadaire</span>
          </div>

          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Bienvenue dans notre paroisse
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-stone-200">
            Paroisse Saint Ignace de Loyola — un lieu de prière, de communion
            fraternelle et d'écoute de la Parole.
          </p>

          <a
            href="#programme"
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-amber-700 hover:shadow-xl active:scale-95"
          >
            Voir le programme de la semaine
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      {/* Program Section */}
      <section id="programme" className="scroll-mt-20 bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
              Cette semaine
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-800 sm:text-4xl">
              Programme de la semaine
            </h2>
            <p className="mt-3 text-base text-stone-500">
              {weekRange}
            </p>
            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-amber-500 to-amber-700" />
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
              <p className="mt-4 text-sm text-stone-400">Chargement des programmes...</p>
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && thisWeekPrograms.length === 0 && upcomingPrograms.length === 0 && (
            <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-stone-300" />
              <p className="text-lg font-medium text-stone-600">
                Aucun programme prévu pour cette semaine.
              </p>
              <p className="mt-2 text-sm text-stone-400">
                Revenez bientôt pour découvrir les prochains événements.
              </p>
            </div>
          )}

          {!loading && !error && thisWeekPrograms.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {thisWeekPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}

          {!loading && !error && upcomingPrograms.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-6 font-serif text-2xl font-bold text-stone-700">
                À venir
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="a-propos" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.pexels.com/photos/12013504/pexels-photo-12013504.jpeg?auto=compress&cs=tinysrgb&h=800&w=600"
                  alt="Intérieur de l'église"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-600">
                Notre paroisse
              </p>
              <h2 className="mb-4 font-serif text-3xl font-bold text-stone-800">
                À propos
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  La Paroisse Saint Ignace de Loyola est un lieu de prière et de
                  communion fraternelle, au service de la communauté chrétienne
                  de Lomé.
                </p>
                <p>
                  Rattachée au Centre Catéchétique « Parole et Vie », notre
                  paroisse vit sa mission à travers la célébration des sacrements,
                  la catéchèse, l'éducation chrétienne et l'engagement fraternel
                  au quotidien.
                </p>
                <p>
                  Nous vous accueillons chaleureusement pour partager des moments
                  de prière, d'écoute de la Parole et de louange.
                </p>
              </div>
              <a
                href="#programme"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-amber-700 transition-colors hover:text-amber-800"
              >
                Découvrir nos programmes →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20 bg-stone-900 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
              Nous joindre
            </p>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white">
              Contact
            </h2>
            <p className="mb-10 text-stone-400">
              Pour toute question, n'hésitez pas à nous contacter.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-stone-800 p-6 text-center transition-colors hover:bg-stone-700">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/20 ring-1 ring-amber-500/30">
                <MapPin className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Adresse</h3>
              <p className="text-sm text-stone-400">B.P. 15273<br />Lomé, Togo</p>
            </div>

            <div className="rounded-2xl bg-stone-800 p-6 text-center transition-colors hover:bg-stone-700">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/20 ring-1 ring-amber-500/30">
                <PhoneIcon className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Téléphone</h3>
              <p className="text-sm text-stone-400">22 21 95 68</p>
            </div>

            <div className="rounded-2xl bg-stone-800 p-6 text-center transition-colors hover:bg-stone-700">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/20 ring-1 ring-amber-500/30">
                <MailIcon className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Email</h3>
              <p className="text-sm text-stone-400 break-all">centreparoleetvie@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}



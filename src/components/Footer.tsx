import { Link } from 'react-router-dom';
import { Church, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 [&_*]:text-stone-100">
              <Logo />
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Centre catéchétique « Parole et Vie » — Office diocésain pour la
              Nouvelle Évangélisation et la catéchèse.
            </p>
            <p className="mt-2 text-sm text-stone-400">Lomé, Togo</p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-amber-400">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-amber-400">Accueil</Link></li>
              <li><a href="/#programme" className="transition-colors hover:text-amber-400">Programme</a></li>
              <li><a href="/#a-propos" className="transition-colors hover:text-amber-400">À propos</a></li>
              <li><a href="/#contact" className="transition-colors hover:text-amber-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-amber-400">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>B.P. 15273 — Lomé, Togo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                <span>22 21 95 68</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                <span>centreparoleetvie@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-700 pt-6 text-center">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Paroisse Saint Ignace de Loyola. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

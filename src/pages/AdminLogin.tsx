import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';

export function AdminLogin() {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/admin/dashboard');
    }
  }, [session, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError('Veuillez entrer le code administrateur.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(code);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Logo className="[&_*]:text-stone-100" />
          </div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-600/20 ring-1 ring-amber-500/30">
            <Lock className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Administration</h1>
          <p className="mt-2 text-sm text-stone-400">
            Entrez votre code administrateur pour accéder au tableau de bord.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-stone-50 p-8 shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label htmlFor="code" className="mb-2 block text-sm font-semibold text-stone-700">
            Code administrateur
          </label>
          <div className="relative">
            <input
              id="code"
              type={showCode ? 'text' : 'password'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••"
              autoComplete="off"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-lg tracking-widest text-stone-800 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label={showCode ? 'Masquer' : 'Afficher'}
            >
              {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-stone-500 transition-colors hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </form>
      </div>
    </div>
  );
}

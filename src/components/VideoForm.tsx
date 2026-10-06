import { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Video, VideoInput } from '@/types';

interface Props {
  video: Video | null;
  onSubmit: (input: VideoInput, id?: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function VideoForm({ video, onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState(video?.title ?? '');
  const [url, setUrl] = useState(video?.url ?? '');
  const [description, setDescription] = useState(video?.description ?? '');
  const [status, setStatus] = useState<'published' | 'draft'>(video?.status ?? 'draft');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Le titre est obligatoire.';
    if (!url.trim()) e.url = "L'URL de la vidéo est obligatoire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const input: VideoInput = {
      title: title.trim(),
      description: description.trim() || null,
      url: url.trim(),
      status,
    };
    onSubmit(input, video?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="mt-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-stone-800">
            {video ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Titre de la vidéo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Culte du dimanche"
              className={`w-full rounded-xl border px-4 py-2.5 text-stone-800 outline-none transition-all focus:ring-2 ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-stone-300 focus:border-amber-500 focus:ring-amber-200'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* URL */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Lien (URL)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: https://youtube.com/watch?v=..."
              className={`w-full rounded-xl border px-4 py-2.5 text-stone-800 outline-none transition-all focus:ring-2 ${
                errors.url
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-stone-300 focus:border-amber-500 focus:ring-amber-200'
              }`}
            />
            {errors.url && <p className="mt-1 text-xs text-red-600">{errors.url}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la vidéo..."
              rows={3}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-stone-800 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">Statut</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  status === 'draft'
                    ? 'border-stone-400 bg-stone-100 text-stone-700'
                    : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                Brouillon
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                  status === 'published'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                Publié
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-600 transition-colors hover:bg-stone-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Enregistrement...' : video ? 'Enregistrer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

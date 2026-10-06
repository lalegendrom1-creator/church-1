import { AlertTriangle } from 'lucide-react';
import type { Video } from '@/types';

interface Props {
  video: Video;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteVideo({ video, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="mb-2 text-center font-serif text-xl font-bold text-stone-800">
            Voulez-vous vraiment supprimer cette vidéo ?
          </h3>
          <p className="mb-6 text-center text-sm text-stone-500">
            <span className="font-semibold text-stone-700">{video.title}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-600 transition-colors hover:bg-stone-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

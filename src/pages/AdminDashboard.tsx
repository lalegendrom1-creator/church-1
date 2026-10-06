import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Edit2, Trash2, Calendar, CheckCircle, Clock, AlertCircle, Eye, EyeOff, Video as VideoIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchAllPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/programs';
import { fetchAllVideos, createVideo, updateVideo, deleteVideo } from '@/lib/videos';
import { Logo } from '@/components/Logo';
import { ProgramForm } from '@/components/ProgramForm';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import { VideoForm } from '@/components/VideoForm';
import { ConfirmDeleteVideo } from '@/components/ConfirmDeleteVideo';
import type { Program, ProgramInput, Video, VideoInput } from '@/types';
import { isThisWeek, isUpcoming, formatDateFR, formatTimeFR } from '@/lib/dates';

type Tab = 'programs' | 'videos';

export function AdminDashboard() {
  const { session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('programs');

  // Programs state
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deleteProgramTarget, setDeleteProgramTarget] = useState<Program | null>(null);

  // Videos state
  const [videos, setVideos] = useState<Video[]>([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deleteVideoTarget, setDeleteVideoTarget] = useState<Video | null>(null);

  // General state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [programsData, videosData] = await Promise.all([
        fetchAllPrograms(),
        fetchAllVideos()
      ]);
      setPrograms(programsData);
      setVideos(videosData);
    } catch {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/admin');
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    if (session) loadData();
  }, [session, loadData]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // --- Handlers pour Programmes ---
  const handleCreateProgram = () => {
    setEditingProgram(null);
    setShowProgramForm(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setShowProgramForm(true);
  };

  const handleSubmitProgram = async (input: ProgramInput, id?: string) => {
    setFormLoading(true);
    try {
      if (id) {
        await updateProgram(id, input);
        showSuccess('Programme modifié avec succès.');
      } else {
        await createProgram(input);
        showSuccess('Programme ajouté avec succès.');
      }
      setShowProgramForm(false);
      setEditingProgram(null);
      await loadData();
    } catch {
      setError(id ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteProgram(id);
      showSuccess('Programme supprimé avec succès.');
      setDeleteProgramTarget(null);
      await loadData();
    } catch {
      setError('Erreur lors de la suppression.');
      setDeleteProgramTarget(null);
    }
  };

  // --- Handlers pour Vidéos ---
  const handleCreateVideo = () => {
    setEditingVideo(null);
    setShowVideoForm(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleSubmitVideo = async (input: VideoInput, id?: string) => {
    setFormLoading(true);
    try {
      if (id) {
        await updateVideo(id, input);
        showSuccess('Vidéo modifiée avec succès.');
      } else {
        await createVideo(input);
        showSuccess('Vidéo ajoutée avec succès.');
      }
      setShowVideoForm(false);
      setEditingVideo(null);
      await loadData();
    } catch {
      setError(id ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      showSuccess('Vidéo supprimée avec succès.');
      setDeleteVideoTarget(null);
      await loadData();
    } catch {
      setError('Erreur lors de la suppression.');
      setDeleteVideoTarget(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = {
    thisWeek: programs.filter((p) => isThisWeek(p.program_date)).length,
    published: programs.filter((p) => p.status === 'published').length,
    upcoming: programs.filter((p) => isUpcoming(p.program_date)).length,
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-stone-100 pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Se déconnecter</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-800">Tableau de bord</h1>
            <p className="mt-1 text-sm text-stone-500">Gérez les programmes et vidéos de la paroisse.</p>
          </div>
          <button
            onClick={activeTab === 'programs' ? handleCreateProgram : handleCreateVideo}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Ajouter {activeTab === 'programs' ? 'un programme' : 'une vidéo'}
          </button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'programs'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Programmes
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition-colors ${
              activeTab === 'videos'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <VideoIcon className="h-5 w-5" />
            Vidéos
          </button>
        </div>

        {/* Content */}
        {activeTab === 'programs' ? (
          <div>
            {/* Stats Programmes */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                    <Calendar className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-800">{stats.thisWeek}</p>
                    <p className="text-xs text-stone-500">Cette semaine</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-800">{stats.published}</p>
                    <p className="text-xs text-stone-500">Publiés</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-stone-800">{stats.upcoming}</p>
                    <p className="text-xs text-stone-500">À venir</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mb-4 font-serif text-xl font-bold text-stone-700">Tous les programmes</h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
              </div>
            ) : programs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-stone-300" />
                <p className="text-lg font-medium text-stone-600">Aucun programme.</p>
                <p className="mt-2 text-sm text-stone-400">Cliquez sur « Ajouter un programme » pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-stone-800 px-3 py-2 text-white">
                        <span className="text-[9px] font-semibold uppercase text-amber-400">
                          {program.day_name.slice(0, 4)}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {new Date(program.program_date + 'T00:00:00').getDate().toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-800">{program.title}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              program.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {program.status === 'published' ? (
                              <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> Publié</span>
                            ) : (
                              <span className="flex items-center gap-1"><EyeOff className="h-2.5 w-2.5" /> Brouillon</span>
                            )}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                          {formatDateFR(program.program_date)} • {formatTimeFR(program.start_time)} • {program.location}
                        </p>
                        {program.description && (
                          <p className="mt-1 text-xs text-stone-400 line-clamp-2">{program.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleEditProgram(program)}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                      <button
                        onClick={() => setDeleteProgramTarget(program)}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="mb-4 font-serif text-xl font-bold text-stone-700">Toutes les vidéos</h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
              </div>
            ) : videos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <VideoIcon className="mx-auto mb-4 h-12 w-12 text-stone-300" />
                <p className="text-lg font-medium text-stone-600">Aucune vidéo.</p>
                <p className="mt-2 text-sm text-stone-400">Cliquez sur « Ajouter une vidéo » pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                        <VideoIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-stone-800">{video.title}</h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              video.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {video.status === 'published' ? (
                              <span className="flex items-center gap-1"><Eye className="h-2.5 w-2.5" /> Publié</span>
                            ) : (
                              <span className="flex items-center gap-1"><EyeOff className="h-2.5 w-2.5" /> Brouillon</span>
                            )}
                          </span>
                        </div>
                        <a 
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs text-amber-600 hover:underline"
                        >
                          {video.url}
                        </a>
                        {video.description && (
                          <p className="mt-1 text-xs text-stone-400 line-clamp-2">{video.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleEditVideo(video)}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                      <button
                        onClick={() => setDeleteVideoTarget(video)}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Program Form Modal */}
      {showProgramForm && (
        <ProgramForm
          program={editingProgram}
          onSubmit={handleSubmitProgram}
          onCancel={() => { setShowProgramForm(false); setEditingProgram(null); }}
          loading={formLoading}
        />
      )}

      {/* Video Form Modal */}
      {showVideoForm && (
        <VideoForm
          video={editingVideo}
          onSubmit={handleSubmitVideo}
          onCancel={() => { setShowVideoForm(false); setEditingVideo(null); }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirmation Program */}
      {deleteProgramTarget && (
        <ConfirmDelete
          program={deleteProgramTarget}
          onConfirm={() => handleDeleteProgram(deleteProgramTarget.id)}
          onCancel={() => setDeleteProgramTarget(null)}
        />
      )}

      {/* Delete Confirmation Video */}
      {deleteVideoTarget && (
        <ConfirmDeleteVideo
          video={deleteVideoTarget}
          onConfirm={() => handleDeleteVideo(deleteVideoTarget.id)}
          onCancel={() => setDeleteVideoTarget(null)}
        />
      )}
    </div>
  );
}

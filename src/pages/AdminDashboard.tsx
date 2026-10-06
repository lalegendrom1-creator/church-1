import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Edit2, Trash2, Calendar, CheckCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchAllPrograms, createProgram, updateProgram, deleteProgram } from '@/lib/programs';
import { Logo } from '@/components/Logo';
import { ProgramForm } from '@/components/ProgramForm';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import type { Program, ProgramInput } from '@/types';
import { isThisWeek, isUpcoming, formatDateFR, formatTimeFR, getDayNameFromDateStr } from '@/lib/dates';

export function AdminDashboard() {
  const { session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllPrograms();
      setPrograms(data);
    } catch {
      setError('Erreur lors du chargement des programmes.');
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
    if (session) loadPrograms();
  }, [session, loadPrograms]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCreate = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleSubmit = async (input: ProgramInput, id?: string) => {
    setFormLoading(true);
    try {
      if (id) {
        await updateProgram(id, input);
        showSuccess('Programme modifié avec succès.');
      } else {
        await createProgram(input);
        showSuccess('Programme ajouté avec succès.');
      }
      setShowForm(false);
      setEditingProgram(null);
      await loadPrograms();
    } catch {
      setError(id ? 'Erreur lors de la modification.' : 'Erreur lors de l\'ajout.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProgram(id);
      showSuccess('Programme supprimé avec succès.');
      setDeleteTarget(null);
      await loadPrograms();
    } catch {
      setError('Erreur lors de la suppression.');
      setDeleteTarget(null);
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
    <div className="min-h-screen bg-stone-100">
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
            <p className="mt-1 text-sm text-stone-500">Gérez les programmes de la paroisse.</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-amber-700 active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
            Ajouter un programme
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

        {/* Stats */}
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

        {/* Programs list */}
        <h2 className="mb-4 font-serif text-xl font-bold text-stone-700">Tous les programmes</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
            <p className="mt-4 text-sm text-stone-400">Chargement...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <p className="text-lg font-medium text-stone-600">Aucun programme.</p>
            <p className="mt-2 text-sm text-stone-400">
              Cliquez sur « Ajouter un programme » pour commencer.
            </p>
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
                          <span className="flex items-center gap-1">
                            <Eye className="h-2.5 w-2.5" /> Publié
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="h-2.5 w-2.5" /> Brouillon
                          </span>
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
                    onClick={() => handleEdit(program)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Modifier</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(program)}
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

      {/* Program Form Modal */}
      {showForm && (
        <ProgramForm
          program={editingProgram}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingProgram(null); }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDelete
          program={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

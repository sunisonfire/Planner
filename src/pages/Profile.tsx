import React, { useState } from 'react';
import {
  User,
  School,
  BookOpen,
  Calendar,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Hash,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Modal } from '../components/common/Modal';
import { UserProfile } from '../types';
import { BackupRestoreCard } from '../components/profile/BackupRestoreCard';
import { ThemePaletteSelector } from '../components/profile/ThemePaletteSelector';

export const Profile: React.FC = () => {
  const {
    profile,
    updateProfile,
    subjects,
    tasks,
    goals,
    events,
    loadDemoData,
    resetAllData,
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(profile?.name || '');
  const [editUniversity, setEditUniversity] = useState(profile?.university || '');
  const [editCareer, setEditCareer] = useState(profile?.career || '');
  const [editSemester, setEditSemester] = useState(profile?.semester || '');
  const [editStudentId, setEditStudentId] = useState(profile?.studentId || '');

  const openEditModal = () => {
    setEditName(profile?.name || '');
    setEditUniversity(profile?.university || '');
    setEditCareer(profile?.career || '');
    setEditSemester(profile?.semester || '');
    setEditStudentId(profile?.studentId || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setStatusMessage({ type: 'error', text: 'El nombre no puede estar vacío.' });
      return;
    }

    const updated: UserProfile = {
      name: editName.trim(),
      university: editUniversity.trim(),
      career: editCareer.trim(),
      semester: editSemester.trim() || undefined,
      studentId: editStudentId.trim() || undefined,
      avatarColor: profile?.avatarColor || '#6366f1',
    };

    updateProfile(updated);
    setIsEditProfileOpen(false);
    setStatusMessage({ type: 'success', text: 'Perfil actualizado con éxito.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
          Mi Perfil & Configuración ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Gestiona tus datos personales, preferencias del sistema y copias de seguridad locales
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* 1. Student Identity Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md shrink-0"
              style={{ backgroundColor: profile?.avatarColor || '#6366f1' }}
            >
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                {profile?.name || 'Estudiante'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile?.career || 'Carrera no especificada'}
              </p>
            </div>
          </div>

          <button
            id="profile-edit-btn"
            type="button"
            onClick={openEditModal}
            className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            Editar perfil
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <School className="w-3.5 h-3.5" />
              Universidad
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {profile?.university || 'No definida'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Carrera
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {profile?.career || 'No definida'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Semestre
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {profile?.semester ? `${profile.semester}° Semestre` : 'No asignado'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold mb-1">
              <Hash className="w-3.5 h-3.5" />
              Código Estudiantil
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {profile?.studentId || 'No asignado'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Stats summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Estadísticas de tu espacio local 📊
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {subjects.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Materias</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
              {tasks.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Tareas totales</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {goals.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Metas fijadas</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
              {events.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Eventos agendados</p>
          </div>
        </div>
      </div>

      {/* 3. Theme & Custom Color Palette Selector */}
      <ThemePaletteSelector />

      {/* 4. Local Storage Backup & Restore Dedicated Card */}
      <BackupRestoreCard />

      {/* 5. Demo Data & Reset Danger Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          Opciones avanzadas
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            id="profile-load-demo-btn"
            type="button"
            onClick={() => setIsDemoConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            🪄 Cargar datos de ejemplo
          </button>

          <button
            id="profile-reset-btn"
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            ⚠️ Restablecer aplicación
          </button>
        </div>
      </div>

      {/* Modal: Edit Profile */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Editar Perfil"
        subtitle="Actualiza tus datos académicos personales"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label
              htmlFor="edit-profile-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nombre completo <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-profile-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="edit-profile-uni"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Universidad
              </label>
              <input
                id="edit-profile-uni"
                type="text"
                value={editUniversity}
                onChange={(e) => setEditUniversity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="edit-profile-career"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Carrera
              </label>
              <input
                id="edit-profile-career"
                type="text"
                value={editCareer}
                onChange={(e) => setEditCareer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="edit-profile-sem"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Semestre (ej. 4)
              </label>
              <input
                id="edit-profile-sem"
                type="text"
                placeholder="4"
                value={editSemester}
                onChange={(e) => setEditSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="edit-profile-studentid"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Código Estudiantil
              </label>
              <input
                id="edit-profile-studentid"
                type="text"
                placeholder="2204592"
                value={editStudentId}
                onChange={(e) => setEditStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation: Load Demo */}
      <ConfirmationModal
        isOpen={isDemoConfirmOpen}
        onClose={() => setIsDemoConfirmOpen(false)}
        onConfirm={() => {
          loadDemoData();
          setIsDemoConfirmOpen(false);
          setStatusMessage({
            type: 'success',
            text: '¡Datos de ejemplo cargados con éxito!',
          });
          setTimeout(() => setStatusMessage(null), 4000);
        }}
        title="¿Cargar datos de ejemplo?"
        message="Esto agregará materias, tareas y metas de muestra a tu UniPlanner para que explores todas las funciones."
        confirmText="Cargar datos"
        confirmVariant="primary"
      />

      {/* Confirmation: Reset App */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetAllData();
          setIsResetConfirmOpen(false);
        }}
        title="¿Restablecer UniPlanner por completo?"
        message="Esta acción eliminará todas tus materias, tareas, eventos, notas y metas almacenadas en este navegador. Volverás a la pantalla de bienvenida inicial."
        confirmText="Sí, restablecer todo"
        confirmVariant="danger"
      />
    </div>
  );
};

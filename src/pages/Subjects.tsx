import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  User,
  MapPin,
  Clock,
  CheckSquare,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';
import { SubjectModal } from '../components/modals/SubjectModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';

export const Subjects: React.FC = () => {
  const { subjects, tasks, deleteSubject, setActiveTab } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  // Helper to count pending tasks per subject
  const getSubjectTaskCounts = (subjectId: string) => {
    const subTasks = tasks.filter((t) => t.subjectId === subjectId);
    const pending = subTasks.filter((t) => !t.completed).length;
    return { total: subTasks.length, pending };
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Mis Materias 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Administra tus cursos, códigos, profesores, aulas y horarios
          </p>
        </div>

        <button
          id="subjects-add-btn"
          type="button"
          onClick={() => {
            setSubjectToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Nueva materia
        </button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="📚 No tienes materias registradas"
          description="Agrega las materias que estás cursando este semestre para asociar tus tareas y notas."
          actionText="+ Crear primera materia"
          onAction={() => {
            setSubjectToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject) => {
            const { total, pending } = getSubjectTaskCounts(subject.id);

            return (
              <div
                key={subject.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Color Band */}
                <div
                  className="h-3 w-full"
                  style={{ backgroundColor: subject.color }}
                />

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Subject Info */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {subject.code && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {subject.code}
                          </span>
                        )}
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                          {subject.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setSubjectToEdit(subject);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Editar materia"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubjectToDelete(subject)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Eliminar materia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-500 dark:text-slate-400">
                      {subject.professor && (
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{subject.professor}</span>
                        </div>
                      )}
                      {subject.classroom && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{subject.classroom}</span>
                        </div>
                      )}
                      {subject.schedule && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{subject.schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task summary badge */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        <strong>{pending}</strong> pendiente{pending === 1 ? '' : 's'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('grades')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Calculator className="w-3 h-3" />
                      Calcular notas →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      <ConfirmationModal
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={() => {
          if (subjectToDelete) {
            deleteSubject(subjectToDelete.id);
            setSubjectToDelete(null);
          }
        }}
        title="Eliminar materia"
        message={`¿Estás seguro de eliminar la materia "${subjectToDelete?.name}"? También se eliminarán o desvincularán sus tareas asociadas.`}
        confirmText="Eliminar materia"
      />
    </div>
  );
};

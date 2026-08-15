import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  School,
  BookOpen,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject, UserProfile } from '../types';

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#6366f1', // Indigo
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [career, setCareer] = useState('');

  // Step 4: Subjects
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 'sub-init-1', name: 'Bases de Datos', code: 'BD01', color: '#10b981' },
    { id: 'sub-init-2', name: 'Programación', code: 'PROG01', color: '#8b5cf6' },
    { id: 'sub-init-3', name: 'Matemáticas', code: 'MAT01', color: '#3b82f6' },
    { id: 'sub-init-4', name: 'Inglés', code: 'ING01', color: '#f59e0b' },
  ]);

  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubColor, setNewSubColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const handleAddSubject = () => {
    if (!newSubName.trim()) {
      setError('Escribe el nombre de la materia.');
      return;
    }
    const newSubject: Subject = {
      id: `sub-init-${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim() || undefined,
      color: newSubColor,
    };
    setSubjects([...subjects, newSubject]);
    setNewSubName('');
    setNewSubCode('');
    setNewSubColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setError('');
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!name.trim()) {
        setError('Por favor ingresa tu nombre.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!university.trim()) {
        setError('Por favor ingresa el nombre de tu universidad.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!career.trim()) {
        setError('Por favor ingresa tu carrera universitaria.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (subjects.length === 0) {
        setError('Por favor agrega al menos una materia para comenzar.');
        return;
      }
      setStep(5);
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim(),
      university: university.trim(),
      career: career.trim(),
      avatarColor: '#6366f1',
    };
    completeOnboarding(profile, subjects);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Background soft glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            ¡Bienvenido a UniPlanner! 🎓
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Vamos a personalizar tu espacio para que organizar la universidad sea mucho más fácil.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-indigo-600'
                  : s < step
                  ? 'w-3 bg-indigo-300 dark:bg-indigo-800'
                  : 'w-3 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                Paso 1 de 5 · Tu identidad
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                ¿Cómo te llamas?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Así personalizaremos tus saludos y tus reportes académicos.
              </p>
              <input
                id="onboarding-name-input"
                type="text"
                placeholder="Tu nombre (ej. Danna)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/60 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                autoFocus
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <School className="w-4 h-4" />
                Paso 2 de 5 · Tu institución
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                ¿En qué universidad estudias?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                El nombre de tu universidad o instituto superior.
              </p>
              <input
                id="onboarding-university-input"
                type="text"
                placeholder="Nombre de tu universidad (ej. Universidad Industrial de Santander)"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/60 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                autoFocus
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Paso 3 de 5 · Tu profesión
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                ¿Qué carrera estudias?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tu programa o facultad académica.
              </p>
              <input
                id="onboarding-career-input"
                type="text"
                placeholder="Tu carrera (ej. Ingeniería de Sistemas)"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/60 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                autoFocus
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Paso 4 de 5 · Tus asignaturas
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                ¿Qué materias estás viendo?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agrega las materias de tu semestre actual. Podrás editarlas o agregar más después.
              </p>

              {/* Add mini form */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-750 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    id="onboarding-subject-name"
                    type="text"
                    placeholder="Nombre de materia *"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    id="onboarding-subject-code"
                    type="text"
                    placeholder="Código (opcional)"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewSubColor(c)}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          newSubColor === c ? 'scale-125 ring-2 ring-indigo-500' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: c }}
                        aria-label="Color"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Agregar materia
                  </button>
                </div>
              </div>

              {/* Current list */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-750 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {sub.name}
                      </span>
                      {sub.code && (
                        <span className="text-slate-400 font-mono text-[10px]">
                          ({sub.code})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label={`Eliminar ${sub.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Resumen final · Todo listo
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-display">
                Hola, {name} 👋
              </h2>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Universidad:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {university}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Carrera:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {career}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block mb-1">
                    Materias registradas ({subjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {subjects.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              id="onboarding-next-btn"
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:translate-x-0.5 active:scale-95"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="onboarding-start-btn"
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-102 active:scale-98"
            >
              Comenzar 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  RotateCw,
  Eye,
  EyeOff,
  Filter,
  Check,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Flashcard } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import confetti from 'canvas-confetti';

export const FlashcardsStudySection: React.FC = () => {
  const {
    flashcards,
    subjects,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    playSound,
  } = useApp();

  // Mode: 'list' (manage cards) | 'study' (interactive flip session)
  const [activeView, setActiveView] = useState<'study' | 'list'>('study');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  
  // Study session state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionStreak, setSessionStreak] = useState<number>(0);

  // Card Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);

  // Form inputs
  const [formSubjectId, setFormSubjectId] = useState<string>('');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formAnswer, setFormAnswer] = useState<string>('');
  const [formHint, setFormHint] = useState<string>('');
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [formError, setFormError] = useState<string>('');

  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const filteredCards = useMemo(() => {
    if (selectedSubjectFilter === 'all') return flashcards;
    return flashcards.filter((c) => c.subjectId === selectedSubjectFilter);
  }, [flashcards, selectedSubjectFilter]);

  const currentCard = filteredCards[currentIndex] || null;

  const masteredCount = useMemo(
    () => flashcards.filter((c) => c.mastered).length,
    [flashcards]
  );

  const openCreateModal = () => {
    setEditingCard(null);
    setFormSubjectId(subjects[0]?.id || '');
    setFormQuestion('');
    setFormAnswer('');
    setFormHint('');
    setFormDifficulty('medium');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setFormSubjectId(card.subjectId);
    setFormQuestion(card.question);
    setFormAnswer(card.answer);
    setFormHint(card.hint || '');
    setFormDifficulty(card.difficulty || 'medium');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubjectId) {
      setFormError('Por favor selecciona una materia.');
      return;
    }
    if (!formQuestion.trim()) {
      setFormError('Por favor escribe la pregunta o término.');
      return;
    }
    if (!formAnswer.trim()) {
      setFormError('Por favor escribe la respuesta o explicación.');
      return;
    }

    if (editingCard) {
      updateFlashcard(editingCard.id, {
        subjectId: formSubjectId,
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        hint: formHint.trim() || undefined,
        difficulty: formDifficulty,
      });
    } else {
      addFlashcard({
        subjectId: formSubjectId,
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        hint: formHint.trim() || undefined,
        difficulty: formDifficulty,
        reviewCount: 0,
        mastered: false,
      });
    }

    setIsModalOpen(false);
  };

  const handleAnswerReview = (mastered: boolean) => {
    if (!currentCard) return;

    reviewFlashcard(currentCard.id, mastered);

    if (mastered) {
      setSessionStreak((prev) => prev + 1);
      if ((sessionStreak + 1) % 5 === 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    } else {
      setSessionStreak(0);
    }

    // Go to next card
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back or stay
      setCurrentIndex(0);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              Método de Estudio: Flashcards & Repaso Activo
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Memoriza conceptos clave durante tus bloques de Pomodoro mediante repetición espaciada.
          </p>
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              id="flashcards-study-tab"
              type="button"
              onClick={() => setActiveView('study')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'study'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Modo Repaso
            </button>
            <button
              id="flashcards-list-tab"
              type="button"
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Gestionar ({flashcards.length})
            </button>
          </div>

          <button
            id="flashcards-add-btn"
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            + Nueva Tarjeta
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tarjetas</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
            {flashcards.length}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/30">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Dominadas</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
            {masteredCount} <span className="text-xs font-normal">({flashcards.length > 0 ? Math.round((masteredCount / flashcards.length) * 100) : 0}%)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/30">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Por Repasar</div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-display mt-0.5">
            {flashcards.length - masteredCount}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30">
          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Racha de Aciertos</div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display mt-0.5 flex items-center gap-1">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            {sessionStreak}
          </div>
        </div>
      </div>

      {/* Filter by subject */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          Filtrar materia:
        </span>
        <button
          type="button"
          onClick={() => {
            setSelectedSubjectFilter('all');
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedSubjectFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Todas ({flashcards.length})
        </button>
        {subjects.map((sub) => {
          const count = flashcards.filter((c) => c.subjectId === sub.id).length;
          const isSelected = selectedSubjectFilter === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                setSelectedSubjectFilter(sub.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              style={{
                backgroundColor: isSelected ? sub.color : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isSelected ? '#ffffff' : sub.color }}
              />
              <span>{sub.name}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main View: Study Flip Card vs List */}
      {activeView === 'study' ? (
        filteredCards.length === 0 ? (
          <div className="py-14 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-200 dark:border-slate-800">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No hay flashcards para esta materia
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Crea tarjetas de preguntas y respuestas para memorizar durante tus descansos o ciclos de estudio.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Crear primera Flashcard
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                Tarjeta {currentIndex + 1} de {filteredCards.length}
              </span>
              {currentCard && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: subjectMap.get(currentCard.subjectId)?.color || '#6366f1' }}
                  />
                  {subjectMap.get(currentCard.subjectId)?.name || 'Materia'}
                </span>
              )}
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => {
                playSound('pop');
                setIsFlipped(!isFlipped);
              }}
              className={`min-h-[260px] sm:min-h-[300px] p-6 sm:p-8 rounded-3xl cursor-pointer select-none transition-all duration-300 relative flex flex-col justify-between shadow-sm border ${
                isFlipped
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              {/* Top Tag & Flip Hint */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    isFlipped
                      ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  {isFlipped ? '💡 RESPUESTA' : '❓ PREGUNTA'}
                </span>

                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  Haz clic para voltear
                </span>
              </div>

              {/* Card Center Content */}
              <div className="py-6 text-center">
                <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {isFlipped ? currentCard?.answer : currentCard?.question}
                </p>

                {/* Optional Hint button */}
                {!isFlipped && currentCard?.hint && (
                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    {showHint ? (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 max-w-md mx-auto animate-fade-in">
                        💡 <strong>Pista:</strong> {currentCard.hint}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowHint(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Mostrar pista
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Bottom Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-750/50">
                <span>Repasos: {currentCard?.reviewCount || 0}</span>
                {currentCard?.mastered && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Dominada
                  </span>
                )}
              </div>
            </div>

            {/* Answer Evaluation Actions (when flipped) */}
            {isFlipped ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="flashcard-failed-btn"
                  type="button"
                  onClick={() => handleAnswerReview(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-sm border border-rose-200 dark:border-rose-800 transition-all active:scale-95"
                >
                  <XCircle className="w-5 h-5" />
                  Necesito repasarla
                </button>

                <button
                  id="flashcard-success-btn"
                  type="button"
                  onClick={() => handleAnswerReview(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  ¡La recordé bien!
                </button>
              </div>
            ) : (
              /* Navigation arrows */
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setIsFlipped(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  Ver Respuesta
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        /* List Mode: Manage Flashcards */
        <div className="space-y-3">
          {filteredCards.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay flashcards para mostrar en esta lista.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCards.map((card) => {
                const sub = subjectMap.get(card.subjectId);
                return (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold"
                          style={{
                            backgroundColor: `${sub?.color || '#6366f1'}18`,
                            color: sub?.color || '#6366f1',
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: sub?.color || '#6366f1' }}
                          />
                          {sub?.name || 'Materia'}
                        </span>

                        <div className="flex items-center gap-1">
                          {card.mastered && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                              Dominada
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(card)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardToDelete(card)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {card.question}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2">
                        {card.answer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Repasada {card.reviewCount} veces</span>
                      {card.difficulty && (
                        <span className="capitalize font-medium text-slate-500 dark:text-slate-400">
                          Nivel: {card.difficulty === 'easy' ? 'Fácil' : card.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCard ? 'Editar Flashcard' : 'Nueva Flashcard de Estudio'}
        subtitle="Agrega preguntas y respuestas para memorizar durante el Pomodoro"
      >
        <form onSubmit={handleSaveCard} className="space-y-4">
          {formError && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="fc-subject-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Materia asociada <span className="text-rose-500">*</span>
            </label>
            <select
              id="fc-subject-select"
              value={formSubjectId}
              onChange={(e) => setFormSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} {sub.code ? `(${sub.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fc-question-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Pregunta, término o concepto <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="fc-question-input"
              rows={3}
              value={formQuestion}
              onChange={(e) => setFormQuestion(e.target.value)}
              placeholder="Ej. ¿Qué es el principio de Responsabilidad Única (SOLID)?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="fc-answer-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Respuesta o definición <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="fc-answer-input"
              rows={3}
              value={formAnswer}
              onChange={(e) => setFormAnswer(e.target.value)}
              placeholder="Ej. Cada clase o módulo debe tener una sola razón para cambiar."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fc-hint-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Pista opcional
              </label>
              <input
                id="fc-hint-input"
                type="text"
                value={formHint}
                onChange={(e) => setFormHint(e.target.value)}
                placeholder="Ej. Piensa en la letra 'S' de SOLID"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label
                htmlFor="fc-difficulty-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Nivel de dificultad
              </label>
              <select
                id="fc-difficulty-select"
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
              >
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              {editingCard ? 'Guardar Cambios' : 'Crear Flashcard'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={() => {
          if (cardToDelete) {
            deleteFlashcard(cardToDelete.id);
            setCardToDelete(null);
          }
        }}
        title="Eliminar Flashcard"
        message={`¿Estás seguro de que deseas eliminar esta tarjeta de estudio?`}
        confirmText="Eliminar tarjeta"
      />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  CheckSquare,
  Maximize2,
  Minimize2,
  Clock,
  Coffee,
  SunMedium,
  History,
  Trash2,
  Headphones,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PomodoroMode } from '../types';
import { THEME_PALETTES } from '../utils/themes';
import { SoundEngine, AmbientSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { FlashcardsStudySection } from '../components/pomodoro/FlashcardsStudySection';

export const Pomodoro: React.FC = () => {
  const {
    subjects,
    tasks,
    pomodoroSessions,
    pomodoroSettings,
    addPomodoroSession,
    updatePomodoroSettings,
    clearPomodoroHistory,
    settings,
    toggleTask,
  } = useApp();

  const currentPalette = THEME_PALETTES[settings.themeColor] || THEME_PALETTES.indigo;

  // Active state
  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(pomodoroSettings.pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [sessionNote, setSessionNote] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.3);

  // Settings form local state
  const [formPomoTime, setFormPomoTime] = useState<number>(pomodoroSettings.pomodoroTime);
  const [formShortBreak, setFormShortBreak] = useState<number>(pomodoroSettings.shortBreakTime);
  const [formLongBreak, setFormLongBreak] = useState<number>(pomodoroSettings.longBreakTime);
  const [formInterval, setFormInterval] = useState<number>(pomodoroSettings.longBreakInterval);
  const [formTicking, setFormTicking] = useState<boolean>(pomodoroSettings.tickingSound);
  const [formAutoBreaks, setFormAutoBreaks] = useState<boolean>(pomodoroSettings.autoStartBreaks);
  const [formAutoPomo, setFormAutoPomo] = useState<boolean>(pomodoroSettings.autoStartPomodoros);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Get total duration for current mode in seconds
  const getTotalSecondsForMode = (m: PomodoroMode): number => {
    switch (m) {
      case 'pomodoro':
        return pomodoroSettings.pomodoroTime * 60;
      case 'shortBreak':
        return pomodoroSettings.shortBreakTime * 60;
      case 'longBreak':
        return pomodoroSettings.longBreakTime * 60;
    }
  };

  const totalTimeForCurrentMode = getTotalSecondsForMode(mode);
  const progressPercent = Math.min(100, Math.max(0, ((totalTimeForCurrentMode - timeLeft) / totalTimeForCurrentMode) * 100));

  // Switch mode helper
  const handleSwitchMode = (newMode: PomodoroMode, autoStart = false) => {
    setIsRunning(false);
    setMode(newMode);
    const newTotal = getTotalSecondsForMode(newMode);
    setTimeLeft(newTotal);

    if (autoStart) {
      setTimeout(() => setIsRunning(true), 200);
    }
  };

  // Timer Tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, completedCycles, pomodoroSettings, selectedSubjectId, selectedTaskId, sessionNote]);

  // Audio ticking sound effect
  useEffect(() => {
    if (isRunning && pomodoroSettings.tickingSound) {
      tickRef.current = setInterval(() => {
        SoundEngine.playTimerTick(settings.soundEnabled);
      }, 1000);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, pomodoroSettings.tickingSound, settings.soundEnabled]);

  // Ambient sound effect
  useEffect(() => {
    if (isRunning && pomodoroSettings.ambientSound !== 'none') {
      AmbientSound.start(pomodoroSettings.ambientSound as 'rain' | 'whitenoise' | 'binaural', ambientVolume);
    } else {
      AmbientSound.stop();
    }

    return () => {
      AmbientSound.stop();
    };
  }, [isRunning, pomodoroSettings.ambientSound, ambientVolume]);

  // Session completion handler
  const handleTimerCompleted = () => {
    setIsRunning(false);
    SoundEngine.playTimerComplete(settings.soundEnabled);

    if (mode === 'pomodoro') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }

      // Log session
      addPomodoroSession({
        mode: 'pomodoro',
        durationMinutes: pomodoroSettings.pomodoroTime,
        completedAt: new Date().toISOString(),
        subjectId: selectedSubjectId || undefined,
        taskId: selectedTaskId || undefined,
        notes: sessionNote || undefined,
      });

      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);

      // Determine next break mode
      const isLongBreakTime = nextCycles % pomodoroSettings.longBreakInterval === 0;
      const nextMode: PomodoroMode = isLongBreakTime ? 'longBreak' : 'shortBreak';
      handleSwitchMode(nextMode, pomodoroSettings.autoStartBreaks);
    } else {
      // Break completed -> back to study
      handleSwitchMode('pomodoro', pomodoroSettings.autoStartPomodoros);
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      SoundEngine.playPop(settings.soundEnabled);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getTotalSecondsForMode(mode));
    SoundEngine.playDelete(settings.soundEnabled);
  };

  const skipTimer = () => {
    setIsRunning(false);
    SoundEngine.playTab(settings.soundEnabled);
    if (mode === 'pomodoro') {
      const isLongBreak = (completedCycles + 1) % pomodoroSettings.longBreakInterval === 0;
      handleSwitchMode(isLongBreak ? 'longBreak' : 'shortBreak', false);
    } else {
      handleSwitchMode('pomodoro', false);
    }
  };

  // Preset quick selectors
  const applyPreset = (pomoMin: number, shortMin: number, longMin: number) => {
    const updated = {
      pomodoroTime: pomoMin,
      shortBreakTime: shortMin,
      longBreakTime: longMin,
    };
    updatePomodoroSettings(updated);
    setFormPomoTime(pomoMin);
    setFormShortBreak(shortMin);
    setFormLongBreak(longMin);
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(pomoMin * 60);
    else if (mode === 'shortBreak') setTimeLeft(shortMin * 60);
    else setTimeLeft(longMin * 60);
    SoundEngine.playPop(settings.soundEnabled);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      pomodoroTime: Math.max(1, formPomoTime),
      shortBreakTime: Math.max(1, formShortBreak),
      longBreakTime: Math.max(1, formLongBreak),
      longBreakInterval: Math.max(1, formInterval),
      tickingSound: formTicking,
      autoStartBreaks: formAutoBreaks,
      autoStartPomodoros: formAutoPomo,
    };
    updatePomodoroSettings(updated);
    setIsSettingsOpen(false);
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(updated.pomodoroTime * 60);
    else if (mode === 'shortBreak') setTimeLeft(updated.shortBreakTime * 60);
    else setTimeLeft(updated.longBreakTime * 60);
    SoundEngine.playSuccess(settings.soundEnabled);
  };

  // Calculations for Today's Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = pomodoroSessions.filter((s) => s.completedAt.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const todayPomosCount = todaySessions.filter((s) => s.mode === 'pomodoro').length;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const pendingTasksList = tasks.filter((t) => !t.completed);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  // Zen / Fullscreen container toggle
  const toggleZenMode = () => {
    setIsFullscreen(!isFullscreen);
    SoundEngine.playTab(settings.soundEnabled);
  };

  return (
    <div
      id="pomodoro-section-root"
      className={`space-y-4 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 text-white p-4 sm:p-8 flex flex-col justify-center items-center overflow-y-auto'
          : ''
      }`}
    >
      {/* Top Header Card */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: currentPalette.primary }}
              >
                <Clock className="w-4 h-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">
                Temporizador Pomodoro & Enfoque ⏱️
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Gestiona tus bloques de estudio universitario, descansos y maximiza tu concentración sin fatiga mental.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="pomodoro-settings-button"
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Ajustes</span>
            </button>

            <button
              id="pomodoro-zen-mode-button"
              type="button"
              onClick={toggleZenMode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Zen</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column Timer & Controls | Right Column Focus Context & Stats */}
      <div className={`grid grid-cols-1 ${isFullscreen ? 'max-w-2xl w-full' : 'lg:grid-cols-12'} gap-4`}>
        {/* Left / Center Column: The Visual Timer */}
        <div className={`${isFullscreen ? 'w-full' : 'lg:col-span-7'} space-y-4`}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center relative overflow-hidden">
            {/* Zen Mode Exit Button */}
            {isFullscreen && (
              <button
                type="button"
                onClick={toggleZenMode}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Salir Zen</span>
              </button>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 max-w-sm w-full justify-center">
              <button
                type="button"
                id="pomodoro-tab-pomo"
                onClick={() => handleSwitchMode('pomodoro')}
                style={
                  mode === 'pomodoro'
                    ? {
                        backgroundColor: currentPalette.primary,
                        color: '#ffffff',
                      }
                    : undefined
                }
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'pomodoro'
                    ? 'shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Estudio</span>
              </button>

              <button
                type="button"
                id="pomodoro-tab-short"
                onClick={() => handleSwitchMode('shortBreak')}
                style={
                  mode === 'shortBreak'
                    ? {
                        backgroundColor: '#10b981', // emerald
                        color: '#ffffff',
                      }
                    : undefined
                }
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'shortBreak'
                    ? 'shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Descanso</span>
              </button>

              <button
                type="button"
                id="pomodoro-tab-long"
                onClick={() => handleSwitchMode('longBreak')}
                style={
                  mode === 'longBreak'
                    ? {
                        backgroundColor: '#3b82f6', // blue
                        color: '#ffffff',
                      }
                    : undefined
                }
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'longBreak'
                    ? 'shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <SunMedium className="w-3.5 h-3.5" />
                <span>Largo</span>
              </button>
            </div>

            {/* Circular Progress Ring & Large Numbers */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2 select-none">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
                {/* Background Track Circle */}
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                {/* Progress Circle */}
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke={
                    mode === 'pomodoro'
                      ? currentPalette.primary
                      : mode === 'shortBreak'
                      ? '#10b981'
                      : '#3b82f6'
                  }
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1"
                  style={{
                    backgroundColor:
                      mode === 'pomodoro'
                        ? currentPalette.lightBg
                        : mode === 'shortBreak'
                        ? '#ecfdf5'
                        : '#eff6ff',
                    color:
                      mode === 'pomodoro'
                        ? currentPalette.text
                        : mode === 'shortBreak'
                        ? '#047857'
                        : '#1d4ed8',
                  }}
                >
                  {mode === 'pomodoro'
                    ? isRunning
                      ? '🔥 Sesión En Curso'
                      : '🎯 Modo Estudio'
                    : mode === 'shortBreak'
                    ? '☕ Descanso Corto'
                    : '🌴 Descanso Largo'}
                </span>

                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono my-0.5">
                  {formattedTime}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {mode === 'pomodoro'
                    ? `Bloque ${(completedCycles % pomodoroSettings.longBreakInterval) + 1} de ${
                        pomodoroSettings.longBreakInterval
                      }`
                    : 'Respira hondo y relaja la vista'}
                </p>

                {/* Linked Subject Pill */}
                {selectedSubject && (
                  <div
                    className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold text-white max-w-[180px] truncate shadow-xs"
                    style={{ backgroundColor: selectedSubject.color }}
                  >
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span className="truncate">{selectedSubject.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Interactive Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                id="pomodoro-reset-btn"
                type="button"
                onClick={resetTimer}
                title="Reiniciar temporizador"
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="pomodoro-play-pause-btn"
                type="button"
                onClick={toggleTimer}
                style={{
                  backgroundColor:
                    mode === 'pomodoro'
                      ? currentPalette.primary
                      : mode === 'shortBreak'
                      ? '#10b981'
                      : '#3b82f6',
                }}
                className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-95 transition-all transform active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Iniciar Enfoque</span>
                  </>
                )}
              </button>

              <button
                id="pomodoro-skip-btn"
                type="button"
                onClick={skipTimer}
                title="Saltar a siguiente fase"
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs active:scale-95"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Row */}
            <div className="w-full pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Métodos rápidos:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset(25, 5, 15)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pomodoroSettings.pomodoroTime === 25
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  25/5 min
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(50, 10, 20)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pomodoroSettings.pomodoroTime === 50
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  50/10 min (Deep Work)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(15, 3, 10)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    pomodoroSettings.pomodoroTime === 15
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  15/3 min
                </button>
              </div>
            </div>
          </div>

          {/* Ambient Noise & Focus Sounds Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Ambiente Acústico de Concentración 🎧
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Generado sin descargas</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Silencio', desc: 'Sin sonido de fondo' },
                { id: 'rain', label: '🌧️ Lluvia Suave', desc: 'Filtro relajante' },
                { id: 'whitenoise', label: '📻 Ruido Blanco', desc: 'Aísla ruidos' },
                { id: 'binaural', label: '🧠 Ondas 40Hz', desc: 'Gamma focus' },
              ].map((sound) => {
                const isSelected = pomodoroSettings.ambientSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    type="button"
                    onClick={() => {
                      updatePomodoroSettings({ ambientSound: sound.id as any });
                      SoundEngine.playPop(settings.soundEnabled);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: currentPalette.primary,
                            backgroundColor: currentPalette.lightBg,
                            color: currentPalette.text,
                          }
                        : undefined
                    }
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-xs">{sound.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {sound.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Linking, Stats & History */}
        {!isFullscreen && (
          <div className="lg:col-span-5 space-y-4">
            {/* Subject & Task Linking Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Objetivo de esta sesión 🎯
                </h3>
              </div>

              {/* Subject selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Materia académica:
                </label>
                <select
                  id="pomodoro-subject-select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">(Sin vincular a materia específica)</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} {sub.code ? `(${sub.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Tarea pendiente vinculada:
                </label>
                <select
                  id="pomodoro-task-select"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">(Ninguna tarea seleccionada)</option>
                  {pendingTasksList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Completed Task Quick action if selected */}
              {selectedTask && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium truncate">
                      {selectedTask.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      toggleTask(selectedTask.id);
                      setSelectedTaskId('');
                    }}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0"
                  >
                    Marcar lista ✓
                  </button>
                </div>
              )}

              {/* Session Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Nota breve / Meta del bloque:
                </label>
                <input
                  type="text"
                  placeholder="p. ej. Resolver ejercicios del 1 al 10..."
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Daily Productivity Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Rendimiento de Hoy
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Minutos de Enfoque</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                    {todayMinutes} <span className="text-xs font-normal text-slate-400">min</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Pomodoros Listos</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                    {todayPomosCount} <span className="text-xs font-normal text-slate-400">sesiones</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Today's History Log */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Historial de Sesiones
                  </h3>
                </div>
                {pomodoroSessions.length > 0 && (
                  <button
                    type="button"
                    onClick={clearPomodoroHistory}
                    className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>

              {pomodoroSessions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Aún no has registrado sesiones de estudio. ¡Inicia tu primer Pomodoro arriba!
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pomodoroSessions.slice(0, 10).map((session) => {
                    const sub = subjects.find((s) => s.id === session.subjectId);
                    const time = new Date(session.completedAt).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={session.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-750 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {sub ? sub.name : 'Estudio Libre'}
                            </p>
                            {session.notes && (
                              <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900 dark:text-white">
                            +{session.durationMinutes}m
                          </span>
                          <p className="text-[10px] text-slate-400">{time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flashcards & Active Study Method Section */}
        {!isFullscreen && (
          <div className="pt-2">
            <FlashcardsStudySection />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Ajustes del Temporizador ⚙️
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Estudio (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formPomoTime}
                    onChange={(e) => setFormPomoTime(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Descanso (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formShortBreak}
                    onChange={(e) => setFormShortBreak(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Largo (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formLongBreak}
                    onChange={(e) => setFormLongBreak(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Intervalo para descanso largo:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formInterval}
                    onChange={(e) => setFormInterval(Number(e.target.value))}
                    className="w-24 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                  <span className="text-xs text-slate-500">sesiones de estudio</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formTicking}
                    onChange={(e) => setFormTicking(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Efecto de sonido de reloj (Tic-tac sutil)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAutoBreaks}
                    onChange={(e) => setFormAutoBreaks(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Iniciar descansos automáticamente</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAutoPomo}
                    onChange={(e) => setFormAutoPomo(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Iniciar pomodoros automáticamente al terminar descanso</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentPalette.primary }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                >
                  Guardar Preferencias
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

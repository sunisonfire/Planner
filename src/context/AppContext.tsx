import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Subject,
  Task,
  CalendarEvent,
  Goal,
  SubjectGrades,
  Evaluation,
  AppSettings,
  AppNotification,
  TabType,
  ThemeColorKey,
  PomodoroSession,
  PomodoroSettings,
  Flashcard,
} from '../types';
import {
  STORAGE_KEYS,
  getData,
  setData,
  clearAllUniPlannerData,
  exportAllData,
  validateAndImportData,
  inspectBackupJSON,
  getStorageUsageKB,
  BackupInspectionSummary,
} from '../utils/storage';
import { generateSmartNotifications } from '../utils/notifications';
import { getDemoData } from '../data/demoData';
import { SoundEngine } from '../utils/audio';
import { applyThemeToDOM } from '../utils/themes';

interface AppContextType {
  profile: UserProfile | null;
  subjects: Subject[];
  tasks: Task[];
  events: CalendarEvent[];
  goals: Goal[];
  grades: Record<string, SubjectGrades>;
  settings: AppSettings;
  isOnboarded: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Theme & Sound
  setThemeColor: (color: ThemeColorKey) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  playSound: (type: 'click' | 'pop' | 'success' | 'delete' | 'tab' | 'celebration') => void;

  pomodoroSessions: PomodoroSession[];
  pomodoroSettings: PomodoroSettings;
  addPomodoroSession: (session: Omit<PomodoroSession, 'id'>) => PomodoroSession;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  clearPomodoroHistory: () => void;

  flashcards: Flashcard[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt'>) => Flashcard;
  updateFlashcard: (id: string, card: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, mastered: boolean) => void;

  // Actions
  completeOnboarding: (profile: UserProfile, subjects: Subject[]) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  addEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  addGoal: (goal: Omit<Goal, 'id'>) => Goal;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  deleteGoal: (id: string) => void;

  getSubjectGrades: (subjectId: string) => SubjectGrades;
  updateSubjectGrades: (subjectId: string, grades: SubjectGrades) => void;
  addEvaluation: (subjectId: string, evaluation: Omit<Evaluation, 'id'>) => void;
  updateEvaluation: (subjectId: string, evalId: string, evalData: Partial<Evaluation>) => void;
  deleteEvaluation: (subjectId: string, evalId: string) => void;

  loadDemoData: () => void;
  resetAllData: () => void;
  exportBackup: () => void;
  inspectBackup: (json: string) => BackupInspectionSummary;
  importBackup: (json: string) => { success: boolean; error?: string };
  storageUsageKB: number;
  triggerCelebration: () => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  themeColor: 'indigo',
  soundEnabled: true,
  notificationsEnabled: true,
  minPassingGradeDefault: 3.0,
  maxGradeDefault: 5.0,
};

const defaultPomodoroSettings: PomodoroSettings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  tickingSound: false,
  ambientSound: 'none',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() =>
    getData<UserProfile | null>(STORAGE_KEYS.PROFILE, null)
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getData<Subject[]>(STORAGE_KEYS.SUBJECTS, [])
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    getData<Task[]>(STORAGE_KEYS.TASKS, [])
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    getData<CalendarEvent[]>(STORAGE_KEYS.EVENTS, [])
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    getData<Goal[]>(STORAGE_KEYS.GOALS, [])
  );
  const [grades, setGrades] = useState<Record<string, SubjectGrades>>(() =>
    getData<Record<string, SubjectGrades>>(STORAGE_KEYS.GRADES, {})
  );
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() =>
    getData<PomodoroSession[]>(STORAGE_KEYS.POMODORO_SESSIONS, [])
  );
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => {
    const saved = getData<Partial<PomodoroSettings>>(STORAGE_KEYS.POMODORO_SETTINGS, {});
    return { ...defaultPomodoroSettings, ...saved };
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    getData<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, [])
  );
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = getData<Partial<AppSettings>>(STORAGE_KEYS.SETTINGS, {});
    return {
      ...defaultSettings,
      ...saved,
      themeColor: saved.themeColor || 'indigo',
      soundEnabled: saved.soundEnabled !== undefined ? saved.soundEnabled : true,
    };
  });
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() =>
    getData<boolean>(STORAGE_KEYS.ONBOARDING, false)
  );
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() =>
    getData<string[]>(STORAGE_KEYS.READ_NOTIFICATIONS, [])
  );
  const [activeTab, setActiveTabState] = useState<TabType>('dashboard');
  const [storageUsageKB, setStorageUsageKB] = useState<number>(() => getStorageUsageKB());

  // Refresh storage usage estimate on updates
  const refreshStorageUsage = () => {
    setStorageUsageKB(getStorageUsageKB());
  };

  // Apply dark mode class and color theme palette to DOM in sync
  useEffect(() => {
    applyThemeToDOM(settings.themeColor || 'indigo', !!settings.darkMode);
  }, [settings.themeColor, settings.darkMode]);

  // Sound Player Dispatcher
  const playSound = (type: 'click' | 'pop' | 'success' | 'delete' | 'tab' | 'celebration') => {
    const isSoundOn = settings.soundEnabled;
    switch (type) {
      case 'click':
        SoundEngine.playClick(isSoundOn);
        break;
      case 'pop':
        SoundEngine.playPop(isSoundOn);
        break;
      case 'success':
        SoundEngine.playSuccess(isSoundOn);
        break;
      case 'delete':
        SoundEngine.playDelete(isSoundOn);
        break;
      case 'tab':
        SoundEngine.playTab(isSoundOn);
        break;
      case 'celebration':
        SoundEngine.playCelebration(isSoundOn);
        break;
      default:
        SoundEngine.playClick(isSoundOn);
    }
  };

  // Global listener for UI click acoustic feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!settings.soundEnabled) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // If clicking interactive elements like button or interactive role, produce click sound
      const interactiveEl = target.closest('button, [role="button"], input[type="checkbox"], input[type="radio"], select, .clickable-sound');
      if (interactiveEl) {
        // Skip if special sound already triggered
        SoundEngine.playClick(true);
      }
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [settings.soundEnabled]);

  const setActiveTab = (tab: TabType) => {
    playSound('tab');
    setActiveTabState(tab);
  };

  // Compute smart notifications
  const notifications = useMemo(() => {
    return generateSmartNotifications(tasks, events, goals, subjects, readNotificationIds);
  }, [tasks, events, goals, subjects, readNotificationIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const triggerCelebration = () => {
    playSound('celebration');
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'],
      });
    } catch {
      // safe fallback if canvas is not ready
    }
  };

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      setData(STORAGE_KEYS.READ_NOTIFICATIONS, updated);
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    setData(STORAGE_KEYS.READ_NOTIFICATIONS, allIds);
    playSound('pop');
  };

  const completeOnboarding = (newProfile: UserProfile, newSubjects: Subject[]) => {
    setProfile(newProfile);
    setData(STORAGE_KEYS.PROFILE, newProfile);

    setSubjects(newSubjects);
    setData(STORAGE_KEYS.SUBJECTS, newSubjects);

    // Initialize default grade containers for subjects
    const initialGrades: Record<string, SubjectGrades> = {};
    newSubjects.forEach((sub) => {
      initialGrades[sub.id] = {
        subjectId: sub.id,
        minPassingGrade: settings.minPassingGradeDefault || 3.0,
        maxGrade: settings.maxGradeDefault || 5.0,
        evaluations: [],
      };
    });
    setGrades(initialGrades);
    setData(STORAGE_KEYS.GRADES, initialGrades);

    setIsOnboarded(true);
    setData(STORAGE_KEYS.ONBOARDING, true);
    setActiveTabState('dashboard');
    triggerCelebration();
    refreshStorageUsage();
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updated };
      setData(STORAGE_KEYS.PROFILE, next);
      return next;
    });
    playSound('pop');
    refreshStorageUsage();
  };

  // Theme & Settings
  const setThemeColor = (themeColor: ThemeColorKey) => {
    setSettings((prev) => {
      const next = { ...prev, themeColor };
      setData(STORAGE_KEYS.SETTINGS, next);
      applyThemeToDOM(themeColor, !!prev.darkMode);
      return next;
    });
    playSound('pop');
  };

  const toggleDarkMode = () => {
    setSettings((prev) => {
      const nextDark = !prev.darkMode;
      const next = { ...prev, darkMode: nextDark };
      setData(STORAGE_KEYS.SETTINGS, next);
      applyThemeToDOM(prev.themeColor || 'indigo', nextDark);
      return next;
    });
    playSound('pop');
  };

  const toggleSound = () => {
    setSettings((prev) => {
      const nextSound = !prev.soundEnabled;
      const next = { ...prev, soundEnabled: nextSound };
      setData(STORAGE_KEYS.SETTINGS, next);
      if (nextSound) {
        SoundEngine.playPop(true);
      }
      return next;
    });
  };

  // Pomodoro Actions
  const addPomodoroSession = (sessionData: Omit<PomodoroSession, 'id'>): PomodoroSession => {
    const newSession: PomodoroSession = {
      ...sessionData,
      id: `pomo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setPomodoroSessions((prev) => {
      const updated = [newSession, ...prev];
      setData(STORAGE_KEYS.POMODORO_SESSIONS, updated);
      return updated;
    });
    refreshStorageUsage();
    return newSession;
  };

  const updatePomodoroSettings = (newSettings: Partial<PomodoroSettings>) => {
    setPomodoroSettings((prev) => {
      const next = { ...prev, ...newSettings };
      setData(STORAGE_KEYS.POMODORO_SETTINGS, next);
      return next;
    });
  };

  const clearPomodoroHistory = () => {
    setPomodoroSessions([]);
    setData(STORAGE_KEYS.POMODORO_SESSIONS, []);
    playSound('delete');
    refreshStorageUsage();
  };

  // Flashcards
  const addFlashcard = (cardData: Omit<Flashcard, 'id' | 'createdAt'>): Flashcard => {
    const newCard: Flashcard = {
      ...cardData,
      id: `fc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      reviewCount: 0,
      mastered: false,
    };
    const updated = [newCard, ...flashcards];
    setFlashcards(updated);
    setData(STORAGE_KEYS.FLASHCARDS, updated);
    playSound('pop');
    refreshStorageUsage();
    return newCard;
  };

  const updateFlashcard = (id: string, cardFields: Partial<Flashcard>) => {
    const updated = flashcards.map((c) =>
      c.id === id ? { ...c, ...cardFields } : c
    );
    setFlashcards(updated);
    setData(STORAGE_KEYS.FLASHCARDS, updated);
    playSound('pop');
    refreshStorageUsage();
  };

  const deleteFlashcard = (id: string) => {
    const updated = flashcards.filter((c) => c.id !== id);
    setFlashcards(updated);
    setData(STORAGE_KEYS.FLASHCARDS, updated);
    playSound('delete');
    refreshStorageUsage();
  };

  const reviewFlashcard = (id: string, mastered: boolean) => {
    const updated = flashcards.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          reviewCount: (c.reviewCount || 0) + 1,
          mastered,
          lastReviewed: new Date().toISOString(),
        };
      }
      return c;
    });
    setFlashcards(updated);
    setData(STORAGE_KEYS.FLASHCARDS, updated);
    if (mastered) {
      playSound('success');
    } else {
      playSound('pop');
    }
    refreshStorageUsage();
  };

  // Subjects
  const addSubject = (subData: Omit<Subject, 'id'>): Subject => {
    const newSub: Subject = {
      ...subData,
      id: `subj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    setData(STORAGE_KEYS.SUBJECTS, updated);

    // Initialize grade entry
    setGrades((prev) => {
      const next = {
        ...prev,
        [newSub.id]: {
          subjectId: newSub.id,
          minPassingGrade: settings.minPassingGradeDefault || 3.0,
          maxGrade: settings.maxGradeDefault || 5.0,
          evaluations: [],
        },
      };
      setData(STORAGE_KEYS.GRADES, next);
      return next;
    });

    playSound('success');
    refreshStorageUsage();
    return newSub;
  };

  const updateSubject = (id: string, updatedFields: Partial<Subject>) => {
    const updated = subjects.map((sub) =>
      sub.id === id ? { ...sub, ...updatedFields } : sub
    );
    setSubjects(updated);
    setData(STORAGE_KEYS.SUBJECTS, updated);
    playSound('pop');
    refreshStorageUsage();
  };

  const deleteSubject = (id: string) => {
    const updated = subjects.filter((sub) => sub.id !== id);
    setSubjects(updated);
    setData(STORAGE_KEYS.SUBJECTS, updated);

    setGrades((prev) => {
      const next = { ...prev };
      delete next[id];
      setData(STORAGE_KEYS.GRADES, next);
      return next;
    });

    playSound('delete');
    refreshStorageUsage();
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    setData(STORAGE_KEYS.TASKS, updated);
    playSound('pop');
    refreshStorageUsage();
    return newTask;
  };

  const updateTask = (id: string, taskFields: Partial<Task>) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...taskFields } : t
    );
    setTasks(updated);
    setData(STORAGE_KEYS.TASKS, updated);
    playSound('pop');
    refreshStorageUsage();
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const isNowCompleted = !task?.completed;

    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          }
        : t
    );
    setTasks(updated);
    setData(STORAGE_KEYS.TASKS, updated);

    if (isNowCompleted) {
      playSound('success');
      triggerCelebration();
    } else {
      playSound('pop');
    }
    refreshStorageUsage();
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    setData(STORAGE_KEYS.TASKS, updated);
    playSound('delete');
    refreshStorageUsage();
  };

  // Events
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    setData(STORAGE_KEYS.EVENTS, updated);
    playSound('pop');
    refreshStorageUsage();
    return newEvent;
  };

  const updateEvent = (id: string, eventFields: Partial<CalendarEvent>) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, ...eventFields } : e
    );
    setEvents(updated);
    setData(STORAGE_KEYS.EVENTS, updated);
    playSound('pop');
    refreshStorageUsage();
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    setData(STORAGE_KEYS.EVENTS, updated);
    playSound('delete');
    refreshStorageUsage();
  };

  // Goals
  const addGoal = (goalData: Omit<Goal, 'id'>): Goal => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    setData(STORAGE_KEYS.GOALS, updated);
    playSound('pop');
    refreshStorageUsage();
    return newGoal;
  };

  const updateGoal = (id: string, goalFields: Partial<Goal>) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, ...goalFields } : g
    );
    setGoals(updated);
    setData(STORAGE_KEYS.GOALS, updated);
    playSound('pop');
    refreshStorageUsage();
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const cleanProgress = Math.min(100, Math.max(0, Math.round(progress)));
    const wasAlready100 = goals.find((g) => g.id === id)?.progress === 100;
    
    const updated = goals.map((g) => {
      if (g.id === id) {
        const isCompleted = cleanProgress >= 100;
        return {
          ...g,
          progress: cleanProgress,
          completed: isCompleted,
        };
      }
      return g;
    });

    setGoals(updated);
    setData(STORAGE_KEYS.GOALS, updated);

    if (cleanProgress >= 100 && !wasAlready100) {
      playSound('celebration');
      triggerCelebration();
    } else {
      playSound('pop');
    }
    refreshStorageUsage();
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    setData(STORAGE_KEYS.GOALS, updated);
    playSound('delete');
    refreshStorageUsage();
  };

  // Grades
  const getSubjectGrades = (subjectId: string): SubjectGrades => {
    if (grades[subjectId]) {
      return grades[subjectId];
    }
    return {
      subjectId,
      minPassingGrade: settings.minPassingGradeDefault || 3.0,
      maxGrade: settings.maxGradeDefault || 5.0,
      evaluations: [],
    };
  };

  const updateSubjectGrades = (subjectId: string, updatedGrades: SubjectGrades) => {
    setGrades((prev) => {
      const next = { ...prev, [subjectId]: updatedGrades };
      setData(STORAGE_KEYS.GRADES, next);
      return next;
    });
    playSound('pop');
    refreshStorageUsage();
  };

  const addEvaluation = (subjectId: string, evalData: Omit<Evaluation, 'id'>) => {
    const current = getSubjectGrades(subjectId);
    const newEval: Evaluation = {
      ...evalData,
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updatedSubjectGrades: SubjectGrades = {
      ...current,
      evaluations: [...current.evaluations, newEval],
    };
    updateSubjectGrades(subjectId, updatedSubjectGrades);
    playSound('success');
    refreshStorageUsage();
  };

  const updateEvaluation = (
    subjectId: string,
    evalId: string,
    evalData: Partial<Evaluation>
  ) => {
    const current = getSubjectGrades(subjectId);
    const updatedEvals = current.evaluations.map((ev) =>
      ev.id === evalId ? { ...ev, ...evalData } : ev
    );
    updateSubjectGrades(subjectId, {
      ...current,
      evaluations: updatedEvals,
    });
    playSound('pop');
    refreshStorageUsage();
  };

  const deleteEvaluation = (subjectId: string, evalId: string) => {
    const current = getSubjectGrades(subjectId);
    const updatedEvals = current.evaluations.filter((ev) => ev.id !== evalId);
    updateSubjectGrades(subjectId, {
      ...current,
      evaluations: updatedEvals,
    });
    playSound('delete');
    refreshStorageUsage();
  };

  const loadDemoData = () => {
    const demo = getDemoData();
    setProfile(demo.profile);
    setData(STORAGE_KEYS.PROFILE, demo.profile);

    setSubjects(demo.subjects);
    setData(STORAGE_KEYS.SUBJECTS, demo.subjects);

    setTasks(demo.tasks);
    setData(STORAGE_KEYS.TASKS, demo.tasks);

    setEvents(demo.events);
    setData(STORAGE_KEYS.EVENTS, demo.events);

    setGoals(demo.goals);
    setData(STORAGE_KEYS.GOALS, demo.goals);

    setGrades(demo.grades);
    setData(STORAGE_KEYS.GRADES, demo.grades);

    if (demo.flashcards) {
      setFlashcards(demo.flashcards);
      setData(STORAGE_KEYS.FLASHCARDS, demo.flashcards);
    }

    const mergedSettings = { ...defaultSettings, ...demo.settings, themeColor: settings.themeColor };
    setSettings(mergedSettings);
    setData(STORAGE_KEYS.SETTINGS, mergedSettings);

    setIsOnboarded(true);
    setData(STORAGE_KEYS.ONBOARDING, true);
    
    setReadNotificationIds([]);
    setData(STORAGE_KEYS.READ_NOTIFICATIONS, []);

    setActiveTabState('dashboard');
    triggerCelebration();
    refreshStorageUsage();
  };

  const resetAllData = () => {
    clearAllUniPlannerData();
    setProfile(null);
    setSubjects([]);
    setTasks([]);
    setEvents([]);
    setGoals([]);
    setGrades({});
    setPomodoroSessions([]);
    setPomodoroSettings(defaultPomodoroSettings);
    setFlashcards([]);
    setSettings(defaultSettings);
    setIsOnboarded(false);
    setReadNotificationIds([]);
    setActiveTabState('dashboard');
    playSound('delete');
    refreshStorageUsage();
  };

  const exportBackup = () => {
    exportAllData();
    playSound('success');
  };

  const inspectBackup = (json: string): BackupInspectionSummary => {
    return inspectBackupJSON(json);
  };

  const importBackup = (json: string) => {
    const res = validateAndImportData(json);
    if (res.success) {
      setProfile(getData(STORAGE_KEYS.PROFILE, null));
      setSubjects(getData(STORAGE_KEYS.SUBJECTS, []));
      setTasks(getData(STORAGE_KEYS.TASKS, []));
      setEvents(getData(STORAGE_KEYS.EVENTS, []));
      setGoals(getData(STORAGE_KEYS.GOALS, []));
      setGrades(getData(STORAGE_KEYS.GRADES, {}));
      setPomodoroSessions(getData(STORAGE_KEYS.POMODORO_SESSIONS, []));
      setPomodoroSettings(getData(STORAGE_KEYS.POMODORO_SETTINGS, defaultPomodoroSettings));
      setFlashcards(getData(STORAGE_KEYS.FLASHCARDS, []));
      
      const loadedSettings = getData(STORAGE_KEYS.SETTINGS, defaultSettings);
      setSettings(loadedSettings);
      applyThemeToDOM(loadedSettings.themeColor || 'indigo', !!loadedSettings.darkMode);

      setIsOnboarded(getData(STORAGE_KEYS.ONBOARDING, false));
      setActiveTabState('dashboard');
      triggerCelebration();
      refreshStorageUsage();
    } else {
      playSound('delete');
    }
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        subjects,
        tasks,
        events,
        goals,
        grades,
        settings,
        isOnboarded,
        activeTab,
        setActiveTab,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        pomodoroSessions,
        pomodoroSettings,
        addPomodoroSession,
        updatePomodoroSettings,
        clearPomodoroHistory,
        flashcards,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        reviewFlashcard,
        setThemeColor,
        toggleDarkMode,
        toggleSound,
        playSound,
        completeOnboarding,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        addEvent,
        updateEvent,
        deleteEvent,
        addGoal,
        updateGoal,
        updateGoalProgress,
        deleteGoal,
        getSubjectGrades,
        updateSubjectGrades,
        addEvaluation,
        updateEvaluation,
        deleteEvaluation,
        loadDemoData,
        resetAllData,
        exportBackup,
        inspectBackup,
        importBackup,
        storageUsageKB,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

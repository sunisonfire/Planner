export const STORAGE_KEYS = {
  PROFILE: 'uniplanner_profile',
  SUBJECTS: 'uniplanner_subjects',
  TASKS: 'uniplanner_tasks',
  EVENTS: 'uniplanner_events',
  GOALS: 'uniplanner_goals',
  GRADES: 'uniplanner_grades',
  SETTINGS: 'uniplanner_settings',
  ONBOARDING: 'uniplanner_onboarding',
  READ_NOTIFICATIONS: 'uniplanner_read_notifications',
  POMODORO_SESSIONS: 'uniplanner_pomodoro_sessions',
  POMODORO_SETTINGS: 'uniplanner_pomodoro_settings',
  FLASHCARDS: 'uniplanner_flashcards',
} as const;

export function getData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setData<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
    return false;
  }
}

export function removeData(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
    return false;
  }
}

export function clearAllUniPlannerData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error clearing ${key}:`, e);
    }
  });
}

export function getStorageUsageKB(): number {
  try {
    let totalBytes = 0;
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        totalBytes += key.length + item.length * 2; // UTF-16
      }
    });
    return parseFloat((totalBytes / 1024).toFixed(2));
  } catch {
    return 0;
  }
}

export interface BackupData {
  version: string;
  app: string;
  exportedAt: string;
  profile: unknown;
  subjects: unknown[];
  tasks: unknown[];
  events: unknown[];
  goals: unknown[];
  grades: Record<string, unknown>;
  settings: unknown;
  onboarding: boolean;
  pomodoroSessions?: unknown[];
  pomodoroSettings?: unknown;
  flashcards?: unknown[];
}

export interface BackupInspectionSummary {
  isValid: boolean;
  version?: string;
  exportedAt?: string;
  studentName?: string;
  subjectsCount: number;
  tasksCount: number;
  eventsCount: number;
  goalsCount: number;
  gradesSubjectsCount: number;
  flashcardsCount?: number;
  error?: string;
}

export function generateBackupData(): BackupData {
  return {
    app: 'UniPlanner',
    version: '1.3.0',
    exportedAt: new Date().toISOString(),
    profile: getData(STORAGE_KEYS.PROFILE, null),
    subjects: getData(STORAGE_KEYS.SUBJECTS, []),
    tasks: getData(STORAGE_KEYS.TASKS, []),
    events: getData(STORAGE_KEYS.EVENTS, []),
    goals: getData(STORAGE_KEYS.GOALS, []),
    grades: getData(STORAGE_KEYS.GRADES, {}),
    settings: getData(STORAGE_KEYS.SETTINGS, null),
    onboarding: getData(STORAGE_KEYS.ONBOARDING, false),
    pomodoroSessions: getData(STORAGE_KEYS.POMODORO_SESSIONS, []),
    pomodoroSettings: getData(STORAGE_KEYS.POMODORO_SETTINGS, null),
    flashcards: getData(STORAGE_KEYS.FLASHCARDS, []),
  };
}

export function exportAllData(): void {
  const data = generateBackupData();
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `uniplanner_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function inspectBackupJSON(jsonString: string): BackupInspectionSummary {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { isValid: false, subjectsCount: 0, tasksCount: 0, eventsCount: 0, goalsCount: 0, gradesSubjectsCount: 0, error: 'El archivo no contiene un objeto JSON válido.' };
    }

    const hasUniPlannerData = 
      data.profile !== undefined ||
      Array.isArray(data.subjects) ||
      Array.isArray(data.tasks) ||
      Array.isArray(data.goals) ||
      Array.isArray(data.events) ||
      Array.isArray(data.flashcards) ||
      data.grades !== undefined;

    if (!hasUniPlannerData) {
      return { isValid: false, subjectsCount: 0, tasksCount: 0, eventsCount: 0, goalsCount: 0, gradesSubjectsCount: 0, error: 'El archivo JSON no contiene datos reconocibles de UniPlanner.' };
    }

    const studentName = data.profile && typeof data.profile === 'object' && 'name' in data.profile ? String(data.profile.name) : undefined;
    const subjectsCount = Array.isArray(data.subjects) ? data.subjects.length : 0;
    const tasksCount = Array.isArray(data.tasks) ? data.tasks.length : 0;
    const eventsCount = Array.isArray(data.events) ? data.events.length : 0;
    const goalsCount = Array.isArray(data.goals) ? data.goals.length : 0;
    const flashcardsCount = Array.isArray(data.flashcards) ? data.flashcards.length : 0;
    const gradesSubjectsCount = data.grades && typeof data.grades === 'object' ? Object.keys(data.grades).length : 0;

    return {
      isValid: true,
      version: data.version || '1.0.0',
      exportedAt: data.exportedAt,
      studentName,
      subjectsCount,
      tasksCount,
      eventsCount,
      goalsCount,
      gradesSubjectsCount,
      flashcardsCount,
    };
  } catch {
    return { isValid: false, subjectsCount: 0, tasksCount: 0, eventsCount: 0, goalsCount: 0, gradesSubjectsCount: 0, error: 'No se pudo interpretar el archivo como JSON.' };
  }
}

export function validateAndImportData(jsonString: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonString) as Partial<BackupData>;
    
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'El archivo JSON no tiene un formato válido.' };
    }

    if (data.profile !== undefined && data.profile !== null) setData(STORAGE_KEYS.PROFILE, data.profile);
    if (Array.isArray(data.subjects)) setData(STORAGE_KEYS.SUBJECTS, data.subjects);
    if (Array.isArray(data.tasks)) setData(STORAGE_KEYS.TASKS, data.tasks);
    if (Array.isArray(data.events)) setData(STORAGE_KEYS.EVENTS, data.events);
    if (Array.isArray(data.goals)) setData(STORAGE_KEYS.GOALS, data.goals);
    if (data.grades !== undefined && data.grades !== null) setData(STORAGE_KEYS.GRADES, data.grades);
    if (data.settings !== undefined && data.settings !== null) setData(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.onboarding !== undefined) setData(STORAGE_KEYS.ONBOARDING, data.onboarding);
    if (Array.isArray(data.pomodoroSessions)) setData(STORAGE_KEYS.POMODORO_SESSIONS, data.pomodoroSessions);
    if (data.pomodoroSettings !== undefined && data.pomodoroSettings !== null) setData(STORAGE_KEYS.POMODORO_SETTINGS, data.pomodoroSettings);
    if (Array.isArray(data.flashcards)) setData(STORAGE_KEYS.FLASHCARDS, data.flashcards);

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al procesar el archivo. Asegúrate de que sea un JSON válido.' };
  }
}

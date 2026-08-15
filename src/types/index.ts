export type Priority = 'low' | 'medium' | 'high';

export type EventType = 'task' | 'exam' | 'event' | 'reminder';

export interface UserProfile {
  name: string;
  university: string;
  career: string;
  semester?: string;
  studentId?: string;
  avatarColor?: string;
}

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 0; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun

export interface ScheduleSlot {
  id: string;
  subjectId: string;
  dayOfWeek: Weekday; // 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  startTime: string; // "08:00" (24h)
  endTime: string; // "10:00" (24h)
  classroom?: string;
  building?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
  classroom?: string;
  professor?: string;
  schedule?: string;
  slots?: ScheduleSlot[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // YYYY-MM-DD
  progress: number; // 0 to 100
  target?: number;
  current?: number;
  unit?: string;
  completed: boolean;
  subjectId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  type: EventType;
  description?: string;
  subjectId?: string;
  location?: string;
}

export interface Evaluation {
  id: string;
  name: string;
  weight: number; // e.g. 30 for 30%
  grade?: number; // e.g. 4.2
  isGraded: boolean;
}

export interface SubjectGrades {
  subjectId: string;
  minPassingGrade: number; // e.g. 3.0
  maxGrade: number; // e.g. 5.0
  evaluations: Evaluation[];
}

export type ThemeColorKey = 
  | 'indigo'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'blue'
  | 'fuchsia'
  | 'slate';

export interface AppSettings {
  darkMode: boolean;
  themeColor: ThemeColorKey;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  minPassingGradeDefault: number;
  maxGradeDefault: number;
}

export interface AppNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  entityId?: string;
}

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  id: string;
  mode: PomodoroMode;
  durationMinutes: number;
  completedAt: string; // ISO string
  subjectId?: string;
  taskId?: string;
  notes?: string;
}

export interface PomodoroSettings {
  pomodoroTime: number; // in minutes (default 25)
  shortBreakTime: number; // in minutes (default 5)
  longBreakTime: number; // in minutes (default 15)
  longBreakInterval: number; // sessions before long break (default 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  tickingSound: boolean;
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'binaural';
}

export interface Flashcard {
  id: string;
  subjectId: string;
  question: string;
  answer: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: string; // ISO date
  reviewCount: number;
  mastered: boolean;
  createdAt: string;
}

export type TabType = 
  | 'dashboard'
  | 'pomodoro'
  | 'tasks'
  | 'calendar'
  | 'goals'
  | 'grades'
  | 'subjects'
  | 'profile';

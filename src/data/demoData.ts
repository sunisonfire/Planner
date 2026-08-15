import { UserProfile, Subject, Task, Goal, CalendarEvent, SubjectGrades, AppSettings, Flashcard } from '../types';
import { formatToYMD } from '../utils/dates';

export function getDemoData(): {
  profile: UserProfile;
  subjects: Subject[];
  tasks: Task[];
  events: CalendarEvent[];
  goals: Goal[];
  grades: Record<string, SubjectGrades>;
  settings: AppSettings;
  flashcards?: Flashcard[];
} {
  const today = new Date();
  
  const addDays = (d: Date, days: number) => {
    const next = new Date(d);
    next.setDate(next.getDate() + days);
    return formatToYMD(next);
  };

  const todayStr = formatToYMD(today);
  const tomorrowStr = addDays(today, 1);
  const in2DaysStr = addDays(today, 2);
  const in3DaysStr = addDays(today, 3);
  const in6DaysStr = addDays(today, 6);
  const in10DaysStr = addDays(today, 10);
  const past2DaysStr = addDays(today, -2);

  const profile: UserProfile = {
    name: 'Danna',
    university: 'Universidad Industrial de Santander',
    career: 'Ingeniería de Sistemas',
    semester: '6to Semestre',
    studentId: '2210452',
    avatarColor: '#6366f1',
  };

  const subjects: Subject[] = [
    {
      id: 'sub-bd',
      name: 'Bases de Datos',
      code: 'BD-301',
      color: '#10b981', // Emerald
      classroom: 'Edificio Centenario - Sala 402',
      professor: 'Ing. Carlos Mendoza',
      schedule: 'Mar y Jue 8:00 AM - 10:00 AM',
      slots: [
        { id: 'slot-bd-1', subjectId: 'sub-bd', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', classroom: 'Sala 402' },
        { id: 'slot-bd-2', subjectId: 'sub-bd', dayOfWeek: 4, startTime: '08:00', endTime: '10:00', classroom: 'Sala 402' },
      ],
    },
    {
      id: 'sub-prog',
      name: 'Programación Web',
      code: 'PW-204',
      color: '#8b5cf6', // Violet
      classroom: 'Laboratorio de Software 2',
      professor: 'Dra. Elena Ramos',
      schedule: 'Lun y Mié 10:00 AM - 12:00 PM',
      slots: [
        { id: 'slot-pw-1', subjectId: 'sub-prog', dayOfWeek: 1, startTime: '10:00', endTime: '12:00', classroom: 'Lab Software 2' },
        { id: 'slot-pw-2', subjectId: 'sub-prog', dayOfWeek: 3, startTime: '10:00', endTime: '12:00', classroom: 'Lab Software 2' },
      ],
    },
    {
      id: 'sub-mat',
      name: 'Cálculo Multivariable',
      code: 'MAT-302',
      color: '#3b82f6', // Blue
      classroom: 'Aula 205',
      professor: 'Lic. Fernando Ortiz',
      schedule: 'Lun, Mié y Vie 7:00 AM - 9:00 AM',
      slots: [
        { id: 'slot-mat-1', subjectId: 'sub-mat', dayOfWeek: 1, startTime: '07:00', endTime: '09:00', classroom: 'Aula 205' },
        { id: 'slot-mat-2', subjectId: 'sub-mat', dayOfWeek: 3, startTime: '07:00', endTime: '09:00', classroom: 'Aula 205' },
        { id: 'slot-mat-3', subjectId: 'sub-mat', dayOfWeek: 5, startTime: '07:00', endTime: '09:00', classroom: 'Aula 205' },
      ],
    },
    {
      id: 'sub-ing',
      name: 'Inglés Técnico',
      code: 'ING-103',
      color: '#f59e0b', // Amber
      classroom: 'Centro de Idiomas - Lab B',
      professor: 'Prof. Sarah Jenkins',
      schedule: 'Jueves 2:00 PM - 5:00 PM',
      slots: [
        { id: 'slot-ing-1', subjectId: 'sub-ing', dayOfWeek: 4, startTime: '14:00', endTime: '17:00', classroom: 'Lab B' },
      ],
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Entrega Final: Proyecto de Bases de Datos',
      description: 'Subir el script SQL, modelo entidad-relación normalizado y reporte en PDF al repositorio universitario.',
      subjectId: 'sub-bd',
      dueDate: todayStr, // Today!
      priority: 'high',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Taller de React Hooks y Zustand',
      description: 'Resolver los 5 ejercicios prácticos del repositorio de la clase 8.',
      subjectId: 'sub-prog',
      dueDate: tomorrowStr, // Tomorrow (1 day)!
      priority: 'high',
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Ejercicios de Integrales Múltiples',
      description: 'Capítulo 14 del Stewart: Ejercicios impares del 1 al 25.',
      subjectId: 'sub-mat',
      dueDate: in3DaysStr, // 3 days!
      priority: 'medium',
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Ensayo en Inglés: Cloud Computing Trends',
      description: 'Redactar ensayo de 800 palabras con vocabulario técnico visto en la unidad 3.',
      subjectId: 'sub-ing',
      dueDate: in6DaysStr,
      priority: 'low',
      completed: false,
    },
    {
      id: 'task-5',
      title: 'Cuestionario Previo de Laboratorio',
      description: 'Completar formulario virtual antes de la sesión presencial.',
      subjectId: 'sub-prog',
      dueDate: past2DaysStr,
      priority: 'medium',
      completed: true,
      completedAt: past2DaysStr,
    },
  ];

  const events: CalendarEvent[] = [
    {
      id: 'evt-1',
      title: 'Parcial 2 de Bases de Datos (SQL & Normalización)',
      date: in2DaysStr,
      time: '08:00',
      type: 'exam',
      description: 'Evaluación presencial teórica y práctica en sala de cómputo.',
      subjectId: 'sub-bd',
      location: 'Sala 402',
    },
    {
      id: 'evt-2',
      title: 'Sustentación de Proyecto Web',
      date: in6DaysStr,
      time: '10:30',
      type: 'exam',
      description: 'Exposición de 15 minutos por grupo con demo funcional.',
      subjectId: 'sub-prog',
      location: 'Lab de Software 2',
    },
    {
      id: 'evt-3',
      title: 'Asesoría con Profesor de Matemáticas',
      date: tomorrowStr,
      time: '14:00',
      type: 'event',
      description: 'Revisión de dudas sobre coordenadas polares y cilíndricas.',
      subjectId: 'sub-mat',
      location: 'Oficina 310',
    },
    {
      id: 'evt-4',
      title: 'Quiz de Vocabulario Técnico en Inglés',
      date: in10DaysStr,
      time: '14:30',
      type: 'exam',
      description: 'Quiz corto sobre arquitecturas cliente-servidor.',
      subjectId: 'sub-ing',
      location: 'Lab B',
    },
  ];

  const goals: Goal[] = [
    {
      id: 'goal-1',
      title: 'Obtener promedio semestral superior a 4.2',
      description: 'Mantener la beca de excelencia académica de la universidad.',
      deadline: addDays(today, 60),
      progress: 80,
      target: 100,
      current: 80,
      unit: '%',
      completed: false,
    },
    {
      id: 'goal-2',
      title: 'Completar curso complementario de TypeScript',
      description: 'Avanzar 2 módulos por semana para el proyecto integrador.',
      deadline: in10DaysStr,
      progress: 60,
      target: 10,
      current: 6,
      unit: 'módulos',
      completed: false,
    },
    {
      id: 'goal-3',
      title: 'Aprobar todas las entregas de Bases de Datos',
      description: 'Garantizar el 100% de cumplimiento en laboratorios.',
      deadline: todayStr,
      progress: 100,
      target: 5,
      current: 5,
      unit: 'talleres',
      completed: true,
    },
  ];

  const grades: Record<string, SubjectGrades> = {
    'sub-bd': {
      subjectId: 'sub-bd',
      minPassingGrade: 3.0,
      maxGrade: 5.0,
      evaluations: [
        { id: 'eval-1', name: 'Parcial 1 (Modelo E-R)', weight: 30, grade: 4.2, isGraded: true },
        { id: 'eval-2', name: 'Talleres y Laboratorios', weight: 30, grade: 4.5, isGraded: true },
        { id: 'eval-3', name: 'Proyecto Final & SQL', weight: 40, isGraded: false },
      ],
    },
    'sub-prog': {
      subjectId: 'sub-prog',
      minPassingGrade: 3.0,
      maxGrade: 5.0,
      evaluations: [
        { id: 'eval-p1', name: 'Primer Sprint (Frontend UI)', weight: 25, grade: 4.8, isGraded: true },
        { id: 'eval-p2', name: 'Segundo Sprint (Backend API)', weight: 25, grade: 3.8, isGraded: true },
        { id: 'eval-p3', name: 'Laboratorios Prácticos', weight: 20, grade: 4.5, isGraded: true },
        { id: 'eval-p4', name: 'Sustentación Final', weight: 30, isGraded: false },
      ],
    },
    'sub-mat': {
      subjectId: 'sub-mat',
      minPassingGrade: 3.0,
      maxGrade: 5.0,
      evaluations: [
        { id: 'eval-m1', name: 'Parcial 1 (Derivadas Parciales)', weight: 30, grade: 3.2, isGraded: true },
        { id: 'eval-m2', name: 'Parcial 2 (Integrales Dobles)', weight: 35, grade: 2.8, isGraded: true },
        { id: 'eval-m3', name: 'Examen Final Acumulativo', weight: 35, isGraded: false },
      ],
    },
    'sub-ing': {
      subjectId: 'sub-ing',
      minPassingGrade: 3.0,
      maxGrade: 5.0,
      evaluations: [
        { id: 'eval-i1', name: 'Oral Presentation', weight: 30, grade: 4.6, isGraded: true },
        { id: 'eval-i2', name: 'Technical Essays', weight: 30, grade: 4.4, isGraded: true },
        { id: 'eval-i3', name: 'Final Exam', weight: 40, isGraded: false },
      ],
    },
  };

  const settings: AppSettings = {
    darkMode: false,
    themeColor: 'indigo',
    soundEnabled: true,
    notificationsEnabled: true,
    minPassingGradeDefault: 3.0,
    maxGradeDefault: 5.0,
  };

  const flashcards: Flashcard[] = [
    {
      id: 'fc-1',
      subjectId: 'sub-bd',
      question: '¿Qué es la Tercera Forma Normal (3NF) en bases de datos relacionales?',
      answer: 'Una tabla está en 3NF si está en 2NF y no tiene dependencias funcionales transitivas (ningún atributo no clave depende de otro atributo no clave).',
      hint: 'Piensa en eliminar dependencias transitivas entre columnas que no son clave primaria.',
      difficulty: 'medium',
      reviewCount: 3,
      mastered: true,
      createdAt: todayStr,
    },
    {
      id: 'fc-2',
      subjectId: 'sub-bd',
      question: '¿Cuál es la diferencia entre INNER JOIN y LEFT JOIN en SQL?',
      answer: 'INNER JOIN retorna solo filas que tienen coincidencias en ambas tablas. LEFT JOIN retorna todas las filas de la tabla izquierda, más las coincidencias de la derecha (o NULL si no hay).',
      difficulty: 'easy',
      reviewCount: 4,
      mastered: true,
      createdAt: todayStr,
    },
    {
      id: 'fc-3',
      subjectId: 'sub-prog',
      question: '¿Para qué sirve el Hook useEffect en React y qué hace el array de dependencias?',
      answer: 'Ejecuta efectos secundarios (peticiones API, suscripciones, timers). El array de dependencias controla cuándo se vuelve a ejecutar la función del efecto.',
      hint: 'Controla el ciclo de vida del componente (montaje, actualización, desmontaje).',
      difficulty: 'easy',
      reviewCount: 2,
      mastered: false,
      createdAt: todayStr,
    },
    {
      id: 'fc-4',
      subjectId: 'sub-mat',
      question: '¿Qué representa el vector Gradiente (∇f) de un campo escalar?',
      answer: 'Representa la dirección de máxima tasa de incremento de la función y su magnitud es el valor de esa máxima tasa de cambio.',
      difficulty: 'hard',
      reviewCount: 1,
      mastered: false,
      createdAt: todayStr,
    },
  ];

  return { profile, subjects, tasks, events, goals, grades, settings, flashcards };
}

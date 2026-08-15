import { Task, CalendarEvent, Goal, AppNotification, Subject } from '../types';
import { getDaysUntil, formatShortDate } from './dates';

export function generateSmartNotifications(
  tasks: Task[],
  events: CalendarEvent[],
  goals: Goal[],
  subjects: Subject[],
  readIds: string[] = []
): AppNotification[] {
  const notifications: AppNotification[] = [];
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  // 1. Task Deadline Notifications
  tasks.forEach((task) => {
    if (task.completed) return;

    const days = getDaysUntil(task.dueDate);
    const subject = subjectMap.get(task.subjectId);
    const subjectName = subject ? ` (${subject.name})` : '';

    if (days < 0) {
      const overdueDays = Math.abs(days);
      notifications.push({
        id: `task-${task.id}-overdue-${overdueDays}`,
        type: 'urgent',
        title: `🚨 Tarea vencida: "${task.title}"`,
        message: `Esta tarea de ${subject?.name || 'materia'} venció hace ${overdueDays} día${overdueDays > 1 ? 's' : ''}.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`task-${task.id}-overdue-${overdueDays}`),
        linkTab: 'tasks',
        entityId: task.id,
      });
    } else if (days === 0) {
      notifications.push({
        id: `task-${task.id}-today`,
        type: 'urgent',
        title: `🚨 ¡"${task.title}" vence hoy!`,
        message: `No olvides entregar tu tarea de ${subject?.name || 'materia'} antes de que finalice el día.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`task-${task.id}-today`),
        linkTab: 'tasks',
        entityId: task.id,
      });
    } else if (days === 1) {
      notifications.push({
        id: `task-${task.id}-1-day`,
        type: 'warning',
        title: `🔥 ¡"${task.title}" vence mañana!`,
        message: `Te queda 1 día para completar tu tarea${subjectName}.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`task-${task.id}-1-day`),
        linkTab: 'tasks',
        entityId: task.id,
      });
    } else if (days === 2) {
      notifications.push({
        id: `task-${task.id}-2-days`,
        type: 'warning',
        title: `⚠️ Te quedan 2 días para "${task.title}"`,
        message: `Entrega programada para el ${formatShortDate(task.dueDate)}${subjectName}.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`task-${task.id}-2-days`),
        linkTab: 'tasks',
        entityId: task.id,
      });
    } else if (days === 3) {
      notifications.push({
        id: `task-${task.id}-3-days`,
        type: 'warning',
        title: `⚠️ Te quedan 3 días para "${task.title}"`,
        message: `Entrega programada para el ${formatShortDate(task.dueDate)}${subjectName}.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`task-${task.id}-3-days`),
        linkTab: 'tasks',
        entityId: task.id,
      });
    }
  });

  // 2. Exam and Event alerts
  events.forEach((event) => {
    const days = getDaysUntil(event.date);
    const subject = event.subjectId ? subjectMap.get(event.subjectId) : undefined;
    const isExam = event.type === 'exam';

    if (days >= 0 && days <= 3) {
      const typeLabel = isExam ? 'Parcial / Examen' : 'Evento';
      const timeStr = event.time ? ` a las ${event.time}` : '';
      const daysText = days === 0 ? '¡Hoy!' : days === 1 ? '¡Mañana!' : `en ${days} días`;
      
      notifications.push({
        id: `event-${event.id}-${days}-days`,
        type: isExam ? 'urgent' : 'info',
        title: `${isExam ? '📝' : '📅'} ${typeLabel}: "${event.title}" (${daysText})`,
        message: `Programado para el ${formatShortDate(event.date)}${timeStr}${subject ? ` de ${subject.name}` : ''}.`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`event-${event.id}-${days}-days`),
        linkTab: 'calendar',
        entityId: event.id,
      });
    }
  });

  // 3. Goal Completed celebrations
  goals.forEach((goal) => {
    if (goal.completed || goal.progress >= 100) {
      notifications.push({
        id: `goal-${goal.id}-completed`,
        type: 'success',
        title: `🎯 ¡Meta completada!`,
        message: `Has alcanzado el 100% en: "${goal.title}". ¡Excelente trabajo!`,
        timestamp: new Date().toISOString(),
        read: readIds.includes(`goal-${goal.id}-completed`),
        linkTab: 'goals',
        entityId: goal.id,
      });
    }
  });

  return notifications;
}

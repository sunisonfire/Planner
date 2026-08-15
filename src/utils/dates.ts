/**
 * Timezone-aware date calculations based on user's local day boundaries
 */

export function parseLocalDate(dateString: string): Date {
  if (!dateString) return new Date();
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateString);
}

export function getTodayLocalDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysUntil(dateString: string): number {
  if (!dateString) return 999;
  const targetDate = parseLocalDate(dateString);
  const today = getTodayLocalDate();
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isDueToday(dateString: string): boolean {
  return getDaysUntil(dateString) === 0;
}

export function isDueTomorrow(dateString: string): boolean {
  return getDaysUntil(dateString) === 1;
}

export function isDueInTwoDays(dateString: string): boolean {
  return getDaysUntil(dateString) === 2;
}

export function isDueInThreeDays(dateString: string): boolean {
  return getDaysUntil(dateString) === 3;
}

export function isOverdue(dateString: string): boolean {
  return getDaysUntil(dateString) < 0;
}

export function getDueAlert(dateString: string): {
  type: 'urgent' | 'high' | 'warning' | 'info' | 'overdue' | 'none';
  text: string;
  badgeText: string;
  days: number;
} {
  const days = getDaysUntil(dateString);

  if (days < 0) {
    const overdueDays = Math.abs(days);
    return {
      type: 'overdue',
      text: `Venció hace ${overdueDays} día${overdueDays > 1 ? 's' : ''}`,
      badgeText: `Vencida (-${overdueDays}d)`,
      days,
    };
  }
  if (days === 0) {
    return {
      type: 'urgent',
      text: '¡Vence hoy!',
      badgeText: 'Hoy 🚨',
      days,
    };
  }
  if (days === 1) {
    return {
      type: 'high',
      text: '¡Vence mañana!',
      badgeText: 'Mañana 🔥',
      days,
    };
  }
  if (days === 2) {
    return {
      type: 'warning',
      text: 'Faltan 2 días',
      badgeText: 'En 2 días ⚠️',
      days,
    };
  }
  if (days === 3) {
    return {
      type: 'warning',
      text: 'Faltan 3 días',
      badgeText: 'En 3 días ⚠️',
      days,
    };
  }
  if (days <= 7) {
    return {
      type: 'info',
      text: `En ${days} días`,
      badgeText: `En ${days} días`,
      days,
    };
  }

  return {
    type: 'none',
    text: `En ${days} días`,
    badgeText: `${days} días`,
    days,
  };
}

export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

export function formatDayOfWeek(dateString: string): string {
  if (!dateString) return '';
  const date = parseLocalDate(dateString);
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[date.getDay()];
}

export function getGreeting(name: string): {
  greeting: string;
  icon: string;
  subtitle: string;
} {
  const hour = new Date().getHours();
  const cleanName = name ? name.trim().split(' ')[0] : 'Estudiante';
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Buenos días, ${cleanName}`,
      icon: '☀️',
      subtitle: '¡Que tengas una jornada universitaria muy productiva!',
    };
  }
  if (hour >= 12 && hour < 19) {
    return {
      greeting: `Buenas tardes, ${cleanName}`,
      icon: '🌤️',
      subtitle: 'Aquí tienes todo lo importante para avanzar hoy.',
    };
  }
  return {
    greeting: `Buenas noches, ${cleanName}`,
    icon: '🌙',
    subtitle: 'Revisa tus pendientes y prepárate para mañana.',
  };
}

export interface CalendarDay {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Starting day of week (0 = Sunday, 1 = Monday). Let's start week on Monday (1).
  let startingDay = firstDayOfMonth.getDay(); // 0 is Sun
  startingDay = startingDay === 0 ? 6 : startingDay - 1; // Mon = 0, Sun = 6
  
  const days: CalendarDay[] = [];
  const todayStr = formatToYMD(new Date());

  // Previous month filler days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNum);
    const dateStr = formatToYMD(date);
    days.push({
      date,
      dateString: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  // Current month days
  const totalDays = lastDayOfMonth.getDate();
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i);
    const dateStr = formatToYMD(date);
    days.push({
      date,
      dateString: dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  // Next month filler days to complete 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    const dateStr = formatToYMD(date);
    days.push({
      date,
      dateString: dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }

  return days;
}

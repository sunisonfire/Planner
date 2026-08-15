import { Weekday, ScheduleSlot, Subject } from '../types';

export const WEEKDAYS_SPANISH: { key: Weekday; label: string; short: string }[] = [
  { key: 1, label: 'Lunes', short: 'Lun' },
  { key: 2, label: 'Martes', short: 'Mar' },
  { key: 3, label: 'Miércoles', short: 'Mié' },
  { key: 4, label: 'Jueves', short: 'Jue' },
  { key: 5, label: 'Viernes', short: 'Vie' },
  { key: 6, label: 'Sábado', short: 'Sáb' },
  { key: 0, label: 'Domingo', short: 'Dom' },
];

/**
 * Parses free-form text schedule like:
 * "Mar y Jue 8:00 AM - 10:00 AM" or "Lun, Mié y Vie 07:00 - 09:00" or "Jueves 2:00 PM - 5:00 PM"
 * and returns ScheduleSlot[]
 */
export function parseScheduleTextToSlots(scheduleText: string, subjectId: string, defaultClassroom?: string): ScheduleSlot[] {
  if (!scheduleText || !scheduleText.trim()) return [];

  const text = scheduleText.toLowerCase().trim();
  const slots: ScheduleSlot[] = [];

  // Match days
  const detectedDays: Weekday[] = [];
  if (text.includes('lun')) detectedDays.push(1);
  if (text.includes('mar')) detectedDays.push(2);
  if (text.includes('mié') || text.includes('mie')) detectedDays.push(3);
  if (text.includes('jue')) detectedDays.push(4);
  if (text.includes('vie')) detectedDays.push(5);
  if (text.includes('sáb') || text.includes('sab')) detectedDays.push(6);
  if (text.includes('dom')) detectedDays.push(0);

  if (detectedDays.length === 0) {
    // If no days found, default to Monday
    detectedDays.push(1);
  }

  // Match times: e.g. "8:00 AM - 10:00 AM" or "08:00 - 10:00" or "2:00 PM - 5:00 PM" or "8am a 10am"
  let startTime = '08:00';
  let endTime = '10:00';

  const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|a|hasta)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (timeMatch) {
    let startH = parseInt(timeMatch[1], 10);
    const startM = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const startPeriod = timeMatch[3]?.toLowerCase();

    let endH = parseInt(timeMatch[4], 10);
    const endM = timeMatch[5] ? parseInt(timeMatch[5], 10) : 0;
    const endPeriod = timeMatch[6]?.toLowerCase();

    if (startPeriod === 'pm' && startH < 12) startH += 12;
    if (startPeriod === 'am' && startH === 12) startH = 0;

    if (endPeriod === 'pm' && endH < 12) endH += 12;
    if (endPeriod === 'am' && endH === 12) endH = 0;

    // Handle case where start doesn't specify PM but end is PM (e.g. 2 - 5 PM)
    if (!startPeriod && endPeriod === 'pm' && startH < 12 && endH > 12 && startH < (endH - 12)) {
      startH += 12;
    }

    startTime = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  detectedDays.forEach((day, idx) => {
    slots.push({
      id: `slot-${subjectId}-${day}-${idx}`,
      subjectId,
      dayOfWeek: day,
      startTime,
      endTime,
      classroom: defaultClassroom,
    });
  });

  return slots;
}

/**
 * Extracts all weekly slots from an array of subjects, using either `slots` or parsing `schedule` string
 */
export function getAllSubjectSlots(subjects: Subject[]): { slot: ScheduleSlot; subject: Subject }[] {
  const result: { slot: ScheduleSlot; subject: Subject }[] = [];

  subjects.forEach((subject) => {
    if (subject.slots && subject.slots.length > 0) {
      subject.slots.forEach((slot) => {
        result.push({ slot, subject });
      });
    } else if (subject.schedule && subject.schedule.trim()) {
      const parsedSlots = parseScheduleTextToSlots(subject.schedule, subject.id, subject.classroom);
      parsedSlots.forEach((slot) => {
        result.push({ slot, subject });
      });
    }
  });

  return result;
}

export function formatTimeSlot(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m} ${period}`;
}

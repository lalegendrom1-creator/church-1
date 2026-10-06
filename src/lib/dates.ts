const DAY_NAMES = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

const MONTH_NAMES = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

export function getDayNameFromDateStr(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return getDayName(date);
}

export function formatDateFR(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  return `${day} ${month}`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function formatWeekRange(date: Date = new Date()): string {
  const { start, end } = getWeekRange(date);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTH_NAMES[start.getMonth()];
  const endMonth = MONTH_NAMES[end.getMonth()];

  if (start.getMonth() === end.getMonth()) {
    return `Du ${startDay} au ${endDay} ${endMonth} ${start.getFullYear()}`;
  }
  return `Du ${startDay} ${startMonth} au ${endDay} ${endMonth} ${start.getFullYear()}`;
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeFR(time: string): string {
  if (time.includes('h')) return time;
  const [h, m] = time.split(':');
  if (m && m !== '00') return `${parseInt(h)}h${m}`;
  return `${parseInt(h)}h`;
}

export function isUpcoming(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const programDate = new Date(dateStr + 'T00:00:00');
  return programDate >= today;
}

export function isThisWeek(dateStr: string): boolean {
  const { start, end } = getWeekRange();
  const programDate = new Date(dateStr + 'T00:00:00');
  return programDate >= start && programDate <= end;
}

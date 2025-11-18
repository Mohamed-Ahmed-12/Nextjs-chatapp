import { format, isToday, isYesterday } from 'date-fns';

export function formatChatDate(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) return format(date, 'h:mm a');       // Today
  if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`; // Yesterday
  return format(date, 'MMM d, h:mm a');                  // Older messages
}
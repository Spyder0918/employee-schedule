export type CalendarViewType = 'month' | 'week' | 'day';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Shift {
  id: number;
  user: User;
  start_time: string;
  end_time: string;
  role: string;
  location: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  shift?: Shift;
}

export interface CalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

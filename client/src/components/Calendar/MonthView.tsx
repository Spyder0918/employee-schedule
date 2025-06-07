import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import { CalendarEvent } from './types';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateSelect,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayEvents = (date: Date) => {
    return events.filter(
      (event) =>
        format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="month-view">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dayEvents = getDayEvents(day);
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] bg-white p-2 ${
                !isSameMonth(day, monthStart)
                  ? 'text-gray-400'
                  : 'text-gray-900'
              }`}
              onClick={() => onDateSelect?.(day)}
            >
              <div
                className={`text-sm font-medium ${
                  isToday(day) ? 'rounded-full bg-blue-500 text-white w-6 h-6 flex items-center justify-center' : ''
                }`}
              >
                {format(day, 'd')}
              </div>
              <div className="mt-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-1 truncate cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval,
  differenceInMinutes,
} from 'date-fns';
import { CalendarEvent } from './types';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateSelect,
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const hours = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: endOfDay(currentDate),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      return format(eventStart, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const dayStart = startOfDay(eventStart);
    const minutesFromDayStart = differenceInMinutes(eventStart, dayStart);
    const eventDuration = differenceInMinutes(event.end, event.start);

    // Each hour block is 80px high (h-20 = 5rem = 80px)
    const hourHeight = 80;
    const top = (minutesFromDayStart / 60) * hourHeight;
    const height = (eventDuration / 60) * hourHeight;

    return { top, height };
  };

  return (
    <div className="week-view overflow-auto">
      <div className="grid grid-cols-8 border-b">
        <div className="w-20" /> {/* Empty corner cell */}
        {days.map((day) => (
          <div
            key={day.toString()}
            className="p-2 text-center border-l"
            onClick={() => onDateSelect?.(day)}
          >
            <div className="font-medium">{format(day, 'EEE')}</div>
            <div className="text-sm text-gray-500">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8">
        <div className="w-20">
          {hours.map((hour) => (
            <div key={hour.toString()} className="h-20 border-b text-sm text-gray-500 text-right pr-2 pt-1">
              {format(hour, 'ha')}
            </div>
          ))}
        </div>
        {days.map((day) => (
          <div key={day.toString()} className="border-l relative">
            {hours.map((hour) => (
              <div
                key={hour.toString()}
                className="h-20 border-b"
                onClick={() => {
                  const selectedDate = new Date(day);
                  selectedDate.setHours(hour.getHours());
                  onDateSelect?.(selectedDate);
                }}
              />
            ))}
            {getEventsForDay(day).map((event) => {
              const { top, height } = calculateEventPosition(event);
              return (
                <div
                  key={event.id}
                  className="absolute left-0 right-0 mx-1 bg-blue-100 text-blue-800 p-1 rounded overflow-hidden cursor-pointer"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(event);
                  }}
                >
                  <div className="text-xs font-medium truncate">{event.title}</div>
                  <div className="text-xs truncate">
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const getEventsForDayAndHour = (day: Date, hour: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const hourEnd = new Date(hour);
      hourEnd.setHours(hour.getHours() + 1);

      return (
        format(eventStart, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
        isWithinInterval(hour, { start: eventStart, end: eventEnd })
      );
    });
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
          <div key={day.toString()} className="border-l">
            {hours.map((hour) => {
              const hourEvents = getEventsForDayAndHour(day, hour);
              return (
                <div
                  key={hour.toString()}
                  className="h-20 border-b relative"
                  onClick={() => {
                    const selectedDate = new Date(day);
                    selectedDate.setHours(hour.getHours());
                    onDateSelect?.(selectedDate);
                  }}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 mx-1 bg-blue-100 text-blue-800 text-xs p-1 rounded overflow-hidden cursor-pointer"
                      style={{
                        top: '4px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

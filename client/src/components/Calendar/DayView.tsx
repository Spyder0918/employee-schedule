import React from 'react';
import {
  format,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from 'date-fns';
import { CalendarEvent } from './types';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (date: Date) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateSelect,
}) => {
  const hours = eachHourOfInterval({
    start: startOfDay(currentDate),
    end: endOfDay(currentDate),
  });

  const getEventsForHour = (hour: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const hourEnd = new Date(hour);
      hourEnd.setHours(hour.getHours() + 1);

      return (
        format(eventStart, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
        isWithinInterval(hour, { start: eventStart, end: eventEnd })
      );
    });
  };

  return (
    <div className="day-view overflow-auto">
      <div className="text-center p-4">
        <h2 className="text-xl font-bold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-0">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <React.Fragment key={hour.toString()}>
              <div className="text-right pr-4 py-2 text-sm text-gray-500 border-r h-24">
                {format(hour, 'ha')}
              </div>
              <div
                className="border-b relative h-24"
                onClick={() => {
                  const selectedDate = new Date(currentDate);
                  selectedDate.setHours(hour.getHours());
                  onDateSelect?.(selectedDate);
                }}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="absolute left-0 right-0 mx-2 my-1 bg-blue-100 text-blue-800 p-2 rounded cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs">
                      {format(new Date(event.start), 'h:mm a')} -{' '}
                      {format(new Date(event.end), 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import {
  format,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  differenceInMinutes,
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

  const getDayEvents = () => {
    return events.filter(
      (event) => format(event.start, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );
  };

  const calculateEventPosition = (event: CalendarEvent) => {
    const eventStart = new Date(event.start);
    const dayStart = startOfDay(eventStart);
    const minutesFromDayStart = differenceInMinutes(eventStart, dayStart);
    const eventDuration = differenceInMinutes(event.end, event.start);

    // Each hour block is 96px high (h-24 = 6rem = 96px)
    const hourHeight = 96;
    const top = (minutesFromDayStart / 60) * hourHeight;
    const height = (eventDuration / 60) * hourHeight;

    return { top, height };
  };

  return (
    <div className="day-view overflow-auto">
      <div className="text-center p-4">
        <h2 className="text-xl font-bold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-0">
        <div>
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="text-right pr-4 py-2 text-sm text-gray-500 border-r h-24"
            >
              {format(hour, 'ha')}
            </div>
          ))}
        </div>
        <div className="relative">
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="border-b h-24"
              onClick={() => {
                const selectedDate = new Date(currentDate);
                selectedDate.setHours(hour.getHours());
                onDateSelect?.(selectedDate);
              }}
            />
          ))}
          {getDayEvents().map((event) => {
            const { top, height } = calculateEventPosition(event);
            return (
              <div
                key={event.id}
                className="absolute left-0 right-0 mx-2 bg-blue-100 text-blue-800 p-2 rounded cursor-pointer"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
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
                <div className="text-xs mt-1">{event.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { CalendarViewType, CalendarProps } from './types';
import { format } from 'date-fns';

export const CalendarContainer: React.FC<CalendarProps> = ({ events, onEventClick, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');

  const handleViewChange = (newView: CalendarViewType) => {
    setView(newView);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleNavigate('prev')}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Previous
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange('month')}
              className={`px-4 py-2 rounded ${
                view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange('week')}
              className={`px-4 py-2 rounded ${
                view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('day')}
              className={`px-4 py-2 rounded ${
                view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>
          <button
            onClick={() => handleNavigate('next')}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateSelect={onDateSelect}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateSelect={onDateSelect}
        />
      )}
      {view === 'day' && (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDateSelect={onDateSelect}
        />
      )}
    </div>
  );
};

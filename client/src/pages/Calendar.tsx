import React from 'react';
import { CalendarContainer } from '../components/Calendar/CalendarContainer';

const CalendarPage: React.FC = () => {
  const events = [
    {
      id: '1',
      title: 'Meeting',
      start: new Date(2025, 5, 7, 10, 0), // June 7, 2025, 10:00 AM
      end: new Date(2025, 5, 7, 11, 0),   // June 7, 2025, 11:00 AM
      description: 'Team meeting'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <CalendarContainer
        events={events}
        onEventClick={(event) => {
          console.log('Event clicked:', event);
        }}
        onDateSelect={(date) => {
          console.log('Date selected:', date);
        }}
      />
    </div>
  );
};

export default CalendarPage;

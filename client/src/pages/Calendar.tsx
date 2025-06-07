import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarContainer } from '../components/Calendar/CalendarContainer';
import { CalendarEvent, Shift } from '../components/Calendar/types';
import { login } from '../services/auth';
import { getShifts } from '../services/api';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        // Check if we're already logged in
        if (!localStorage.getItem('token')) {
          await login('testuser', 'testpass123');
        }

        const shifts = await getShifts();

        // Convert shifts to calendar events
        const calendarEvents: CalendarEvent[] = shifts.map(shift => ({
          id: shift.id.toString(),
          title: `${shift.role} - ${shift.location}`,
          start: new Date(shift.start_time),
          end: new Date(shift.end_time),
          description: `${shift.user.username}'s shift at ${shift.location}`,
          shift: shift
        }));

        setEvents(calendarEvents);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        if (errorMessage === 'Authentication failed') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeCalendar();
  }, [navigate]);

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    if (event.shift) {
      console.log('Shift details:', event.shift);
    }
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected:', date);
  };

  if (isLoading) {
    return <div className="p-4">Loading shifts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <CalendarContainer
        events={events}
        onEventClick={handleEventClick}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default CalendarPage;

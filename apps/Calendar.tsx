import React, { useState } from 'react';
import type { CalendarEvent } from '../types';

interface CalendarProps {
    savedEvents: Record<string, CalendarEvent[]>;
    onSaveEvents: (events: Record<string, CalendarEvent[]>) => void;
}

const Calendar: React.FC<CalendarProps> = ({ savedEvents, onSaveEvents }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [eventInput, setEventInput] = useState('');

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  }
  
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventInput.trim() || !selectedDate) return;

    const dateKey = selectedDate.toISOString().split('T')[0];
    const newEvent = { id: Date.now(), text: eventInput };
    const dayEvents = savedEvents[dateKey] ? [...savedEvents[dateKey], newEvent] : [newEvent];
    onSaveEvents({ ...savedEvents, [dateKey]: dayEvents });
    setEventInput('');
  };

  const handleDeleteEvent = (eventId: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().split('T')[0];
    const updatedEvents = savedEvents[dateKey].filter((event: CalendarEvent) => event.id !== eventId);
    onSaveEvents({ ...savedEvents, [dateKey]: updatedEvents });
  };

  const selectedDateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const selectedDayEvents = savedEvents[selectedDateKey] || [];

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex text-gray-800 dark:text-gray-200">
      <div className="w-2/3 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
        <header className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">&lt;</button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={handleNextMonth} className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">&gt;</button>
        </header>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-grow">
          {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {daysInMonth.map(day => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toDateString() === selectedDate?.toDateString();
            const dateKey = day.toISOString().split('T')[0];
            const hasEvents = savedEvents[dateKey] && savedEvents[dateKey].length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`p-1 text-center cursor-pointer border rounded ${isSelected ? 'bg-blue-500 text-white border-blue-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <span className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto ${isToday && !isSelected ? 'bg-red-500 text-white' : ''}`}>
                  {day.getDate()}
                </span>
                {hasEvents && <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${isSelected ? 'bg-white' : 'bg-blue-400'}`}></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-1/3 p-4 bg-white dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold mb-3">
          {selectedDate ? selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
        </h3>
        {selectedDate && (
          <div>
            <ul className="space-y-2 mb-4 h-48 overflow-y-auto">
              {selectedDayEvents.length > 0 ? selectedDayEvents.map((event: CalendarEvent) => (
                <li key={event.id} className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md flex justify-between items-center text-sm">
                  <span>{event.text}</span>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700 text-xs">X</button>
                </li>
              )) : <p className="text-sm text-gray-500">No events for this day.</p>}
            </ul>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="Add new event"
                className="w-full p-2 border rounded bg-transparent dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="w-full mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Event</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

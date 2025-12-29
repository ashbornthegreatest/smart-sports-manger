import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { EVENT_TYPES } from '../constants';
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'Training',
    date: new Date().toISOString().split('T')[0]
  });

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const handleSave = () => {
    if (newEvent.title && newEvent.date) {
      onAddEvent({
        id: crypto.randomUUID(),
        title: newEvent.title,
        date: newEvent.date,
        type: newEvent.type as any || 'Training',
        notes: newEvent.notes
      });
      setShowModal(false);
      setNewEvent({ type: 'Training', date: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Schedule</h2>
          <p className="text-gray-400">Manage your training and match days.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-apex-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="bg-apex-900 border border-apex-800 rounded-2xl overflow-hidden">
        {sortedEvents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="divide-y divide-apex-800">
            {sortedEvents.map(event => (
              <div key={event.id} className="p-4 flex items-center justify-between hover:bg-apex-800/50 transition">
                <div className="flex items-center gap-4">
                  <div className="text-center w-16 bg-apex-950 rounded-lg p-2 border border-apex-800">
                    <div className="text-xs text-gray-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-white">{new Date(event.date).getDate()}</div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{event.title}</h4>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                       EVENT_TYPES.find(t => t.label === event.type)?.color || 'bg-gray-600'
                    } text-white bg-opacity-20 border border-white/10`}>
                      {event.type}
                    </span>
                    {event.notes && <p className="text-gray-500 text-sm mt-1">{event.notes}</p>}
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-gray-600 hover:text-red-500 p-2 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-apex-900 border border-apex-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Add Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none"
                  value={newEvent.title || ''}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="e.g. Strength Training"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-gray-400 mb-1">Date</label>
                   <input 
                    type="date" 
                    className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none"
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm text-gray-400 mb-1">Type</label>
                   <select 
                    className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none"
                    value={newEvent.type}
                    onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                  >
                    {EVENT_TYPES.map(t => (
                      <option key={t.label} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes (Optional)</label>
                <textarea 
                  className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none h-20 resize-none"
                  value={newEvent.notes || ''}
                  onChange={e => setNewEvent({...newEvent, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-apex-primary text-white rounded-lg hover:bg-indigo-600">Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { MentalLog } from '../types';
import { MENTAL_TAGS } from '../constants';
import { Brain, TrendingUp } from 'lucide-react';

interface MentalProps {
  logs: MentalLog[];
  onLog: (log: MentalLog) => void;
}

export const MentalView: React.FC<MentalProps> = ({ logs, onLog }) => {
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [stress, setStress] = useState(3);
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLog({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      energy,
      stress,
      notes
    });
    setNotes('');
  };

  const RangeInput = ({ label, value, onChange, minLabel, maxLabel }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>{label}</span>
        <span className="text-white font-bold">{value}/10</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-apex-950 rounded-lg appearance-none cursor-pointer accent-apex-primary"
      />
      <div className="flex justify-between text-xs text-gray-600">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Mental Conditioning</h2>
          <p className="text-gray-400">Track your mindset, energy, and stress.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-apex-900 border border-apex-800 rounded-2xl p-6 space-y-6">
          <RangeInput 
            label="Overall Mood" 
            value={mood} 
            onChange={setMood} 
            minLabel="Terrible" 
            maxLabel="Unstoppable" 
          />
          <RangeInput 
            label="Energy Level" 
            value={energy} 
            onChange={setEnergy} 
            minLabel="Exhausted" 
            maxLabel="Peaking" 
          />
          <RangeInput 
            label="Stress Level" 
            value={stress} 
            onChange={setStress} 
            minLabel="Zen" 
            maxLabel="Overwhelmed" 
          />
          
          <div>
             <label className="block text-sm text-gray-400 mb-2">Reflections / Tags</label>
             <textarea 
               className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none h-24 resize-none"
               placeholder="How are you feeling mentally pre/post training?"
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
             />
          </div>

          <button 
            type="submit" 
            className="w-full bg-apex-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition"
          >
            Log Entry
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-apex-accent" /> Recent Logs
        </h3>
        
        <div className="space-y-4">
          {logs.length === 0 && <p className="text-gray-500 italic">No logs yet. Start tracking today.</p>}
          {logs.slice(0, 5).map(log => (
            <div key={log.id} className="bg-apex-900 border border-apex-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">{new Date(log.date).toLocaleString()}</span>
                <div className="flex gap-2">
                  <span className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">Mood: {log.mood}</span>
                  <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Energy: {log.energy}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{log.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
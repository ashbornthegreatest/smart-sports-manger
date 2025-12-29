import React, { useState } from 'react';
import { MealLog } from '../types';
import { Utensils, Droplets } from 'lucide-react';

interface NutritionProps {
  logs: MealLog[];
  onLog: (log: MealLog) => void;
}

export const NutritionView: React.FC<NutritionProps> = ({ logs, onLog }) => {
  const [mealName, setMealName] = useState('');
  const [type, setType] = useState<MealLog['type']>('Breakfast');
  const [calories, setCalories] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealName) {
      onLog({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        name: mealName,
        type,
        calories: calories ? parseInt(calories) : undefined
      });
      setMealName('');
      setCalories('');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysLogs = logs.filter(l => l.date.startsWith(today));
  const totalCals = todaysLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Nutrition Tracker</h2>
          <p className="text-gray-400">Fuel your performance.</p>
        </div>

        <form onSubmit={handleAdd} className="bg-apex-900 border border-apex-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-1">Meal Name</label>
            <input 
              type="text" 
              className="w-full bg-apex-950 border border-apex-800 rounded-lg p-2 text-white outline-none focus:border-apex-primary"
              placeholder="e.g. Chicken & Rice"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-32">
             <label className="block text-xs text-gray-500 mb-1">Type</label>
             <select 
               className="w-full bg-apex-950 border border-apex-800 rounded-lg p-2 text-white outline-none focus:border-apex-primary"
               value={type}
               onChange={(e) => setType(e.target.value as any)}
             >
               {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'].map(t => (
                 <option key={t} value={t}>{t}</option>
               ))}
             </select>
          </div>
          <div className="w-full md:w-24">
            <label className="block text-xs text-gray-500 mb-1">Cals</label>
            <input 
              type="number" 
              className="w-full bg-apex-950 border border-apex-800 rounded-lg p-2 text-white outline-none focus:border-apex-primary"
              placeholder="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full md:w-auto bg-apex-primary text-white p-2.5 rounded-lg hover:bg-indigo-600 transition">
            <Utensils size={20} />
          </button>
        </form>

        <div className="space-y-2">
          <h3 className="text-white font-medium mb-4">Today's Logs</h3>
          {todaysLogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No meals logged today.</p>
          ) : (
            todaysLogs.map(log => (
              <div key={log.id} className="flex justify-between items-center bg-apex-900/50 p-3 rounded-xl border border-apex-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-apex-800 flex items-center justify-center text-gray-400">
                    <Utensils size={14} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{log.name}</p>
                    <p className="text-xs text-gray-500">{log.type}</p>
                  </div>
                </div>
                {log.calories && <span className="text-gray-300 font-mono text-sm">{log.calories} kcal</span>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-apex-900 border border-apex-800 rounded-2xl p-6">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Calories Today</h3>
          <div className="text-4xl font-bold text-white">{totalCals}</div>
        </div>

        <div className="bg-apex-900 border border-apex-800 rounded-2xl p-6">
           <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
             <Droplets size={16} className="text-blue-400" /> Hydration
           </h3>
           <div className="grid grid-cols-4 gap-2">
             {[1,2,3,4,5,6,7,8].map(i => (
               <button key={i} className="aspect-square rounded-lg bg-blue-900/20 border border-blue-500/30 hover:bg-blue-500/20 transition flex items-center justify-center text-blue-400">
                 <Droplets size={16} />
               </button>
             ))}
           </div>
           <p className="text-center text-xs text-gray-500 mt-3">Tap to track (Visual only in MVP)</p>
        </div>
      </div>
    </div>
  );
};
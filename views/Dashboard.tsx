import React, { useState } from 'react';
import { AppData, CalendarEvent } from '../types';
import { generateTrainingProgram } from '../services/geminiService';
import { Activity, Calendar, Brain, TrendingUp, Zap, RotateCcw, Loader2 } from 'lucide-react';

interface DashboardProps {
  data: AppData;
  onNavigate: (view: string) => void;
  onUpdateData: (data: Partial<AppData>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate, onUpdateData }) => {
  const { profile, events, mentalLogs } = data;
  const [isGenerating, setIsGenerating] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysEvents = events.filter(e => e.date === today);
  const lastMood = mentalLogs[0]; 

  // --- PROGRAM GENERATION LOGIC ---
  const handleGenerateProgram = async () => {
    if (!profile) return;
    setIsGenerating(true);

    const program = await generateTrainingProgram(profile);
    
    if (program) {
      const newEvents: CalendarEvent[] = program.schedule.map(item => {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + item.dayOffset);
        return {
          id: crypto.randomUUID(),
          date: dateObj.toISOString().split('T')[0],
          title: item.title,
          type: item.type as any,
          notes: item.notes
        };
      });

      // Keep past events, remove future ones to "reset" before adding new ones
      const pastEvents = events.filter(e => e.date <= today);
      const updatedEvents = [...pastEvents, ...newEvents];

      onUpdateData({
        events: updatedEvents,
        profile: {
          ...profile,
          dietaryPlan: program.dietPlan
        }
      });
      alert("Training Program Generated Successfully!");
    } else {
      alert("Failed to generate program. Check API Key.");
    }
    setIsGenerating(false);
  };

  const handleResetProgram = () => {
    if (confirm("Are you sure? This will delete all FUTURE training events.")) {
      const pastEvents = events.filter(e => e.date <= today);
      onUpdateData({ events: pastEvents });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Hello, {profile?.name.split(' ')[0]}</h2>
          <p className="text-gray-400 mt-1">
            Current Phase: <span className="text-apex-accent font-medium">{profile?.trainingPhase}</span>
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Next Competition</p>
          <p className="text-white font-medium">{profile?.nextCompetitionDate || "Not Scheduled"}</p>
        </div>
      </div>

      {/* AI Strategy Banner (If exists) */}
      {profile?.dietaryPlan && (
        <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
           <Zap className="text-emerald-400 shrink-0 mt-1" size={20} />
           <div>
             <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wide">Current AI Strategy</h4>
             <p className="text-gray-300 text-sm leading-relaxed mt-1">{profile.dietaryPlan}</p>
           </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Today's Focus */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-apex-900 to-apex-900/50 border border-apex-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-apex-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-apex-primary/20"></div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="text-apex-primary" size={20} /> Today's Schedule
          </h3>
          
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map(event => (
                <div key={event.id} className="bg-apex-950/50 p-4 rounded-xl border border-apex-800 flex justify-between items-center">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      event.type === 'Training' ? 'bg-blue-900/30 text-blue-400' :
                      event.type === 'Match' ? 'bg-red-900/30 text-red-400' :
                      'bg-emerald-900/30 text-emerald-400'
                    }`}>{event.type}</span>
                    <h4 className="text-white font-medium mt-1">{event.title}</h4>
                  </div>
                  <div className="text-gray-400 text-sm">Today</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic py-8 text-center bg-apex-950/30 rounded-xl border border-apex-800 border-dashed">
              Rest Day or Nothing Scheduled
            </div>
          )}
        </div>

        {/* Quick Stats / Mood */}
        <div className="bg-apex-900 border border-apex-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="text-purple-500" size={20} /> Readiness
          </h3>
          {lastMood ? (
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-white mb-2">{lastMood.energy}<span className="text-xl text-gray-500">/10</span></div>
              <p className="text-sm text-gray-400">Energy Level</p>
              <div className="mt-4 pt-4 border-t border-apex-800">
                <p className="text-gray-300 italic line-clamp-2">"{lastMood.notes}"</p>
              </div>
            </div>
          ) : (
             <div className="text-center py-8">
               <p className="text-gray-500 mb-4">No logs yet.</p>
               <button 
                 onClick={() => onNavigate('mental')} 
                 className="text-sm bg-apex-800 hover:bg-apex-700 text-white px-4 py-2 rounded-lg transition"
               >
                 Check In
               </button>
             </div>
          )}
        </div>

        {/* AI Program Generator */}
        <div className="col-span-1 md:col-span-3 bg-apex-900 border border-apex-800 p-6 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                 <Zap className="text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Program Generator</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xl">
                  Automatically generate a 7-day training schedule and diet strategy tailored to your current phase and injuries. This will update your calendar immediately.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={handleResetProgram}
                className="px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-900/20 transition flex items-center gap-2"
                title="Clear future events"
              >
                <RotateCcw size={18} /> <span className="hidden md:inline">Reset</span>
              </button>
              <button 
                onClick={handleGenerateProgram}
                disabled={isGenerating}
                className="flex-1 md:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                {isGenerating ? 'Building Plan...' : 'Generate Program'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Chat Prompt */}
        <div className="col-span-1 md:col-span-3 bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
               <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Performance Coach</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-lg">
                Your assistant has analyzed your data. Ask for a pre-match visualization or detailed recovery protocol.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('ai-coach')}
            className="w-full md:w-auto bg-apex-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg whitespace-nowrap"
          >
            Chat with Coach
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { UserProfile, TrainingPhase, ExperienceLevel } from '../types';
import { SPORTS_LIST } from '../constants';
import { ArrowRight, Check, Trophy, Activity, User, ArrowLeft, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    id: crypto.randomUUID(),
    trainingPhase: TrainingPhase.Maintenance,
    experienceLevel: ExperienceLevel.Intermediate,
    injuries: "None",
    trainingFrequency: 4,
    goals: { shortTerm: '', longTerm: '' }
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const updateData = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateGoal = (type: 'shortTerm' | 'longTerm', value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: { ...prev.goals!, [type]: value }
    }));
  };

  const handleFinish = () => {
    if (formData.name && formData.sport) {
      onComplete(formData as UserProfile);
    }
  };

  // Steps Rendering
  const renderStep1_Identity = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to APEX</h2>
        <p className="text-gray-400">Let's build your athlete profile.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary focus:ring-1 focus:ring-apex-primary outline-none transition"
            placeholder="e.g. Michael Jordan"
            value={formData.name || ''}
            onChange={(e) => updateData('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
          <input 
            type="number" 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.age || ''}
            onChange={(e) => updateData('age', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2_Sport = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Your Discipline</h2>
        <p className="text-gray-400">What is your main game?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sport</label>
          <select 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.sport || ''}
            onChange={(e) => updateData('sport', e.target.value)}
          >
            <option value="">Select a Sport</option>
            {SPORTS_LIST.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Position / Role / Weight Class</label>
          <input 
            type="text"
            placeholder="e.g. Striker, Point Guard, Heavyweight"
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.position || ''}
            onChange={(e) => updateData('position', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Experience</label>
            <select 
              className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
              value={formData.experienceLevel}
              onChange={(e) => updateData('experienceLevel', e.target.value)}
            >
              {Object.values(ExperienceLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sessions / Week</label>
            <input 
              type="number" 
              className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
              value={formData.trainingFrequency || ''}
              onChange={(e) => updateData('trainingFrequency', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3_Physical = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Physical Stats</h2>
        <p className="text-gray-400">Baseline metrics for performance tracking.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Height</label>
          <input 
            type="text" 
            placeholder="e.g. 6'2"
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.height || ''}
            onChange={(e) => updateData('height', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Weight</label>
          <input 
            type="text" 
            placeholder="e.g. 195 lbs"
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.weight || ''}
            onChange={(e) => updateData('weight', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Current Injuries</label>
        <textarea 
          className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary h-24 resize-none"
          placeholder="List any nagging injuries or 'None'"
          value={formData.injuries || ''}
          onChange={(e) => updateData('injuries', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep4_Context = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Context & Goals</h2>
        <p className="text-gray-400">Tell the AI Coach what you're aiming for.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Current Phase</label>
          <select 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            value={formData.trainingPhase}
            onChange={(e) => updateData('trainingPhase', e.target.value)}
          >
            {Object.values(TrainingPhase).map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Short-term Goal (Next 30 days)</label>
          <input 
            type="text" 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            placeholder="e.g. Increase squat by 5kg, Fix sleep schedule"
            value={formData.goals?.shortTerm || ''}
            onChange={(e) => updateGoal('shortTerm', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Long-term Goal (Season/Career)</label>
          <input 
            type="text" 
            className="w-full bg-apex-900 border border-apex-800 rounded-lg p-3 text-white outline-none focus:border-apex-primary"
            placeholder="e.g. Win regional championship, Go pro"
            value={formData.goals?.longTerm || ''}
            onChange={(e) => updateGoal('longTerm', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-apex-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-apex-950 md:bg-apex-900 md:border md:border-apex-800 rounded-2xl p-8 shadow-2xl relative">
        
        {/* Cancel Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          title="Cancel Registration"
        >
          <X size={24} />
        </button>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-apex-primary' : 'bg-apex-800'}`} />
          ))}
        </div>

        {step === 1 && renderStep1_Identity()}
        {step === 2 && renderStep2_Sport()}
        {step === 3 && renderStep3_Physical()}
        {step === 4 && renderStep4_Context()}

        <div className="flex justify-between mt-8 pt-4 border-t border-apex-800">
          {step > 1 ? (
             <button 
             onClick={handleBack}
             className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-apex-800 transition flex items-center gap-2"
           >
             <ArrowLeft size={16} /> Back
           </button>
          ) : <div></div>}
         
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="bg-apex-primary hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              className="bg-apex-accent hover:bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              Finish Setup <Check size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
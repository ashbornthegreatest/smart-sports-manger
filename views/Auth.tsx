import React, { useEffect, useState } from 'react';
import { getStoredUsers, UserSummary } from '../services/storage';
import { User, Plus, ArrowRight, Activity, Zap } from 'lucide-react';

interface AuthProps {
  onLogin: (userId?: string) => void;
  onSignup: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savedUsers, setSavedUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    setSavedUsers(getStoredUsers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
        onLogin(undefined); 
    } else {
        onSignup();
    }
  };

  const handleQuickLogin = (userId: string) => {
    onLogin(userId);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-apex-950 relative overflow-hidden font-sans text-gray-100">
      
      {/* Left Side: Auth Form & Quick Login */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-12 relative z-10 border-b md:border-b-0 md:border-r border-apex-800 bg-apex-950/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
             <h1 className="text-4xl font-bold tracking-tighter text-white mb-2 flex items-center gap-2">
                APEX <Activity className="text-apex-primary" />
             </h1>
             <p className="text-gray-400">Elite Performance Management</p>
          </div>

          {/* Login/Signup Form */}
          <div className="animate-fade-in">
             <form onSubmit={handleSubmit} className="space-y-4">
                {/* Visual Only Inputs for MVP */}
                {!savedUsers.length && (
                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6">
                        <p className="text-blue-200 text-sm">Tip: Sign up to create a new profile, or reload to see demo data.</p>
                    </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none transition focus:ring-1 focus:ring-apex-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@apex.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-apex-950 border border-apex-800 rounded-lg p-3 text-white focus:border-apex-primary outline-none transition focus:ring-1 focus:ring-apex-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-apex-primary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] flex items-center justify-center gap-2"
                >
                  {isLoginView ? 'Sign In' : 'Create New Account'}
                  {!isLoginView && <Plus size={18} />}
                </button>
             </form>

             <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isLoginView ? "New to APEX?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLoginView(!isLoginView)}
                  className="ml-2 text-apex-primary hover:text-indigo-400 font-medium"
                >
                  {isLoginView ? 'Create Profile' : 'Log In'}
                </button>
              </p>
            </div>
           </div>

           {/* Quick Login Section (Below Form) */}
           {savedUsers.length > 0 && (
            <div className="mt-8 pt-8 border-t border-apex-800 animate-fade-in space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap size={14} className="text-apex-accent" /> Quick Login
              </h3>
              <div className="grid gap-3">
                {savedUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user.id)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-apex-900 border border-apex-800 hover:border-apex-primary/50 hover:bg-apex-800 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apex-800 to-apex-900 flex items-center justify-center border border-apex-700 group-hover:border-apex-primary text-gray-300 group-hover:text-white transition-colors">
                      <User size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-apex-primary transition-colors">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.sport}</p>
                    </div>
                    <ArrowRight size={18} className="text-apex-800 group-hover:text-apex-primary transform group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Visuals */}
      <div className="hidden md:block flex-1 bg-apex-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-apex-900 via-apex-950 to-black"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-apex-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-apex-accent/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 h-full flex items-center justify-center p-12">
            <div className="grid grid-cols-2 gap-4 opacity-50">
                <div className="space-y-4 translate-y-8">
                    <div className="bg-apex-800 p-4 rounded-xl h-32 w-32 animate-pulse"></div>
                    <div className="bg-apex-800 p-4 rounded-xl h-48 w-32"></div>
                </div>
                <div className="space-y-4">
                    <div className="bg-apex-800 p-4 rounded-xl h-48 w-32"></div>
                    <div className="bg-apex-800 p-4 rounded-xl h-32 w-32 animate-pulse delay-75"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
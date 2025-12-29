import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Utensils, 
  Calendar as CalendarIcon, 
  Users, 
  Bot, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  userName: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onNavigate, 
  onLogout,
  userName 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Schedule', icon: CalendarIcon },
    { id: 'mental', label: 'Mindset', icon: Brain },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'contacts', label: 'Team', icon: Users },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot, highlight: true },
  ];

  // --- SWIPE LOGIC ---
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null; 
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRightSwipe && !isSidebarOpen) {
      // Swipe Right -> Open Sidebar
      setSidebarOpen(true);
    } else if (isLeftSwipe && isSidebarOpen) {
      // Swipe Left -> Close Sidebar
      setSidebarOpen(false);
    }
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setSidebarOpen(false); // Close on selection (mobile)
  };

  return (
    <div 
      className="flex h-screen bg-apex-950 text-gray-200 overflow-hidden font-sans relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-apex-900 border-b border-apex-800 z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-300 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-white tracking-tight">APEX HQ</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-apex-primary flex items-center justify-center text-white font-bold text-sm">
          {userName.charAt(0)}
        </div>
      </div>

      {/* --- SIDEBAR OVERLAY (BACKDROP) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR DRAWER --- */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-apex-900 border-r border-apex-800 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-apex-800 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                APEX <span className="text-apex-primary text-xs px-2 py-0.5 bg-apex-primary/20 rounded-full border border-apex-primary/50">HQ</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">Performance Command Center</p>
            </div>
            {/* Close Button (Mobile Only) */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeView === item.id
                    ? 'bg-apex-800 text-white shadow-lg border-l-4 border-apex-primary'
                    : 'text-gray-400 hover:bg-apex-800/50 hover:text-white'
                } ${item.highlight ? 'mt-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30' : ''}`}
              >
                <item.icon size={20} className={`transition-colors ${item.highlight ? 'text-indigo-400' : activeView === item.id ? 'text-apex-primary' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {activeView === item.id && <ChevronRight size={16} className="text-apex-primary" />}
              </button>
            ))}
          </nav>

          {/* User Footer */}
          <div className="p-4 border-t border-apex-800 bg-apex-950/30">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-apex-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userName}</p>
                <p className="text-xs text-gray-500">Athlete</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto relative w-full pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
};
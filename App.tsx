import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './views/Auth';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { AICoach } from './views/AICoach';
import { CalendarView } from './views/Calendar';
import { MentalView } from './views/Mental';
import { NutritionView } from './views/Nutrition';
import { ContactsView } from './views/Contacts';
import { loadAppData, saveAppData, initDemoData, CURRENT_USER_KEY } from './services/storage';
import { AppData, UserProfile } from './types';

const App: React.FC = () => {
  // State
  const [data, setData] = useState<AppData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // 1. Initialize Demo Data if storage is empty
    initDemoData();

    // 2. Check for active session
    const hasAuth = localStorage.getItem('apex_auth_token');
    const lastUserId = localStorage.getItem(CURRENT_USER_KEY);
    
    if (hasAuth) {
      if (lastUserId) {
        // Load specific user data
        const userData = loadAppData(lastUserId);
        setData(userData);
      } else {
        // Legacy or new user state without ID yet (will trigger onboarding)
        setData(loadAppData(null));
      }
      setIsAuthenticated(true);
    }
  }, []);

  // Persistence Wrapper
  const updateData = (newData: Partial<AppData>) => {
    if (!data) return;
    const updated = { ...data, ...newData };
    setData(updated);
    saveAppData(updated);
  };

  // Auth Handlers
  const handleLogin = (userId?: string) => {
    localStorage.setItem('apex_auth_token', 'demo-token');
    
    if (userId) {
      localStorage.setItem(CURRENT_USER_KEY, userId);
      const userData = loadAppData(userId);
      setData(userData);
    } else {
      // New user login/signup flow - clear current user to trigger onboarding if needed
      localStorage.removeItem(CURRENT_USER_KEY);
      setData(loadAppData(null));
    }
    
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_auth_token');
    localStorage.removeItem(CURRENT_USER_KEY);
    setIsAuthenticated(false);
    setData(null);
    setCurrentView('dashboard');
  };

  // Onboarding Handler
  const handleOnboardingComplete = (profile: UserProfile) => {
    // Create new full data object
    const newData: AppData = {
      profile,
      mentalLogs: [],
      mealLogs: [],
      events: [],
      contacts: []
    };
    
    setData(newData);
    // Save new user to storage immediately
    saveAppData(newData);
    // Set them as current user
    localStorage.setItem(CURRENT_USER_KEY, profile.id);
  };

  // 1. Auth Guard
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} onSignup={() => handleLogin(undefined)} />;
  }

  // 2. Onboarding Guard
  if (!data || !data.profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 3. Main App Layout
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          data={data} 
          onNavigate={setCurrentView} 
          onUpdateData={updateData} // Pass the updater
        />;
      case 'ai-coach':
        return <AICoach data={data} />;
      case 'calendar':
        return <CalendarView 
          events={data.events} 
          onAddEvent={(e) => updateData({ events: [...data.events, e] })}
          onDeleteEvent={(id) => updateData({ events: data.events.filter(e => e.id !== id) })}
        />;
      case 'mental':
        return <MentalView 
          logs={data.mentalLogs} 
          onLog={(l) => updateData({ mentalLogs: [l, ...data.mentalLogs] })} 
        />;
      case 'nutrition':
        return <NutritionView 
          logs={data.mealLogs} 
          onLog={(l) => updateData({ mealLogs: [l, ...data.mealLogs] })} 
        />;
      case 'contacts':
        return <ContactsView 
          contacts={data.contacts} 
          onAdd={(c) => updateData({ contacts: [...data.contacts, c] })}
          onDelete={(id) => updateData({ contacts: data.contacts.filter(c => c.id !== id) })}
        />;
      default:
        return <Dashboard data={data} onNavigate={setCurrentView} onUpdateData={updateData} />;
    }
  };

  return (
    <Layout 
      activeView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
      userName={data.profile.name}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
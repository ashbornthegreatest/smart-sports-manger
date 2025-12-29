import { AppData, UserProfile, TrainingPhase, ExperienceLevel, MentalLog, CalendarEvent, MealLog, Contact } from '../types';

const INDEX_KEY = 'apex_users_index';
export const CURRENT_USER_KEY = 'apex_current_user_id';
const DATA_PREFIX = 'apex_data_';

const INITIAL_STATE: AppData = {
  profile: null,
  mentalLogs: [],
  mealLogs: [],
  events: [],
  contacts: [],
};

// --- DEMO DATA GENERATION ---

const MARCUS_ID = 'demo-user-1';
const SARAH_ID = 'demo-user-2';

const DEMO_PROFILES: AppData[] = [
  {
    profile: {
      id: MARCUS_ID,
      name: "Marcus 'Iron' Reeves",
      age: 24,
      sport: "Boxing",
      position: "Heavyweight",
      height: "6'2\"",
      weight: "215 lbs",
      trainingPhase: TrainingPhase.Peaking,
      experienceLevel: ExperienceLevel.Elite,
      goals: { shortTerm: "Make weight for title fight", longTerm: "Unified World Champion" },
      injuries: "Minor left wrist soreness",
      trainingFrequency: 6,
      nextCompetitionDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0] // 5 days from now
    },
    mentalLogs: [
      { id: 'm1', date: new Date().toISOString(), mood: 9, energy: 9, stress: 7, notes: "Weight cut is tough but feeling sharp. Sparring was excellent." },
      { id: 'm2', date: new Date(Date.now() - 86400000).toISOString(), mood: 7, energy: 6, stress: 5, notes: "Rest day. Visualized the walkout." }
    ],
    mealLogs: [
      { id: 'f1', date: new Date().toISOString(), name: "Egg whites & Oatmeal", type: 'Breakfast', calories: 450 },
      { id: 'f2', date: new Date().toISOString(), name: "Chicken Breast & Greens", type: 'Lunch', calories: 600 }
    ],
    events: [
      { id: 'e1', date: new Date().toISOString().split('T')[0], title: "Heavy Bag Work", type: 'Training', notes: "12 rounds, focus on cardio" },
      { id: 'e2', date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], title: "TITLE FIGHT vs. Johnson", type: 'Match', notes: "Main Event" }
    ],
    contacts: [
      { id: 'c1', name: "Coach Mike", role: "Head Coach", phone: "555-0101", notes: "Corner man" },
      { id: 'c2', name: "Dr. Evans", role: "Physio", phone: "555-0102" }
    ]
  },
  {
    profile: {
      id: SARAH_ID,
      name: "Sarah Jenkins",
      age: 21,
      sport: "Tennis",
      position: "Singles",
      height: "5'8\"",
      weight: "135 lbs",
      trainingPhase: TrainingPhase.Recovery,
      experienceLevel: ExperienceLevel.Advanced,
      goals: { shortTerm: "Rehab ankle sprain", longTerm: "Top 50 Ranking" },
      injuries: "Grade 1 Ankle Sprain (Recovering)",
      trainingFrequency: 4,
      nextCompetitionDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
    },
    mentalLogs: [
      { id: 's1', date: new Date().toISOString(), mood: 6, energy: 5, stress: 3, notes: "Frustrated about the injury, but mobility is improving." }
    ],
    mealLogs: [],
    events: [
      { id: 'se1', date: new Date().toISOString().split('T')[0], title: "Physio Session", type: 'Recovery', notes: "Ankle mobility work" },
      { id: 'se2', date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], title: "Light Hitting", type: 'Training', notes: "Stationary drills only" }
    ],
    contacts: [
      { id: 'sc1', name: "Coach Sarah", role: "Technical Coach", phone: "555-0202" }
    ]
  }
];

// --- STORAGE LOGIC ---

export interface UserSummary {
  id: string;
  name: string;
  sport: string;
  lastActive?: string;
}

export const getStoredUsers = (): UserSummary[] => {
  try {
    const index = localStorage.getItem(INDEX_KEY);
    return index ? JSON.parse(index) : [];
  } catch {
    return [];
  }
};

export const saveAppData = (data: AppData) => {
  if (!data.profile) return;
  
  try {
    const userId = data.profile.id;
    // 1. Save the actual data
    localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(data));

    // 2. Update the user index
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.id === userId);
    
    const summary: UserSummary = {
      id: userId,
      name: data.profile.name,
      sport: data.profile.sport,
      lastActive: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      users[existingIndex] = summary;
    } else {
      users.push(summary);
    }
    
    localStorage.setItem(INDEX_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const loadAppData = (userId?: string | null): AppData => {
  if (!userId) return INITIAL_STATE;
  
  try {
    const data = localStorage.getItem(`${DATA_PREFIX}${userId}`);
    return data ? JSON.parse(data) : INITIAL_STATE;
  } catch (e) {
    console.error("Failed to load data", e);
    return INITIAL_STATE;
  }
};

export const initDemoData = () => {
  const users = getStoredUsers();
  // Only inject if storage is completely empty to avoid overwriting user changes on reload
  if (users.length === 0) {
    console.log("Injecting Demo Data...");
    DEMO_PROFILES.forEach(profile => saveAppData(profile));
  }
};
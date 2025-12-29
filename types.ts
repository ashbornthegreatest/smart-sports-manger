export enum TrainingPhase {
  Bulking = 'Bulking',
  Cutting = 'Cutting',
  Recovery = 'Recovery',
  Maintenance = 'Maintenance',
  PreSeason = 'Pre-Season',
  InSeason = 'In-Season',
  Peaking = 'Peaking (Competition Ready)',
}

export enum ExperienceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Elite = 'Elite',
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sport: string;
  position: string; // or weight class
  height?: string; // stored as string for flexibility (e.g. 6'2")
  weight?: string; // stored as string
  trainingPhase: TrainingPhase;
  experienceLevel: ExperienceLevel;
  goals: {
    shortTerm: string;
    longTerm: string;
  };
  injuries: string; // "None" or description
  trainingFrequency: number; // days per week
  nextCompetitionDate?: string; // ISO date string
  dietaryPlan?: string; // AI Generated high-level strategy
}

export interface MentalLog {
  id: string;
  date: string; // ISO string
  mood: number; // 1-10
  stress: number; // 1-10
  energy: number; // 1-10
  notes: string;
}

export interface MealLog {
  id: string;
  date: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-Workout' | 'Post-Workout';
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  calories?: number;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'Training' | 'Match' | 'Recovery' | 'Other';
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  notes?: string;
}

// App State wrapper
export interface AppData {
  profile: UserProfile | null;
  mentalLogs: MentalLog[];
  mealLogs: MealLog[];
  events: CalendarEvent[];
  contacts: Contact[];
}
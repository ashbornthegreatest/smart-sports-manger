import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, MentalLog, CalendarEvent } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // Ensure this is set in your Vercel/Env variables
const ai = new GoogleGenAI({ apiKey });

export const generateCoachResponse = async (
  userMessage: string,
  profile: UserProfile,
  recentLogs: MentalLog[],
  upcomingEvents: CalendarEvent[]
): Promise<string> => {
  
  if (!apiKey) {
    return "AI Configuration Error: API Key is missing. Please check your environment variables.";
  }

  const model = 'gemini-3-flash-preview';

  // Construct Context
  const context = `
    You are an elite Sports Performance Coach for an athlete named ${profile.name}.
    
    ATHLETE PROFILE:
    - Sport: ${profile.sport} (${profile.position})
    - Phase: ${profile.trainingPhase}
    - Level: ${profile.experienceLevel}
    - Goals: Short-term: "${profile.goals.shortTerm}", Long-term: "${profile.goals.longTerm}"
    - Injuries: ${profile.injuries}
    
    RECENT MENTAL LOGS (Last few entries):
    ${recentLogs.map(l => `- ${new Date(l.date).toLocaleDateString()}: Mood ${l.mood}/10, Energy ${l.energy}/10. Note: ${l.notes}`).join('\n')}

    UPCOMING SCHEDULE:
    ${upcomingEvents.map(e => `- ${e.date}: ${e.title} (${e.type})`).join('\n')}

    INSTRUCTIONS:
    - Be concise, motivating, and direct.
    - Focus on performance, recovery, and mindset.
    - Do not give medical advice; refer to a physio/doctor for injuries.
    - Use the provided context to tailor your advice.
    - Tone: Professional, intense but supportive, "Personal HQ" feel.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: context + `\n\nAthlete asks: "${userMessage}"` }] }
      ],
      config: {
        temperature: 0.7, // Balanced creativity and focus
      }
    });

    return response.text || "I couldn't generate a response right now. Let's focus on your next training session.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error with the coaching server. Please check your internet connection.";
  }
};

export interface AIProgramResponse {
  dietPlan: string;
  schedule: {
    title: string;
    type: string;
    notes: string;
    dayOffset: number;
  }[];
}

export const generateTrainingProgram = async (profile: UserProfile): Promise<AIProgramResponse | null> => {
  if (!apiKey) return null;

  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Create a 7-day high-performance training schedule and a brief dietary strategy for:
    Athlete: ${profile.name}, Sport: ${profile.sport}, Phase: ${profile.trainingPhase}, Injuries: ${profile.injuries}.
    
    The schedule should represent the next 7 days (Day 1 = tomorrow).
    The dietary strategy should be 2-3 concise sentences summarizing their nutrition focus for this week.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dietPlan: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Training", "Match", "Recovery", "Other"] },
                  notes: { type: Type.STRING },
                  dayOffset: { type: Type.INTEGER, description: "1 for tomorrow, 2 for day after, etc." }
                }
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr) as AIProgramResponse;
    }
    return null;

  } catch (error) {
    console.error("Gemini Program Gen Error:", error);
    return null;
  }
};
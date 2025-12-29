# APEX - Athlete Performance HQ

APEX is a React-based performance command center for athletes. It features local data persistence, a multi-profile system, and an AI performance coach powered by the Google Gemini API.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 2. Installation
Install the project dependencies (assuming standard React setup):

```bash
npm install
```

### 3. API Configuration (Important)
To use the AI Coach features, you must have a Google Gemini API Key.

1. Get a key from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env` file in the root directory (or ensure your environment variables are set).
3. Add the key:

```
API_KEY=your_gemini_api_key_here
```

> **Note:** Since this is a client-side demo, `process.env.API_KEY` is used in `services/geminiService.ts`. Ensure your bundler (Vite/Webpack) is configured to expose this, or for local testing, replace `process.env.API_KEY` directly in the code if strict env handling isn't set up.

### 4. Running Locally
Start the development server:

```bash
npm start
# or if using Vite
npm run dev
```

The app will launch at `http://localhost:3000` (or similar).

## 🧪 Demo Mode & Profiles
When you first load the application, **two fake athlete profiles** (Marcus & Sarah) are automatically injected into your local storage.

1. **Marcus 'Iron' Reeves**: A Boxer in peaking phase.
2. **Sarah Jenkins**: A Tennis player in recovery.

You can "Quick Login" as either of these from the login screen to test the dashboard populated with data.

To test the onboarding flow, click **"Create Profile"** or **"Sign Up"**.

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide Icons
- **AI**: @google/genai SDK (Gemini 2.0 Flash)
- **Storage**: LocalStorage (persists across reloads)

## 📂 Project Structure
- `/views`: Individual pages (Dashboard, Calendar, AI Coach, etc.)
- `/services`: Logic for Storage and Gemini API
- `/components`: Shared UI layouts
- `/constants`: Static lists (Sports, Event Types)

Enjoy optimizing your performance! 🏆
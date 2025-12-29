import React, { useState, useEffect, useRef } from 'react';
import { generateCoachResponse } from '../services/geminiService';
import { AppData } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AICoachProps {
  data: AppData;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const AICoach: React.FC<AICoachProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Welcome to your personal HQ, ${data.profile?.name.split(' ')[0]}. I've analyzed your profile and schedule. How can I help you optimize your performance today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Context preparation
    const recentLogs = data.mentalLogs.slice(0, 5);
    const upcomingEvents = data.events.filter(e => e.date >= new Date().toISOString().split('T')[0]).slice(0, 5);

    try {
      const responseText = await generateCoachResponse(
        userMsg.text, 
        data.profile!, 
        recentLogs, 
        upcomingEvents
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling is inside service, but failsafe here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-apex-900 rounded-2xl border border-apex-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-apex-800 bg-apex-950 flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <Bot className="text-indigo-400" size={20} />
        </div>
        <div>
          <h3 className="text-white font-bold">Performance Intelligence</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Online • Gemini 2.0 Flash
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'assistant' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-apex-800 text-gray-300'
            }`}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === 'assistant' 
                ? 'bg-apex-950 border border-apex-800 text-gray-300' 
                : 'bg-apex-primary text-white'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-apex-950 border border-apex-800 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-400" size={16} />
              <span className="text-gray-500 text-xs">Analyzing profile data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-apex-950 border-t border-apex-800">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-apex-900 text-white border border-apex-800 rounded-xl py-3 pl-4 pr-12 focus:border-apex-primary focus:ring-1 focus:ring-apex-primary outline-none transition"
            placeholder="Ask about training, recovery, or mindset..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-apex-primary hover:text-white disabled:text-gray-600 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
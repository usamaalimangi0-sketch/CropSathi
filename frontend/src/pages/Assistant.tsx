import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { ChatMessage } from '../types';
import {
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sprout,
  Bot,
  User,
  Languages,
  ArrowRight
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "What should I check if my cotton leaves are turning yellow?",
  "How can I reduce water waste when growing wheat in Sindh?",
  "What precautions should I take before spraying a pesticide?",
  "Explain Leaf Curl Virus symptoms and prevention in Urdu.",
  "Which organic fertilizers are best suited for rice crops in Pakistan?",
  "What is the best irrigation timing for wheat during hot weather?"
];

export const Assistant: React.FC = () => {
  const location = useLocation();
  const state = location.state as { initialQuery?: string; cropContext?: string } | null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Assalam-o-Alaikum! I am CropSathi AI, your agricultural assistant. How can I help you today with your crops, soil, pest management, or irrigation?'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [cropContext, setCropContext] = useState<string>(state?.cropContext || '');
  const [followups, setFollowups] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle passed initial query from diagnosis page
  useEffect(() => {
    if (state?.initialQuery) {
      handleSendMessage(state.initialQuery);
    }
  }, []);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMessage: ChatMessage = { role: 'user', content: textToSend.trim() };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage({
        message: textToSend.trim(),
        history: updatedHistory.slice(-6), // last 6 turns
        crop_context: cropContext || undefined,
        language
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.reply }
      ]);
      setFollowups(response.suggested_followups || []);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Could not reach the assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-agri-600 to-agri-800 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Farming Assistant
              <span className="bg-agri-100 text-agri-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Grounded agronomic guidance for Pakistani crops • Integrated Pest Management & Irrigation
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <Languages className="w-3.5 h-3.5 text-agri-600" /> Language:
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-agri-500"
          >
            <option value="en">English</option>
            <option value="ur">اردو (Urdu)</option>
          </select>
        </div>
      </div>

      {cropContext && (
        <div className="bg-agri-50 border border-agri-200 rounded-xl px-4 py-2 text-xs text-agri-900 flex items-center justify-between">
          <span>Active context: <strong>{cropContext}</strong></span>
          <button
            onClick={() => setCropContext('')}
            className="text-agri-700 hover:text-agri-900 font-bold underline"
          >
            Clear context
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-agri-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div
                  className={`
                    max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed
                    ${isUser
                      ? 'bg-agri-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-agri-700 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                <span>CropSathi is consulting agronomic knowledge...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested follow-up questions */}
        {followups.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
            </span>
            {followups.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="bg-white hover:bg-agri-50 border border-slate-300 hover:border-agri-400 text-slate-700 hover:text-agri-800 px-3 py-1 rounded-full text-xs shrink-0 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an agricultural question (e.g., Best sowing time for wheat in Sindh)..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-agri-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`
                p-3 rounded-xl transition text-white flex items-center justify-center shrink-0
                ${input.trim() && !loading
                  ? 'bg-agri-700 hover:bg-agri-800 cursor-pointer shadow-xs'
                  : 'bg-slate-300 cursor-not-allowed'
                }
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Quick Suggested Prompts Pill Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-agri-600" />
          Common Agronomic Questions to Ask
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUGGESTED_QUESTIONS.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-agri-400 hover:bg-agri-50/50 text-xs text-slate-700 hover:text-agri-900 transition flex items-center justify-between group"
            >
              <span className="line-clamp-1">{question}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-agri-600 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

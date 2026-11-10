'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Music,
  Sliders,
  Volume2,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bot,
  ExternalLink,
  CornerDownLeft,
  Headphones,
  Compass,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  suggestAdminHandoff?: boolean;
}

interface AriaChatbotProps {
  onSwitchToAdmin?: () => void;
  initialPrompt?: string;
}

const STARTER_PROMPTS = [
  {
    category: 'Music & Artists',
    icon: Music,
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    title: 'Explore Artists',
    description: 'Discography, albums & songs',
    prompt: 'What albums and top songs do BINI and The Black Eyed Peas have in SONORA?'
  },
  {
    category: 'Lyrics & Display',
    icon: Sparkles,
    color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/20',
    title: 'Lyrics & Translations',
    description: 'Font size, languages & sync',
    prompt: 'How do I switch lyric translations and adjust font size in SONORA?'
  },
  {
    category: 'Playback & Audio',
    icon: Sliders,
    color: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
    title: 'Equalizer & Sound',
    description: 'Bass boost, EQ presets & quality',
    prompt: 'How do I use the 10-band Equalizer and bass boost?'
  },
  {
    category: 'Troubleshooting',
    icon: AlertTriangle,
    color: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
    title: 'Fix Playback Issues',
    description: 'Buffering or silent audio',
    prompt: 'My music is not playing or is buffering, how can I troubleshoot it?'
  }
];

export default function AriaChatbot({ onSwitchToAdmin, initialPrompt }: AriaChatbotProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll on message updates
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  // Load conversation from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('sonora_aria_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('sonora_aria_chat_history', JSON.stringify(messages.slice(-30)));
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build history payload for contextual continuity
      const historyPayload = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/support/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('Aria is currently reconnecting to the neural stream.');
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `aria-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        role: 'assistant',
        content: data.reply || "I've processed your inquiry. Let me know if you need more details!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: data.suggestedFollowUps || [],
        suggestAdminHandoff: data.suggestAdminHandoff || false
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      toast.error(err.message || 'Error communicating with Aria.');
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having a slight audio interference connecting to my neural network. Please check your connection or try asking again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['How do I fix playback issues?', 'Contact Administrator']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle optional initial prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (confirm('Start a fresh conversation with Aria?')) {
      setMessages([]);
      localStorage.removeItem('sonora_aria_chat_history');
      toast.info('Conversation history cleared.');
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Response copied to clipboard!');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d0f] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      {/* ── ARIA TOP NAVIGATION HEADER ── */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#121216]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Animated Aria Orb Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-[14px] bg-[#0c0c12] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-[#121216]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Aria
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300">
                  AI Music Maestro
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <span>SONORA Intelligent Navigator</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
              <span className="text-cyan-400 font-medium">Real-Time Knowledge</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 hover:border-white/10 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Human Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* ── ARIA CONVERSATION WORKSPACE ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 select-text custom-scrollbar">
        {messages.length === 0 ? (
          /* INTELLIGENT WELCOME HERO */
          <div className="max-w-2xl mx-auto py-6 sm:py-10 text-center animate-in fade-in duration-300">
            {/* Holographic Glowing Emblem */}
            <div className="relative inline-flex items-center justify-center mb-5">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse"></div>
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-blue-500/30 relative">
                <div className="w-full h-full rounded-[22px] bg-[#0e0e14] flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-cyan-300 animate-bounce duration-1000" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Meet <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Aria</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-lg mx-auto leading-relaxed">
              Your personal SONORA AI Music Maestro. I can navigate our 50,000+ tracks, explain synced lyric translations, guide audio equalizer tuning, and troubleshoot any playback hurdles.
            </p>

            {/* Quick Starters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mt-8">
              {STARTER_PROMPTS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-2xl bg-[#141419]/90 border border-white/5 hover:border-blue-500/40 hover:bg-[#181822] transition-all group cursor-pointer text-left shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`p-2 rounded-xl border ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-1">
                      {item.prompt}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fluent in English, Tagalog, and Bisaya/Cebuano</span>
            </div>
          </div>
        ) : (
          /* MESSAGE THREAD */
          messages.map(msg => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 transition-all`}
              >
                {/* Bubble Header */}
                <div className={`flex items-center gap-2 text-[11px] px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <span className="font-bold text-neutral-300">
                    {isUser ? user?.name || 'You' : 'Aria'}
                  </span>
                  <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
                </div>

                {/* Message Card */}
                <div
                  className={`relative max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all shadow-xl ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-tr-none border border-blue-400/30'
                      : 'bg-[#15151c]/95 backdrop-blur-md text-neutral-200 rounded-tl-none border border-white/10 border-l-2 border-l-cyan-400'
                  }`}
                >
                  {/* Message Content with Markdown Formatting */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} className="h-2"></div>;

                      // Headers
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={lIdx} className="text-sm font-black text-cyan-300 mt-2 mb-1">
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('## ') || line.startsWith('# ')) {
                        return (
                          <h3 key={lIdx} className="text-base font-black text-white mt-2 mb-1">
                            {line.replace(/^#+\s/, '')}
                          </h3>
                        );
                      }

                      // Bold bullet points
                      return (
                        <p key={lIdx} className="leading-relaxed">
                          {renderFormattedText(line)}
                        </p>
                      );
                    })}
                  </div>

                  {/* Assistant Footer Actions */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-neutral-400">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>SONORA AI Engine</span>
                      </div>

                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-blue-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Admin Handoff Suggestion Banner */}
                  {!isUser && msg.suggestAdminHandoff && onSwitchToAdmin && (
                    <div className="mt-3 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-blue-300">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Would you like to connect with a human administrator?</span>
                      </div>
                      <button
                        onClick={onSwitchToAdmin}
                        className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs shrink-0 transition-colors"
                      >
                        Talk to Admin
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-ups */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 max-w-[85%]">
                    {msg.suggestedFollowUps.map((followUp, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSendMessage(followUp)}
                        className="px-2.5 py-1 rounded-full bg-[#181820] hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/40 text-[11px] text-neutral-300 hover:text-blue-300 transition-all flex items-center gap-1 active:scale-95 text-left"
                      >
                        <span>{followUp}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* TYPING PULSE INDICATOR */}
        {isTyping && (
          <div className="flex items-start gap-2 animate-in fade-in">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-700" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-[#15151c] border border-white/10 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300"></span>
              </div>
              <span className="text-xs text-neutral-400 ml-1">Aria is harmonizing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── ARIA INPUT BAR & QUICK PILLS ── */}
      <div className="p-3 sm:p-4 bg-[#111116]/95 backdrop-blur-xl border-t border-white/10 shrink-0 space-y-2">
        {/* Quick Topics Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-neutral-400 shrink-0">Quick Ask:</span>
          {[
            '🎵 BINI Albums',
            '📝 Translations',
            '🎚️ Equalizer',
            '⚠️ Playback Help',
            '➕ Request Track'
          ].map((tag, tIdx) => (
            <button
              key={tIdx}
              onClick={() => handleSendMessage(`How does ${tag.replace(/^.+?\s/, '')} work in SONORA?`)}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 hover:text-white border border-white/5 whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div className="relative flex items-end gap-2 bg-[#171720] border border-white/10 focus-within:border-cyan-500/50 rounded-2xl p-2 transition-all shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aria about any artist, album, lyrics, or playback issue... (English, Tagalog, Bisaya)"
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none max-h-24 py-1.5 px-2"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
              inputText.trim() && !isTyping
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-black shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer'
                : 'bg-white/5 text-neutral-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line</span>
          <span>SONORA AI Engine v2.5</span>
        </div>
      </div>
    </div>
  );
}

// Helper to format basic markdown-style bold tags (**bold**)
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}


'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  RefreshCw,
  ShieldAlert,
  Info,
  User,
  ShieldCheck,
  X
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt?: string;
}

export interface SonoraAIChatbotProps {
  userName?: string;
  userId?: string;
  open?: boolean;
  onClose?: () => void;
  category?: 'music_request' | 'issue_report' | 'account_support' | 'feedback' | 'general';
}

export function SonoraAIChatbot({
  userName = 'there',
  userId,
  open = true,
  onClose,
  category = 'general'
}: SonoraAIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi ${userName}! I'm your SONORA AI Assistant. Ask me about music requests, playback issues, lyrics, playlists, your account, or anything else about SONORA.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          category,
          conversationHistory: messages.map((m) => ({
            senderType: m.sender,
            message: m.text
          }))
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to get a response from the AI assistant.');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I received your message but I couldn’t generate a response right now.'
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.suggestHandoff) {
        setMessages((prev) => [
          ...prev,
          {
            id: `handoff-${Date.now()}`,
            sender: 'ai',
            text: 'I’ve flagged this for the SONORA Administrator. You can also click “Contact Administrator” in your support thread if you need direct human help.'
          }
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'ai',
          text: err.message || 'The AI assistant is unavailable right now. Please try again later.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages, category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-[#141414] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#141414]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">SONORA AI Assistant</h3>
              <p className="text-[11px] text-neutral-400">Custom AI support chatbot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome',
                    sender: 'ai',
                    text: `Hi ${userName}! I'm your SONORA AI Assistant. Ask me about music requests, playback issues, lyrics, playlists, your account, or anything else about SONORA.`
                  }
                ]);
                setError(null);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Clear conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          {error && (
            <div className="flex items-start gap-2 px-1">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%]">
                {error}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in zoom-in duration-200`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold mb-0.5">
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>SONORA AI Assistant</span>
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-lg whitespace-pre-line transition-all ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-black font-semibold rounded-tr-sm shadow-blue-900/20'
                    : 'bg-[#18181c] border border-white/10 text-neutral-200 rounded-tl-sm shadow-black/40'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <span className="text-[9px] text-neutral-500 font-mono ml-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="p-3 sm:p-4 bg-[#141414] border-t border-white/10 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me about SONORA… (Enter to send, Shift+Enter for new line)"
              rows={1}
              maxLength={1500}
              className="flex-1 bg-[#1e1e1e] border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:hover:bg-blue-500 text-black font-bold text-xs transition-all active:scale-95 shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span className="text-xs">Sending…</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="text-xs">Send</span>
                </>
              )}
            </button>
          </form>
          <p className="text-[10px] text-neutral-500 mt-1.5">
            AI-generated responses may occasionally be inaccurate. For urgent account issues, contact the SONORA Administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

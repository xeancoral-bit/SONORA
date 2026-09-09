'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  ShieldCheck,
  Music,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  UserCheck,
  Clock,
  CheckCheck,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  X,
  Info,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import {
  SupportCategory,
  SupportMessage,
  SupportConversation,
  AdminOnlineStatus
} from '@/lib/types';
import Link from 'next/link';

const CATEGORIES: { id: SupportCategory; label: string; icon: any; color: string }[] = [
  { id: 'music_request', label: 'Music Request', icon: Music, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'issue_report', label: 'Report an Issue', icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'account_support', label: 'Account Support', icon: UserCheck, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  { id: 'feedback', label: 'Feedback & Suggestion', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'general', label: 'General Inquiry', icon: HelpCircle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' }
];

export default function MessagesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const toast = useToast();

  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [adminStatus, setAdminStatus] = useState<AdminOnlineStatus>({ isOnline: true, lastSeen: '' });
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isHandoffPending, setIsHandoffPending] = useState(false);

  // Music Request Form State
  const [mrTitle, setMrTitle] = useState('');
  const [mrArtist, setMrArtist] = useState('');
  const [mrAlbum, setMrAlbum] = useState('');
  const [mrNote, setMrNote] = useState('');
  const [mrSubmitting, setMrSubmitting] = useState(false);

  // Issue Report Form State
  const [irType, setIrType] = useState<'player' | 'lyrics' | 'search' | 'playlist' | 'account' | 'other'>('player');
  const [irTitle, setIrTitle] = useState('');
  const [irDesc, setIrDesc] = useState('');
  const [irScreenshot, setIrScreenshot] = useState('');
  const [irSubmitting, setIrSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch conversation & messages
  const loadConversationData = async (silent: boolean = false) => {
    if (!user) return;
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch('/api/support/conversations');
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setConversation(data.conversation || null);
      setMessages(data.messages || []);
      if (data.adminStatus) setAdminStatus(data.adminStatus);
    } catch (err: any) {
      if (!silent) {
        toast.error('Unable to load your conversation. Please try again.');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversationData();
      pollIntervalRef.current = setInterval(() => {
        loadConversationData(true);
      }, 4000);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  // Send regular message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isSending) return;

    try {
      setIsSending(true);
      const res = await fetch('/api/support/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          category: selectedCategory
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      const data = await res.json();
      setInputMessage('');
      
      // Update local messages immediately
      if (data.userMessage) {
        setMessages((prev) => {
          const next = [...prev, data.userMessage];
          if (data.aiMessage) next.push(data.aiMessage);
          return next;
        });
      }
      if (data.conversation) setConversation(data.conversation);
      if (data.adminStatus) setAdminStatus(data.adminStatus);

      toast.success(
        data.aiMessage
          ? 'Message sent. SONORA Support Assistant replied.'
          : 'Message delivered to SONORA Administrator.'
      );
    } catch (err: any) {
      toast.error(err.message || 'Error sending message. Please check connection.');
    } finally {
      setIsSending(false);
    }
  };

  // Human Admin Handoff trigger
  const handleEscalateToAdmin = async () => {
    if (!conversation) return;
    try {
      setIsHandoffPending(true);
      const res = await fetch(`/api/support/conversations/${conversation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'waiting_admin' })
      });
      if (!res.ok) throw new Error('Failed to escalate conversation');
      const data = await res.json();
      if (data.conversation) setConversation(data.conversation);
      if (data.messages) setMessages(data.messages);

      toast.success('Your conversation has been forwarded to the SONORA Administrator.');
    } catch (err: any) {
      toast.error(err.message || 'Could not contact administrator');
    } finally {
      setIsHandoffPending(false);
    }
  };

  // Submit Music Request
  const handleSubmitMusicRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrTitle.trim() || !mrArtist.trim()) {
      toast.error('Please specify both Song Title and Artist Name');
      return;
    }

    try {
      setMrSubmitting(true);
      const res = await fetch('/api/support/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'music_request',
          title: mrTitle.trim(),
          artist: mrArtist.trim(),
          album: mrAlbum.trim() || undefined,
          message: mrNote.trim() || undefined
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      
      setIsMusicModalOpen(false);
      setMrTitle('');
      setMrArtist('');
      setMrAlbum('');
      setMrNote('');

      if (data.messages) setMessages(data.messages);
      if (data.conversation) setConversation(data.conversation);

      toast.success('Music request submitted successfully. The administrator will review it!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit music request');
    } finally {
      setMrSubmitting(false);
    }
  };

  // Submit Issue Report
  const handleSubmitIssueReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!irTitle.trim() || !irDesc.trim()) {
      toast.error('Please provide a title and detailed description of the problem');
      return;
    }

    try {
      setIrSubmitting(true);
      const res = await fetch('/api/support/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'issue_report',
          title: irTitle.trim(),
          issueType: irType,
          description: irDesc.trim(),
          screenshotUrl: irScreenshot.trim() || undefined
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();

      setIsIssueModalOpen(false);
      setIrTitle('');
      setIrDesc('');
      setIrScreenshot('');

      if (data.messages) setMessages(data.messages);
      if (data.conversation) setConversation(data.conversation);

      toast.success('Your issue report has been submitted for review.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setIrSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-neutral-400 animate-in fade-in">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
        <p className="text-sm font-medium">Loading your secure support messages...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Private Support Messages</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Please sign in to contact the SONORA Administrator, request new music tracks, or receive automated troubleshooting assistance.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors"
            >
              Sign In to Sonora
            </Link>
            <Link
              href="/auth/register"
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-130px)] min-h-[580px] p-2 sm:p-4 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl shrink-0 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                Messages
              </h1>
              {conversation?.status === 'waiting_admin' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  Waiting for Admin
                </span>
              )}
              {conversation?.status === 'resolved' && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Resolved
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Contact SONORA Support for music requests, technical issues, questions, and feedback.
            </p>
          </div>

          {/* Administrator Availability Live Status Badge */}
          <div className="shrink-0 flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold select-none backdrop-blur-md transition-all ${
                adminStatus.isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-neutral-800/80 border-neutral-700 text-neutral-400'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {adminStatus.isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    adminStatus.isOnline ? 'bg-emerald-500' : 'bg-neutral-500'
                  }`}
                ></span>
              </span>
              <span>{adminStatus.isOnline ? 'Admin Online' : 'Admin Offline'}</span>
            </div>

            {/* Quick Action modal launchers */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => setIsMusicModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-neutral-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all"
                title="Submit a music request"
              >
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>Request Music</span>
              </button>
              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-neutral-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all"
                title="Report a problem"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informative Status Banner */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-neutral-400">
          <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          {adminStatus.isOnline ? (
            <p>
              <strong className="text-white">SONORA Administrator is online.</strong> You can send a message and receive a direct response from the administrator.
            </p>
          ) : (
            <p>
              <strong className="text-white">The administrator is currently offline.</strong> Our <span className="text-cyan-400 font-semibold">SONORA Support Assistant</span> can help you with common questions and issues, and all requests are queued for administrator review upon return.
            </p>
          )}
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 min-h-0 bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-neutral-500">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs">Loading conversation history...</span>
            </div>
          ) : messages.length === 0 ? (
            /* Welcome Screen / Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">How can we help?</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                Send a private message to SONORA Support for music requests, technical issues, account assistance, or feedback.
              </p>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-6">
                <button
                  onClick={() => setIsMusicModalOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#181818] border border-white/10 hover:border-emerald-500/40 text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">🎵 Request Music</h4>
                    <p className="text-[11px] text-neutral-500">Ask for songs, albums, or artists</p>
                  </div>
                </button>

                <button
                  onClick={() => setIsIssueModalOpen(true)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#181818] border border-white/10 hover:border-rose-500/40 text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">⚠️ Report an Issue</h4>
                    <p className="text-[11px] text-neutral-500">Player, audio, or lyrics bugs</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('feedback');
                    setInputMessage('Hi! I have a suggestion for improving SONORA: ');
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#181818] border border-white/10 hover:border-amber-500/40 text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">💡 Send Feedback</h4>
                    <p className="text-[11px] text-neutral-500">Share your thoughts & suggestions</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('general');
                    setInputMessage('Hi! How do I customize lyric translations and font size in SONORA?');
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#181818] border border-white/10 hover:border-cyan-500/40 text-left transition-all group hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">🤖 Ask Support Bot</h4>
                    <p className="text-[11px] text-neutral-500">Get immediate 24/7 help</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Render message thread */
            messages.map((msg) => {
              const isUser = msg.senderRole === 'user';
              const isAI = msg.senderType === 'ai';
              const isAdmin = msg.senderType === 'admin';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5 transition-all`}
                >
                  {/* Sender Header Badge */}
                  <div className={`flex items-center gap-2 text-[11px] px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    {isUser ? (
                      <span className="font-bold text-neutral-300">You</span>
                    ) : isAI ? (
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                        <Bot className="w-3.5 h-3.5" />
                        <span>SONORA Support Assistant</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Automated Bot
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SONORA Administrator</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Official Support
                        </span>
                      </div>
                    )}
                    <span className="text-neutral-500 font-mono text-[10px]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg whitespace-pre-line ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-semibold rounded-tr-sm shadow-emerald-900/20'
                        : isAI
                        ? 'bg-[#18181c] border border-cyan-500/20 text-neutral-200 rounded-tl-sm shadow-black/40'
                        : 'bg-[#1e1c18] border border-amber-500/30 text-neutral-100 rounded-tl-sm shadow-black/40'
                    }`}
                  >
                    {/* Category pill indicator if available */}
                    {msg.category && msg.category !== 'general' && isUser && (
                      <div className="mb-2 text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded bg-black/20 w-fit">
                        {CATEGORIES.find((c) => c.id === msg.category)?.label || msg.category}
                      </div>
                    )}

                    {msg.message}

                    {/* Screenshot / Attachment display if any */}
                    {msg.attachmentUrl && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <a
                          href={msg.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Attachment / Screenshot
                        </a>
                      </div>
                    )}
                  </div>

                  {/* If AI message and user hasn't escalated yet, show optional Contact Administrator button */}
                  {isAI && conversation?.status !== 'waiting_admin' && (
                    <div className="mt-1 pl-1">
                      <button
                        onClick={handleEscalateToAdmin}
                        disabled={isHandoffPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                        title="Forward this ticket for human administrator attention"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isHandoffPending ? 'Forwarding...' : 'Contact Administrator'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Composer */}
        <div className="p-3 sm:p-4 bg-[#141414] border-t border-white/10 shrink-0">
          {/* Category Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-neutral-500 shrink-0 mr-1">Category:</span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? `${cat.color} font-bold shadow-sm scale-105 border`
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                maxLength={1500}
                placeholder={
                  adminStatus.isOnline
                    ? 'Write a message to SONORA Support… (Press Enter to send)'
                    : 'The administrator is offline. The SONORA Support Assistant can help with common questions…'
                }
                rows={2}
                className="w-full bg-[#1e1e1e] border border-white/10 focus:border-emerald-500/50 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {inputMessage.length}/1500 characters
                </span>
                <span className="text-neutral-600 hidden sm:inline">•</span>
                <span className="text-[10px] text-neutral-500 hidden sm:inline">
                  Strictly private & encrypted
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile modals shortcut */}
                <button
                  type="button"
                  onClick={() => setIsMusicModalOpen(true)}
                  className="sm:hidden p-2 rounded-xl bg-white/5 text-emerald-400 border border-white/10"
                  title="Request Music"
                >
                  <Music className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(true)}
                  className="sm:hidden p-2 rounded-xl bg-white/5 text-rose-400 border border-white/10"
                  title="Report Issue"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-bold text-xs transition-all active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL 1: Structured Music Request Workflow */}
      {isMusicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-[#181818] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Music Request</h3>
                  <p className="text-[11px] text-neutral-400">Request a track or album to be added to SONORA</p>
                </div>
              </div>
              <button
                onClick={() => setIsMusicModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMusicRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Song Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Espresso, Birds of a Feather"
                  value={mrTitle}
                  onChange={(e) => setMrTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Artist Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sabrina Carpenter, Billie Eilish"
                  value={mrArtist}
                  onChange={(e) => setMrArtist(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Album Name <span className="text-neutral-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Short n' Sweet"
                  value={mrAlbum}
                  onChange={(e) => setMrAlbum(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Additional Note / Video Link <span className="text-neutral-500">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide YouTube link or version details (acoustic, live, etc.)"
                  value={mrNote}
                  onChange={(e) => setMrNote(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMusicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mrSubmitting || !mrTitle.trim() || !mrArtist.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  {mrSubmitting ? 'Submitting...' : 'Submit Music Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Structured Issue Report Workflow */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-[#181818] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Report an Issue</h3>
                  <p className="text-[11px] text-neutral-400">Submit technical feedback or playback problem</p>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIssueReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Issue Type
                </label>
                <select
                  value={irType}
                  onChange={(e: any) => setIrType(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500/60"
                >
                  <option value="player">🎵 Music Player / Playback</option>
                  <option value="lyrics">🎙️ Lyrics Synchronization</option>
                  <option value="search">🔍 Search & Catalog</option>
                  <option value="playlist">📋 Playlists & Collections</option>
                  <option value="account">👤 Account & Profile</option>
                  <option value="other">⚙️ Other Technical Problem</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Problem Summary <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Song audio cuts off after 30 seconds"
                  value={irTitle}
                  onChange={(e) => setIrTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Detailed Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what happened, what device or browser you are using, and steps to reproduce..."
                  value={irDesc}
                  onChange={(e) => setIrDesc(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500/60 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Optional Screenshot URL
                </label>
                <input
                  type="url"
                  placeholder="https://i.imgur.com/example.png"
                  value={irScreenshot}
                  onChange={(e) => setIrScreenshot(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500/60"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={irSubmitting || !irTitle.trim() || !irDesc.trim()}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  {irSubmitting ? 'Submitting...' : 'Submit Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

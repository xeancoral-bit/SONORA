'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bot,
  User,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Power,
  Music,
  AlertTriangle,
  Lightbulb,
  UserCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  SupportConversation,
  SupportMessage,
  SupportCategory,
  ConversationStatus,
  AdminOnlineStatus
} from '@/lib/types';

const STATUS_BADGES: Record<ConversationStatus, { label: string; color: string; border: string; bg: string }> = {
  new: { label: 'New', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/15' },
  unread: { label: 'Unread', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/15' },
  ai_assisted: { label: 'AI Assisted', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/15' },
  waiting_admin: { label: 'Waiting for Admin', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/15' },
  replied: { label: 'Replied', color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/15' },
  resolved: { label: 'Resolved', color: 'text-neutral-400', border: 'border-neutral-700', bg: 'bg-neutral-800' }
};

const CATEGORY_LABELS: Record<SupportCategory, { label: string; icon: any }> = {
  music_request: { label: 'Music Request', icon: Music },
  issue_report: { label: 'Report an Issue', icon: AlertTriangle },
  account_support: { label: 'Account Support', icon: UserCheck },
  feedback: { label: 'Feedback', icon: Lightbulb },
  general: { label: 'General Inquiry', icon: HelpCircle }
};

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<SupportMessage[]>([]);
  const [adminStatus, setAdminStatus] = useState<AdminOnlineStatus>({ isOnline: true, lastSeen: '' });
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load all conversations
  const loadAdminInbox = async (silent: boolean = false) => {
    try {
      if (!silent) setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/support/conversations?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load inbox');
      const data = await res.json();
      setConversations(data.conversations || []);
      if (data.adminStatus) setAdminStatus(data.adminStatus);

      // If a conversation is selected, refresh its messages
      if (selectedConvId) {
        const msgRes = await fetch(`/api/support/conversations/${selectedConvId}`);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setActiveMessages(msgData.messages || []);
        }
      }
    } catch (err: any) {
      if (!silent) toast.error('Error refreshing support inbox');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminInbox();
    pollTimerRef.current = setInterval(() => {
      loadAdminInbox(true);
    }, 4000);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [statusFilter, categoryFilter, searchQuery]);

  // When a conversation is selected, load its messages
  const handleSelectConversation = async (convId: string) => {
    setSelectedConvId(convId);
    try {
      const res = await fetch(`/api/support/conversations/${convId}`);
      if (!res.ok) throw new Error('Failed to load thread');
      const data = await res.json();
      setActiveMessages(data.messages || []);
      
      // Update local unread count
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadByAdminCount: 0 } : c))
      );
    } catch {
      toast.error('Could not load conversation thread');
    }
  };

  // Scroll to bottom of active conversation
  useEffect(() => {
    if (selectedConvId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, selectedConvId]);

  // Admin replies to user
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !replyText.trim() || isReplying) return;

    try {
      setIsReplying(true);
      const res = await fetch(`/api/support/conversations/${selectedConvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() })
      });

      if (!res.ok) throw new Error('Failed to send reply');
      const data = await res.json();
      setReplyText('');
      setActiveMessages(data.messages || []);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? data.conversation : c))
        );
      }
      toast.success('Reply sent directly to user.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  // Toggle Admin Online Status
  const handleToggleOnlineStatus = async () => {
    try {
      setIsTogglingStatus(true);
      const nextState = !adminStatus.isOnline;
      const res = await fetch('/api/support/admin-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline: nextState })
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      const data = await res.json();
      setAdminStatus(data.status);
      toast.info(`Availability updated to ${nextState ? 'Online 🟢' : 'Offline ⚫'}`);
    } catch (err: any) {
      toast.error('Failed to change admin status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Update conversation status (e.g. resolve)
  const handleUpdateStatus = async (convId: string, status: ConversationStatus) => {
    try {
      const res = await fetch(`/api/support/conversations/${convId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? data.conversation : c))
        );
      }
      if (data.messages) setActiveMessages(data.messages);
      toast.success(`Conversation marked as ${status.replace('_', ' ')}`);
    } catch (err: any) {
      toast.error('Could not update status');
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[600px] gap-4 animate-in fade-in select-none">
      {/* Top Header Bar with Online/Offline Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#121212] border border-white/5 rounded-2xl shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Support Messages</h1>
              <p className="text-xs text-neutral-400">Private customer support tickets, music requests, and AI-assisted inquiries.</p>
            </div>
          </div>
        </div>

        {/* Admin Online Availability Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-neutral-400 font-medium">Your Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 font-bold ${
                adminStatus.isOnline ? 'text-emerald-400' : 'text-neutral-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${adminStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-500'}`} />
              {adminStatus.isOnline ? 'Online (Accepting Live Chats)' : 'Offline (AI Bot Handling)'}
            </span>
          </div>

          <button
            onClick={handleToggleOnlineStatus}
            disabled={isTogglingStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
              adminStatus.isOnline
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
            }`}
            title="Toggle whether users see you as Online or Offline"
          >
            <Power className="w-3.5 h-3.5" />
            <span>{adminStatus.isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Inbox on Left, Conversation on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column: Inbox List (col-span-5) */}
        <div
          className={`lg:col-span-5 bg-[#121212] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl ${
            selectedConvId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Inbox Filter & Search Toolbar */}
          <div className="p-3.5 border-b border-white/5 space-y-2.5 shrink-0 bg-[#161616]">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, or message..."
                className="w-full bg-[#1e1e1e] border border-white/5 focus:border-amber-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1e1e1e] border border-white/10 rounded-lg px-2 py-1 text-neutral-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="waiting_admin">Waiting for Admin 🔥</option>
                <option value="ai_assisted">AI Assisted 🤖</option>
                <option value="unread">Unread</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#1e1e1e] border border-white/10 rounded-lg px-2 py-1 text-neutral-300 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="music_request">🎵 Music Request</option>
                <option value="issue_report">⚠️ Report an Issue</option>
                <option value="account_support">👤 Account Support</option>
                <option value="feedback">💡 Feedback</option>
                <option value="general">❓ General Inquiry</option>
              </select>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-neutral-500 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold text-neutral-400">No support tickets match filters</p>
                <p className="text-[11px] text-neutral-600 mt-1">User conversations will appear here automatically.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedConvId === conv.id;
                const statusBadge = STATUS_BADGES[conv.status] || STATUS_BADGES.new;
                const CategoryIcon = CATEGORY_LABELS[conv.category]?.icon || HelpCircle;

                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer group hover:bg-white/[0.03] ${
                      isSelected ? 'bg-amber-500/10 border-l-4 border-amber-400 pl-2.5' : ''
                    }`}
                  >
                    <img
                      src={conv.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={conv.userName}
                      className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-white truncate group-hover:text-amber-400 transition-colors">
                          {conv.userName}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                          {new Date(conv.latestMessageAt || conv.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Category & Status tags */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-neutral-300 bg-white/5 px-2 py-0.5 rounded">
                          <CategoryIcon className="w-2.5 h-2.5" />
                          {CATEGORY_LABELS[conv.category]?.label || conv.category}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded border ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                        >
                          {statusBadge.label}
                        </span>
                        {conv.unreadByAdminCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[9px]">
                            {conv.unreadByAdminCount} new
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 truncate line-clamp-1 leading-normal">
                        {conv.latestMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Thread (col-span-7) */}
        <div
          className={`lg:col-span-7 bg-[#121212] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl ${
            !selectedConvId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-white/5 bg-[#161616] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedConvId(null)}
                    className="lg:hidden p-1.5 rounded-xl bg-white/5 text-neutral-300 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={selectedConv.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={selectedConv.userName}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white truncate">{selectedConv.userName}</h3>
                      <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                        ({selectedConv.userEmail})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                      <span>Category: <strong className="text-neutral-200">{CATEGORY_LABELS[selectedConv.category]?.label}</strong></span>
                      <span>•</span>
                      <span
                        className={`font-bold uppercase text-[9px] px-2 py-0.5 rounded border ${
                          STATUS_BADGES[selectedConv.status]?.bg
                        } ${STATUS_BADGES[selectedConv.status]?.color} ${
                          STATUS_BADGES[selectedConv.status]?.border
                        }`}
                      >
                        {STATUS_BADGES[selectedConv.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedConv.status !== 'resolved' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedConv.id, 'resolved')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                      title="Mark ticket resolved"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedConv.id, 'waiting_admin')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                      title="Re-open ticket"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-open</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 select-text bg-[#0e0e0e]">
                {activeMessages.map((msg) => {
                  const isUser = msg.senderRole === 'user';
                  const isAI = msg.senderType === 'ai';
                  const isAdmin = msg.senderType === 'admin';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} gap-1`}
                    >
                      {/* Badge Header */}
                      <div className="flex items-center gap-2 text-[11px] px-1">
                        {isUser ? (
                          <div className="flex items-center gap-1.5 text-neutral-300 font-bold">
                            <User className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{msg.senderName} (User)</span>
                          </div>
                        ) : isAI ? (
                          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                            <Bot className="w-3.5 h-3.5" />
                            <span>SONORA Support Assistant (AI)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>You (Administrator)</span>
                          </div>
                        )}
                        <span className="text-neutral-500 font-mono text-[10px]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg whitespace-pre-line ${
                          isUser
                            ? 'bg-[#181818] border border-white/10 text-neutral-200 rounded-tl-sm'
                            : isAI
                            ? 'bg-[#14181c] border border-cyan-500/20 text-neutral-300 rounded-tr-sm'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-tr-sm shadow-amber-900/20'
                        }`}
                      >
                        {msg.message}

                        {msg.attachmentUrl && (
                          <div className="mt-2.5 pt-2 border-t border-white/10">
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs underline text-cyan-400"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin Reply Composer */}
              <div className="p-3 sm:p-4 bg-[#161616] border-t border-white/5 shrink-0">
                <form onSubmit={handleSendAdminReply} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                    <span>
                      Replying as: <strong className="text-amber-400 font-bold">SONORA Administrator</strong>
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Direct notification will be sent to {selectedConv.userName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAdminReply(e);
                        }
                      }}
                      rows={2}
                      placeholder={`Reply to ${selectedConv.userName} directly... (Press Enter to send)`}
                      className="flex-1 bg-[#1e1e1e] border border-white/10 focus:border-amber-500/50 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isReplying}
                      className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer h-full"
                    >
                      {isReplying ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Reply</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            /* No conversation selected state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-500">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8 opacity-40 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-base">Select a conversation</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                Choose a ticket from the left panel to review message history, inspect AI troubleshooting, and reply directly to users.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

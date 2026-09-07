'use client';

import React, { useState, useEffect } from 'react';
import { NotificationItem } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import { Bell, Send, Radio, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Broadcast form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'system' | 'release' | 'album' | 'admin_alert'>('system');
  const [link, setLink] = useState('');
  const [isSending, setIsSending] = useState(false);

  const toast = useToast();

  const fetchNotifs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setIsSending(true);
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          link: link.trim() || undefined,
          userId: 'all'
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Announcement Broadcasted', 'All users received the notification.');
        setTitle('');
        setMessage('');
        setLink('');
        fetchNotifs();
      } else {
        toast.error(data.error || 'Failed to send broadcast');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Notifications & Announcement Center</h1>
        <p className="text-xs md:text-sm text-neutral-400 mt-1">
          Broadcast system notifications, release updates, and manage platform alerts.
        </p>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleBroadcast} className="p-6 rounded-3xl bg-[#141414] border border-white/5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 border-b border-white/5 pb-3">
          <Send className="w-5 h-5" />
          <h3 className="font-bold text-base text-white">Broadcast Announcement To All Users</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Notification Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Sound Experience Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="system">System Announcement</option>
              <option value="release">New Single / Release</option>
              <option value="album">New Album</option>
              <option value="admin_alert">Admin Notice</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Announcement Message *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Write clear and engaging announcement text..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Action Link (Optional)
          </label>
          <input
            type="text"
            placeholder="/browse or /albums/album-midnight-odyssey"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSending}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <Radio className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Broadcast to All Users'}
          </button>
        </div>
      </form>

      {/* Notifications History */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-white">Recent System Notifications & Alerts</h3>

        <div className="space-y-2">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-neutral-500">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-500">No recent notifications.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{n.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{n.message}</p>
                    {n.link && (
                      <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                        Link: {n.link}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

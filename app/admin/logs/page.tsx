'use client';

import React, { useState, useEffect } from 'react';
import { AdminActivityLog } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { FileText, Shield, Clock, Search, Terminal } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/admin/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q) ||
      log.targetType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Activity Audit Logs</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Immutable audit record of all administrative uploads, edits, deletes, and security changes.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 uppercase font-bold text-[10px] text-neutral-400 tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-3">Administrator</th>
                <th className="py-3.5 px-3">Details</th>
                <th className="py-3.5 px-3">Target</th>
                <th className="py-3.5 px-3">IP</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 text-white font-sans font-semibold">
                      {log.adminName}
                    </td>
                    <td className="py-3 px-3 text-neutral-300 font-sans max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] uppercase font-bold text-neutral-400">
                        {log.targetType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-400">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

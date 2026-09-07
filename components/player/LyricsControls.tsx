'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { SUPPORTED_LYRIC_LANGUAGES, LyricLanguage } from '@/lib/lyricsData';

interface LyricsControlsProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  variant?: 'panel' | 'fullscreen' | 'page';
  className?: string;
}

export const LyricsControls: React.FC<LyricsControlsProps> = ({
  language,
  onLanguageChange,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  variant = 'panel',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentLang =
    SUPPORTED_LYRIC_LANGUAGES.find((l) => l.code === language) ||
    SUPPORTED_LYRIC_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const fontSizeLabels: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'X-Large',
  };

  const isMinSize = fontSize === 'sm';
  const isMaxSize = fontSize === 'xl';

  const filteredLanguages = SUPPORTED_LYRIC_LANGUAGES.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`flex items-center justify-between gap-2 py-1.5 px-0.5 text-xs text-neutral-300 select-none ${className}`}
    >
      {/* Language Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setSearchQuery('');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 hover:border-emerald-500/40 text-white font-medium transition-all shadow-sm group"
          title="Change lyrics language"
        >
          <span className="w-5 h-4 rounded bg-neutral-800 border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-400">
            {currentLang.code.toUpperCase()}
          </span>
          <span className="truncate max-w-[100px] sm:max-w-[130px] font-semibold text-xs">
            {currentLang.nativeName}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-72 max-w-[90vw] py-2 rounded-2xl bg-[#181818]/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Header with Title and Language Count */}
            <div className="px-3 pb-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs">All Languages</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                {SUPPORTED_LYRIC_LANGUAGES.length} Available
              </span>
            </div>

            {/* Quick Search Box */}
            <div className="p-2 border-b border-white/5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search language (e.g. Spanish, Tagalog, 日本語)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Language Scrollable List */}
            <div className="max-h-72 overflow-y-auto py-1 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => {
                  const isSelected = lang.code === language;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors my-0.5 ${
                        isSelected
                          ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                          : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-4 rounded bg-neutral-800 border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-neutral-300 shrink-0">
                          {lang.code.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-xs text-white">
                            {lang.nativeName}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            {lang.name}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-neutral-500">
                  No language found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Font Size Adjuster Controls */}
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shadow-sm">
        <button
          type="button"
          onClick={onDecreaseFontSize}
          disabled={isMinSize}
          className="p-1 rounded-lg hover:bg-white/10 active:bg-white/15 text-neutral-300 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
          title="Decrease text size (A-)"
          aria-label="Decrease lyrics font size"
        >
          <span className="text-[11px] font-bold px-1">A-</span>
        </button>

        <div
          className="px-1.5 text-[10px] font-bold text-neutral-300 uppercase tracking-wider min-w-[28px] text-center"
          title={`Font size: ${fontSizeLabels[fontSize]}`}
        >
          {fontSize.toUpperCase()}
        </div>

        <button
          type="button"
          onClick={onIncreaseFontSize}
          disabled={isMaxSize}
          className="p-1 rounded-lg hover:bg-white/10 active:bg-white/15 text-neutral-300 hover:text-white disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
          title="Increase text size (A+)"
          aria-label="Increase lyrics font size"
        >
          <span className="text-[11px] font-bold px-1">A+</span>
        </button>
      </div>
    </div>
  );
};

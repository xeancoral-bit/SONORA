'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Genre } from '@/lib/types';
import { useToast } from '@/context/ToastContext';

interface GenreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: Genre | null;
  onSaved: (genre: Genre) => void;
}

const colorPresets = [
  { name: 'Emerald / Teal', color: 'from-emerald-500 to-teal-800', accent: '#10B981' },
  { name: 'Cyan / Blue', color: 'from-cyan-500 to-blue-700', accent: '#06B6D4' },
  { name: 'Pink / Rose', color: 'from-pink-500 to-rose-700', accent: '#EC4899' },
  { name: 'Purple / Indigo', color: 'from-purple-500 to-indigo-800', accent: '#8B5CF6' },
  { name: 'Amber / Red', color: 'from-amber-600 to-red-800', accent: '#F59E0B' },
  { name: 'Orange / Amber', color: 'from-orange-500 to-amber-700', accent: '#F97316' },
  { name: 'Lime / Green', color: 'from-lime-600 to-emerald-800', accent: '#84CC16' },
  { name: 'Slate / Dark', color: 'from-slate-600 to-zinc-900', accent: '#64748B' }
];

export const GenreFormModal: React.FC<GenreFormModalProps> = ({
  isOpen,
  onClose,
  genre,
  onSaved
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorPresets[0].color);
  const [accentColor, setAccentColor] = useState(colorPresets[0].accent);
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (genre) {
      setName(genre.name);
      setColor(genre.color);
      setAccentColor(genre.accentColor);
      setCoverImage(genre.coverImage || '');
      setDescription(genre.description || '');
    } else {
      setName('');
      setColor(colorPresets[0].color);
      setAccentColor(colorPresets[0].accent);
      setCoverImage('');
      setDescription('');
    }
  }, [genre, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const endpoint = genre ? `/api/genres/${genre.id}` : '/api/genres';
      const method = genre ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          color,
          accentColor,
          coverImage: coverImage.trim() || undefined,
          description: description.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(genre ? 'Genre Updated' : 'Genre Created');
        onSaved(data.genre);
        onClose();
      } else {
        toast.error(data.error || 'Failed to save genre');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={genre ? 'Edit Genre' : 'Create Genre / Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Genre Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Color Theme Palette
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setColor(preset.color);
                  setAccentColor(preset.accent);
                }}
                className={`h-10 rounded-xl bg-gradient-to-r ${preset.color} border transition-all ${
                  color === preset.color ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Cover Illustration URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow-lg shadow-emerald-500/25"
          >
            {isSubmitting ? 'Saving...' : 'Save Genre'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

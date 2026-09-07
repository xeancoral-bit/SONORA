'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Song, Genre, SongStatus, Artist } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { parseMediaUrl } from '@/lib/urlUtils';
import {
  FileCode,
  Globe,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Link2
} from 'lucide-react';
import { Youtube } from '@/components/ui/icons';

interface SongFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onSaved: (song: Song) => void;
}

export const SongFormModal: React.FC<SongFormModalProps> = ({
  isOpen,
  onClose,
  song,
  onSaved
}) => {
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [genreId, setGenreId] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [status, setStatus] = useState<SongStatus>('published');
  const [explicit, setExplicit] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Source URL editing
  const [sourceUrl, setSourceUrl] = useState('');
  const [isReplacingUrl, setIsReplacingUrl] = useState(false);
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [urlCheckState, setUrlCheckState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [urlError, setUrlError] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);
  const [existingArtists, setExistingArtists] = useState<Artist[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const isUrlTrack = song?.sourceType === 'external_url' || song?.uploadType === 'url';
  const isYouTube = song?.sourcePlatform === 'youtube';

  useEffect(() => {
    if (isOpen) {
      fetch('/api/genres')
        .then((r) => r.json())
        .then((data) => setGenres(data.genres || []));
      fetch('/api/artists')
        .then((r) => r.json())
        .then((data) => setExistingArtists(data.artists || []));
    }
  }, [isOpen]);

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtistName(song.artistName);
      setAlbumTitle(song.albumTitle || '');
      setGenreId(song.genreId);
      setCoverImage(song.coverImage || '');
      setDescription(song.description || '');
      setLyrics(song.lyrics || '');
      setStatus(song.status || 'published');
      setExplicit(song.explicit || false);
      setIsFeatured(song.isFeatured || false);
      setSourceUrl(song.sourceUrl || song.audioUrl || '');
      setIsReplacingUrl(false);
      setNewSourceUrl('');
      setUrlCheckState('idle');
    }
  }, [song]);

  const handleCheckNewUrl = async () => {
    const raw = newSourceUrl.trim();
    if (!raw) {
      setUrlCheckState('invalid');
      setUrlError('Please enter a URL.');
      return;
    }
    setUrlCheckState('checking');
    setUrlError('');
    const parsed = parseMediaUrl(raw);
    if (!parsed.isValid) {
      setUrlCheckState('invalid');
      setUrlError('Invalid URL. Please enter a valid YouTube or media URL.');
      return;
    }
    setUrlCheckState('valid');
  };

  const handleCopySourceUrl = async () => {
    const url = song?.sourceUrl || song?.audioUrl || '';
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Source URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!song || !title.trim() || !artistName.trim()) return;

    if (isReplacingUrl && newSourceUrl.trim() && urlCheckState !== 'valid') {
      toast.error('Please check the new URL first.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedGenre = genres.find((g) => g.id === genreId);

      // Compute source fields if URL is being replaced
      let sourcePatch = {};
      if (isReplacingUrl && newSourceUrl.trim() && urlCheckState === 'valid') {
        const parsed = parseMediaUrl(newSourceUrl.trim());
        sourcePatch = {
          sourceUrl: newSourceUrl.trim(),
          audioUrl: newSourceUrl.trim(),
          sourcePlatform: parsed.platform,
          externalMediaId: parsed.videoId || undefined,
        };
      }

      const matchedArtist = existingArtists.find(
        (a) => a.name.toLowerCase() === artistName.trim().toLowerCase()
      );
      const targetArtistId = matchedArtist ? matchedArtist.id : song.artistId;

      const res = await fetch(`/api/songs/${song.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          artistId: targetArtistId,
          artistName: artistName.trim(),
          albumId: albumTitle.trim() ? song.albumId : undefined,
          albumTitle: albumTitle.trim() || undefined,
          genreId,
          genreName: selectedGenre?.name || song.genreName,
          coverImage,
          description,
          lyrics,
          status,
          explicit,
          isFeatured,
          ...sourcePatch,
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Track Updated', `"${data.song.title}" saved.`);
        onSaved(data.song);
        onClose();
      } else {
        toast.error(data.error || 'Failed to update track');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!song) return null;

  const inputClass = 'w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors';
  const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Track" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Source info banner */}
        {isUrlTrack ? (
          <div className={`flex flex-col gap-3 p-3 rounded-xl border text-xs ${
            isYouTube
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-blue-500/5 border-blue-500/20'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isYouTube ? (
                  <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <div>
                  <p className={`font-bold text-[11px] ${isYouTube ? 'text-red-300' : 'text-blue-300'}`}>
                    {isYouTube ? 'YouTube Source' : 'External URL Source'}
                  </p>
                  <p className="text-neutral-500 text-[10px] font-mono truncate max-w-[280px]">
                    {sourceUrl || 'No URL stored'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {sourceUrl && (
                  <>
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Open source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopySourceUrl}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Copy source URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsReplacingUrl(!isReplacingUrl)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] transition-colors border border-white/5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replace URL
                </button>
              </div>
            </div>

            {/* Replace URL inline UI */}
            {isReplacingUrl && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[11px] text-amber-300/80">
                  ⚠ Replacing the URL will update the source. Manually entered track info below will NOT be erased.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Paste new YouTube or media URL..."
                      value={newSourceUrl}
                      onChange={(e) => {
                        setNewSourceUrl(e.target.value);
                        setUrlCheckState('idle');
                        setUrlError('');
                      }}
                      className={`w-full bg-neutral-950 border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none font-mono transition-colors ${
                        urlCheckState === 'valid'
                          ? 'border-emerald-500/50'
                          : urlCheckState === 'invalid'
                          ? 'border-red-500/50'
                          : 'border-white/10 focus:border-amber-500/50'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckNewUrl}
                    disabled={urlCheckState === 'checking' || !newSourceUrl.trim()}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 shrink-0 transition-all"
                  >
                    {urlCheckState === 'checking' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : urlCheckState === 'valid' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      'Check'
                    )}
                  </button>
                </div>
                {urlCheckState === 'valid' && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid — will be saved on submit
                  </p>
                )}
                {urlCheckState === 'invalid' && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {urlError}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 border border-white/5 text-xs text-neutral-400 font-mono">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>File:</span>
            <span className="text-white font-bold truncate">{song.originalFilename || 'audio_file.mp3'}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className={labelClass}>Track Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Artist & Album — free text */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Artist <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              list="edit-modal-artists-list"
              placeholder="e.g. Adele, Aurora Wave, or new artist"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className={inputClass}
            />
            <datalist id="edit-modal-artists-list">
              {existingArtists.map((a) => (
                <option key={a.id} value={a.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Album (Optional)</label>
            <input
              type="text"
              placeholder="Leave blank for Single"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Genre & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Genre</label>
            <select
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              className={inputClass}
            >
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SongStatus)}
              className={inputClass}
            >
              <option value="published">Published (Public)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="private">Private (Admin only)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Cover Artwork */}
        <div>
          <label className={labelClass}>Cover Artwork URL</label>
          <div className="flex gap-2 items-start">
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className={`${inputClass} flex-1`}
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="w-12 h-12 rounded-lg object-cover bg-neutral-800 shrink-0 border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Short description..."
          />
        </div>

        {/* Lyrics */}
        <div>
          <label className={labelClass}>Lyrics</label>
          <textarea
            rows={3}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            className={`${inputClass} font-mono resize-none`}
            placeholder="[00:15.00] Lyric line..."
          />
        </div>

        {/* Flags */}
        <div className="flex items-center gap-5 pt-1">
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={explicit}
              onChange={(e) => setExplicit(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            Explicit Content
          </label>
          <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            Feature on Homepage
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-40"
          >
            {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Genre, SongStatus, Artist, Album } from '@/lib/types';
import { useToast } from '@/context/ToastContext';
import { parseMediaUrl, fetchYouTubeOEmbed } from '@/lib/urlUtils';
import {
  Upload,
  Link2,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ExternalLink,
  RefreshCw,
  Music2,
  Image as ImageIcon,
  Info,
  Globe,
  Sparkles
} from 'lucide-react';
import { Youtube } from '@/components/ui/icons';

type AudioSourceMode = 'file' | 'url';

interface UrlPreviewMeta {
  title: string;
  thumbnail: string;
  channelName: string;
  channelUrl: string;
  platform: string;
  videoId: string | null;
  canonicalUrl: string;
}

type UrlValidationState = 'idle' | 'checking' | 'valid' | 'invalid';

export default function AdminAddMusicPage() {
  const router = useRouter();
  const toast = useToast();

  // Audio Source Mode
  const [audioSourceMode, setAudioSourceMode] = useState<AudioSourceMode>('file');

  // ── File Upload State ──
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState(180);
  const [uploadedAudioPath, setUploadedAudioPath] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── URL Source State ──
  const [sourceUrl, setSourceUrl] = useState('');
  const [urlValidation, setUrlValidation] = useState<UrlValidationState>('idle');
  const [urlError, setUrlError] = useState('');
  const [urlPreview, setUrlPreview] = useState<UrlPreviewMeta | null>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // ── Track Information (free-text for Artist & Album) ──
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [genreId, setGenreId] = useState('genre-pop');
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [copyrightOwner, setCopyrightOwner] = useState('');
  const [tags, setTags] = useState('');
  const [explicit, setExplicit] = useState(false);
  const [status, setStatus] = useState<SongStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [synthPreset, setSynthPreset] = useState('chill');



  // ── Reference data ──
  const [genres, setGenres] = useState<Genre[]>([]);
  const [existingArtists, setExistingArtists] = useState<Artist[]>([]);
  const [existingAlbums, setExistingAlbums] = useState<Album[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/genres')
      .then((r) => r.json())
      .then((data) => {
        setGenres(data.genres || []);
        if (data.genres?.length > 0) setGenreId(data.genres[0].id);
      });

    fetch('/api/artists')
      .then((r) => r.json())
      .then((data) => {
        setExistingArtists(data.artists || []);
      })
      .catch(() => {});

    fetch('/api/albums')
      .then((r) => r.json())
      .then((data) => {
        setExistingAlbums(data.albums || []);
      })
      .catch(() => {});
  }, []);

  // ── File Upload Logic ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      toast.error('Invalid format', 'Please select an MP3, WAV, M4A, AAC, or OGG file.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large', 'Maximum audio file size is 50MB.');
      return;
    }

    setSelectedFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setFileDuration(Math.round(audio.duration));
      }
    };
    uploadAudioFile(file);
  };

  const uploadAudioFile = async (file: File) => {
    try {
      setIsUploadingFile(true);
      setUploadProgress(20);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');
      setUploadProgress(60);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setUploadProgress(100);
      if (res.ok && data.url) {
        setUploadedAudioPath(data.url);
        toast.success('Audio file uploaded');
      } else {
        toast.error(data.error || 'Upload error');
      }
    } catch {
      toast.error('File upload failed');
    } finally {
      setIsUploadingFile(false);
    }
  };

  // ── URL Validation Logic ──
  const handleCheckUrl = useCallback(async () => {
    const raw = sourceUrl.trim();
    if (!raw) {
      setUrlError('Music URL is required.');
      setUrlValidation('invalid');
      return;
    }

    setUrlValidation('checking');
    setUrlError('');
    setUrlPreview(null);

    const parsed = parseMediaUrl(raw);

    if (!parsed.isValid) {
      setUrlValidation('invalid');
      setUrlError('Please enter a valid supported media URL. Accepted: YouTube links, direct audio file URLs.');
      return;
    }

    setUrlValidation('valid');

    // Fetch YouTube metadata if applicable
    if (parsed.platform === 'youtube' && parsed.videoId) {
      setIsFetchingMeta(true);
      const meta = await fetchYouTubeOEmbed(parsed.videoId);
      setIsFetchingMeta(false);

      if (meta) {
        setUrlPreview({
          title: meta.title,
          thumbnail: meta.thumbnail,
          channelName: meta.channelName,
          channelUrl: meta.channelUrl,
          platform: 'youtube',
          videoId: parsed.videoId,
          canonicalUrl: parsed.canonicalUrl,
        });

        // Pre-fill title only if the admin hasn't typed one yet
        if (!title && meta.title) setTitle(meta.title);
        if (!artistName && meta.channelName) setArtistName(meta.channelName);
        if (!coverImage && meta.thumbnail) setCoverImage(meta.thumbnail);
      } else {
        // Fallback preview with YouTube thumbnail directly
        setUrlPreview({
          title: '',
          thumbnail: `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`,
          channelName: '',
          channelUrl: '',
          platform: 'youtube',
          videoId: parsed.videoId,
          canonicalUrl: parsed.canonicalUrl,
        });
        if (!coverImage && parsed.videoId) {
          setCoverImage(`https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`);
        }
      }
    } else {
      setUrlPreview({
        title: '',
        thumbnail: '',
        channelName: '',
        channelUrl: '',
        platform: parsed.platform || 'direct',
        videoId: null,
        canonicalUrl: parsed.canonicalUrl,
      });
    }
  }, [sourceUrl, title, artistName, coverImage]);

  const handleClearUrl = () => {
    setSourceUrl('');
    setUrlValidation('idle');
    setUrlError('');
    setUrlPreview(null);
  };

  // ── Form Submission ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Track Title is required.');
      return;
    }
    if (!artistName.trim()) {
      toast.error('Artist name is required.');
      return;
    }

    if (audioSourceMode === 'url') {
      if (!sourceUrl.trim()) {
        toast.error('Music URL is required.');
        return;
      }
      if (urlValidation !== 'valid') {
        toast.error('Please validate the URL first by clicking "Check URL".');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const selectedGenre = genres.find((g) => g.id === genreId);
      const parsed = audioSourceMode === 'url' ? parseMediaUrl(sourceUrl.trim()) : null;

      // Link to existing artist if matched by name
      const matchedArtist = existingArtists.find(
        (a) => a.name.toLowerCase() === artistName.trim().toLowerCase()
      );

      const trimmedAlbumTitle = albumTitle.trim();
      const matchedAlbum = trimmedAlbumTitle
        ? existingAlbums.find(
            (a) => a.title.trim().toLowerCase() === trimmedAlbumTitle.toLowerCase()
          )
        : null;

      const payload = {
        title: title.trim(),
        artistId: matchedArtist ? matchedArtist.id : undefined,
        artistName: artistName.trim(),
        albumId: matchedAlbum ? matchedAlbum.id : undefined,
        albumTitle: trimmedAlbumTitle || undefined,
        genreId,
        genreName: selectedGenre?.name || 'Pop',
        duration: fileDuration || 180,
        releaseDate,
        description: description.trim(),
        lyrics: lyrics.trim(),
        coverImage:
          coverImage.trim() ||
          (urlPreview?.thumbnail) ||
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        copyrightOwner: copyrightOwner.trim() || `${artistName.trim()} / Sonora Records`,
        source: audioSourceMode === 'file' ? 'Official Master' : 'External URL',
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        explicit,
        status,
        isFeatured,
        uploadType: audioSourceMode,
        originalFilename:
          audioSourceMode === 'file'
            ? selectedFile?.name || `${title.toLowerCase().replace(/\s+/g, '_')}.mp3`
            : undefined,
        audioPath: uploadedAudioPath || undefined,
        audioUrl: audioSourceMode === 'url' ? sourceUrl.trim() : undefined,
        synthPreset,
        // Source tracking
        sourceType: audioSourceMode === 'file' ? 'upload' : 'external_url',
        sourceUrl: audioSourceMode === 'url' ? sourceUrl.trim() : undefined,
        sourcePlatform: parsed?.platform ?? null,
        externalMediaId: parsed?.videoId ?? undefined,
      };

      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Track Published!', `"${data.song.title}" is now in the library.`);
        router.push('/admin/music');
      } else {
        toast.error(data.error || 'Failed to publish track');
      }
    } catch {
      toast.error('Network error while saving track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 transition-colors';
  const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          <span>/</span>
          <Link href="/admin/music" className="hover:text-white transition-colors">Music Catalog</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold">Add New Track</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Add New Track</h1>
        <p className="text-sm text-neutral-400 mt-1">Add music to the SONORA library via file upload or supported URL.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ═══════════════════════════════════════════
            SECTION 1 — AUDIO SOURCE
        ═══════════════════════════════════════════ */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">1</span>
              Audio Source
            </h3>
            <p className="text-xs text-neutral-400 mt-1 ml-8">How would you like to add this track?</p>
          </div>

          {/* Source Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAudioSourceMode('file')}
              className={`relative p-5 rounded-2xl border text-left transition-all duration-200 ${
                audioSourceMode === 'file'
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-neutral-900/60 border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              {audioSourceMode === 'file' && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-black" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">↑ Upload Audio</h4>
                  <span className="text-[11px] text-neutral-400">MP3, WAV, M4A, AAC, or OGG</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 ml-13">Upload a local audio file directly to SONORA.</p>
            </button>

            <button
              type="button"
              onClick={() => setAudioSourceMode('url')}
              className={`relative p-5 rounded-2xl border text-left transition-all duration-200 ${
                audioSourceMode === 'url'
                  ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/10'
                  : 'bg-neutral-900/60 border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              {audioSourceMode === 'url' && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">🔗 Add from URL</h4>
                  <span className="text-[11px] text-neutral-400">YouTube or supported media URL</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500">Paste a YouTube or supported URL. Content plays via authorized embed.</p>
            </button>
          </div>

          {/* ─── FILE UPLOAD UI ─── */}
          {audioSourceMode === 'file' && (
            <div className="mt-1">
              <label
                htmlFor="audio-file-input"
                className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-white/10 bg-neutral-900/40 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  type="file"
                  id="audio-file-input"
                  accept=".mp3,.wav,.m4a,.aac,.ogg,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-emerald-400">
                  <FileAudio className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm text-white">
                    {selectedFile ? selectedFile.name : 'Click to browse or drag & drop'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">MP3, WAV, M4A, AAC, OGG — Max 50MB</p>
                </div>
              </label>

              {selectedFile && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isUploadingFile
                        ? `Uploading... ${uploadProgress}%`
                        : `Ready — ${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`}
                    </span>
                  </div>
                  <span className="font-mono text-neutral-400">~{fileDuration}s</span>
                </div>
              )}
            </div>
          )}

          {/* ─── URL INPUT UI ─── */}
          {audioSourceMode === 'url' && (
            <div className="mt-1 space-y-4">
              {/* URL Label */}
              <div>
                <label className={labelClass}>
                  YouTube / Music URL <span className="text-red-400">*</span>
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Paste YouTube or supported music URL..."
                      value={sourceUrl}
                      onChange={(e) => {
                        setSourceUrl(e.target.value);
                        setUrlValidation('idle');
                        setUrlPreview(null);
                        setUrlError('');
                      }}
                      className={`w-full bg-neutral-900 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors font-mono ${
                        urlValidation === 'valid'
                          ? 'border-emerald-500/60 focus:border-emerald-400'
                          : urlValidation === 'invalid'
                          ? 'border-red-500/60 focus:border-red-400'
                          : 'border-white/10 focus:border-amber-500/60'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckUrl}
                    disabled={urlValidation === 'checking' || !sourceUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-2 shrink-0"
                  >
                    {urlValidation === 'checking' ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking...</>
                    ) : (
                      <>Check URL</>
                    )}
                  </button>
                </div>

                {/* Validation feedback */}
                {urlValidation === 'valid' && !isFetchingMeta && (
                  <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid URL — source ready
                  </p>
                )}
                {urlValidation === 'invalid' && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" /> {urlError}
                  </p>
                )}
                {urlValidation === 'idle' && (
                  <p className="text-[11px] text-neutral-500 mt-1.5">
                    Paste a valid YouTube URL (e.g. youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…)
                  </p>
                )}
              </div>

              {/* URL Preview Card */}
              {isFetchingMeta && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 p-4 rounded-xl bg-neutral-900 border border-white/5">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  Retrieving track information from source...
                </div>
              )}

              {urlPreview && !isFetchingMeta && (
                <div className="rounded-2xl bg-neutral-900/80 border border-white/10 overflow-hidden">
                  <div className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-neutral-800 shrink-0 relative">
                      {urlPreview.thumbnail ? (
                        <img
                          src={urlPreview.thumbnail}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music2 className="w-6 h-6 text-neutral-600" />
                        </div>
                      )}
                      {urlPreview.platform === 'youtube' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center">
                            <Youtube className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {urlPreview.title ? (
                            <h4 className="font-bold text-sm text-white truncate">{urlPreview.title}</h4>
                          ) : (
                            <h4 className="font-bold text-sm text-neutral-400 italic">Title not retrieved</h4>
                          )}
                          {urlPreview.channelName && (
                            <p className="text-xs text-neutral-400 truncate mt-0.5">{urlPreview.channelName}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400 font-semibold">Valid Source</span>
                            {urlPreview.platform === 'youtube' && (
                              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 font-semibold">
                                YouTube
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview actions */}
                  <div className="flex items-center gap-2 px-4 pb-4">
                    <a
                      href={urlPreview.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition-colors border border-white/5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Source
                    </a>
                    <button
                      type="button"
                      onClick={handleClearUrl}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-300 hover:text-white transition-colors border border-white/5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Change URL
                    </button>
                  </div>

                  {/* Notice */}
                  <div className="mx-4 mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-300/80 leading-relaxed">
                      Content plays via the official YouTube embed. SONORA does not download or extract audio.
                      Fill in Track Information below — pre-filled values can be edited freely.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            SECTION 2 — TRACK INFORMATION
        ═══════════════════════════════════════════ */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono font-bold">2</span>
            Track Information
          </h3>

          {/* Track Title */}
          <div>
            <label className={labelClass}>
              Track Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Night Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Artist & Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Artist <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  list="existing-artists-list"
                  placeholder="e.g. Adele, Aurora Wave, or new artist"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className={inputClass}
                />
                <datalist id="existing-artists-list">
                  {existingArtists.map((a) => (
                    <option key={a.id} value={a.name} />
                  ))}
                </datalist>
              </div>

              {/* Artist Connection Status Indicator */}
              {artistName.trim() && (() => {
                const matched = existingArtists.find(
                  (a) => a.name.toLowerCase() === artistName.trim().toLowerCase()
                );
                if (matched) {
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Connects to existing artist <strong>{matched.name}</strong> (sidebar &gt; Artists)</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>New artist — will automatically create <strong>{artistName.trim()}</strong> profile in Artists & Genres</span>
                    </div>
                  );
                }
              })()}

              {/* Quick Suggestions */}
              {existingArtists.length > 0 && !artistName.trim() && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Existing:</span>
                  {existingArtists.slice(0, 5).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setArtistName(a.name);
                        if (a.genreId && genres.some((g) => g.id === a.genreId)) {
                          setGenreId(a.genreId);
                        }
                      }}
                      className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] transition-colors border border-white/5"
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Album (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  list="existing-albums-datalist"
                  placeholder="e.g. Midnight Memories"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className={inputClass}
                />
                <datalist id="existing-albums-datalist">
                  {existingAlbums.map((alb) => (
                    <option key={alb.id} value={alb.title}>
                      {alb.artistName ? `${alb.title} (${alb.artistName})` : alb.title}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Dynamic Album Feedback */}
              {albumTitle.trim() ? (() => {
                const matched = existingAlbums.find(
                  (a) => a.title.trim().toLowerCase() === albumTitle.trim().toLowerCase()
                );
                if (matched) {
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Connects to existing album <strong>{matched.title}</strong> by {matched.artistName} ({matched.songIds?.length || 0} tracks) — appears on Albums page
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        New album — will automatically create <strong>{albumTitle.trim()}</strong> and publish to Albums page
                      </span>
                    </div>
                  );
                }
              })() : (
                <p className="text-[11px] text-neutral-500 mt-1">
                  Leave empty to treat as a Single (standalone track — no album created).
                </p>
              )}

              {/* Quick Suggestions for existing albums */}
              {existingAlbums.length > 0 && !albumTitle.trim() && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Existing:</span>
                  {existingAlbums
                    .filter((a) => !artistName.trim() || a.artistName.toLowerCase() === artistName.trim().toLowerCase())
                    .concat(
                      existingAlbums.filter(
                        (a) => artistName.trim() && a.artistName.toLowerCase() !== artistName.trim().toLowerCase()
                      )
                    )
                    .slice(0, 6)
                    .map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setAlbumTitle(a.title);
                          if (a.artistName && !artistName.trim()) {
                            setArtistName(a.artistName);
                          }
                          if (a.genreId && genres.some((g) => g.id === a.genreId)) {
                            setGenreId(a.genreId);
                          }
                        }}
                        className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] transition-colors border border-white/5"
                      >
                        {a.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Genre, Release Date, Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Genre</label>
              <select
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              >
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Release Date</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>

            <div>
              <label className={labelClass}>Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SongStatus)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              >
                <option value="published">Published (Public)</option>
                <option value="draft">Save as Draft</option>
                <option value="private">Private (Admin only)</option>
              </select>
            </div>
          </div>

          {/* Cover Artwork */}
          <div>
            <label className={labelClass}>Cover Artwork URL</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[11px] text-neutral-600 mt-1">
                  {audioSourceMode === 'url' && urlPreview?.thumbnail
                    ? 'Pre-filled from source — you can replace this.'
                    : 'Paste any public image URL for the track artwork.'}
                </p>
              </div>
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-16 h-16 rounded-xl object-cover bg-neutral-800 shrink-0 border border-white/10"
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
              placeholder="Short description of the track..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Lyrics */}
          <div>
            <label className={labelClass}>Lyrics (Plain text or [00:15.00] LRC timestamp format)</label>
            <textarea
              rows={4}
              placeholder="[00:00.00] Intro&#10;[00:15.00] First lyric line..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className={`${inputClass} font-mono resize-none`}
            />
          </div>

          {/* Synth Preset (only relevant for file uploads without real audio) */}
          {audioSourceMode === 'file' && (
            <div>
              <label className={labelClass}>Demo Audio Preset (if no file uploaded)</label>
              <select
                value={synthPreset}
                onChange={(e) => setSynthPreset(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 transition-colors"
              >
                <option value="electronic">Electronic / Synthwave</option>
                <option value="lofi">Lo-Fi & Study</option>
                <option value="chill">Chill / Ambient</option>
                <option value="pop">Pop Dance</option>
                <option value="rnb">R&B Velvet</option>
                <option value="acoustic">Acoustic Guitar</option>
              </select>
            </div>
          )}

          {/* Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="synthwave, chill, 2025"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Copyright Owner / Label</label>
              <input
                type="text"
                placeholder="Artist Name / Sonora Records"
                value={copyrightOwner}
                onChange={(e) => setCopyrightOwner(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={explicit}
                onChange={(e) => setExplicit(e.target.checked)}
                className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
              />
              Explicit Content (mark [E])
            </label>
            <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
              />
              Feature on Homepage
            </label>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            ACTION BUTTONS
        ═══════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className="px-5 py-3 rounded-full border border-white/10 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-xl shadow-amber-500/25 disabled:opacity-40 flex items-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
              ) : (
                'Publish Track'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

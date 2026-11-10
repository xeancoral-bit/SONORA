import React from 'react';

/**
 * Checks whether an image URL is an empty/placeholder image or Deezer disc icon.
 */
export function isPlaceholderOrBroken(url?: string): boolean {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  return (
    url.includes('d41d8cd98f00b204e9800998ecf8427e') || // Deezer blank MD5 placeholder
    url.includes('b315ca94d75039eaee4d5098ffb4e7ce') || // Missing Deezer cover hash
    url.includes('59f19ef7639537f71120468962fa9c90') || // Expired Deezer hash
    url.includes('bead7fcad96c8d76d49466e13b86068e') || // Expired Deezer hash
    url.includes('bca0b297ea4b9711674db89bb3336be0') || // Deezer artist silhouette hash
    url.includes('485b03517852f5201c1074e532b2f703') || // Deezer artist silhouette hash
    url.includes('1e73998a4422e6b772591eeb00e622b7') || // Deezer artist silhouette hash
    url.includes('e0e0e40589c98cb9cf99b6222ccc955a') || // Deezer artist silhouette hash
    url.includes('ee29e36f8674af9fc2043abbeaa9cd9a') || // Deezer artist silhouette hash
    url.includes('431a80c0ed495e0729cd03593222d4d7') || // Deezer artist silhouette hash
    url.includes('f19f18aeebc7606cb874ebf464d1fcf5') || // Deezer artist silhouette hash (Blink-182)
    url.includes('/artist//') ||                         // Missing artist hash
    url.includes('dicebear.com')                          // Generic cartoon avatar
  );
}

/**
 * Returns the best artist avatar URL:
 * - If the provided URL is good and not placeholder, returns it as-is.
 * - Otherwise routes to /api/media/cover?artist=...&type=artist
 */
export function getOptimizedArtistAvatar(avatar?: string, artistName?: string): string {
  if (avatar && !isPlaceholderOrBroken(avatar)) {
    return avatar;
  }
  const name = (artistName || '').trim();
  if (name) {
    return `/api/media/cover?artist=${encodeURIComponent(name)}&type=artist`;
  }
  return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80';
}

/**
 * Event handler for artist avatar onError fallback.
 */
export function handleArtistAvatarError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  artistName?: string
) {
  const target = e.currentTarget;
  const fallbackUrl = `/api/media/cover?artist=${encodeURIComponent(artistName || '')}&type=artist`;
  if (!target.dataset.triedFallback && target.src !== fallbackUrl) {
    target.dataset.triedFallback = 'true';
    target.src = fallbackUrl;
  }
}

/**
 * Returns the best cover image URL:
 * - If the provided URL is good, returns it as-is.
 * - If broken or placeholder, routes to /api/media/cover for verified 1000x1000 studio artwork.
 */
export function getOptimizedCoverUrl(
  coverImage?: string,
  artistName?: string,
  title?: string,
  albumTitle?: string,
  type: 'song' | 'album' = 'song'
): string {
  if (!isPlaceholderOrBroken(coverImage)) {
    return coverImage!;
  }

  const queryArtist = (artistName || '').trim();
  const queryTitle = (title || albumTitle || '').trim();
  const queryAlbum = (albumTitle || '').trim();

  if (queryArtist || queryTitle) {
    return `/api/media/cover?artist=${encodeURIComponent(queryArtist)}&title=${encodeURIComponent(queryTitle)}&album=${encodeURIComponent(queryAlbum)}&type=${type}`;
  }

  return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
}

/**
 * Event handler for img onError fallback.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  artistName?: string,
  title?: string,
  albumTitle?: string,
  type: 'song' | 'album' = 'song'
) {
  const target = e.currentTarget;
  const fallbackUrl = `/api/media/cover?artist=${encodeURIComponent(artistName || '')}&title=${encodeURIComponent(title || albumTitle || '')}&album=${encodeURIComponent(albumTitle || '')}&type=${type}`;
  if (!target.dataset.triedFallback && target.src !== fallbackUrl) {
    target.dataset.triedFallback = 'true';
    target.src = fallbackUrl;
  }
}

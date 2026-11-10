import React from 'react';

const KNOWN_PLACEHOLDER_HASHES = new Set([
  'd41d8cd98f00b204e9800998ecf8427e', // Deezer blank MD5 placeholder
  'b315ca94d75039eaee4d5098ffb4e7ce', // Missing Deezer cover hash
  '59f19ef7639537f71120468962fa9c90', // Expired Deezer hash
  'bead7fcad96c8d76d49466e13b86068e', // Expired Deezer hash
  'bca0b297ea4b9711674db89bb3336be0', // Deezer artist silhouette hash
  '485b03517852f5201c1074e532b2f703', // Deezer artist silhouette hash
  '1e73998a4422e6b772591eeb00e622b7', // Deezer artist silhouette hash
  'e0e0e40589c98cb9cf99b6222ccc955a', // Deezer artist silhouette hash
  'ee29e36f8674af9fc2043abbeaa9cd9a', // Deezer artist silhouette hash
  '431a80c0ed495e0729cd03593222d4d7', // Deezer artist silhouette hash
  'f19f18aeebc7606cb874ebf464d1fcf5', // Deezer artist silhouette hash
  'cf50f58356a640ceb849206d28ca09e3',
  'a0134015dc3df43d2c8ea3521b29a24c',
  'ca355447192a0f7eaefbe6161947bcf5',
  '683dfad1f94dca954e389cb433c2aae6',
  'cf593126f5ec090fa8b7ee3eb4620f4c',
  '47108990b764b8bb22d2b4eead2e76f6',
  '93c66ebcf3be0606fbf422a578ee1fd3',
  '68e5d36e2f69e6b541334c2bb8c09194',
  '33e66487e6822295690b21235b273ce9',
  '8172c72b1d3d6832db74a5fe0425a176',
  '80c62ba193fe78d6541f534346eb02ba',
  'b28d6aa9670f443bce09f6e520023ee0',
  '4249a2a9263a2336329c2ef93ffc640d',
  '6c6c58eebebe0288ebf2dddf1b3ce9ba',
  '410cf59ce0c91ba4208a531e21b069d2',
  '8f8e0294a5327a3c3e53612845c48b26',
  'a5a8a1fa9db0fa3aeb96e00185077271',
  '4243a85cae1a967c3b9b4ef3b29c11f7',
  '1c2a392b8d4e9a1ff0910f01ce4e229e',
  'f017cf70fa4cfdf3bb64aa7eecf61ba3',
  'a8df9e87ac256b46c602078696b9efab',
  '0cb3a0d54022a16d84bb2e8736d85973',
  '4d0a1b64cf6eb001ab9fa3f3b9247c7c',
  '8553d100d897f26c71f6ce6eef5a0db8',
  '5f51d8d1723f03b603fc6dcf906ad3ec',
  '06f7ef0e816a1b21c4355ecb5fa4bceb',
  'dd5a7a7267104b2a8f895cfa32e8d47b',
  'eb32e1aa1b6ea32f144d18728d8fe017',
  '20aa2cebc962fca6eb4bb8e3ae1394c5',
  '914446c6b4122d4f268b3dc66f91ecaa',
  'eb0b0d3e58315ea0e7d5d0458aa6a7e0',
  '060205d9cfa3410fe3f4f14ba6cfcb5a',
  'dfaece8659d6e5c54807204f1a0e4c6c',
  'ca853c8db41f05781a742a03e1eebce0',
  '23be4cf8f2b7f5256e2eb98b79b9a674',
  'a1f5927dca9069d58be16e102f9c5fc9',
  '1e263c9b7e738ff8ddce74d3fa7bfb34',
  '77b8b2fc60f6db9bf08bc277341ea222',
  '95a7ecb98b0f1df7ef9a5c68b6ff9a3e',
  'fec4f18dbda94c92a95c9a96e6ca0eb6',
  '5b47a974b77f8fc6ea7b2f447a1ec5ce',
  '6b3df58c679fb49ba4e24eb29ef4f89d',
  '3bb0fa44ff74a4cf0bdf059c2b9a7c66',
  'c176e5d26392652b35b6fa7585be7fa2',
  'b6f5d7ce87d7b2e88a087a329d8926d2'
]);

/**
 * Checks whether an image URL is an empty/placeholder image or Deezer disc icon.
 */
export function isPlaceholderOrBroken(url?: string): boolean {
  if (!url || typeof url !== 'string' || !url.trim()) return true;
  if (url.includes('/artist//') || url.includes('dicebear.com')) return true;
  const match = url.match(/\/([a-f0-9]{32})\//);
  if (match && KNOWN_PLACEHOLDER_HASHES.has(match[1])) return true;
  return false;
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

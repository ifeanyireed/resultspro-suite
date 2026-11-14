export const CDN_BASE_URL = (process.env.NEXT_PUBLIC_CDN_URL || '').replace(/\/+$/, '');

// Unique version key to manage browser and CDN cache invalidation deterministically
const ASSET_VERSION_KEY = process.env.NEXT_PUBLIC_BUILD_VERSION || '2.1.1_v1';

export const CHARACTER_AVATARS_CDN = Array.from(
  { length: 20 },
  (_, i) => getCdnUrl(`/images/character${i + 1}.jpg`)
);

export function getCharacterAvatarUrl(avatarPath?: string, index: number = 1): string {
  if (!avatarPath) return getCdnUrl('/images/character1.jpg');

  const match = avatarPath.match(/character(\d+)/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 20) {
      return getCdnUrl(`/images/character${num}.jpg`);
    }
  }

  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  const idx = ((Math.max(1, index) - 1) % 20) + 1;
  return getCdnUrl(`/images/character${idx}.jpg`);
}

/**
 * Returns full URL for an asset, appending CDN_BASE_URL (or local public path if CDN is not configured),
 * including a cache-busting query parameter to force browser & CDN cache refresh.
 */
export function getCdnUrl(assetPath: string, cacheBust: boolean = true): string {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    const queryJoin = assetPath.includes('?') ? '&' : '?';
    return cacheBust ? `${assetPath}${queryJoin}v=${ASSET_VERSION_KEY}` : assetPath;
  }
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  const query = cacheBust ? `?v=${ASSET_VERSION_KEY}` : '';

  // Route through external Cloudinary CDN whenever configured
  if (CDN_BASE_URL) {
    return `${CDN_BASE_URL}${encodeURI(cleanPath)}${query}`;
  }

  // Fallback to local server /public directory when CDN_BASE_URL is not provided
  return `${cleanPath}${query}`;
}

/**
 * Preloads image in browser memory for smooth instant level transitions
 */
export function preloadNextLevelImage(adventureId: number, nextLevelNumber: number, worldId: number = 1): void {
  if (typeof window === 'undefined') return;
  const nextLevelPath = getCdnUrl(`/${worldId}_${adventureId}_${nextLevelNumber}.svg`);
  
  // 1. Browser Image Object Preload
  const img = new window.Image();
  img.src = nextLevelPath;

  // 2. Link Preload Tag Insertion
  const existingLink = document.querySelector(`link[rel="preload"][href="${nextLevelPath}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = nextLevelPath;
    document.head.appendChild(link);
  }
}

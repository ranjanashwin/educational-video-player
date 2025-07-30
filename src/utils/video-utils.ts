/**
 * Video utility functions for parsing and handling different video platforms
 */

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com\/(\d+)/.test(url);
}

export function extractVimeoVideoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function getVideoPlatform(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (isYouTubeUrl(url)) return 'youtube';
  if (isVimeoUrl(url)) return 'vimeo';
  return 'direct';
} 
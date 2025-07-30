/**
 * Video Utilities for Educational Video Player Assessment
 * Handles video URL parsing, thumbnail generation, and platform detection
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

export interface VideoPlatform {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  videoId?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Parse video URL to extract platform and video ID
 */
export function parseVideoUrl(url: string): VideoPlatform {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      let videoId = '';
      
      if (hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v') || '';
      }
      
      if (videoId) {
        return {
          type: 'youtube',
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        };
      }
    }
    
    // Vimeo
    if (hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.slice(1);
      if (videoId && !isNaN(Number(videoId))) {
        return {
          type: 'vimeo',
          videoId,
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`
        };
      }
    }
    
    // Direct video files
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const hasVideoExtension = videoExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    
    if (hasVideoExtension) {
              return {
          type: 'direct',
          videoId: urlObj.pathname,
          embedUrl: undefined,
          thumbnailUrl: undefined
        };
    }
    
          return {
        type: 'unknown',
        videoId: undefined,
        embedUrl: undefined,
        thumbnailUrl: undefined
      };
    } catch {
      return {
        type: 'unknown',
        videoId: undefined,
        embedUrl: undefined,
        thumbnailUrl: undefined
      };
  }
}

/**
 * Generate thumbnail from HTML5 video file by capturing a frame
 */
export function generateVideoThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Only for direct video files
    const platform = parseVideoUrl(videoUrl);
    if (platform.type !== 'direct') {
      reject(new Error('Not a direct video file'));
      return;
    }

    // Check if the URL is from an external domain that might have CORS issues
    try {
      const urlObj = new URL(videoUrl);
      const isExternalDomain = urlObj.hostname !== window.location.hostname && 
                              !urlObj.hostname.includes('localhost') && 
                              !urlObj.hostname.includes('127.0.0.1');
      
      if (isExternalDomain) {
        // For external domains, we'll use a placeholder instead of trying to generate thumbnail
        // This avoids CORS issues
        const placeholderSvg = `
          <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="250" fill="#f3f4f6"/>
            <rect x="150" y="100" width="100" height="50" fill="#d1d5db" rx="4"/>
            <text x="200" y="130" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">
              Video
            </text>
          </svg>
        `;
        resolve(`data:image/svg+xml;base64,${btoa(placeholderSvg)}`);
        return;
      }
    } catch (error) {
      // If URL parsing fails, treat as external
      const placeholderSvg = `
        <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#f3f4f6"/>
          <rect x="150" y="100" width="100" height="50" fill="#d1d5db" rx="4"/>
          <text x="200" y="130" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">
            Video
          </text>
        </svg>
      `;
      resolve(`data:image/svg+xml;base64,${btoa(placeholderSvg)}`);
      return;
    }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      try {
        // Seek to 1 second or 10% of duration, whichever is smaller
        const seekTime = Math.min(1, video.duration * 0.1);
        video.currentTime = seekTime;
      } catch (error) {
        // If seeking fails, try at 0 seconds
        video.currentTime = 0;
      }
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas size to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        video.pause();
        video.src = '';
        video.load();
        
        resolve(thumbnailUrl);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      // Provide a fallback placeholder instead of rejecting
      const placeholderSvg = `
        <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#f3f4f6"/>
          <rect x="150" y="100" width="100" height="50" fill="#d1d5db" rx="4"/>
          <text x="200" y="130" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">
            Video
          </text>
        </svg>
      `;
      resolve(`data:image/svg+xml;base64,${btoa(placeholderSvg)}`);
    };

    video.src = videoUrl;
  });
}

/**
 * Get video thumbnail from video URL
 */
export function getVideoThumbnail(videoUrl: string): string {
  const platform = parseVideoUrl(videoUrl);
  
  // Return platform-specific thumbnail if available
  if (platform.thumbnailUrl) {
    return platform.thumbnailUrl;
  }
  
  // For direct video files, we'll use a placeholder initially
  // The actual thumbnail will be generated when the component loads
  if (platform.type === 'direct') {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="250" fill="#f3f4f6"/>
        <text x="200" y="125" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
          Loading thumbnail...
        </text>
      </svg>
    `)}`;
  }
  
  // Fallback to data URL with loading message
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" fill="#f3f4f6"/>
      <text x="200" y="125" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
        No thumbnail available
      </text>
    </svg>
  `)}`;
}

/**
 * Get embed URL for video platforms
 */
export function getVideoEmbedUrl(videoUrl: string): string | null {
  const platform = parseVideoUrl(videoUrl);
  return platform.embedUrl || null;
}

/**
 * Check if video URL is from an embeddable platform
 */
export function isEmbeddablePlatform(videoUrl: string): boolean {
  const platform = parseVideoUrl(videoUrl);
  return platform.type === 'youtube' || platform.type === 'vimeo';
}

/**
 * Get video duration in a readable format
 */
export function formatVideoDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extract duration from YouTube URL or estimate based on video type
 * This is a fallback since we can't get actual duration without API calls
 */
export function getVideoDuration(videoUrl: string, apiDuration?: string): string | null {
  // If API provides duration, use it
  if (apiDuration) {
    return formatDuration(apiDuration);
  }
  
  // Try to extract from URL parameters (YouTube sometimes has duration)
  try {
    const url = new URL(videoUrl);
    const durationParam = url.searchParams.get('t'); // YouTube time parameter
    if (durationParam) {
      const seconds = parseInt(durationParam);
      if (!isNaN(seconds)) {
        return formatVideoDuration(seconds);
      }
    }
  } catch {
    // URL parsing failed
  }
  
  // No duration available
  return null;
}

/**
 * Format duration string to MM:SS or HH:MM:SS
 */
function formatDuration(duration: string): string {
  if (!duration) return '10:00';
  
  // If duration is already in MM:SS format, return as is
  if (duration.match(/^\d{1,2}:\d{2}$/)) {
    return duration;
  }
  
  // If duration is in HH:MM:SS format, return as is
  if (duration.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
    return duration;
  }
  
  // If duration is in seconds, convert to MM:SS
  const seconds = parseInt(duration);
  if (!isNaN(seconds)) {
    return formatVideoDuration(seconds);
  }
  
  return duration;
}

/**
 * Validate video URL format
 */
export function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return true;
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      return true;
    }
    
    // Direct video file
    if (urlObj.pathname.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
} 
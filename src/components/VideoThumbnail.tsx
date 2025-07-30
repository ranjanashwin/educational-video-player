import { useState, useEffect } from 'react';
import { getVideoThumbnail, generateVideoThumbnail, parseVideoUrl } from '@/lib/video-utils';

/**
 * Available thumbnail sizes
 */
type ThumbnailSize = 'small' | 'medium' | 'large';

/**
 * Props for the VideoThumbnail component
 */
interface VideoThumbnailProps {
  /** Video URL to generate thumbnail from */
  videoUrl: string;
  /** Title for alt text */
  title: string;
  /** Additional CSS classes */
  className?: string;
  /** Thumbnail size variant */
  size?: ThumbnailSize;
}

/**
 * VideoThumbnail Component
 * 
 * Generates and displays video thumbnails with loading states.
 * Supports different sizes and handles various video platforms.
 * 
 * @param videoUrl - Video URL to generate thumbnail from
 * @param title - Title for alt text
 * @param className - Additional CSS classes
 * @param size - Thumbnail size variant
 */
export function VideoThumbnail({ videoUrl, title, className = '', size = 'medium' }: VideoThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  // Generate or get thumbnail based on video platform
  useEffect(() => {
    const platform = parseVideoUrl(videoUrl);
    
    if (platform.type === 'direct') {
      // For direct video files, generate thumbnail from video
      setIsGeneratingThumbnail(true);
      generateVideoThumbnail(videoUrl)
        .then((generatedThumbnail) => {
          setThumbnailUrl(generatedThumbnail);
        })
        .catch((error) => {
          console.error('Failed to generate thumbnail:', error);
          // Use a fallback placeholder instead of empty string
          const fallbackSvg = `
            <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="250" fill="#f3f4f6"/>
              <rect x="150" y="100" width="100" height="50" fill="#d1d5db" rx="4"/>
              <text x="200" y="130" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">
                Video
              </text>
            </svg>
          `;
          setThumbnailUrl(`data:image/svg+xml;base64,${btoa(fallbackSvg)}`);
        })
        .finally(() => {
          setIsGeneratingThumbnail(false);
        });
    } else {
      // For YouTube/Vimeo, use platform-specific thumbnail
      setThumbnailUrl(getVideoThumbnail(videoUrl));
    }
  }, [videoUrl]);

  // Size configuration for different contexts
  const sizeClasses = {
    small: 'w-12 h-8',      // Table view
    medium: 'w-32 h-20',    // List view
    large: 'w-full aspect-video' // Grid view
  };

  const spinnerSizes = {
    small: 'w-3 h-3',       // Tiny spinner for table
    medium: 'w-4 h-4',      // Small spinner for list
    large: 'w-8 h-8'        // Large spinner for grid
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative ${className}`}>
      {(isGeneratingThumbnail || !thumbnailUrl) ? (
        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className={`animate-spin ${spinnerSizes[size]} border-2 border-gray-200 border-t-gray-500 rounded-full mx-auto ${size === 'large' ? 'mb-3' : 'mb-1'}`}></div>
            <p className={`${textSizes[size]} text-gray-500 ${size === 'large' ? 'mt-1' : ''}`}>
              {size === 'large' ? 'Fetching thumbnail...' : 'Loading...'}
            </p>
          </div>
        </div>
      ) : (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Replace with a fallback placeholder instead of hiding
            const fallbackSvg = `
              <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="250" fill="#f3f4f6"/>
                <rect x="150" y="100" width="100" height="50" fill="#d1d5db" rx="4"/>
                <text x="200" y="130" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">
                  Video
                </text>
              </svg>
            `;
            target.src = `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
          }}
        />
      )}
    </div>
  );
} 
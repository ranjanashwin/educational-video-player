import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
}

export function YouTubePlayer({ 
  videoId, 
  title,
  width = '100%', 
  height = 'auto',
  autoPlay = true
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  // YouTube embed URL with parameters to hide UI elements
  const getYouTubeEmbedUrl = (id: string) => {
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      mute: autoPlay ? '1' : '0', // YouTube requires mute for autoplay
      controls: '1', // Show native YouTube controls
      rel: '0', // Don't show related videos
      showinfo: '0', // Hide video title and uploader info
      iv_load_policy: '3', // Hide video annotations
      modestbranding: '1', // Hide YouTube logo
      fs: '1', // Allow fullscreen
      disablekb: '0', // Enable keyboard controls
      cc_load_policy: '0', // Disable closed captions by default
      color: 'white', // White progress bar
      playsinline: '1', // Play inline on mobile
    });

    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  };

  const handleError = () => {
    setError('Failed to load YouTube video');
  };

  const handleLoad = () => {
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    if (playerRef.current) {
      playerRef.current.src = getYouTubeEmbedUrl(videoId);
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src = getYouTubeEmbedUrl(videoId);
    }
  }, [videoId, autoPlay]);

  if (error) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Video Not Available</p>
          <p className="text-sm text-gray-400">This YouTube video cannot be played</p>
          <Button 
            onClick={handleRetry} 
            className="mt-4 bg-white text-black hover:bg-gray-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="aspect-video bg-black rounded-xl overflow-hidden"
      style={{ width, height }}
    >
      <iframe
        ref={playerRef}
        src={getYouTubeEmbedUrl(videoId)}
        title={title || `YouTube video ${videoId}`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
} 
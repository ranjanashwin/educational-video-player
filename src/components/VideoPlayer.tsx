import ReactPlayer from 'react-player';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { VideoPlayerControls } from '@/components/VideoPlayerControls';

/**
 * Props for the VideoPlayer component
 */
interface VideoPlayerProps {
  /** Video URL to play */
  url: string;
  /** Video title for accessibility */
  title: string;
  /** Light mode for ReactPlayer */
  light?: boolean | string;
  /** Player width */
  width?: string | number;
  /** Player height */
  height?: string | number;
}

/**
 * VideoPlayer Component
 * 
 * A custom video player component that wraps ReactPlayer with enhanced controls.
 * Features include keyboard shortcuts, custom controls, and responsive design.
 * 
 * @param url - Video URL to play
 * @param title - Video title for accessibility
 * @param light - Light mode for ReactPlayer
 * @param width - Player width
 * @param height - Player height
 */
export function VideoPlayer({ 
  url, 
  light = false, 
  width = '100%', 
  height = 'auto' 
}: VideoPlayerProps) {
  const { state, handlers, playerRef } = useVideoPlayer();

  // Error state
  if (state.error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-gray-300 mb-4">{state.error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700"
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
      className="aspect-video bg-black rounded-xl overflow-hidden relative group video-player-container"
      onMouseMove={() => handlers.handleVideoClick()}
      onClick={handlers.handleVideoClick}
      style={{ width, height }}
    >
      {/* ReactPlayer */}
      <ReactPlayer
        ref={playerRef}
        src={url}
        playing={state.playing}
        volume={state.muted ? 0 : state.volume}
        playbackRate={state.playbackRate}
        width="100%"
        height="100%"
        controls={false}
        light={light}
        onPlay={() => handlers.handlePlayPause()}
        onPause={() => handlers.handlePlayPause()}
        onError={handlers.handleError}
        onProgress={handlers.handleProgress}
        onReady={handlers.handleLoad}
        onLoad={handlers.handleLoad}
      />

      {/* Loading Indicator */}
      {state.loading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Buffering Indicator */}
      {state.buffering && !state.loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <VideoPlayerControls
        playing={state.playing}
        volume={state.volume}
        muted={state.muted}
        played={state.played}
        duration={state.duration}
        playbackRate={state.playbackRate}
        showControls={state.showControls}
        onPlayPause={handlers.handlePlayPause}
        onVolumeChange={handlers.handleVolumeChange}
        onMuteToggle={handlers.handleMuteToggle}
        onFullscreenToggle={handlers.handleFullscreenToggle}
        onSeek={handlers.handleSeek}
        onPlaybackRateChange={handlers.handlePlaybackRateChange}
      />
    </div>
  );
}
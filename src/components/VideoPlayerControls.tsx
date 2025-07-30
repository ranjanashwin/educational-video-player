import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Props for the VideoPlayerControls component
 */
interface VideoPlayerControlsProps {
  /** Whether the video is currently playing */
  playing: boolean;
  /** Current volume level (0-1) */
  volume: number;
  /** Whether the video is muted */
  muted: boolean;
  /** Current playback progress (0-1) */
  played: number;
  /** Total video duration in seconds */
  duration: number;
  /** Current playback rate */
  playbackRate: number;
  /** Whether controls should be visible */
  showControls: boolean;
  /** Callback for play/pause toggle */
  onPlayPause: () => void;
  /** Callback for volume change */
  onVolumeChange: (value: number[]) => void;
  /** Callback for mute toggle */
  onMuteToggle: () => void;
  /** Callback for fullscreen toggle */
  onFullscreenToggle: () => void;
  /** Callback for seeking */
  onSeek: (value: number[]) => void;
  /** Callback for playback rate change */
  onPlaybackRateChange: (rate: string) => void;
}

/**
 * VideoPlayerControls Component
 * 
 * Displays video player controls including play/pause, volume, progress,
 * playback rate, and fullscreen controls.
 */
export function VideoPlayerControls({
  playing,
  volume,
  muted,
  played,
  duration,
  playbackRate,
  showControls,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onSeek,
  onPlaybackRateChange
}: VideoPlayerControlsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showControls) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 md:p-4">
      {/* Progress Bar */}
      <div className="mb-2 sm:mb-3 md:mb-4">
        <Slider
          value={[played]}
          onValueChange={onSeek}
          max={1}
          step={0.01}
          className="w-full [&_.slider-track]:bg-gray-600 [&_.slider-range]:bg-white [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-white [&_.slider-thumb]:shadow-lg"
        />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        {/* Left Side - Play/Pause, Volume */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <Button
            onClick={onPlayPause}
            size="sm"
            variant="ghost"
            className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200 p-1.5 sm:p-2"
          >
            {playing ? <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
          </Button>

          {/* Volume Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              onClick={onMuteToggle}
              size="sm"
              variant="ghost"
              className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200 p-1.5 sm:p-2"
            >
              {muted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
            </Button>
            <div className="w-12 sm:w-16 md:w-20" onClick={(e) => e.stopPropagation()}>
              <Slider
                value={[muted ? 0 : volume]}
                onValueChange={onVolumeChange}
                max={1}
                step={0.1}
                className="w-full [&_.slider-track]:bg-gray-600 [&_.slider-range]:bg-white [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-white [&_.slider-thumb]:shadow-lg"
              />
            </div>
          </div>

          {/* Time Display */}
          <span className="text-white text-xs sm:text-sm font-medium bg-black/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:block">
            {formatTime(played * duration)} / {formatTime(duration)}
          </span>
        </div>

        {/* Right Side - Playback Rate, Fullscreen */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {/* Playback Rate Selector */}
          <Select value={playbackRate.toString()} onValueChange={onPlaybackRateChange}>
            <SelectTrigger className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 bg-black/80 border-white/30 text-white text-xs font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/30">
              <SelectItem value="0.75" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">0.75x</SelectItem>
              <SelectItem value="1" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1x</SelectItem>
              <SelectItem value="1.25" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1.25x</SelectItem>
              <SelectItem value="1.5" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1.5x</SelectItem>
              <SelectItem value="2" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">2x</SelectItem>
            </SelectContent>
          </Select>

          {/* Fullscreen Button */}
          <Button
            onClick={onFullscreenToggle}
            size="sm"
            variant="ghost"
            className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200 p-1.5 sm:p-2"
          >
            <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
} 
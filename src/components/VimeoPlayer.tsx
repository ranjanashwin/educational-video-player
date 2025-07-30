import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VimeoPlayerProps {
  videoId: string;
  title: string;
  width?: string | number;
  height?: string | number;
}

export function VimeoPlayer({ 
  videoId, 
  title, 
  width = '100%', 
  height = 'auto' 
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Vimeo Player API
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    // Load Vimeo Player API
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    script.onload = () => {
      if (iframeRef.current && (window as any).Vimeo) {
        const vimeoPlayer = new (window as any).Vimeo.Player(iframeRef.current);
        setPlayer(vimeoPlayer);
        
        // Set up event listeners
        vimeoPlayer.on('loaded', () => {
          setLoading(false);
          setShowControls(true);
          
          // Set initial volume
          vimeoPlayer.setVolume(volume);
          
          // Auto-hide controls after 3 seconds
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        });

        vimeoPlayer.on('play', () => {
          setPlaying(true);
          setShowControls(true);
        });

        vimeoPlayer.on('pause', () => {
          setPlaying(false);
          setShowControls(true);
        });

        vimeoPlayer.on('timeupdate', (data: any) => {
          if (data && data.percent) {
            setPlayed(data.percent);
          }
        });

        vimeoPlayer.on('error', (error: any) => {
          console.error('Vimeo player error:', error);
          setError('Failed to load Vimeo video');
          setLoading(false);
        });

        // Get duration when video loads
        vimeoPlayer.getDuration().then((duration: number) => {
          console.log('Vimeo duration detected:', duration);
          if (duration && duration > 0) {
            setDuration(duration);
          }
        }).catch((error: any) => {
          console.error('Error getting Vimeo duration:', error);
        });

        // Set initial volume
        vimeoPlayer.setVolume(volume);
      }
    };
    script.onerror = () => {
      setError('Failed to load Vimeo player');
      setLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [volume]);

  const handlePlayPause = () => {
    if (player) {
      if (playing) {
        player.pause();
      } else {
        player.play();
      }
      setShowControls(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (player) {
      if (muted) {
        player.setVolume(volume);
        setMuted(false);
      } else {
        player.setVolume(0);
        setMuted(true);
      }
      setShowControls(true);
    }
  };

  const handleFullscreenToggle = () => {
    if (player) {
      player.requestFullscreen();
    }
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFullscreenToggle();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFullscreenToggle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (player) {
          player.getCurrentTime().then((currentTime: number) => {
            player.getDuration().then((duration: number) => {
              player.setCurrentTime(Math.min(currentTime + 10, duration));
            });
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (player) {
          player.getCurrentTime().then((currentTime: number) => {
            player.setCurrentTime(Math.max(currentTime - 10, 0));
          });
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [player]);

  const handleVideoClick = () => {
    handlePlayPause();
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Set new timeout to hide controls after 3 seconds
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleSeek = useCallback((value: number[]) => {
    const seekTo = value[0];
    setPlayed(seekTo);
    if (player && player.setCurrentTime) {
      try {
        const seekTime = seekTo * duration;
        player.setCurrentTime(seekTime);
      } catch (error) {
        console.log('Vimeo seek error:', error);
      }
    }
  }, [player, duration]);

  const handlePlaybackRateChange = (rate: string) => {
    const newRate = parseFloat(rate);
    setPlaybackRate(newRate);
    if (player) {
      player.setPlaybackRate(newRate);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Vimeo Video Not Available</p>
          <p className="text-sm text-gray-400">This Vimeo video cannot be played</p>
          <Button 
            onClick={() => setError(null)} 
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
      className="aspect-video bg-black rounded-xl overflow-hidden relative group video-player-container"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
      style={{ width, height }}
    >
      <iframe
        ref={iframeRef}
        src={`https://player.vimeo.com/video/${videoId}?h=auto&autoplay=1&muted=1&controls=0&transparent=0&dnt=1&app_id=122963`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        className="w-full h-full"
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading Vimeo video...</p>
          </div>
        </div>
      )}

      {/* Custom Controls Overlay */}
      {showControls && !loading && (
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-auto"
          onMouseMove={() => setShowControls(true)}
        >


          {/* Center Play Button - Show when paused */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <div
                onClick={handlePlayPause}
                className="bg-black/80 hover:bg-white/20 text-white border-2 border-white/40 rounded-full w-20 h-20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              >
                <Play className="h-10 w-10 text-white fill-white" />
              </div>
            </div>
          )}



          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <div className="space-y-2">
              {/* Progress Bar */}
              <div onClick={(e) => e.stopPropagation()}>
                <Slider
                  value={[played]}
                  onValueChange={handleSeek}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
              
              {/* Bottom Row Controls */}
              <div className="flex items-center justify-between">
                {/* Left Side - Play/Pause, Volume */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause();
                    }}
                    size="sm"
                    variant="ghost"
                    className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200"
                  >
                    {playing ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                  </Button>
                  <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle();
                      }}
                      size="sm"
                      variant="ghost"
                      className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200"
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="w-20" onClick={(e) => e.stopPropagation()}>
                      <Slider
                        value={[muted ? 0 : volume]}
                        onValueChange={handleVolumeChange}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Speed Control and Fullscreen */}
                <div className="flex items-center space-x-2">
                  <Select 
                    value={playbackRate.toString()} 
                    onValueChange={(value) => {
                      handlePlaybackRateChange(value);
                    }}
                  >
                    <SelectTrigger className="w-16 h-7 bg-black/80 border-white/30 text-white text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/30">
                      <SelectItem value="0.75" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">0.75x</SelectItem>
                      <SelectItem value="1" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1x</SelectItem>
                      <SelectItem value="1.25" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1.25x</SelectItem>
                      <SelectItem value="1.5" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">1.5x</SelectItem>
                      <SelectItem value="2" className="text-white hover:bg-white hover:text-black data-[state=checked]:bg-black data-[state=checked]:text-white font-bold data-[state=unchecked]:text-white">2x</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleFullscreenClick}
                    size="sm"
                    variant="ghost"
                    className="bg-black/50 hover:bg-white/30 text-white border border-white/20 transition-colors duration-200"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
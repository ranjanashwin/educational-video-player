import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Video player state interface
 */
interface VideoPlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  duration: number;
  showControls: boolean;
  error: string | null;
  playbackRate: number;
  loading: boolean;
  buffering: boolean;
}

/**
 * Video player actions interface
 */
interface VideoPlayerActions {
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlayed: (played: number) => void;
  setDuration: (duration: number) => void;
  setShowControls: (show: boolean) => void;
  setError: (error: string | null) => void;
  setPlaybackRate: (rate: number) => void;
  setLoading: (loading: boolean) => void;
  setBuffering: (buffering: boolean) => void;
}

/**
 * Video player handlers interface
 */
interface VideoPlayerHandlers {
  handlePlayPause: () => void;
  handleVolumeChange: (value: number[]) => void;
  handleMuteToggle: () => void;
  handleFullscreenToggle: () => void;
  handleSeek: (value: number[]) => void;
  handlePlaybackRateChange: (rate: string) => void;
  handleVideoClick: () => void;
  handleProgress: (state: any) => void;
  handleError: (error: any) => void;
  handleLoad: (data?: any) => void;
}

/**
 * Custom hook for video player state management
 * 
 * Manages all video player state and provides handlers for user interactions.
 * 
 * @returns Video player state, actions, and handlers
 */
export function useVideoPlayer() {
  // State
  const [state, setState] = useState<VideoPlayerState>({
    playing: false,
    volume: 0.8,
    muted: true,
    played: 0,
    duration: 0,
    showControls: true,
    error: null,
    playbackRate: 1,
    loading: true,
    buffering: false
  });

  // Refs
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Actions
  const actions: VideoPlayerActions = {
    setPlaying: (playing) => setState(prev => ({ ...prev, playing })),
    setVolume: (volume) => setState(prev => ({ ...prev, volume })),
    setMuted: (muted) => setState(prev => ({ ...prev, muted })),
    setPlayed: (played) => setState(prev => ({ ...prev, played })),
    setDuration: (duration) => setState(prev => ({ ...prev, duration })),
    setShowControls: (showControls) => setState(prev => ({ ...prev, showControls })),
    setError: (error) => setState(prev => ({ ...prev, error })),
    setPlaybackRate: (playbackRate) => setState(prev => ({ ...prev, playbackRate })),
    setLoading: (loading) => setState(prev => ({ ...prev, loading })),
    setBuffering: (buffering) => setState(prev => ({ ...prev, buffering }))
  };

  // Handlers
  const handlers: VideoPlayerHandlers = {
    handlePlayPause: useCallback(() => {
      actions.setPlaying(!state.playing);
      actions.setShowControls(true);
    }, [state.playing, actions]),

    handleVolumeChange: useCallback((value: number[]) => {
      const newVolume = value[0];
      actions.setVolume(newVolume);
      if (newVolume === 0) {
        actions.setMuted(true);
      } else if (state.muted) {
        actions.setMuted(false);
      }
    }, [state.muted, actions]),

    handleMuteToggle: useCallback(() => {
      actions.setMuted(!state.muted);
      actions.setShowControls(true);
    }, [state.muted, actions]),

    handleFullscreenToggle: useCallback(() => {
      const container = document.querySelector('.video-player-container');
      if (container) {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch((err: Error) => {
            console.error('Error attempting to enable fullscreen:', err);
          });
        } else {
          document.exitFullscreen().catch((err: Error) => {
            console.error('Error attempting to exit fullscreen:', err);
          });
        }
      }
    }, []),

    handleSeek: useCallback((value: number[]) => {
      const seekTo = value[0];
      actions.setPlayed(seekTo);
      if (playerRef.current && state.duration > 0) {
        try {
          const seekTime = seekTo * state.duration;
          playerRef.current.seekTo(seekTime, 'seconds');
        } catch (error) {
          console.log('Seek error:', error);
        }
      }
    }, [state.duration, actions]),

    handlePlaybackRateChange: useCallback((rate: string) => {
      const newRate = parseFloat(rate);
      actions.setPlaybackRate(newRate);
    }, [actions]),

    handleVideoClick: useCallback(() => {
      actions.setPlaying(!state.playing);
      actions.setShowControls(true);
      
      // Clear existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Set new timeout to hide controls after 3 seconds
      controlsTimeoutRef.current = setTimeout(() => {
        actions.setShowControls(false);
      }, 3000);
    }, [state.playing, actions]),

    handleProgress: useCallback((progressState: any) => {
      actions.setPlayed(progressState.played);
      
      // Update duration if available and valid
      if (progressState.duration && progressState.duration > 0 && !isNaN(progressState.duration)) {
        actions.setDuration(progressState.duration);
      }
      
      // Simple buffering detection
      if (progressState.loaded > 0 && progressState.played < 1) {
        const bufferThreshold = 0.1;
        if (progressState.loaded - progressState.played < bufferThreshold) {
          actions.setBuffering(true);
        } else {
          actions.setBuffering(false);
        }
      }
    }, [actions]),

    handleError: useCallback((error: any) => {
      console.error('Video player error:', error);
      actions.setError('Failed to load video');
      actions.setLoading(false);
      actions.setBuffering(false);
    }, [actions]),

    handleLoad: useCallback((data?: any) => {
      actions.setError(null);
      actions.setLoading(false);
      actions.setBuffering(false);
      actions.setShowControls(true);
      
      // If we have duration data from onReady, set it
      if (data && data.duration) {
        actions.setDuration(data.duration);
      }
      
      // Auto-hide controls after 3 seconds
      controlsTimeoutRef.current = setTimeout(() => {
        actions.setShowControls(false);
      }, 3000);
    }, [actions])
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when video player is focused or when no specific element is focused
      const target = e.target as Element;
      if (e.target !== document.body && !target?.closest('.video-player-container')) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handlers.handleFullscreenToggle();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (playerRef.current && state.duration > 0) {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            const newTime = Math.min(currentTime + 10, state.duration);
            playerRef.current.seekTo(newTime / state.duration);
          } catch (error) {
            console.log('Error seeking forward:', error);
          }
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (playerRef.current && state.duration > 0) {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            const newTime = Math.max(currentTime - 10, 0);
            playerRef.current.seekTo(newTime / state.duration);
          } catch (error) {
            console.log('Error seeking backward:', error);
          }
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        handlers.handlePlayPause();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state.duration, state.playing, handlers]);

  // Polling for duration from underlying video element
  useEffect(() => {
    if (!state.loading && playerRef.current) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          try {
            // Try to get duration from the underlying video element
            const videoElement = playerRef.current.getInternalPlayer();
            if (videoElement && videoElement.duration && videoElement.duration > 0) {
              actions.setDuration(videoElement.duration);
              clearInterval(interval);
            }
          } catch (error) {
            console.log('Error getting duration from video element:', error);
          }
        }
      }, 1000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [state.loading, actions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    actions,
    handlers,
    playerRef
  };
} 
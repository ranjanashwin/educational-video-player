import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { useVideosPaginated } from '@/hooks/use-api';
import { Video } from '@/types';

interface InfiniteVideoGridProps {
  userId?: string;
  pageSize?: number;
  className?: string;
  onVideoClick?: (video: Video) => void;
}

export function InfiniteVideoGrid({ 
  userId = 'ashwin_ranjan',
  pageSize = 12,
  className = '',
  onVideoClick
}: InfiniteVideoGridProps) {
  const {
    videos,
    loading,
    error,
    hasMore,
    loadNextPage,
    refresh
  } = useVideosPaginated(userId, 1, pageSize);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadNextPage();
      }
    });
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore, loadNextPage]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load videos
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message || 'Something went wrong while loading videos.'}
          </p>
          <Button
            onClick={refresh}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first educational video.
          </p>
          <Button
            onClick={() => window.location.href = '/videos/create'}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Add Your First Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        <AnimatePresence>
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut"
              }}
              className="group"
              onClick={() => onVideoClick?.(video)}
            >
              <VideoCard video={video} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center py-8"
        >
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more videos...</span>
          </div>
        </motion.div>
      )}

      {/* Intersection Observer Target */}
      {hasMore && (
        <div 
          ref={lastElementRef}
          className="h-4 w-full"
        />
      )}

      {/* End of Content */}
      {!hasMore && videos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span className="text-sm">You've reached the end</span>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 
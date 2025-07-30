import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideosPaginated } from '@/hooks/use-api';
import { VideoThumbnail } from '@/components/VideoThumbnail';
import { getVideoDuration } from '@/lib/video-utils';

interface VideoCarouselProps {
  maxVideos?: number;
  autoPlayInterval?: number;
}

export function VideoCarousel({ maxVideos = 6, autoPlayInterval = 5000 }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying] = useState(true);
  
  const { videos, loading } = useVideosPaginated('ashwin_ranjan', 1, maxVideos);
  
  useEffect(() => {
    if (!isAutoPlaying || videos.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length, autoPlayInterval]);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading videos...</p>
        </div>
      </div>
    );
  }
  
  if (videos.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <Play className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No videos available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            <div className="aspect-video w-full">
              <VideoThumbnail
                videoUrl={videos[currentIndex]?.video_url || ''}
                title={videos[currentIndex]?.title || ''}
                size="large"
                className="w-full h-full"
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-2 line-clamp-1">
                    {videos[currentIndex]?.title}
                  </h3>
                  <p className="text-gray-200 text-sm line-clamp-2">
                    {videos[currentIndex]?.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getVideoDuration(videos[currentIndex]?.video_url, videos[currentIndex]?.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{videos[currentIndex]?.num_comments || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {videos.length > 1 && (
          <>
            <Button
              onClick={prevSlide}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={nextSlide}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      
      {videos.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gray-800 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {videos.slice(0, 6).map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              index === currentIndex 
                ? 'border-gray-800 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => goToSlide(index)}
          >
            <div className="aspect-video">
              <VideoThumbnail
                videoUrl={video.video_url}
                title={video.title}
                size="small"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
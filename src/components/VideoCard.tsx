import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from '@/types';
import { getVideoDuration } from '@/lib/video-utils';
import { VideoThumbnail } from '@/components/VideoThumbnail';

/**
 * Props for the VideoCard component
 */
interface VideoCardProps {
  /** Video data to display */
  video: Video;
  /** Index for staggered animation */
  index: number;
}

/**
 * Formats comment count for display
 * @param count - Number of comments
 * @returns Formatted string (e.g., "0", "5", "1.2K")
 */
const formatCommentCount = (count: number | undefined): string => {
  if (!count) return '0';
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
};

/**
 * VideoCard Component
 * 
 * Displays a video card with thumbnail, title, description, and metadata.
 * Features hover animations and responsive design.
 * 
 * @param video - Video data to display
 * @param index - Index for staggered animation
 */
export function VideoCard({ video, index }: VideoCardProps) {
  // Get dynamic duration from video URL and API data
  const duration = getVideoDuration(video.video_url, video.duration);
  const commentCount = formatCommentCount(video.num_comments);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group h-full w-full"
    >
      <Link to={`/videos/${video.id}`} className="block h-full w-full">
        <Card className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 rounded-xl h-full w-full flex flex-col">
          <div className="relative overflow-hidden">
            <div className="aspect-video w-full">
              <VideoThumbnail 
                videoUrl={video.video_url}
                title={video.title}
                size="large"
                className="w-full h-full"
              />
            </div>
            
            {/* Duration Badge - Only show if duration is available */}
            {duration && (
              <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                <span className="text-white text-xs font-medium">{duration}</span>
              </div>
            )}
            
            {/* Comments Count Overlay */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
              <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                <span className="text-white text-xs font-medium">{commentCount}</span>
              </div>
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 sm:p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/30">
                <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </div>
          
          <CardContent className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
              {video.title}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
              {video.description}
            </p>
            
            {/* Video Stats */}
            <div className="flex items-center justify-end text-xs text-gray-500 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{commentCount} comments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
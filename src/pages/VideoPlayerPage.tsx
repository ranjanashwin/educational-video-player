import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CommentSection } from '@/components/CommentSection';
import { VideoPlayerSkeleton } from '@/components/VideoPlayerSkeleton';
import { useVideo } from '@/hooks/use-api';
import { ApiError } from '@/types';
import { formatErrorMessage, AppError } from '@/lib/error-handler';
import { VideoPlayer } from '@/components/VideoPlayer';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { VimeoPlayer } from '@/components/VimeoPlayer';
import { extractYouTubeVideoId, isYouTubeUrl, isVimeoUrl, extractVimeoVideoId } from '@/utils/video-utils';
import { ErrorBoundary } from '@/components/ErrorBoundary';


// Helper function to convert ApiError to AppError
const convertApiErrorToAppError = (apiError: ApiError): AppError => {
  return new AppError(
    apiError.message,
    apiError.code,
    500, // Default status code
    true, // Default isOperational
    apiError.details
  );
};

export function VideoPlayerPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: video, loading, error, refetch } = useVideo(id || '');

  const handleRetry = async (): Promise<void> => {
    await refetch();
  };

  if (loading === 'loading') {
    return <VideoPlayerSkeleton />;
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8 text-center bg-red-50 border-red-200 rounded-2xl">
            <div className="text-red-600 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Video Not Found</h1>
              <p className="text-base sm:text-lg text-red-600 mb-6">
                {error ? formatErrorMessage(convertApiErrorToAppError(error)) : 'The video you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              {error && (
                <Button
                  onClick={handleRetry}
                  className="rounded-xl px-6 py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300 mb-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
            <Button
              onClick={() => navigate('/videos')}
              className="rounded-xl bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Parse the created_at date string
  const createdDate = video.created_at ? new Date(video.created_at) : new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-8 md:pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-3 sm:mb-4 md:mb-6 lg:mb-8"
        >
          <Button
            onClick={() => navigate('/videos')}
            variant="ghost"
            size="sm"
            className="rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Videos</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Video Player Column */}
          <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {isYouTubeUrl(video.video_url) ? (
              <ErrorBoundary>
                <YouTubePlayer 
                  videoId={extractYouTubeVideoId(video.video_url) || ''} 
                  title={video.title}
                  autoPlay={true}
                />
              </ErrorBoundary>
            ) : isVimeoUrl(video.video_url) ? (
              <ErrorBoundary>
                <VimeoPlayer 
                  videoId={extractVimeoVideoId(video.video_url) || ''} 
                  title={video.title}
                />
              </ErrorBoundary>
            ) : (
              <ErrorBoundary>
                <VideoPlayer url={video.video_url} title={video.title} />
              </ErrorBoundary>
            )}

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-gray-200/50 rounded-2xl transition-all duration-300">
                <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                    {video.title}
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 md:space-x-6 space-y-1 sm:space-y-0 text-gray-600 mb-2 sm:mb-4 md:mb-6 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
                      <span>
                        {createdDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {video.duration && (
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
                        <span>{video.duration}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
                    {video.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Comments Column */}
          <div className="xl:col-span-1">
            <CommentSection videoId={video.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
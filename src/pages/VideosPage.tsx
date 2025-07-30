import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/VideoCard';
import { VideoThumbnail } from '@/components/VideoThumbnail';
import { useVideosPaginated } from '@/hooks/use-api';
import { Video } from '@/types';

type ViewMode = 'grid' | 'list';

export function VideosPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const navigate = useNavigate();

  const {
    videos,
    loading,
    error,
    hasMore,
    loadNextPage,
    refresh
  } = useVideosPaginated('ashwin_ranjan', 1, 12);

  // Reset search query when component mounts
  useEffect(() => {
    setSearchQuery('');
  }, []);

  const handleVideoClick = (video: Video) => {
    navigate(`/videos/${video.id}`);
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-8 sm:py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full"></div>
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
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-8 sm:py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 sm:mb-4 md:mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Educational Videos
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                Discover and learn from our curated collection
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                asChild
                size="sm"
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm sm:text-base"
              >
                <Link to="/videos/create" className="flex items-center justify-center">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Upload Video</span>
                  <span className="sm:hidden">Add Video</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-3 sm:mb-4 md:mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-gray-600 focus:ring-gray-600 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode('grid')}
                  size="sm"
                  variant="ghost"
                  className={`rounded-lg px-2 sm:px-3 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  size="sm"
                  variant="ghost"
                  className={`rounded-lg px-2 sm:px-3 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600'}`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Videos Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-stretch w-full max-w-7xl">
                {filteredVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="w-full sm:w-32 lg:w-40 flex-shrink-0">
                        <VideoThumbnail 
                          videoUrl={video.video_url}
                          title={video.title}
                          size="medium"
                          className="w-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                          {video.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2 sm:mb-3">
                          {video.description}
                        </p>
                        <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                            <span>{video.num_comments || 0} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-6 sm:py-8"
            >
              <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-base">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span>Loading more videos...</span>
              </div>
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-6 sm:py-8"
            >
              <Button
                onClick={loadNextPage}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
              >
                Load More Videos
              </Button>
            </motion.div>
          )}

          {/* End of Content */}
          {!hasMore && videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 sm:py-8"
            >
              <div className="inline-flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
                <span>You've reached the end</span>
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
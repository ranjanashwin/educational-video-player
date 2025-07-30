import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  AlertCircle,
  RefreshCw,
  Video as VideoIcon,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useVideos } from '@/hooks/use-api';
import { useVideosContext } from '@/contexts/VideosContext';
import { Video, ApiError } from '@/types';
import { formatErrorMessage, AppError } from '@/lib/error-handler';
import { toast } from 'sonner';
import { videoApi } from '@/lib/api-client';
import { getVideoEmbedUrl } from '@/lib/video-utils';
import { VideoThumbnail } from '@/components/VideoThumbnail';

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

// Helper function to format comment count
const formatCommentCount = (count: number | undefined): string => {
  if (!count) return '0';
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

type ViewMode = 'grid' | 'list' | 'table';
type SortOption = 'newest' | 'oldest' | 'title' | 'views' | 'comments';

export function VideoManagementPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode] = useState<ViewMode>('table');
  const [sortBy] = useState<SortOption>('newest');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    video_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshTrigger } = useVideosContext();
  
  const { data: videos, loading, error, refetch } = useVideos('ashwin_ranjan');

  // Reset search query when component mounts
  useEffect(() => {
    setSearchQuery('');
  }, []);

  // Refetch when refresh trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Filter and sort videos
  const filteredAndSortedVideos = videos
    ?.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'comments':
          return (b.num_comments || 0) - (a.num_comments || 0);
        default:
          return 0;
      }
    }) || [];

  const handleEdit = (video: Video): void => {
    setSelectedVideo(video);
    setEditFormData({
      title: video.title || '',
      description: video.description || '',
      video_url: video.video_url || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleVideoTitleClick = (video: Video): void => {
    navigate(`/videos/${video.id}`);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!selectedVideo) return;
    
    // Validate form data
    if (!editFormData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        video_id: selectedVideo.id,
        title: editFormData.title.trim(),
        description: editFormData.description.trim()
      };
      
      await videoApi.update(updateData);
      
      toast.success('Video updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedVideo(null);
      setEditFormData({
        title: '',
        description: '',
        video_url: ''
      });
      
      // Refresh the videos list
      await refetch();
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : 'Failed to update video. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-8 text-center bg-red-50 border-red-200 rounded-2xl">
            <div className="text-red-600 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Failed to load videos</h1>
              <p className="text-base sm:text-lg text-red-600 mb-6">
                {formatErrorMessage(convertApiErrorToAppError(error))}
              </p>
              <Button
                onClick={() => refetch()}
                className="rounded-xl px-6 py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Video Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and organize your video content
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/videos/create'}
              className="rounded-xl bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Video
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <VideoIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Videos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {videos?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600 bg-white/80 text-gray-900 placeholder-gray-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Videos Table */}
        {viewMode === 'table' && (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSortedVideos.map((video, index) => (
                      <motion.tr key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <VideoThumbnail 
                              videoUrl={video.video_url}
                              title={video.title}
                              size="small"
                            />
                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => handleVideoTitleClick(video)}
                                className="text-sm font-medium text-black hover:text-gray-700 truncate block text-left cursor-pointer transition-colors duration-200"
                              >
                                {video.title}
                              </button>
                              <p className="text-xs text-gray-500 truncate">{truncateText(video.description, 60)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{formatCommentCount(video.num_comments)}</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() => handleEdit(video)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-900 hover:text-black hover:bg-gray-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Empty State */}
        {!loading && !error && filteredAndSortedVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl p-8 sm:p-12">
              <div className="max-w-lg mx-auto px-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6 neon-glow shadow-2xl">
                  <VideoIcon className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  No videos found
                </h3>
                <p className="text-gray-600 text-base sm:text-lg mb-6">
                  {searchQuery ? 'No videos match your search criteria.' : 'Get started by adding your first video.'}
                </p>
                <Button
                  onClick={() => window.location.href = '/videos/create'}
                  className="rounded-xl bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Video
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Edit Video Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white border-gray-200 rounded-2xl max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Edit Video</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update the video details for "{selectedVideo?.title}".
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter video title"
                  className="mt-1 rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter video description"
                  className="mt-1 rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600 resize-y"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-video-url" className="text-sm font-medium text-gray-700">Video URL *</Label>
                <Input
                  id="edit-video-url"
                  value={editFormData.video_url}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="Enter video link eg youtube.com/"
                  className="mt-1 rounded-xl border-gray-300 focus:border-gray-600 focus:ring-gray-600 bg-gray-100 cursor-not-allowed"
                  disabled={true}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Video URL cannot be updated via API endpoint
                </p>
              </div>
              

            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditFormData({
                    title: '',
                    description: '',
                    video_url: ''
                  });
                }}
                className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="rounded-xl bg-black hover:bg-gray-900 text-white font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Video Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="bg-white border-gray-200 rounded-2xl max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Preview Video</DialogTitle>
              <DialogDescription className="text-gray-600">
                Preview "{selectedVideo?.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedVideo && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  {getVideoEmbedUrl(selectedVideo.video_url) ? (
                    <iframe
                      src={getVideoEmbedUrl(selectedVideo.video_url) || ''}
                      title={selectedVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={() => {
                        toast.error('Failed to load video preview');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <VideoIcon className="h-12 w-12 mx-auto mb-2" />
                        <p>Video Preview Not Available</p>
                        <p className="text-sm text-gray-400 mt-1">Direct video links cannot be previewed</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedVideo && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedVideo.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Comments: {formatCommentCount(selectedVideo.num_comments)}</span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsPreviewDialogOpen(false)}
                className="rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-semibold"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useComments, useCreateComment } from '@/hooks/use-api';
import { ApiError } from '@/types';
import { formatErrorMessage, AppError } from '@/lib/error-handler';
import { toast } from 'sonner';

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

interface CommentSectionProps {
  videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps): React.JSX.Element {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<AppError | null>(null);
  
  // Always use ashwin_ranjan as username
  const username = 'ashwin_ranjan';

  const { data: comments, loading, error, refetch } = useComments(videoId);
  const { createComment } = useCreateComment();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const commentData = {
        video_id: videoId,
        user_id: username,
        content: newComment.trim(),
      };
      await createComment(commentData);
      await refetch();
      setNewComment('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : 'Failed to post comment. Please try again.';
             setApiError(error instanceof AppError ? error : new AppError(errorMessage, 'COMMENT_ERROR'));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async (): Promise<void> => {
    await refetch();
  };

  const handleCommentChange = (value: string): void => {
    setNewComment(value);
    setApiError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl hover:shadow-gray-200/50 rounded-2xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-black rounded-xl">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <span className="text-gray-900 text-lg sm:text-xl font-bold">
                Comments ({comments?.length || 0})
              </span>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Share your thoughts and join the discussion</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 p-3 sm:p-4 md:p-6">
          {/* Add Comment Form */}
          <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-200 mt-3 sm:mt-4">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarFallback className="bg-black text-white font-semibold text-xs sm:text-sm">
                    {username ? username.charAt(0).toUpperCase() : <User className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    value={newComment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    placeholder={username ? "Share your thoughts about this video..." : "Set username to comment..."}
                    className="min-h-[80px] sm:min-h-[100px] resize-none rounded-xl border-gray-300 focus:border-black focus:ring-black bg-white/90 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                    disabled={isSubmitting || !username}
                  />
                </div>
              </div>
            
            {/* API Error Display */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-700 font-medium text-xs sm:text-sm">Failed to post comment</p>
                  <p className="text-red-600 text-xs">{formatErrorMessage(apiError)}</p>
                </div>
              </motion.div>
            )}

              {newComment.trim() && (
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting || !username}
                    size="sm"
                    className="rounded-xl bg-black hover:bg-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                  >
                    {isSubmitting ? (
                      'Posting...'
                    ) : (
                      <>
                        <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 neon-glow">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                Failed to load comments
              </h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                {formatErrorMessage(convertApiErrorToAppError(error))}
              </p>
              <Button
                onClick={handleRetry}
                size="sm"
                className="rounded-xl px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold neon-glow transition-all duration-300 text-xs sm:text-sm"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading === 'loading' && (
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">Loading comments...</p>
            </div>
          )}

          {/* Comments List */}
          {!error && loading !== 'loading' && (
            <>
              {!comments || comments.length === 0 ? (
                <div className="text-center py-6 sm:py-8 md:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">Be the first to share your thoughts!</p>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full animate-pulse"></div>
                    <span>Start the conversation</span>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex space-x-2 sm:space-x-3 md:space-x-4 p-3 sm:p-4 md:p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex-shrink-0">
                        <AvatarFallback className="bg-black text-white font-semibold text-xs sm:text-sm">
                          {comment.user_id ? comment.user_id.charAt(0).toUpperCase() : <User className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="font-bold text-gray-900 text-xs sm:text-sm md:text-base">
                              {comment.user_id || 'Anonymous'}
                            </span>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base break-words">
                          {comment.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
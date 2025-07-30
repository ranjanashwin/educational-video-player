import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput } from '@/components/FormInput';
import { toast } from '@/hooks/use-toast';
import { useCreateVideo } from '@/hooks/use-api';
import { useVideosContext } from '@/contexts/VideosContext';
import { AppError } from '@/lib/error-handler';
import { formatErrorMessage } from '@/lib/error-handler';

interface VideoForm {
  title: string;
  description: string;
  video_url: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  video_url?: string;
}

// Helper function to convert ApiError to AppError
const convertApiErrorToAppError = (apiError: any): AppError => {
  return new AppError(
    apiError.message,
    apiError.code,
    500, // Default status code
    true, // Default isOperational
    apiError.details
  );
};

export function NewVideoPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { triggerRefresh } = useVideosContext();
  const { createVideo, loading, error, success, reset } = useCreateVideo();
  
  const [form, setForm] = useState<VideoForm>({
    title: '',
    description: '',
    video_url: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (form.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!form.video_url.trim()) {
      newErrors.video_url = 'Video URL is required';
    } else {
      try {
        new URL(form.video_url);
      } catch {
        newErrors.video_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const videoData = {
      user_id: 'ashwin_ranjan',
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim(),
    };

    const success = await createVideo(videoData);

    if (success) {
      toast({
        title: "Success!",
        description: `${form.title} is successfully added!`,
      });

      // Trigger refresh of videos list
      triggerRefresh();

      // Navigate back to manage page
      navigate('/manage');
    } else {
      toast({
        title: "Error",
        description: error ? formatErrorMessage(convertApiErrorToAppError(error)) : "Failed to add video",
        variant: "destructive",
      });
    }
  };

  const updateForm = (field: keyof VideoForm) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Reset API state when user makes changes
    if (error || success) {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            onClick={() => navigate('/videos')}
            variant="ghost"
            className="rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl hover:shadow-gray-200/50 rounded-2xl transition-all duration-300">
            <CardHeader className="text-center pb-6 sm:pb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
                <Plus className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 neon-text">
                Add New Video
              </CardTitle>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Share an educational video with the community
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              {/* API Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium">Failed to create video</p>
                    <p className="text-red-600 text-sm">{formatErrorMessage(convertApiErrorToAppError(error))}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <FormInput
                  label="Video Title"
                  value={form.title}
                  onChange={updateForm('title')}
                  placeholder="Enter a descriptive title for your video"
                  error={errors.title}
                  required
                  maxLength={100}
                />

                <FormInput
                  label="Description"
                  type="textarea"
                  value={form.description}
                  onChange={updateForm('description')}
                  placeholder="Describe what viewers will learn from this video"
                  error={errors.description}
                  required
                />

                <FormInput
                  label="Video URL"
                  type="url"
                  value={form.video_url}
                  onChange={updateForm('video_url')}
                  placeholder="Enter video link eg youtube.com/"
                  error={errors.video_url}
                  required
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/videos')}
                    className="flex-1 rounded-xl py-3 border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-white font-bold shadow-lg hover:shadow-xl neon-glow transition-all duration-300"
                  >
                    {loading ? 'Adding Video...' : 'Add Video'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
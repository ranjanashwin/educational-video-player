import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function VideoPlayerSkeleton(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 pt-20 sm:pt-24 pb-8 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Video Player Column */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Video Player Skeleton */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative"
            >
              {/* Animated Loading Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* Pulsing Play Button */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl mb-4"
                  >
                    <Play className="h-8 w-8 text-gray-600 ml-1" />
                  </motion.div>
                  
                  {/* Loading Text */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-gray-600 font-medium"
                  >
                    Loading Video...
                  </motion.div>
                  
                  {/* Subtle Loading Dots */}
                  <div className="flex justify-center space-x-1 mt-3">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 via-transparent to-transparent"></div>
            </motion.div>

            {/* Video Info Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  {/* Title Skeleton */}
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-2/3"></div>
                  </div>
                  
                  {/* Meta Info Skeleton */}
                  <div className="flex items-center space-x-6 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Description Skeleton */}
                  <div className="mt-6 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Comments Column Skeleton */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl">
                <CardContent className="p-4 sm:p-6">
                  {/* Comments Header Skeleton */}
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Comment Input Skeleton */}
                  <div className="space-y-4 mb-6">
                    <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  
                  {/* Comments List Skeleton */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="ml-10 space-y-1">
                          <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { motion } from 'framer-motion';
import { Loader2, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl rounded-2xl">
      <Skeleton className="w-full h-40 sm:h-48 bg-gray-200" />
      <CardContent className="p-4 sm:p-6">
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-2 bg-gray-200" />
        <Skeleton className="h-3 sm:h-4 w-full mb-1 bg-gray-200" />
        <Skeleton className="h-3 sm:h-4 w-2/3 mb-3 sm:mb-4 bg-gray-200" />
        <Skeleton className="h-3 w-1/3 bg-gray-200" />
      </CardContent>
    </Card>
  );
}

export function VideoGridSkeleton() {
  return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
      {Array.from({ length: 8 }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100"
    >
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center mx-auto neon-glow">
            <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 sm:h-8 sm:w-8 text-gray-600 animate-spin" />
        </div>
        <p className="text-gray-700 text-base sm:text-lg font-medium">Loading...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your content</p>
      </div>
    </motion.div>
  );
}
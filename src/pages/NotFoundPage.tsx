import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFoundPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gray-100 rounded-full opacity-30"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-gray-200 rounded-full opacity-20"
            animate={{
              y: [0, 25, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-gray-100 rounded-full opacity-25"
            animate={{
              y: [0, -20, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-8xl sm:text-9xl font-bold text-gray-900 mb-4">
              404
            </h1>
            <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full"></div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to exploring our educational videos.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/" className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/videos" className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Browse Videos
              </Link>
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Navigation
            </h3>
            <div className="space-y-3">
              <Link 
                to="/videos" 
                className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Video className="h-4 w-4 mr-2" />
                All Videos
              </Link>
              <Link 
                to="/videos/create" 
                className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                Add New Video
              </Link>
              <Link 
                to="/manage" 
                className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Manage Videos
              </Link>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 text-sm text-gray-500"
          >
            <p>Educational Video Player Assessment by Ashwin Ranjan for ScopeLabs</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
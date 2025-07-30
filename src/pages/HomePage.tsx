import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomePage(): React.JSX.Element {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 150]);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Full Height Hero Section with 3D Animated Background */}
      <section className="relative h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
        {/* 3D Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* 3D Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-sm"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ y }}
          />
          
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-30 blur-sm"
            animate={{
              y: [0, 40, 0],
              x: [0, -30, 0],
              rotate: [360, 180, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ y }}
          />
          
          <motion.div
            className="absolute bottom-40 left-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-25 blur-sm"
            animate={{
              y: [0, -20, 0],
              x: [0, 40, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ y }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/3 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 blur-sm"
            animate={{
              y: [0, 50, 0],
              x: [0, -20, 0],
              rotate: [360, 0, 360],
              scale: [1, 0.7, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ y }}
          />

          {/* Interactive Grid Pattern */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Floating Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}

          {/* 3D Geometric Shapes */}
          <motion.div
            className="absolute top-1/4 left-1/6 w-10 h-10 sm:w-16 sm:h-16 border-2 border-gray-300 opacity-20"
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              rotateZ: [0, 180],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ y }}
          />

          <motion.div
            className="absolute bottom-1/4 right-1/6 w-8 h-8 sm:w-12 sm:h-12 border-2 border-gray-300 opacity-20 transform rotate-45"
            animate={{
              rotateX: [0, -360],
              rotateY: [0, -360],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ y }}
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2,
            ease: "easeOut"
          }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span
                className="inline-block text-gray-900"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Educational
              </motion.span>
              <br />
              <motion.span
                className="inline-block text-gray-900"
                animate={{ 
                  backgroundPosition: ['100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Video Player
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Animated Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            By Ashwin Ranjan for{' '}
            <a 
              href="https://www.scopelabs.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
            >
              ScopeLabs
            </a>
          </motion.p>

          {/* Animated Author */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg text-gray-500 mb-8 sm:mb-10 md:mb-12 flex items-center justify-center gap-1 sm:gap-2"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-yellow-500" />
            Video player assessment
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-yellow-500" />
          </motion.p>
          
          {/* Animated Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 text-sm sm:text-base md:text-lg"
              >
                <Link to="/videos" className="flex items-center justify-center text-white hover:text-white">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" />
                  Explore Videos
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 ml-2 sm:ml-3" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base md:text-lg backdrop-blur-sm bg-white/80"
              >
                <Link to="/videos/create" className="flex items-center justify-center">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" />
                  Add Video
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-8 sm:w-6 sm:h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-2 sm:w-1 sm:h-3 bg-gray-400 rounded-full mt-1 sm:mt-2"
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
import { motion } from 'framer-motion';

/**
 * Footer Component
 * 
 * A responsive footer component with assessment branding and professional styling.
 */
export function Footer(): React.JSX.Element {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="bg-gray-900 text-white py-6 sm:py-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-4 sm:mb-6"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
              Educational Video Player Assessment
            </h3>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              By Ashwin Ranjan for{' '}
              <a 
                href="https://www.scopelabs.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
              >
                ScopeLabs
              </a>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="border-t border-gray-700 pt-4 sm:pt-6"
          >
            <p className="text-gray-400 text-xs sm:text-sm">
              Demonstrating modern React development practices and professional video player implementation
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
} 
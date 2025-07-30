import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Video, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/videos', label: 'Videos', icon: Video },
  { path: '/manage', label: 'Manage', icon: Settings },
] as const;

export function Navbar(): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
              <span className="hidden sm:inline">Educational Video Player</span>
              <span className="sm:hidden">EduVideo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`rounded-xl px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="rounded-xl p-1.5 sm:p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
          >
            <div className="px-2 py-2 sm:py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start rounded-xl px-3 py-2.5 sm:py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2 sm:mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
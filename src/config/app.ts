/**
 * Application Configuration
 * Centralized configuration for Educational Video Player Assessment
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

export const APP_CONFIG = {
  // Application metadata
  name: 'Educational Video Player Assessment',
  version: '1.0.0',
  description: 'Professional educational video player assessment by Ashwin Ranjan for ScopeLabs',
  
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://take-home-assessment-423502.uc.r.appspot.com/api',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Video configuration
  video: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    supportedFormats: ['mp4', 'webm', 'mov', 'avi'],
    qualityOptions: [360, 480, 720, 1080],
    thumbnailQuality: 720,
  },
  
  // UI configuration
  ui: {
    theme: {
      primary: '#10b981', // Green
      secondary: '#059669',
      accent: '#34d399',
    },
    animations: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    pagination: {
      defaultPageSize: 12,
      maxPageSize: 50,
    },
  },
  
  // Feature flags
  features: {
    comments: true,
    likes: true,
    sharing: true,
    analytics: true,
    search: true,
    filters: true,
  },
  
  // Security configuration
  security: {
    jwtExpiry: '24h',
    refreshTokenExpiry: '7d',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Analytics configuration
  analytics: {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    trackingId: import.meta.env.VITE_ANALYTICS_ID,
    events: {
      videoView: 'video_view',
      videoLike: 'video_like',
      videoShare: 'video_share',
      commentAdd: 'comment_add',
    },
  },
  
  // Error messages
  messages: {
    errors: {
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'You are not authorized to perform this action.',
      notFound: 'The requested resource was not found.',
      serverError: 'Server error. Please try again later.',
      validationError: 'Please check your input and try again.',
    },
    success: {
      videoUploaded: 'Video uploaded successfully!',
      videoUpdated: 'Video updated successfully!',
      videoDeleted: 'Video deleted successfully!',
      commentAdded: 'Comment added successfully!',
      profileUpdated: 'Profile updated successfully!',
    },
  },
  
  // Validation rules
  validation: {
    video: {
      title: {
        minLength: 3,
        maxLength: 100,
      },
      description: {
        minLength: 10,
        maxLength: 1000,
      },
      tags: {
        maxCount: 10,
        maxLength: 20,
      },
    },
    user: {
      name: {
        minLength: 2,
        maxLength: 50,
      },
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
  },
} as const;

// Type-safe configuration access
export type AppConfig = typeof APP_CONFIG;

// Environment-specific overrides
export const getConfig = (): AppConfig => {
  const env = import.meta.env.MODE;
  
  if (env === 'production') {
    return {
      ...APP_CONFIG,
      api: {
        ...APP_CONFIG.api,
        baseUrl: import.meta.env.VITE_API_URL || 'https://api.eduverse.com',
      },
      features: {
        ...APP_CONFIG.features,
        analytics: true,
      },
    };
  }
  
  return APP_CONFIG;
};

// Utility functions for configuration
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return APP_CONFIG.features[feature];
};

export const getApiUrl = (endpoint: string): string => {
  return `${APP_CONFIG.api.baseUrl}${endpoint}`;
};

export const getErrorMessage = (key: keyof AppConfig['messages']['errors']): string => {
  return APP_CONFIG.messages.errors[key];
};

export const getSuccessMessage = (key: keyof AppConfig['messages']['success']): string => {
  return APP_CONFIG.messages.success[key];
}; 
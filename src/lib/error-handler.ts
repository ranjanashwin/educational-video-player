/**
 * Error Handling Utilities
 * Centralized error handling for Educational Video Player Assessment
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

import { ApiError } from '@/types';
import { getErrorMessage } from '@/config/app';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401, true);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403, true);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404, true);
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 0, true);
    this.name = 'NetworkError';
  }
}

/**
 * Error handler for API responses
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date(),
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      timestamp: new Date(),
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date(),
  };
};

/**
 * Error handler for network requests
 */
export const handleNetworkError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError(getErrorMessage('networkError'));
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR');
};

/**
 * Error handler for form validation
 */
export const handleValidationError = (errors: Record<string, string[]>): ValidationError => {
  const messages = Object.entries(errors)
    .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(', ')}`)
    .join('; ');

  return new ValidationError(messages, { fieldErrors: errors });
};

/**
 * Error handler for async operations
 */
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const appError = handleNetworkError(error);
    return { data: fallback || null, error: appError };
  }
};

/**
 * Error boundary component props
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: AppError }>;
  onError?: (error: AppError) => void;
}

/**
 * Error logging utility
 */
export const logError = (error: AppError, context?: Record<string, unknown>): void => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      details: error.details,
    },
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // Example: Sentry, LogRocket, etc.
    console.error('Error logged:', errorLog);
  } else {
    console.error('Development error:', errorLog);
  }
};

/**
 * Error recovery utilities
 */
export const isRecoverableError = (error: AppError): boolean => {
  return error.isOperational && error.statusCode < 500;
};

export const shouldRetry = (error: AppError, attempt: number, maxAttempts: number = 3): boolean => {
  return attempt < maxAttempts && 
         (error instanceof NetworkError || 
          error.statusCode >= 500 || 
          error.statusCode === 429);
};

/**
 * Error message formatting
 */
export const formatErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again.';
    case 'AUTHENTICATION_ERROR':
      return 'Please log in to continue.';
    case 'AUTHORIZATION_ERROR':
      return 'You don\'t have permission to perform this action.';
    case 'NOT_FOUND_ERROR':
      return 'The requested resource was not found.';
    case 'NETWORK_ERROR':
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Error reporting to analytics
 */
export const reportError = (error: AppError, context?: Record<string, unknown>): void => {
  if (import.meta.env.PROD) {
    // Send error to analytics service
    const errorEvent = {
      event: 'error',
      error_code: error.code,
      error_message: error.message,
      error_status: error.statusCode,
      context,
    };
    
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Error reported to analytics:', errorEvent);
  }
}; 
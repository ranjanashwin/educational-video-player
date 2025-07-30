/**
 * API Client for Educational Video Player Assessment
 * Handles all API communication with the backend
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

import { AppError, handleNetworkError } from './error-handler';
import { Video, Comment } from '@/types';

// API Request Types
interface CreateVideoRequest {
  user_id: string;
  title: string;
  description: string;
  video_url: string;
}

interface EditVideoRequest {
  video_id: string;
  title: string;
  description: string;
}

interface CreateCommentRequest {
  video_id: string;
  content: string;
  user_id: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://take-home-assessment-423502.uc.r.appspot.com/api';

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

interface FastAPIValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

class ApiClient {
  private config: ApiClientConfig;

  constructor() {
    this.config = {
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        // Handle FastAPI validation errors
        if (response.status === 422) {
          const validationError: FastAPIValidationError = await response.json();
          const errorMessage = validationError.detail
            .map(detail => `${detail.loc.join('.')}: ${detail.msg}`)
            .join(', ');
          throw new AppError(errorMessage, 'VALIDATION_ERROR', 422);
        }
        
        throw new AppError(
          `HTTP ${response.status}: ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      // Get the response text first to see what we're dealing with
      const responseText = await response.text();

      // Try to parse as JSON
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // If it's not valid JSON, it might be a plain string response
        data = responseText;
      }

      return data;
    } catch (error) {
      throw handleNetworkError(error);
    }
  }

  // Video API Methods
  async getVideos(userId: string = 'ashwin_ranjan'): Promise<Video[]> {
    const response = await this.request<any>(`/videos?user_id=${userId}`);
    
    // Handle different response formats
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        // Check if it's the expected format with videos property
        if (parsed.videos && Array.isArray(parsed.videos)) {
          return parsed.videos;
        }
        return parsed;
      } catch (error) {
        throw new AppError('Invalid response format from server', 'PARSE_ERROR');
      }
    }
    
    // If response is already an object
    if (typeof response === 'object' && response !== null) {
      // Check if it's the expected format with videos property
      if (response.videos && Array.isArray(response.videos)) {
        return response.videos;
      }
      // If it's already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
    }
    
    throw new AppError('Unexpected response format from server', 'PARSE_ERROR');
  }

  async getVideosPaginated(
    userId: string = 'ashwin_ranjan',
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<Video>> {
    const { page = 1, limit = 12 } = params;
    const offset = (page - 1) * limit;
    
    const response = await this.request<any>(
      `/videos?user_id=${userId}&page=${page}&limit=${limit}&offset=${offset}`
    );
    
    // Handle different response formats
    let videos: Video[] = [];
    let total = 0;
    
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        videos = parsed.videos || parsed.data || parsed;
        total = parsed.total || parsed.count || videos.length;
      } catch (error) {
        throw new AppError('Invalid response format from server', 'PARSE_ERROR');
      }
    } else if (typeof response === 'object' && response !== null) {
      videos = response.videos || response.data || response;
      total = response.total || response.count || videos.length;
    }
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: videos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getVideo(videoId: string): Promise<Video> {
    const response = await this.request<any>(`/videos/single?video_id=${videoId}`);
    
    // Handle different response formats
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        // Check if it's the expected format with video property
        if (parsed.video && typeof parsed.video === 'object') {
          return parsed.video;
        }
        return parsed;
      } catch (error) {
        throw new AppError('Invalid response format from server', 'PARSE_ERROR');
      }
    }
    
    // If response is already an object
    if (typeof response === 'object' && response !== null) {
      // Check if it's the expected format with video property
      if (response.video && typeof response.video === 'object') {
        return response.video;
      }
      // If it's already a video object, return it
      if (response.id && response.title) {
        return response;
      }
    }
    
    throw new AppError('Unexpected response format from server', 'PARSE_ERROR');
  }

  async createVideo(videoData: CreateVideoRequest): Promise<string> {
    return this.request<string>('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  async updateVideo(videoData: EditVideoRequest): Promise<string> {
    return this.request<string>('/videos', {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  }

  // Comment API Methods
  async getComments(videoId: string): Promise<Comment[]> {
    const response = await this.request<any>(`/videos/comments?video_id=${videoId}`);
    
    // Handle different response formats
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        // Check if it's the expected format with comments property
        if (parsed.comments && Array.isArray(parsed.comments)) {
          return parsed.comments;
        }
        return parsed;
      } catch (error) {
        throw new AppError('Invalid response format from server', 'PARSE_ERROR');
      }
    }
    
    // If response is already an object
    if (typeof response === 'object' && response !== null) {
      // Check if it's the expected format with comments property
      if (response.comments && Array.isArray(response.comments)) {
        return response.comments;
      }
      // If it's already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
    }
    
    throw new AppError('Unexpected response format from server', 'PARSE_ERROR');
  }

  async createComment(commentData: CreateCommentRequest): Promise<string> {
    return this.request<string>('/videos/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  // Utility methods for error handling
  async handleApiError<T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<{ data: T | null; error: AppError | null }> {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      const appError = handleNetworkError(error);
      return { data: fallback || null, error: appError };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Convenience functions for common operations
export const videoApi = {
  getAll: (userId?: string) => apiClient.getVideos(userId),
  getVideosPaginated: (userId?: string, params?: PaginationParams) => apiClient.getVideosPaginated(userId, params),
  getById: (videoId: string) => apiClient.getVideo(videoId),
  create: (videoData: CreateVideoRequest) => apiClient.createVideo(videoData),
  update: (videoData: EditVideoRequest) => apiClient.updateVideo(videoData),
};

export const commentApi = {
  getByVideoId: (videoId: string) => apiClient.getComments(videoId),
  create: (commentData: CreateCommentRequest) => apiClient.createComment(commentData),
};

// Type-safe API response handlers
export const createApiResponse = <T>(data: T): any => ({
  data,
  message: 'Success',
  success: true,
  timestamp: new Date(),
});

export const createPaginatedResponse = <T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): any => ({
  data,
  pagination: {
    ...pagination,
    totalPages: Math.ceil(pagination.total / pagination.limit),
    hasNext: pagination.page * pagination.limit < pagination.total,
    hasPrev: pagination.page > 1,
  },
  message: 'Success',
  success: true,
}); 
/**
 * Core application types for Educational Video Player Assessment
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

// Video-related types
export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string; // API uses snake_case
  created_at: string; // API uses snake_case
  user_id: string; // API uses snake_case
  num_comments: number; // API uses snake_case
  // Optional fields that might be present
  updated_at?: string;
  thumbnail?: string;
  duration?: string;
  author?: User;
  category?: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  isPublished?: boolean;
  metadata?: VideoMetadata;
}

export interface VideoMetadata {
  resolution: string;
  fileSize: number;
  encoding: string;
  bitrate: number;
  frameRate: number;
}

export type VideoCategory = 
  | 'education'
  | 'technology'
  | 'science'
  | 'business'
  | 'arts'
  | 'health'
  | 'other';

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export type UserRole = 'student' | 'educator' | 'admin' | 'institution';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  playbackSpeed: number;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

// Comment and interaction types
export interface Comment {
  id: string;
  video_id: string; // API uses snake_case
  user_id: string; // API uses snake_case
  content: string;
  created_at: string; // API uses snake_case - string from API
  updated_at?: string; // API uses snake_case - string from API
  parent_id?: string; // API uses snake_case
  replies?: Comment[];
  likes?: number;
  user?: User; // Optional since API might not return user object
}

export interface Like {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  message: string;
  success: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface VideoFormData {
  title: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  isPublished: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: any; // React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

// Analytics types
export interface VideoAnalytics {
  videoId: string;
  viewCount: number;
  uniqueViews: number;
  averageWatchTime: number;
  completionRate: number;
  engagementScore: number;
  topComments: Comment[];
  viewerDemographics: ViewerDemographics;
}

export interface ViewerDemographics {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}

// Search and filter types
export interface SearchFilters {
  query: string;
  category?: VideoCategory;
  author?: string;
  dateRange?: DateRange;
  duration?: DurationRange;
  tags?: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DurationRange {
  min: number; // in seconds
  max: number; // in seconds
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: LoadingState;
  error: ApiError | null;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: any; // React.ReactNode;
}

export interface VideoCardProps extends BaseComponentProps {
  video: Video;
  onPlay?: (video: Video) => void;
  onLike?: (videoId: string) => void;
  showActions?: boolean;
}

export interface VideoPlayerProps extends BaseComponentProps {
  video: Video;
  autoPlay?: boolean;
  showControls?: boolean;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
}
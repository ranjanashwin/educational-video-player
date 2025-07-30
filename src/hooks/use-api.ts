/**
 * Custom API Hook for Educational Video Player Assessment
 * Provides consistent state management for API calls
 * @author Ashwin Ranjan for ScopeLabs
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AsyncState, ApiError } from '@/types';
import { AppError } from '@/lib/error-handler';
import { videoApi, commentApi } from '@/lib/api-client';
import { Video } from '@/types';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
  autoFetch?: boolean;
  dependencies?: any[];
}

// Helper function to convert AppError to ApiError
const convertToApiError = (error: AppError): ApiError => ({
  code: error.code,
  message: error.message,
  details: error.details,
  timestamp: new Date(),
});

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): AsyncState<T> & {
  refetch: () => Promise<void>;
  reset: () => void;
} {
  const {
    initialData = null,
    onSuccess,
    onError,
    autoFetch = false,
    dependencies = [],
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: 'idle',
    error: null,
  });

  // Use ref to store the latest apiCall to avoid stale closures
  const apiCallRef = useRef(apiCall);
  apiCallRef.current = apiCall;

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: 'loading', error: null }));

    try {
      const data = await apiCallRef.current();
      setState({ data, loading: 'success', error: null });
      onSuccess?.(data);
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'UNKNOWN_ERROR'
      );
      setState({ data: null, loading: 'error', error: convertToApiError(appError) });
      onError?.(appError);
    }
  }, [onSuccess, onError]);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: 'idle', error: null });
  }, [initialData]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [execute, autoFetch, ...dependencies]);

  return {
    ...state,
    refetch,
    reset,
  };
}

// Specialized hooks for common API patterns
export function useVideos(userId?: string) {
  return useApi(
    useCallback(() => videoApi.getAll(userId), [userId]),
    {
      autoFetch: true,
      dependencies: [userId],
    }
  );
}

export function useVideosPaginated(
  userId?: string,
  initialPage: number = 1,
  pageSize: number = 12
) {
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadVideos = useCallback(async (pageNum: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await videoApi.getVideosPaginated(userId || 'ashwin_ranjan', {
        page: pageNum,
        limit: pageSize,
      });

      if (append) {
        setVideos(prev => [...prev, ...response.data]);
      } else {
        setVideos(response.data);
      }

      setHasMore(response.pagination.hasNext);
      setPage(pageNum);
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError(
        err instanceof Error ? err.message : 'Failed to load videos',
        'LOAD_VIDEOS_ERROR'
      );
      setError(convertToApiError(appError));
    } finally {
      setLoading(false);
    }
  }, [userId, pageSize]);

  const loadNextPage = useCallback(() => {
    if (!loading && hasMore) {
      loadVideos(page + 1, true);
    }
  }, [loading, hasMore, page, loadVideos]);

  const refresh = useCallback(() => {
    setVideos([]);
    setPage(initialPage);
    setHasMore(true);
    loadVideos(initialPage, false);
  }, [initialPage, loadVideos]);

  // Initial load
  useEffect(() => {
    loadVideos(initialPage, false);
  }, [loadVideos, initialPage]);

  return {
    videos,
    loading,
    error,
    hasMore,
    page,
    loadNextPage,
    refresh,
    setPage,
  };
}

export function useVideo(videoId: string) {
  return useApi(
    useCallback(() => videoApi.getById(videoId), [videoId]),
    {
      autoFetch: !!videoId,
      dependencies: [videoId],
    }
  );
}

export function useComments(videoId: string) {
  return useApi(
    useCallback(() => commentApi.getByVideoId(videoId), [videoId]),
    {
      autoFetch: !!videoId,
      dependencies: [videoId],
    }
  );
}

// Mutation hooks for data modifications
export function useCreateVideo() {
  const [state, setState] = useState<{
    loading: boolean;
    error: ApiError | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const createVideo = useCallback(async (videoData: {
    user_id: string;
    title: string;
    description: string;
    video_url: string;
  }) => {
    setState({ loading: true, error: null, success: false });

    try {
      await videoApi.create(videoData);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(
        error instanceof Error ? error.message : 'Failed to create video',
        'CREATE_VIDEO_ERROR'
      );
      setState({ 
        loading: false, 
        error: convertToApiError(appError), 
        success: false 
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    createVideo,
    reset,
  };
}

export function useCreateComment() {
  const [state, setState] = useState<{
    loading: boolean;
    error: ApiError | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const createComment = useCallback(async (commentData: {
    video_id: string;
    content: string;
    user_id: string;
  }) => {
    setState({ loading: true, error: null, success: false });

    try {
      await commentApi.create(commentData);
      setState({ loading: false, error: null, success: true });
      return true;
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(
        error instanceof Error ? error.message : 'Failed to create comment',
        'CREATE_COMMENT_ERROR'
      );
      setState({ 
        loading: false, 
        error: convertToApiError(appError), 
        success: false 
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return {
    ...state,
    createComment,
    reset,
  };
}

// Optimistic update utilities
export function useOptimisticUpdate<T>(
  currentData: T[]
) {
  const [optimisticData, setOptimisticData] = useState<T[]>(currentData);

  const updateOptimistically = useCallback((updater: (data: T[]) => T[]) => {
    setOptimisticData(prev => updater(prev));
  }, []);

  const revertOptimisticUpdate = useCallback(() => {
    setOptimisticData(currentData);
  }, [currentData]);

  useEffect(() => {
    setOptimisticData(currentData);
  }, [currentData]);

  return {
    data: optimisticData,
    updateOptimistically,
    revertOptimisticUpdate,
  };
}

// Debounced API calls
export function useDebouncedApi<T>(
  apiCall: () => Promise<T>,
  delay: number = 500
) {
  const [debouncedValue, setDebouncedValue] = useState<T | null>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const result = await apiCall();
        setDebouncedValue(result);
      } catch (error) {
        console.error('Debounced API call failed:', error);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [apiCall, delay]);

  return debouncedValue;
}

// Polling hook for real-time updates
export function usePolling<T>(
  apiCall: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiCall();
        setData(result);
        setError(null);
      } catch (err) {
        const appError = err instanceof AppError ? err : new AppError(
          err instanceof Error ? err.message : 'Polling failed',
          'POLLING_ERROR'
        );
        setError(appError);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [apiCall, interval, enabled]);

  return { data, loading, error };
} 
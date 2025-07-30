import React, { createContext, useContext, useState, useCallback } from 'react';

interface VideosContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export function VideosProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <VideosContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </VideosContext.Provider>
  );
}

export function useVideosContext() {
  const context = useContext(VideosContext);
  if (context === undefined) {
    throw new Error('useVideosContext must be used within a VideosProvider');
  }
  return context;
} 
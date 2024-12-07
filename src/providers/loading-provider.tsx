"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { LoadingSpinner } from "../components/loading";

interface LoadingContextType {
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    // Ajout d'un délai minimum pour éviter les flashs
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Délai suffisant pour que l'animation se termine
  }, []);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      {isLoading && <LoadingSpinner />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
} 

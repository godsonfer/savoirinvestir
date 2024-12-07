"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/providers/loading-provider";

export function InitialLoader() {
  const { startLoading, stopLoading } = useLoading();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Démarrer le loader immédiatement
    startLoading();

    // Vérifier si le document est complètement chargé
    const handleLoad = () => {
      setIsReady(true);
    };

    if (document.readyState === 'complete') {
      setIsReady(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [startLoading]);

  useEffect(() => {
    if (isReady) {
      // Ajouter un délai minimal pour éviter un flash trop rapide
      const minLoadingTime = 800;
      const startTime = performance.now();
      
      const timer = setTimeout(() => {
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          stopLoading();
        }, remainingTime);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReady, stopLoading]);

  return null;
} 

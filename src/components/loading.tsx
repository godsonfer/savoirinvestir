import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LoadingSpinner() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Progression plus fluide avec plus d'étapes
    const timer1 = setTimeout(() => setProgress(15), 50);  // Démarrage rapide
    const timer2 = setTimeout(() => setProgress(30), 100);
    const timer3 = setTimeout(() => setProgress(45), 150);
    const timer4 = setTimeout(() => setProgress(60), 300);
    const timer5 = setTimeout(() => setProgress(75), 500);
    const timer6 = setTimeout(() => setProgress(85), 750); // Ralentissement progressif
    const timer7 = setTimeout(() => setProgress(92), 1000); // Très lent à la fin

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, []);

  useEffect(() => {
    if (progress >= 92) {
      const timer = setTimeout(() => {
        setProgress(100);
        setIsComplete(true);
      }, 500); // Transition finale plus longue

      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50",
        "after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-gradient-to-b after:from-white/15 after:to-transparent",
        isComplete && "opacity-0 transition-opacity duration-700"
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary-main/80 via-primary-light to-primary-main relative overflow-hidden"
        style={{
          width: `${progress}%`,
          transition: "width 500ms cubic-bezier(0.34, 1.56, 0.64, 1)", // Courbe de Bézier personnalisée
          boxShadow: "0 1px 12px rgba(var(--primary-rgb), 0.4)",
        }}
      >
        {/* Effet de brillance amélioré */}
        <div
          className="absolute top-0 right-0 bottom-0 w-32 animate-shimmer"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            transform: "skewX(-25deg) translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
} 

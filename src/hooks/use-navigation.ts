import { useRouter } from "next/navigation";
import { useLoading } from "@/providers/loading-provider";
import { useCallback } from "react";

export function useNavigation() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const navigate = useCallback(async (path: string) => {
    try {
      startLoading();
      router.push(path);
    } finally {
      // Ajout d'un petit délai pour éviter un flash du loader
      setTimeout(stopLoading, 500);
    }
  }, [router, startLoading, stopLoading]);

  return { navigate };
} 

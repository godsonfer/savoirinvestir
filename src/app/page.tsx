"use client"


import { useEffect,  } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/courses')
  }, [router])

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-[200px] h-8 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[300px] h-4 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[250px] h-4 bg-gray-200 animate-pulse rounded-md" />
      </div>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      </div>      
    </div>
  );
}
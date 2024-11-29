"use client"

import { Skeleton } from "@/components/ui/skeleton"

export const CoursesSkeleton = () => {
  return (
    <div className="h-[100vh] overflow-hidden">
      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              {/* Action Buttons Skeleton */}
              <div className="flex justify-end items-end gap-2 p-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-[120px]" />
                ))}
              </div>
            </div>
          </div>

          <Skeleton className="h-[1px] w-full" />

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>

          {/* Categories and Users Section Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>

          {/* Table Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

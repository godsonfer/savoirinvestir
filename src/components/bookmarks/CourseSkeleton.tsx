import { ViewMode } from "@/types/course"

interface CourseSkeletonProps {
    viewMode: ViewMode
}

export const CourseSkeleton = ({ viewMode }: CourseSkeletonProps) => {
    return (
        <div className={`relative rounded-2xl overflow-hidden
            bg-gradient-to-b from-gray-900/80 to-gray-900/60
            border border-gray-800/50 backdrop-blur-sm
            animate-pulse
            ${viewMode === 'list' ? 'flex flex-col md:flex-row md:h-[240px]' : ''}`}
        >
            {/* Image skeleton */}
            <div className={`relative bg-gray-800/50 ${
                viewMode === 'list' 
                    ? 'w-full md:w-[360px] h-[200px] md:h-full shrink-0' 
                    : 'aspect-video'
            }`} />

            {/* Contenu skeleton */}
            <div className={`relative flex flex-col ${
                viewMode === 'list' ? 'flex-1 p-4 md:p-6' : 'p-6'
            }`}>
                {/* En-tête */}
                <div className="flex items-center justify-between mb-4">
                    <div className="w-2/3 h-6 bg-gray-800/50 rounded-lg" />
                    <div className="w-20 h-8 bg-gray-800/50 rounded-lg" />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-gray-800/50 rounded-lg" />
                    <div className="w-4/5 h-4 bg-gray-800/50 rounded-lg" />
                </div>

                {/* Stats */}
                <div className={`grid gap-3 mb-6 ${
                    viewMode === 'list' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
                }`}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-800/50 rounded-lg" />
                            <div className="flex flex-col gap-1">
                                <div className="w-16 h-3 bg-gray-800/50 rounded-lg" />
                                <div className="w-12 h-4 bg-gray-800/50 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6">
                    <div className="w-24 h-6 bg-gray-800/50 rounded-lg" />
                    <div className="w-32 h-6 bg-gray-800/50 rounded-lg" />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex gap-2">
                        <div className="w-24 h-9 bg-gray-800/50 rounded-lg" />
                        <div className="hidden md:block w-20 h-9 bg-gray-800/50 rounded-lg" />
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-9 h-9 bg-gray-800/50 rounded-lg" />
                        <div className="w-9 h-9 bg-gray-800/50 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
} 

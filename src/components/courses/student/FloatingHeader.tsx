import { motion } from 'framer-motion'
import Link from 'next/link'
import { ActionButtons } from './ActionButtons'
import { Play } from 'lucide-react'

interface FloatingHeaderProps {
    isVisible: boolean
    title: string
    isBookmarked: boolean
    onBookmark: () => void
    courseId: string
    firstChapterId?: string
}

export const FloatingHeader = ({ 
    isVisible, 
    title, 
    isBookmarked, 
    onBookmark,
    courseId,
    firstChapterId 
}: FloatingHeaderProps) => (
    <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
            y: isVisible ? 0 : -100,
            opacity: isVisible ? 1 : 0
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
        <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg font-semibold text-white truncate">
                        {title}
                    </h2>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:block">
                        <ActionButtons 
                            isBookmarked={isBookmarked}
                            onBookmark={onBookmark}
                            onShare={() => {}}
                            variant="compact"
                        />
                    </div>
                    {firstChapterId && (
                        <Link 
                            href={`/courses/${courseId}/lecture/${firstChapterId}`}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white px-3 py-2 text-sm rounded-lg font-medium hover:opacity-90 transition-all duration-300 whitespace-nowrap"
                        >
                            <Play className="w-4 h-4" />
                            <span className="hidden sm:inline">Commencer le cours</span>
                            <span className="sm:hidden">Commencer</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
) 

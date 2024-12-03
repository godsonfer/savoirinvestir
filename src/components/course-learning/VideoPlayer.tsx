import React from 'react'
import { Clock, Users, ChevronLeft, ChevronRight, CheckCircle, Play } from 'lucide-react'
import type { Lesson, Course, HTMLNode } from '@/types/course'
import { VideoSkeleton } from './VideoSkeleton'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import parse from 'html-react-parser'
import { VideoActionButtons } from './VideoActionButtons'
import { toast } from 'sonner'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CourseMuxPlayer } from '../courses/student/MuxPlayer'

interface VideoPlayerProps {
  currentLesson: Lesson | null
  course?: Course
  onComplete?: (lessonId: string) => void
  onNext?: () => void
  onPrevious?: () => void
  isCompleted?: boolean
  hasNext?: boolean
  hasPrevious?: boolean
}

const parseHTMLContent = (node: any): React.ReactNode => {
  if (node.type === 'tag') {
    const content = node.children?.[0]?.data || '';
    
    switch (node.name) {
      case 'h1':
        return <h1 className="text-xl font-bold mb-4">{content}</h1>;
      case 'h2':
        return <h2 className="text-lg font-semibold mb-3">{content}</h2>;
      case 'h3':
        return <h3 className="text-base font-semibold mb-2">{content}</h3>;
      case 'p':
        return <p className="text-gray-300 mb-4 leading-relaxed">{content}</p>;
      case 'ul':
        return (
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            {node.children?.map((child: HTMLNode, index: number) => (
              <li key={index} className="mb-1">{child.children?.[0]?.data || ''}</li>
            ))}
          </ul>
        );
      case 'ol':
        return (
          <ol className="list-decimal pl-6 mb-4 text-gray-300">
            {node.children?.map((child: HTMLNode, index: number) => (
              <li key={index} className="mb-1">{child.children?.[0]?.data || ''}</li>
            ))}
          </ol>
        );
      case 'code':
        return (
          <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono">
            {content}
          </code>
        );
      case 'pre':
        return (
          <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
            {content}
          </pre>
        );
      case 'blockquote':
        return (
          <blockquote className="border-l-4 border-[#0097A7] pl-4 italic text-gray-400 mb-4">
            {content}
          </blockquote>
        );
      default:
        return null;
    }
  }
  return null;
};

export const VideoPlayer = ({ 
  currentLesson, 
  course, 
  onComplete,
  onNext,
  onPrevious,
  isCompleted,
  hasNext,
  hasPrevious 
}: VideoPlayerProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  if (!currentLesson) {
    return <VideoSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="relative group">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm"
        >
          <div className="aspect-video bg-black">
            {currentLesson.muxData?.playback ? (
              <CourseMuxPlayer
                playbackId={currentLesson?.muxData?.playback || ''}
                title={currentLesson.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Overlay de navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            <AnimatePresence>
              {hasPrevious && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="pointer-events-auto"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-[#0097A7] hover:bg-[#008697] backdrop-blur-sm
                      hover:scale-110 transition-all duration-300"
                    onClick={onPrevious}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </Button>
                </motion.div>
              )}
              {hasNext && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="pointer-events-auto"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-[#0097A7] hover:bg-[#008697] backdrop-blur-sm
                      hover:scale-110 transition-all duration-300"
                    onClick={onNext}
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Barre d'informations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-black ",
              "pointer-events-none",
              isMobile ? "p-3" : "p-6"
            )}
          >
            <div className="max-w-3xl mx-auto">
              <div className={cn(
                "flex items-start gap-4",
                isMobile ? "flex-col" : "justify-between"
              )}>
                <div className="flex-1">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold text-white mb-3"
                  >
                    {currentLesson.title}
                  </motion.h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-sm text-white">
                        {course?.studentsCount || 0} étudiants
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white" />
                        <span className="text-sm text-white">
                        {currentLesson.duration || 0} min
                      </span>
                    </div>
                  </div>
              
                </div>
                <div className="pointer-events-auto">
                  <VideoActionButtons 
                    onShare={() => toast.success("Lien copié !")}
                    onSupport={() => toast.success("Merci pour votre soutien !")}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Barre de navigation et complétion */}
        <motion.div 
          className={cn(
            "absolute left-0 right-0 z-20",
            isMobile ? "-bottom-16 px-2" : "-bottom-12 px-4"
          )}
        >
          <div className={cn(
            "max-w-3xl mx-auto flex items-center",
            isMobile ? "flex-col gap-2" : "justify-between"
          )}>
            <div className="flex gap-2">
              <AnimatePresence mode="wait">
                {hasPrevious && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button
                      onClick={onPrevious}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white 
                        bg-[#0097A7] rounded-lg hover:bg-[#008697] transition-all duration-300
                        hover:shadow-lg hover:shadow-[#0097A7]/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Précédent</span>
                    </Button>
                  </motion.div>
                )}
                {hasNext && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Button
                      onClick={onNext}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white 
                        bg-[#0097A7] rounded-lg hover:bg-[#008697] transition-all duration-300
                        hover:shadow-lg hover:shadow-[#0097A7]/20"
                    >
                      <span className="hidden sm:inline">Suivant</span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={() => onComplete?.(currentLesson._id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300",
                isCompleted
                  ? "bg-green-600/20 text-green-500 hover:bg-green-600/30"
                  : "bg-[#0097A7] text-white hover:bg-[#008697] hover:shadow-lg hover:shadow-[#0097A7]/20"
              )}
            >
              <CheckCircle className={cn(
                "w-4 h-4",
                isCompleted && "animate-bounce"
              )} />
              <span className="hidden sm:inline">
                {isCompleted ? 'Complété' : 'Marquer comme terminé'}
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FolderOpen, CheckCircle2, PlayCircle } from 'lucide-react'
import type { Chapter, Lesson, Progress } from '@/types/course'

interface ChaptersListProps {
  chapters: Chapter[]
  currentLesson: Lesson | null
  progress: Progress | null
  onLessonSelect: (lesson: Lesson, chapterId: string) => void
}

export const ChaptersList = ({ 
  chapters, 
  currentLesson, 
  progress,
  onLessonSelect
}: ChaptersListProps) => {
  const lessonProgress = (chapter: Chapter) => {
    if (!progress) return 0
    const completedCount = chapter.lessons.filter(lesson => 
      progress.completedLessons.includes(lesson._id)
    ).length
    return chapter.lessons.length > 0 
      ? Math.round((completedCount / chapter.lessons.length) * 100)
      : 0
  }

  return (
    <Accordion 
      type="multiple" 
      defaultValue={chapters.map(chapter => chapter._id)} 
      className="space-y-2"
    >
      {chapters.map((chapter) => (
        <AccordionItem 
          key={chapter._id} 
          value={chapter._id}
          className="border-0 bg-white/5 rounded-xl overflow-hidden"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#178F65]/20">
                <FolderOpen className="w-4 h-4 text-[#178F65]" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-white">{chapter.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="h-1 bg-[#178F65] transition-all duration-300"
                    style={{ width: `${lessonProgress(chapter)}%` }}
                  />
                  <span className="text-xs text-white/60">
                    {progress ? 
                      `${chapter.lessons.filter(l => progress.completedLessons.includes(l._id)).length}`
                      : 0
                    }/{chapter.lessons.length}
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="space-y-1 px-2">
              {chapter.lessons
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => onLessonSelect(lesson, chapter._id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg
                      ${currentLesson?._id === lesson._id 
                        ? 'bg-[#178F65] text-white' 
                        : 'text-white/70 hover:bg-white/5'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${currentLesson?._id === lesson._id 
                        ? 'bg-white/20' 
                        : 'bg-white/5'
                      }
                    `}>
                      {progress?.completedLessons.includes(lesson._id) ? (
                        <CheckCircle2 className="w-4 h-4 text-[#20A271]" />
                      ) : (
                        <PlayCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm line-clamp-1">{lesson.title}</span>
                      <span className="text-xs opacity-60">
                        {lesson.duration || 0} min
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
} 

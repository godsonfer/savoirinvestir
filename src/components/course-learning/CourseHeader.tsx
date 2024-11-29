import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Course, Chapter, Lesson } from '@/types/course'

interface CourseHeaderProps {
  course?: Course
  currentLesson: Lesson | null
  onLessonSelect: (lesson: Lesson) => void
}

export const CourseHeader = ({ course, currentLesson, onLessonSelect }: CourseHeaderProps) => {
  return (
    <div className="bg-[#1a1b1a] border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Retour et titre du cours */}
          <div className="flex items-center gap-4">
            <Link 
              href={`/courses/${course?._id}`}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour au cours</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <h1 className="text-lg font-medium text-white line-clamp-1">
              {course?.title}
            </h1>
          </div>

          {/* Menu mobile des leçons */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md p-0 bg-[#1a1b1a] border-neutral-800">
              <SheetHeader className="p-4 border-b border-white/10">
                <SheetTitle className="text-white">Toutes les leçons</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-full py-4">
                {course?.chapters.map((chapter: Chapter) => (
                  <div key={chapter._id} className="px-4">
                    <h2 className="text-sm font-medium text-white/60 mb-2">
                      {chapter.title}
                    </h2>
                    <div className="space-y-1">
                      {chapter.lessons.map((lesson: Lesson) => (
                        <button
                          key={lesson._id}
                          onClick={() => {
                            onLessonSelect(lesson)
                          }}
                          className={`
                            w-full flex items-center gap-3 p-3 rounded-lg text-left
                            ${currentLesson?._id === lesson._id 
                              ? 'bg-[#178F65] text-white' 
                              : 'text-white/70 hover:bg-white/5'
                            }
                          `}
                        >
                          <span className="text-sm line-clamp-1">
                            {lesson.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
} 

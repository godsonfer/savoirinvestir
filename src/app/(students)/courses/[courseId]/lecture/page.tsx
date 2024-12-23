/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { VideoPlayer } from '@/components/course-learning/VideoPlayer'
import { ChaptersList } from '@/components/course-learning/ChaptersList'

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Course, Lesson, Chapter, Progress } from '@/types/course'
import { ResourcesPanel } from '@/components/course-learning/ResourcesPanel'
import { CommentsPanel } from '@/components/course-learning/CommentsPanel'
import { MobileNavigation } from '@/components/course-learning/MobileNavigation'
import { ChevronLeft, ChevronRight, } from 'lucide-react'
import { Id } from '../../../../../../convex/_generated/dataModel'
type ResourceType = 'pdf' | 'video' | 'image' | 'other';
interface Comment {
  _id: string;
  canDelete: boolean
  user: {
    _id: Id<"users"> | undefined;
    name?: string;
    avatar?: string;
  };
  message: string;
  createdAt?: Date;
  type?: 'text' | 'audio' | 'video' | 'image';
  replies?: Comment[];
}

interface Attachment {
  _id: Id<"attachments">;
  name: string;
  url: string
  type: ResourceType
  description?: string;
}

interface LessonFromAPI {
  _id: string;
  title: string;
  description?: string;
  type?: 'video' | 'text' | 'article' | 'quiz';
  comments?: Comment[];
  muxData: {
    _id: string;
    _creationTime: number;
    playback?: string;
    courseId: string;
    lessonId: string;
    chapterId: string;
    assetId: string;
  } | null;
  chapterId: string;
}

const CourseLearningPage = () => {
  const courseId = useCourseId()
  const { data, isLoading } = useGetCourse({ courseId })

  const [currentLesson, setCurrentLesson] = useState<LessonFromAPI | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isLoading && data && data?.chapters) {
      const totalLessons = data?.chapters.reduce(
        (acc, chapter) => acc + chapter.lessons.length,
        0
      )

      setProgress({
        completedLessons: [],
        totalLessons,
        completedChapters: [],
        totalChapters: data.chapters.length,
        percentageCompleted: 0
      })
    }
  }, [data?.chapters, data, isLoading])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
        setIsRightSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLessonComplete = (lessonId: string) => {
    if (!progress) return

    setProgress(prev => {
      if (!prev) return prev
      const newCompletedLessons = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId]

      return {
        ...prev,
        completedLessons: newCompletedLessons,
        percentageCompleted: Math.round((newCompletedLessons.length / prev.totalLessons) * 100)
      }
    })
  }

  const closeSidebars = useCallback(() => {
    setIsSidebarOpen(false)
    setIsRightSidebarOpen(false)
  }, [])

  const handleOutsideClick = useCallback((e: React.MouseEvent) => {
    if (isMobile && (isSidebarOpen || isRightSidebarOpen)) {
      const target = e.target as HTMLElement
      if (target.closest('.sidebar-content')) return
      closeSidebars()
    }
  }, [isMobile, isSidebarOpen, isRightSidebarOpen, closeSidebars])

  const findAdjacentLessons = useCallback(() => {
    if (!data?.chapters || !currentLesson) return { prev: null, next: null }

    let prevLesson: LessonFromAPI | null = null
    let nextLesson: LessonFromAPI | null = null
    let foundCurrent = false

    for (let i = 0; i < data.chapters.length; i++) {
      const lessons = data.chapters[i].lessons
      for (let j = 0; j < lessons.length; j++) {
        if (foundCurrent) {
          nextLesson = lessons[j]
          break
        }
        if (lessons[j]._id === currentLesson._id) {
          foundCurrent = true
          if (j > 0) {
            prevLesson = lessons[j - 1]
          } else if (i > 0) {
            const prevChapterLessons = data.chapters[i - 1].lessons
            prevLesson = prevChapterLessons[prevChapterLessons.length - 1]
          }
        } else if (!foundCurrent) {
          prevLesson = lessons[j]
        }
      }
      if (foundCurrent && !nextLesson && i + 1 < data.chapters.length) {
        nextLesson = data.chapters[i + 1].lessons[0]
      }
    }

    return { prev: prevLesson, next: nextLesson }
  }, [data?.chapters, currentLesson])

  const { prev, next } = findAdjacentLessons()
  return (
    <div className="h-screen flex flex-col bg-[#1a1b1a]">
      {isMobile && (isSidebarOpen || isRightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeSidebars}
        />
      )}

      <div className="flex-1 flex overflow-hidden relative pt-14 lg:pt-0" onClick={handleOutsideClick}>
        <div
          className={`
            sidebar-content
            h-full flex flex-col bg-[#1a1b1a] border-r border-white/10
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-[400px] lg:w-[400px]' : 'w-0'}
            ${isMobile ? `
              fixed top-14 bottom-16 z-50
              ${isSidebarOpen ? 'left-0' : '-left-full'}
            ` : 'relative'}
          `}
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <ChaptersList
              chapters={(data?.chapters as unknown as Chapter[])}
              currentLesson={(currentLesson as unknown as Lesson)}
              progress={progress}
              onLessonSelect={(lesson) => {
                setCurrentLesson(lesson as unknown as LessonFromAPI)
                handleLessonComplete(lesson._id)
                if (isMobile) closeSidebars()
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden mt-auto">
          <div className="flex-1 flex flex-col dark:bg-black/50">
            <div className="w-full max-w-[1280px]  mx-auto px-4">
              <VideoPlayer
                currentLesson={(currentLesson as unknown as Lesson)}
                course={(data?.course as unknown as Course)}
                onComplete={handleLessonComplete}
                hasNext={!!next}
                onNext={() => setCurrentLesson(next)}
                hasPrevious={!!prev}
                onPrevious={() => setCurrentLesson(prev)}
              />
            </div>
          </div>
        </div>

        <div
          className={`
            sidebar-content
            h-full flex flex-col bg-[#1a1b1a] border-l border-white/10
            transition-all duration-300 ease-in-out
            ${isRightSidebarOpen ? 'w-[350px] lg:w-[350px]' : 'w-0'}
            ${isMobile ? `
              fixed top-14 bottom-16 z-50
              ${isRightSidebarOpen ? 'right-0' : '-right-full'}
            ` : 'relative'}
          `}
        >
          <Tabs defaultValue="comments" className="h-full flex flex-col">
            <TabsList className="flex p-2 gap-1 bg-transparent border-b border-white/50">
              <TabsTrigger
                value="comments"
                className="flex-1 data-[state=active]:bg-[#178F65] text-white"
              >
                Commentaires
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="flex-1 data-[state=active]:bg-[#178F65] text-white"
              >
                Ressources
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="comments" className="h-full m-0">
                <CommentsPanel
                  message={currentLesson?.comments as Comment[]}
                  lessonId={currentLesson?._id as Id<"lessons">}
                />
              </TabsContent>
              <TabsContent value="attachments" className="h-full m-0">
                <ResourcesPanel resources={data?.attachments as Attachment[]} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {!isMobile && (
          <>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className={`
                absolute top-1/2 -translate-y-1/2 z-10
                flex items-center justify-center
                h-20 w-6 bg-[#178F65] hover:bg-[#2392A2]
                rounded-r-md transition-all duration-300
                ${isSidebarOpen ? 'left-[400px]' : 'left-0'}
              `}
            >
              <ChevronLeft
                className={`w-4 h-4 text-white transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'
                  }`}
              />
            </button>

            <button
              onClick={() => setIsRightSidebarOpen(prev => !prev)}
              className={`
                absolute top-1/2 -translate-y-1/2 z-10
                flex items-center justify-center
                h-20 w-6 bg-[#178F65] hover:bg-[#2392A2]
                rounded-l-md transition-all duration-300
                ${isRightSidebarOpen ? 'right-[350px]' : 'right-0'}
              `}
            >
              <ChevronRight
                className={`w-4 h-4 text-white transition-transform duration-300 ${isRightSidebarOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>
          </>
        )}
      </div>

      <MobileNavigation
        isCourseLecuture={true}
        courseId={courseId}
        courseTitle={data?.course?.title}
        onOpenSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenResources={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      <style jsx global>{`
        @media (max-width: 1024px) {
          body {
            padding-bottom: 4rem;
            overflow-x: hidden;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default CourseLearningPage 

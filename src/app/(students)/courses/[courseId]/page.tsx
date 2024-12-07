'use client'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { HeroSection } from '@/components/courses/student/HeroSection'
import { CourseBadges } from '@/components/courses/student/CourseBadges'
import { EnrollmentCard } from '@/components/courses/student/EnrollmentCard'
import { ActionButtons } from '@/components/courses/student/ActionButtons'
import { StatCard } from '@/components/courses/student/StatCard'
import { Clock, Users, Star, BookOpen } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Course, Chapter, Lesson } from '@/types/course'
import { CourseDialogs } from '@/components/courses/student/CourseDialogs'
import { CourseDescription } from '@/components/courses/student/CourseDescription'
import { CoursePageSkeleton } from '@/components/courses/student/CoursePageSkeleton'
import { FloatingHeader } from '@/components/courses/student/FloatingHeader'
import { MobileActionButton } from '@/components/courses/student/MobileActionButton'

const StudentCoursePage = () => {
    const courseId = useCourseId()
    const { data, isLoading } = useGetCourse({ courseId: courseId })
    const course = data?.course as Course | undefined
    const chapters = data?.chapters as Chapter[] || []
    
    const [isBookmarked, setIsBookmarked] = useState(false)
  
    const [isScrolled, setIsScrolled] = useState(false)
    const [showMobileAction, setShowMobileAction] = useState(true)

    const totalDuration = useMemo(() => {
        return chapters.reduce((acc, chapter) => {
            return acc + chapter.lessons.reduce((lessonAcc: number, lesson: Lesson) => {
                return lessonAcc + (lesson.duration || 0)
            }, 0)
        }, 0)
    }, [chapters])

    const firstChapterId = chapters[0]?._id

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setIsScrolled(scrollPosition > window.innerHeight * 0.5)
            setShowMobileAction(scrollPosition < window.innerHeight * 0.7)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (isLoading || !course) {
        return <CoursePageSkeleton />
    }

    return (
        <div className="min-h-screen">
            <FloatingHeader 
                isVisible={isScrolled}
                title={course.title}
                isBookmarked={isBookmarked}
                onBookmark={() => setIsBookmarked(!isBookmarked)}
                courseId={courseId}
                firstChapterId={firstChapterId}
            />

            <section className="relative min-h-screen lg:h-screen bg-gradient-to-b from-[#0097A7]/20 via-black/5 to-black/90">
                <HeroSection course={course} />

                <div className="absolute inset-0 z-10">
                    <div className="container mx-auto px-4 h-full py-20 lg:py-0">
                        <div className="flex flex-col lg:flex-row gap-6 md:gap-12 h-full lg:items-center">
                            <div className="flex flex-col justify-center flex-1 pt-16 md:pt-0">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-4 md:space-y-6 lg:max-w-3xl"
                                >
                                    <CourseBadges 
                                        category={course.category} 
                                        level={course.level} 
                                    />

                                    <motion.h1 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                                    >
                                        {course.title}
                                    </motion.h1>

                                    <CourseDescription description={course.description || ''} />

                                    <div className="flex flex-wrap items-center gap-2">
                                        <ActionButtons 
                                            isBookmarked={isBookmarked}
                                            onBookmark={() => setIsBookmarked(!isBookmarked)}
                                            onShare={() => {}}
                                        />
                                    </div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
                                    >
                                        <StatCard
                                            icon={<Users className="w-4 h-4 md:w-5 md:h-5" />}
                                            value={course.studentsCount}
                                            label="Étudiants"
                                        />
                                        <StatCard
                                            icon={<Clock className="w-4 h-4 md:w-5 md:h-5" />}
                                            value={`${totalDuration} min`}
                                            label="Durée"
                                        />
                                        <StatCard
                                            icon={<BookOpen className="w-4 h-4 md:w-5 md:h-5" />}
                                            value={chapters.length}
                                            label="Chapitres"
                                        />
                                        <StatCard
                                            icon={<Star className="w-4 h-4 md:w-5 md:h-5 text-[#D6620F]" />}
                                            value={course.rating}
                                            label="Note"
                                        />
                                    </motion.div>

                                    <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:pb-0 md:px-0 md:mx-0">
                                        <CourseDialogs course={course} chapters={chapters} />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="lg:w-[420px] xl:w-[480px] mt-6 lg:mt-0 flex items-center">
                                <div className="w-full sticky top-24">
                                    <EnrollmentCard 
                                        courseId={courseId}
                                        price={course.price}
                                        firstChapterId={firstChapterId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="lg:hidden">
                <div className="container mx-auto px-4 py-8">
                    <CourseDialogs course={course} chapters={chapters} />
                </div>
            </section>

            <MobileActionButton 
                courseId={courseId}
                firstChapterId={firstChapterId}
                isVisible={showMobileAction}
            />
        </div>
    )
}

export default StudentCoursePage

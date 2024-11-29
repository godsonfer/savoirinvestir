import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Info, MessageSquare } from 'lucide-react'
import { CourseCurriculum } from './CourseCurriculum'
import { CourseReviews } from './CourseReviews'
import { CourseDetails } from './CourseDetails'
import { Course, Chapter } from '@/types/course'

interface CourseTabsProps {
    course: Course
    chapters: Chapter[]
}

export const CourseTabs = ({ course, chapters }: CourseTabsProps) => {
    return (
        <Tabs defaultValue="curriculum" className="w-full">
            <div className="sticky top-[72px] z-40 bg-transparent">
                <TabsList className="w-full p-2 bg-black/50 backdrop-blur-md rounded-xl mb-6">
                    <TabsTrigger 
                        value="curriculum"
                        className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0097A7] data-[state=active]:to-[#D6620F] rounded-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-center gap-2 p-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Programme</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="details"
                        className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0097A7] data-[state=active]:to-[#D6620F] rounded-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-center gap-2 p-2">
                            <Info className="w-4 h-4" />
                            <span>Détails</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="reviews"
                        className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0097A7] data-[state=active]:to-[#D6620F] rounded-lg transition-all duration-300"
                    >
                        <div className="flex items-center justify-center gap-2 p-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Avis ({course.reviewsCount})</span>
                        </div>
                    </TabsTrigger>
                </TabsList>
            </div>

            <div className="space-y-6 overflow-y-auto">
                <TabsContent value="curriculum" className="mt-0 focus-visible:outline-none">
                    <CourseCurriculum chapters={chapters} />
                </TabsContent>

                <TabsContent value="details" className="mt-0 focus-visible:outline-none">
                    <CourseDetails course={course} />
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 focus-visible:outline-none">
                    <CourseReviews course={course} />
                </TabsContent>
            </div>
        </Tabs>
    )
} 

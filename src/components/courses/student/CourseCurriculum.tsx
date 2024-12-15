import { Chapter } from '@/types/course'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { FolderOpen, Clock, BookOpen, Lock, CheckCircle2, Video, FileText } from 'lucide-react'
import { PreviewDialog } from './PreviewDialog'
import { motion } from 'framer-motion'

interface CourseCurriculumProps {
    chapters: Chapter[]
}

export const CourseCurriculum = ({ chapters }: CourseCurriculumProps) => {
    const getLessonIcon = (type: string, isCompleted: boolean, isLocked: boolean) => {
        if (isCompleted) return <CheckCircle2 className="w-4 h-4 text-green-500" />
        if (isLocked) return <Lock className="w-4 h-4 text-white/40" />
        
        switch (type) {
            case 'video':
                return <Video className="w-4 h-4 text-[#0097A7]" />
            case 'article':
                return <FileText className="w-4 h-4 text-[#0097A7]" />
            default:
                return <BookOpen className="w-4 h-4 text-[#0097A7]" />
        }
    }

    return (
        <div className="space-y-4">
            {chapters.map((chapter, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={chapter._id}
                >
                    <Accordion type="single" collapsible>
                        <AccordionItem value={chapter._id} className="border-white/10">
                            <AccordionTrigger className="hover:no-underline group">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 flex items-center justify-center">
                                        <FolderOpen className="w-6 h-6 text-[#0097A7] group-hover:text-[#D6620F] transition-colors duration-300" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-semibold text-lg text-white group-hover:text-[#D6620F] transition-colors duration-300">
                                            {chapter.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-white/60">
                                            <span>{chapter.lessons.length} leçons</span>
                                            <Progress value={30} className="w-20 h-1.5">
                                                <div className="h-full bg-gradient-to-r from-[#0097A7] to-[#D6620F] rounded-full" />
                                            </Progress>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pl-16">
                                    {chapter.lessons.map((lesson, lessonIndex) => {
                                        const isLocked = lessonIndex > 2
                                        const isCompleted = lessonIndex < 2

                                        return (
                                            <div 
                                                key={lesson._id}
                                                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 flex items-center justify-center">
                                                        {getLessonIcon(lesson.type as "video" | "exercise", isCompleted, isLocked)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-medium ${isLocked ? 'text-white/40' : 'text-white'}`}>
                                                            {lesson.title}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-sm text-white/60">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{lesson.duration} min</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {lesson.type === 'video' && <Video className="w-3 h-3" />}
                                                                {lesson.type === 'article' && <FileText className="w-3 h-3" />}
                                                                <span>{lesson.type}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <PreviewDialog lesson={lesson} isLocked={isLocked} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            ))}
        </div>
    )
} 

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Course, Chapter } from '@/types/course'
import { CourseCurriculum } from './CourseCurriculum'
import { CourseDetails } from './CourseDetails'
import { CourseReviews } from './CourseReviews'
import { BookOpen, Info, MessageSquare, X } from 'lucide-react'

interface CourseDialogsProps {
    course: Course
    chapters: Chapter[]
}

export const CourseDialogs = ({ course, chapters }: CourseDialogsProps) => {
    return (
        <div className="flex items-center gap-3 md:gap-4 min-w-max md:min-w-0 px-4 md:px-0 overflow-x-auto pb-4 hide-scrollbar">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-sm md:text-base">
                        <BookOpen className="w-4 h-4" />
                        <span className="whitespace-nowrap">Programme</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] md:h-[80vh] overflow-hidden bg-black/95 border-white/10 p-4 md:p-6">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-lg md:text-xl font-bold text-white">
                            Programme du cours
                        </DialogTitle>
                        <button 
                            onClick={() => (document.querySelector('button[aria-label="Close"]') as HTMLButtonElement)?.click()}
                            className="text-white/60 hover:text-white md:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </DialogHeader>
                    <div className="mt-4 h-[calc(90vh-100px)] md:h-[calc(80vh-100px)] overflow-y-auto custom-scrollbar">
                        <CourseCurriculum chapters={chapters} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Détails */}
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-sm md:text-base">
                        <Info className="w-4 h-4" />
                        <span>Détails</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] overflow-hidden bg-black/95 border-white/10 p-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl font-bold text-white">Détails du cours</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 h-[calc(90vh-100px)] overflow-y-auto custom-scrollbar">
                        <CourseDetails course={course} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Avis */}
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 text-sm md:text-base">
                        <MessageSquare className="w-4 h-4" />
                        <span>Avis</span>
                        <span className="text-white/60">({course.reviewsCount})</span>
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] overflow-hidden bg-black/95 border-white/10 p-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg md:text-xl font-bold text-white">Avis des étudiants</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 h-[calc(90vh-100px)] overflow-y-auto custom-scrollbar">
                        <CourseReviews course={course} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 

import { Course } from '@/types/course'
import { CheckCircle2, Info, Target } from 'lucide-react'
import { motion } from 'framer-motion'

interface CourseDetailsProps {
    course: Course
}

export const CourseDetails = ({ course }: CourseDetailsProps) => {
    return (
        <div className="space-y-8">
            {/* À propos */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
                <h3 className="text-xl font-bold mb-4 text-white">À propos de ce cours</h3>
                <p className="text-white/90 whitespace-pre-line">{course?.description}</p>
            </motion.div>

            {/* Ce que vous apprendrez */}
            {course?.skills && course.skills.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                >
                    <h3 className="text-xl font-bold mb-6 text-white">Ce que vous apprendrez</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.skills.map((skill: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#0097A7] mt-1" />
                                <span className="text-white/90">{skill}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Prérequis */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
                <h3 className="text-xl font-bold mb-6 text-white">Prérequis</h3>
                <div className="space-y-3">
                    {course?.prerequisites?.map((prerequisite: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-[#D6620F] mt-1" />
                            <span className="text-white/90">{prerequisite}</span>
                        </div>
                    )) || (
                        <p className="text-white/60">Aucun prérequis nécessaire</p>
                    )}
                </div>
            </motion.div>

            {/* Pour qui est ce cours */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
                <h3 className="text-xl font-bold mb-6 text-white">Pour qui est ce cours ?</h3>
                <div className="space-y-3">
                    {course?.targetAudience?.map((target: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-[#0097A7] mt-1" />
                            <span className="text-white/90">{target}</span>
                        </div>
                    )) || (
                        <p className="text-white/60">Ce cours est ouvert à tous</p>
                    )}
                </div>
            </motion.div>
        </div>
    )
} 

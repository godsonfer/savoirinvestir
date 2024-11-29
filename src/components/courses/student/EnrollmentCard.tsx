import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Clock, BookOpen, Star } from 'lucide-react'
import { CourseFeature } from './CourseFeature'

interface EnrollmentCardProps {
    courseId: string
    price?: number
    firstChapterId?: string
}

export const EnrollmentCard = ({ courseId, price, firstChapterId }: EnrollmentCardProps) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full"
    >
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 via-transparent to-[#D6620F]/10 rounded-2xl" />
            
            <div className="relative space-y-8">
                <div className="text-center space-y-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent">
                        Gratuit
                    </span>
                    <div className="text-gray-500 text-sm">
                        <span className="line-through">{price}€</span>
                        <span className="ml-2 text-[#D6620F]">100% off</span>
                    </div>
                </div>

                {firstChapterId && (
                    <Link href={`/courses/${courseId}/lecture/${firstChapterId}`}>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white rounded-xl py-4 px-6 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <Play className="w-5 h-5" />
                            Commencer le cours
                        </motion.button>
                    </Link>
                )}

                <div className="space-y-4 pt-4">
                    <CourseFeature Icon={Clock} text="Accès à vie" />
                    <CourseFeature Icon={BookOpen} text="Contenu mis à jour régulièrement" />
                    <CourseFeature Icon={Star} text="Certificat de réussite" color="#D6620F" />
                </div>
            </div>
        </div>
    </motion.div>
) 

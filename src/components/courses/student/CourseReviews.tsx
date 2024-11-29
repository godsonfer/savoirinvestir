import { Course } from '@/types/course'
import { Star, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'

interface CourseReviewsProps {
    course: Course
}

export const CourseReviews = ({ course }: CourseReviewsProps) => {
    const [newRating, setNewRating] = useState(0)
    const [comment, setComment] = useState('')

    return (
        <div className="space-y-8">
            {/* Section statistiques */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Note globale */}
                    <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-[#0097A7]">
                            {course?.rating || '0.0'}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <= Math.floor(Number(course?.rating) || 0)
                                                ? 'text-[#D6620F] fill-[#D6620F]'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-white/60">
                                {course?.reviewsCount || 0} avis
                            </span>
                        </div>
                    </div>

                    {/* Distribution des notes */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-4">
                                <div className="flex items-center gap-2 w-20">
                                    <span className="text-sm text-white">{rating}</span>
                                    <Star className="w-4 h-4 text-[#D6620F] fill-[#D6620F]" />
                                </div>
                                <Progress 
                                    value={70} 
                                    className="h-2 flex-1 bg-white/10"
                                />
                                <span className="text-sm text-white/60 w-12">70%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Formulaire d'avis */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
                <h3 className="font-medium mb-4 text-white">Donnez votre avis</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer transition-all duration-300 ${
                                    star <= newRating 
                                        ? 'text-[#D6620F] fill-[#D6620F]' 
                                        : 'text-gray-300 hover:text-[#D6620F]'
                                }`}
                                onClick={() => setNewRating(star)}
                            />
                        ))}
                    </div>
                    <Textarea
                        placeholder="Votre commentaire..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-white/10 border-0 focus:ring-1 focus:ring-[#0097A7] text-white"
                    />
                    <button className="bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white px-4 py-2 rounded-lg">
                        Publier
                    </button>
                </div>
            </motion.div>

            {/* Liste des avis */}
            <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                    <motion.div 
                        key={review}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + review * 0.1 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#0097A7]/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#0097A7]" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">John Doe</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= 4
                                                            ? 'text-[#D6620F] fill-[#D6620F]'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            il y a 2 jours
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-white/80">
                            Excellent cours, très bien structuré et expliqué. Je recommande !
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 

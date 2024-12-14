import { Course, Rating } from '@/types/course'
import { Star, Trash, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import { toast } from 'sonner'

import { Id } from '../../../../convex/_generated/dataModel'
import { useCreateCourseRating } from '@/features/ratings/use-create-course-rating'
import {  formatDistanceToNow , } from 'date-fns'
import {fr}  from 'date-fns/locale'
import { Avatar } from '@/components/ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/use-confirm'
import { useRemoveRating } from '@/features/ratings/use-remove-rating'

interface CourseReviewsProps {
    course: Course
}

export const CourseReviews = ({ course }: CourseReviewsProps) => {
    const [ ConfirmDialog, confirm,] =  useConfirm ('Suppression de votre avis ?', 'Vous ne pouvez pas revenir en arriere')
    const [newRating, setNewRating] = useState(0)
    const [comment, setComment] = useState('')

    const {mutate: createNewReview, isPending} = useCreateCourseRating()
    const {mutate: removeReview, isPending: isDeleting} = useRemoveRating()
    
    const calculateRatingPercentage = (rating: number) => {
        const totalReviews = course?.reviewsCount || 0
        if (totalReviews === 0) return 0
        const ratingCount = course?.reviewComments?.filter((r: Rating) => r.rate === rating)?.length || 0
        return (ratingCount / totalReviews) * 100
    }

    const handleReview = () => {
        if (newRating === 0) {
            toast.error('Veuillez sélectionner une note')
            return
        }
        if (comment.trim().length < 10) {
            toast.error('Votre commentaire doit faire au moins 10 caractères')
            return
        }

        createNewReview({
            courseId: course._id as Id<"courses">,
            rating: newRating,
            comment: comment.trim()
        }, {
            onSuccess: () => {
                toast.success('Votre avis a été enregistré avec succès')
                setNewRating(0)
                setComment('')
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de l\'envoi de votre avis')
            }
        })
    }

    const handleDeleteReview =async  (id :  Id<"ratings">) => {
        const ok =  await confirm()
        if (!ok) { return }
        removeReview ({ratingId :  id }, {
            onSuccess: () => {
                toast.success('Votre avis a été supprimé avec succès', )
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression de votre avis')
            }
        })
    }

    return (
        <div className="space-y-8">
            <ConfirmDialog />
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
                            {course?.rating || '4.0'}
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
                                    value={calculateRatingPercentage(rating)} 
                                    className="h-2 flex-1 bg-white/10"
                                />
                                <span className="text-sm text-white/60 w-16">
                                    {calculateRatingPercentage(rating).toFixed(0)}%
                                </span>
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
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 transition-colors ${
                                        star <= newRating
                                            ? 'text-[#D6620F] fill-[#D6620F]'
                                            : 'text-gray-300 hover:text-[#D6620F]'
                                    }`}
                                />
                            </button>
                        ))}
                        <span className="text-sm text-white/60 ml-2">
                            {newRating > 0 ? `${newRating} étoile${newRating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
                        </span>
                    </div>
                    <Textarea
                        placeholder="Votre commentaire..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-white/10 border-0 focus:ring-1 focus:ring-[#0097A7] text-white"
                    />
                    <button
                        onClick={handleReview}
                        disabled={isPending || newRating === 0 || comment.trim().length < 10}
                        className={`px-4 py-2 rounded-lg bg-[#0097A7] text-white font-medium
                            ${isPending || newRating === 0 || comment.trim().length < 10
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-[#00838F] transition-colors'
                            }`}
                    >
                        {isPending ? 'Envoi en cours...' : 'Envoyer mon avis'}
                    </button>
                </div>
            </motion.div>

            {/* Liste des avis */}
            <div className="space-y-4">
                {course?.reviewComments?.map((review, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#0097A7]/20 flex items-center justify-center">
                                   <Avatar className='w-5 h-5 '>
                                    <AvatarImage src={review.author.image} alt={review.author.name} />
                                    <AvatarFallback>
                                         <User className="w-5 h-5 text-[#0097A7]" />
                                    </AvatarFallback>
                                   </Avatar>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{review.author.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= review.rate
                                                            ? 'text-[#D6620F] fill-[#D6620F]'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-white/60">
                                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-white/80">
                            {review.comment}
                        </p>
                       {
                        review.canDelete && (
                            <div className="flex flex-end justify-end items-end">
                            <Button disabled={isDeleting} onClick={() => handleDeleteReview(review._id as Id<"ratings">)} variant="destructive" size='iconSm' className="mt-4">
                            <Trash className='w-4 h-4 text-orange-500'/>   
                            </Button>
                        </div>
                        )
                       }
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 

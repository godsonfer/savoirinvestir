/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookmarkIcon, Clock, Layers, Star, Heart, Coffee, Users,  Timer,  BookAIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import Confetti from 'react-dom-confetti'
import { format } from 'date-fns'

import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Tooltip } from "./tooltip"
import { useCreateBookmark } from "@/features/bookmarks/use-create-bookmark"
import { toast } from "sonner"
import { Id } from "../../convex/_generated/dataModel"

interface CourseCardProps {
    id: Id<"courses">
    title: string
    description: string
    imageUrl: string
    category: string
    price: number
    creation: number
    lessonLength?: number
    chapterLength?: number
    progress: number | null
    isBookmarked: boolean
    canDelete?: boolean
    ratings?: number[]
    studentCount?: number
    reviewCount?: number
    duration?: number
    lastUpdate?: number
}

export const CourseCard = ({
    id,
    title,
    description,
    imageUrl,
    category,
    price,
    creation,
    lessonLength = 0,
    chapterLength = 0,
    progress,
    isBookmarked,
    ratings = [],
    studentCount = 0,
    reviewCount = 0,
    duration = 0,
    lastUpdate,
}: CourseCardProps) => {
    const { mutate: createBookmark, isPending: isCreatingBookmark } = useCreateBookmark()

    const [isHovered, setIsHovered] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [confettiKey, setConfettiKey] = useState(0)

    const averageRating = ratings.length > 0 
        ? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length 
        : 0

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours === 0) {
            return `${minutes} min`
        }
        
        if (remainingMinutes === 0) {
            return `${hours}h`
        }

        return `${hours}h ${remainingMinutes}min`
    }

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 20,
        elementCount: 70,
        dragFriction: 0.12,
        duration: 2000,
        stagger: 3,
        width: "10px",
        height: "10px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    }

    const handleHoverStart = () => {
        setIsHovered(true)
        setConfettiKey(prev => prev + 1)
    }

    const handleHoverEnd = () => {
        setIsHovered(false)
    }

    const handleBookmark = () => {
        createBookmark({ courseId: id }, {
          onSuccess: () => {
                toast.success("Cours ajouté aux favoris")
            },
            onError: () => {
                toast.error("Erreur lors de l'ajout aux favoris")
            }
        })
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            className="h-full relative"
        >
            {/* Confetti container avec key unique */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50">
                <Confetti 
                    key={confettiKey}
                    active={isHovered}
                    config={confettiConfig}
                />
            </div>

            <Card className="group relative overflow-hidden bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Effet de fond au hover */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-300",
                    isHovered && "opacity-100"
                )} />

                <Link href={`/courses/${id}`}>
                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                            src={imageUrl || "/placeholder-course.jpg"}
                            alt={title}
                            fill
                            className={cn(
                                "object-cover transition-transform duration-300",
                                isHovered && "scale-110"
                            )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Price Badge */}
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground border border-primary-foreground/20 rounded-full">
                            {price === 0 ? "Gratuit" : ` Pourboie de ${price}€`}
                        </Badge>
                    </div>

                    <div className="p-4 relative z-10">
                        {/* Title & Description */}
                        <div className="space-y-2">
                            <h3 className="font-semibold line-clamp-1 text-lg group-hover:text-primary transition-colors">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
                        </div>

                        {/* Metadata */}
                        <div className="mt-4 space-y-3">
                            {/* Première ligne: Catégorie et Note */}
                            <div className="flex items-center justify-between text-sm">
                                <Badge variant="secondary" className="px-2 py-0.5">
                                    {category}
                                </Badge>
                                <Tooltip content={`${reviewCount} avis - Note moyenne: ${averageRating.toFixed(1)}/5`}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span>{averageRating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-muted-foreground">({reviewCount})</span>
                                    </div>
                                </Tooltip>
                            </div>

                            {/* Deuxième ligne: Chapitres, Leçons et Durée */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <Tooltip content="Structure du cours">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Layers className="h-4 w-4" />
                                            <span>{chapterLength} chapitres</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookAIcon className="h-4 w-4" />
                                            <span>{lessonLength} leçons</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Timer className="h-4 w-4" />
                                            <span>{formatDuration(duration)}</span>
                                        </div>
                                    </div>
                                </Tooltip>
                            </div>

                         
                            {/* Troisième ligne: Étudiants */}
                            <Tooltip content="Nombre d'étudiants inscrits">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{studentCount.toLocaleString('fr-FR')} étudiants</span>
                                </div>
                            </Tooltip>

                            {/* Progress Bar */}
                            {progress !== null && (
                                <Tooltip content={`Progression: ${progress}%`}>
                                    <div className="w-full bg-secondary rounded-full h-1.5">
                                        <div 
                                            className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </Tooltip>
                            )}

                            {/* Dates */}
                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <Tooltip content="Date de création">
                                    <p className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Créé {format(creation, 'dd MMMM yyyy', { locale: fr })}
                                    </p>
                                </Tooltip>
                                
                                {lastUpdate && lastUpdate !== creation && (
                                    <Tooltip content={format(lastUpdate, 'dd/MM/yyyy HH:mm')}>
                                        <p className="flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                                            Mis à jour {formatDistanceToNow(lastUpdate, { locale: fr, addSuffix: true })}
                                        </p>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Actions Buttons avec tooltips améliorés */}
                <div className={cn(
                    "absolute right-2 top-12 z-50 flex flex-row sm:flex-col gap-2 transition-all duration-300",
                    isHovered ? "translate-x-0 opacity-100" : "translate-x-2 sm:translate-x-10 opacity-0"
                )}>
                    {/* <Tooltip 
                        content={isFollowing ? "Unlike" : "Suivre"}
                        delayDuration={200}
                    >
                        <Button
                            size="icon"
                            variant={isFollowing ? "default" : "transparent"}
                            className="h-8 w-8 backdrop-blur-sm bg-background/20 hover:bg-background/30"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsFollowing(!isFollowing)
                            }}
                        >
                            <Heart className={cn(
                                "h-4 w-4 transition-colors",
                                isFollowing && "fill-current text-orange-600"
                            )} />
                        </Button>
                    </Tooltip> */}

                    <Tooltip 
                        content="Soutenir"
                        delayDuration={200}
                    >
                        <Button
                            size="icon"
                            variant="transparent"
                            className="h-8 w-8 backdrop-blur-sm bg-background/20 hover:bg-background/30"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                        >
                            <Coffee className="h-4 w-4" />
                        </Button>
                    </Tooltip>

                    <Tooltip 
                        content={isBookmarked ? "Favoris" : "Sauvegarder"}
                        delayDuration={200}
                    >
                        <Button
                            size="icon"
                            variant={isBookmarked ? "orange" : "transparent"}
                            className="h-8 w-8 backdrop-blur-sm bg-background/20 hover:bg-background/30"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleBookmark()
                            }}
                        >
                            <BookmarkIcon className={cn(
                                "h-4 w-4 transition-colors",
                                isBookmarked && "fill-current text-orange-600"
                            )} />
                        </Button>
                    </Tooltip>
                </div>
            </Card>
        </motion.div>
    )
}


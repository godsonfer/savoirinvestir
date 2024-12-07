/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
import { SupportDialog } from "./course-learning/SupportDialog"

export type ViewMode = "grid" | "list"

export interface CourseCardProps {
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
    viewMode?: ViewMode
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
    viewMode = "grid"
}: CourseCardProps) => {
    const { mutate: createBookmark,  } = useCreateBookmark()

    const [isHovered, setIsHovered] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [confettiKey, setConfettiKey] = useState(0)
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false)

    const openSupportDialog = () => {
        setIsSupportDialogOpen(true)
    }

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
            whileHover={{ y: viewMode === "grid" ? -5 : 0, scale: viewMode === "grid" ? 1.02 : 1 }}
            transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            className="h-full relative group"
        >
            {/* Confetti container avec key unique */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50">
                <Confetti 
                    key={confettiKey}
                    active={isHovered && viewMode === "grid"}
                    config={confettiConfig}
                />
            </div>

            <Card className={cn(
                "group relative overflow-hidden bg-card hover:shadow-2xl transition-all duration-500 h-full border-muted/40",
                viewMode === "list" ? "flex flex-row" : "flex flex-col"
            )}>
                {/* Effet de lumière au hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10 opacity-70" />
                    <div className="absolute -inset-[100%] animate-[spin_12s_linear_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
                </motion.div>

                <Link href={`/courses/${id}`} className={cn(
                    viewMode === "list" && "flex flex-row flex-1"
                )}>
                    {/* Container d'image avec effet de zoom amélioré */}
                    <motion.div 
                        className={cn(
                            "relative overflow-hidden",
                            viewMode === "grid" ? "aspect-video w-full rounded-t-lg" : "w-48 rounded-l-lg"
                        )}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Image
                            src={imageUrl || "/placeholder-course.jpg"}
                            alt={title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:saturate-110"
                        />
                        {/* Overlay gradient amélioré */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                    </motion.div>

                    {/* Contenu avec animations */}
                    <motion.div 
                        className={cn(
                            "relative z-10",
                            viewMode === "grid" ? "p-5" : "flex-1 p-4"
                        )}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Title & Description */}
                        <div className="space-y-3">
                            <div className={cn(
                                "flex items-start",
                                viewMode === "list" ? "justify-between gap-4" : "flex-col gap-3"
                            )}>
                                <h3 className="font-semibold line-clamp-1 text-lg group-hover:text-primary transition-colors duration-300">
                                    {title}
                                </h3>
                                {viewMode === "list" && (
                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium shrink-0">
                                        {category}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{description}</p>
                        </div>

                        {/* Metadata */}
                        <div className={cn(
                            "space-y-4",
                            viewMode === "grid" ? "mt-6" : "mt-4"
                        )}>
                            {/* Première ligne: Catégorie et Note */}
                            <div className="flex items-center justify-between">
                                {viewMode === "grid" && (
                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium">
                                        {category}
                                    </Badge>
                                )}
                                <Tooltip content={`${reviewCount} avis - Note moyenne: ${averageRating.toFixed(1)}/5`}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{averageRating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-muted-foreground text-xs">({reviewCount})</span>
                                    </div>
                                </Tooltip>
                            </div>

                            {/* Deuxième ligne: Structure du cours */}
                            <div className={cn(
                                "grid gap-2 text-xs text-muted-foreground",
                                viewMode === "grid" ? "grid-cols-3" : "grid-cols-4"
                            )}>
                                <Tooltip content="Chapitres">
                                    <div className="flex items-center gap-1.5 bg-muted/30 rounded-md p-2">
                                        <Layers className="h-3.5 w-3.5" />
                                        <span>{chapterLength}</span>
                                    </div>
                                </Tooltip>
                                <Tooltip content="Leçons">
                                    <div className="flex items-center gap-1.5 bg-muted/30 rounded-md p-2">
                                        <BookAIcon className="h-3.5 w-3.5" />
                                        <span>{lessonLength}</span>
                                    </div>
                                </Tooltip>
                                <Tooltip content="Durée">
                                    <div className="flex items-center gap-1.5 bg-muted/30 rounded-md p-2">
                                        <Timer className="h-3.5 w-3.5" />
                                        <span>{formatDuration(duration)}</span>
                                    </div>
                                </Tooltip>
                                {viewMode === "list" && (
                                    <Tooltip content="Nombre d'étudiants inscrits">
                                        <div className="flex items-center gap-1.5 bg-muted/30 rounded-md p-2">
                                            <Users className="h-3.5 w-3.5" />
                                            <span>{studentCount.toLocaleString('fr-FR')}</span>
                                        </div>
                                    </Tooltip>
                                )}
                            </div>

                            {viewMode === "grid" && (
                                <Tooltip content="Nombre d'étudiants inscrits">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground font-medium">{studentCount.toLocaleString('fr-FR')}</span>
                                        <span className="text-xs text-muted-foreground">étudiants</span>
                                    </div>
                                </Tooltip>
                            )}

                            {/* Progress Bar */}
                            {progress !== null && (
                                <Tooltip content={`Progression: ${progress}%`}>
                                    <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </Tooltip>
                            )}

                            {/* Dates */}
                            <div className={cn(
                                "flex items-center justify-between text-xs text-muted-foreground border-t border-muted/30",
                                viewMode === "grid" ? "pt-2" : "pt-3 mt-3"
                            )}>
                                <Tooltip content="Date de création">
                                    <p className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        {format(creation, 'dd MMM yyyy', { locale: fr })}
                                    </p>
                                </Tooltip>
                                
                                {lastUpdate && lastUpdate !== creation && (
                                    <Tooltip content={format(lastUpdate, 'dd/MM/yyyy HH:mm')}>
                                        <p className="flex items-center gap-1.5">
                                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                                            MAJ {formatDistanceToNow(lastUpdate, { locale: fr, addSuffix: true })}
                                        </p>
                                    </Tooltip>
                                )}
                            </div>

                            {/* Bouton de soutien */}
                            <div className="pt-3">
                                <Button
                                    variant="outline"
                                    className="w-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:via-amber-500/20 hover:to-yellow-500/20 border-orange-500/20 hover:border-orange-500/30 transition-all duration-300 group"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsSupportDialogOpen(true)
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Coffee className="h-4 w-4 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                                        <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                            Soutenir ce cours
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Boutons d'action avec nouvelle animation */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="absolute right-3 top-3 z-50 flex flex-col gap-2"
                        >
                            <Tooltip content="Soutenir">
                                <Button
                                    size="icon"
                                    variant="transparent"
                                    className="h-8 w-8 backdrop-blur-md bg-background/30 hover:bg-background/40 shadow-lg"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setIsSupportDialogOpen(true)
                                    }}
                                >
                                    <Coffee className="h-4 w-4" />
                                </Button>
                            </Tooltip>

                            <Tooltip content={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}>
                                <Button
                                    size="icon"
                                    variant={isBookmarked ? "orange" : "transparent"}
                                    className="h-8 w-8 backdrop-blur-md bg-background/30 hover:bg-background/40 shadow-lg"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleBookmark()
                                    }}
                                >
                                    <BookmarkIcon className={cn(
                                        "h-4 w-4 transition-colors duration-300",
                                        isBookmarked && "fill-current text-orange-600"
                                    )} />
                                </Button>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            <SupportDialog 
                isOpen={isSupportDialogOpen}
                courseId= {id}
                onClose={() => setIsSupportDialogOpen(false)}
            />
        </motion.div>
    )
}


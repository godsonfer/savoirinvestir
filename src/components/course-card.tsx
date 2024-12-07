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
import { sanitizeAndParseHTML } from "@/utils/sanitizeAndParsedHtml"

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
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50">
                <Confetti 
                    key={confettiKey}
                    active={isHovered && viewMode === "grid"}
                    config={confettiConfig}
                />
            </div>

            <Card className={cn(
                "group relative overflow-hidden bg-card hover:shadow-2xl transition-all duration-500 h-full border-muted/40",
                "dark:bg-slate-900/50 dark:hover:bg-slate-900/80 dark:border-slate-800/40",
                "backdrop-blur-sm dark:backdrop-blur-lg",
                viewMode === "list" ? "flex flex-row" : "flex flex-col"
            )}>
                {/* Effet de lumière au hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-tr opacity-70",
                        "from-primary/5 via-transparent to-primary/5",
                        "dark:from-[#0097A7]/10 dark:via-transparent dark:to-[#D6620F]/10"
                    )} />
                    <div className={cn(
                        "absolute -inset-[100%] animate-[spin_12s_linear_infinite]",
                        "bg-gradient-to-r from-transparent via-primary/5 to-transparent",
                        "dark:from-transparent dark:via-[#0097A7]/10 dark:to-transparent"
                    )} />
                </motion.div>

                <Link href={`/courses/${id}`} className={cn(
                    viewMode === "list" && "flex flex-row flex-1"
                )}>
                    {/* Container d'image avec effet de zoom amélioré */}
                    <motion.div 
                        className={cn(
                            "relative overflow-hidden",
                            viewMode === "grid" ? "aspect-video w-full rounded-t-lg" : "w-48 rounded-l-lg",
                            "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/80 after:via-black/20 after:to-transparent",
                            "dark:after:from-black/90 dark:after:via-black/30 dark:after:to-transparent/10",
                            "after:opacity-80 group-hover:after:opacity-70 after:transition-opacity after:duration-300"
                        )}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Image
                            src={imageUrl || "/placeholder-course.jpg"}
                            alt={title}
                            fill
                            className={cn(
                                "object-cover transition-all duration-700",
                                "group-hover:saturate-110",
                                "dark:brightness-90 dark:group-hover:brightness-100"
                            )}
                        />
                    </motion.div>

                    {/* Contenu avec animations */}
                    <motion.div 
                        className={cn(
                            "relative z-10",
                            viewMode === "grid" ? "p-5" : "p-4"
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
                                <h3 className={cn(
                                    "font-semibold line-clamp-1 text-lg transition-all duration-300",
                                    "text-foreground dark:text-slate-100",
                                    "group-hover:text-[#0097A7] dark:group-hover:text-[#0097A7]",
                                    "group-hover:translate-x-1 dark:group-hover:text-shadow-glow"
                                )}>
                                    {title}
                                </h3>
                                {viewMode === "list" && (
                                    <Badge variant="secondary" className={cn(
                                        "px-2.5 py-0.5 text-xs font-medium shrink-0",
                                        "text-foreground/90 dark:text-slate-200",
                                        "bg-secondary/80 dark:bg-slate-800/80",
                                        "group-hover:bg-[#0097A7]/10 dark:group-hover:bg-[#0097A7]/20",
                                        "transition-colors duration-300"
                                    )}>
                                        {category}
                                    </Badge>
                                )}
                            </div>
                            <p className={cn(
                                "text-sm line-clamp-2 leading-relaxed",
                                "text-muted-foreground dark:text-slate-300/80",
                                "group-hover:text-muted-foreground/80 dark:group-hover:text-slate-200/90",
                                "transition-colors duration-300"
                            )}>
                                {sanitizeAndParseHTML(description)}
                            </p>
                        </div>

                        {/* Metadata avec effets améliorés */}
                        <div className={cn(
                            "space-y-4",
                            viewMode === "grid" ? "mt-6" : "mt-4"
                        )}>
                            {/* Première ligne: Catégorie et Note */}
                            <div className="flex items-center justify-between">
                                {viewMode === "grid" && (
                                    <Badge variant="secondary" className={cn(
                                        "px-2.5 py-0.5 text-xs font-medium",
                                        "text-foreground/90 dark:text-slate-200",
                                        "bg-secondary/80 dark:bg-slate-800/80",
                                        "group-hover:bg-[#0097A7]/10 dark:group-hover:bg-[#0097A7]/20",
                                        "transition-colors duration-300"
                                    )}>
                                        {category}
                                    </Badge>
                                )}
                                <Tooltip content={`${reviewCount} avis - Note moyenne: ${averageRating.toFixed(1)}/5`}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <Star className={cn(
                                                "h-4 w-4 transition-transform duration-300",
                                                "fill-[#D6620F] text-[#D6620F]",
                                                "dark:fill-[#D6620F]/90 dark:text-[#D6620F]/90",
                                                "group-hover:scale-110"
                                            )} />
                                            <span className="font-medium text-foreground dark:text-slate-100">
                                                {averageRating.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground dark:text-slate-400 text-xs">
                                            ({reviewCount})
                                        </span>
                                    </div>
                                </Tooltip>
                            </div>

                            {/* Boutons d'action avec animations améliorées */}
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
                                                className={cn(
                                                    "h-8 w-8 backdrop-blur-md shadow-lg transition-all duration-300",
                                                    "bg-background/30 hover:bg-background/40",
                                                    "dark:bg-slate-900/30 dark:hover:bg-slate-900/40",
                                                    "hover:scale-110"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setIsSupportDialogOpen(true)
                                                }}
                                            >
                                                <Coffee className="h-4 w-4 text-[#D6620F] dark:text-[#D6620F]/90" />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip content={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}>
                                            <Button
                                                size="icon"
                                                variant={isBookmarked ? "orange" : "transparent"}
                                                className={cn(
                                                    "h-8 w-8 backdrop-blur-md shadow-lg transition-all duration-300",
                                                    "bg-background/30 hover:bg-background/40",
                                                    "dark:bg-slate-900/30 dark:hover:bg-slate-900/40",
                                                    "hover:scale-110"
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleBookmark()
                                                }}
                                            >
                                                <BookmarkIcon className={cn(
                                                    "h-4 w-4 transition-all duration-300",
                                                    isBookmarked 
                                                        ? "fill-[#D6620F] text-[#D6620F] dark:fill-[#D6620F]/90 dark:text-[#D6620F]/90" 
                                                        : "text-[#D6620F] dark:text-[#D6620F]/90"
                                                )} />
                                            </Button>
                                        </Tooltip>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </Link>
            </Card>

            <SupportDialog 
                isOpen={isSupportDialogOpen}
                courseId= {id}
                onClose={() => setIsSupportDialogOpen(false)}
            />
        </motion.div>
    )
}


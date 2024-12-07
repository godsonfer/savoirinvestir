/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useGetCourses } from "@/features/courses/api/use-get-courses"
import { CourseCard } from "@/components/course-card"
import type { ViewMode } from "@/components/course-card"
import { Course } from "@/types"
import { Id } from "../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { 
    Loader2, Grid, List, Search, SlidersHorizontal, 
    Check, ArrowUpDown, Clock, Star, TrendingUp,
    Layers, BookOpen, GraduationCap, Code, Palette, 
    LineChart, Briefcase, Lightbulb
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useSearchCourses } from "@/features/courses/api/use-search-courses"
import { SearchForm } from "@/components/search-form"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { CourseSkeleton } from "@/components/bookmarks/CourseSkeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"

type SortOption = {
    label: string
    value: string
    icon: React.ReactNode
    description: string
}

const sortOptions: SortOption[] = [
    {
        label: "Plus récent",
        value: "recent",
        icon: <Clock className="h-4 w-4" />,
        description: "Trier par date de création, du plus récent au plus ancien"
    },
    {
        label: "Mieux notés",
        value: "rating",
        icon: <Star className="h-4 w-4" />,
        description: "Trier par note moyenne, du mieux noté au moins bien noté"
    },
    {
        label: "Plus populaires",
        value: "popular",
        icon: <TrendingUp className="h-4 w-4" />,
        description: "Trier par nombre d'étudiants inscrits"
    },
    {
        label: "Prix croissant",
        value: "price_asc",
        icon: <ArrowUpDown className="h-4 w-4" />,
        description: "Trier par prix, du moins cher au plus cher"
    }
]

type Category = {
    label: string
    value: string
    icon: React.ReactNode
    description: string
    color: string
}

const categories: Category[] = [
    {
        label: "Développement",
        value: "development",
        icon: <Code className="h-4 w-4" />,
        description: "Programmation, web, mobile et logiciel",
        color: "from-blue-500/20 to-cyan-500/20"
    },
    {
        label: "Design",
        value: "design",
        icon: <Palette className="h-4 w-4" />,
        description: "UI/UX, graphisme et création visuelle",
        color: "from-purple-500/20 to-pink-500/20"
    },
    {
        label: "Business",
        value: "business",
        icon: <Briefcase className="h-4 w-4" />,
        description: "Marketing, vente et entrepreneuriat",
        color: "from-orange-500/20 to-amber-500/20"
    },
    {
        label: "Innovation",
        value: "innovation",
        icon: <Lightbulb className="h-4 w-4" />,
        description: "IA, blockchain et nouvelles technologies",
        color: "from-green-500/20 to-emerald-500/20"
    }
]

interface RatingUser {
    name?: string
    createdAt?: number
}

interface RatingDetail {
    rate: number
    createdAt: number
    comment?: string
}

interface ApiCourseRating {
    users: RatingUser[]
    rates: RatingDetail[]
}

interface ApiCategory {
    _id: Id<"categories">
    _creationTime: number
    workspaceId?: Id<"workspaces">
    title: string
    userId: Id<"users">
}

interface ApiCourse extends Omit<Course, 'rating' | 'category'> {
    rating?: ApiCourseRating
    category: ApiCategory | null
    chapters: {
        _id: Id<"chapters">
        title: string
        isPublished?: boolean
        lessons: {
            _id: Id<"lessons">
            title: string
            isPublished?: boolean
            type: "video" | "text" | "article" | "quiz" | "exercise"
            muxData?: {
                _id: Id<"muxData">
                _creationTime: number
                playback?: string
                courseId: Id<"courses">
                lessonId: Id<"lessons">
                chapterId: Id<"chapters">
                assetId: string
            } | null
            chapterId: Id<"chapters">
        }[]
        courseId: Id<"courses">
    }[]
}

const CoursesExplorerPage = () => {
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [selectedSort, setSelectedSort] = useState<string>("recent")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const { results: courses, status: coursesLoading, loadMore } = useGetCourses()
    const { searchQuery, setSearchQuery, searchResults, isLoading: isSearching } = useSearchCourses()
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const { theme } = useTheme()

    const formatCourseRating = (course: ApiCourse) => {
        if (!course.rating) return { rates: [], average: 0 }
        
        const rates = course.rating.rates.map(r => r.rate)
        const average = rates.length > 0
            ? rates.reduce((acc, curr) => acc + curr, 0) / rates.length
            : 0

        return {
            rates,
            average
        }
    }

    const formatCourseData = (course: ApiCourse): Course => {
        return {
            ...course,
            rating: formatCourseRating(course),
            category: course.category ? {
                title: course.category.title,
                _id: course.category._id
            } : undefined
        }
    }

    // Fonction pour gérer le chargement avec loading state
    const handleLoadMore = async () => {
        setIsLoadingMore(true)
        try {
            await loadMore()
        } finally {
            setIsLoadingMore(false)
        }
    }

    // Détermine quels cours afficher (recherche ou liste normale)
    const displayedCourses = searchQuery ? searchResults : courses
    const isLoading = searchQuery ? isSearching : coursesLoading === "LoadingFirstPage"

    const calculateLessonLength = (course: Course) => {
        if (!Array.isArray(course?.chapters)) return 0
        
        return course.chapters.reduce((acc: number, chapter) => {
            return acc + (Array.isArray(chapter?.lessons) ? chapter.lessons.length : 0)
        }, 0)
    }

    // Modifiez la façon dont les résultats de recherche sont transformés
    const formattedSearchResults = searchResults?.map(course => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category?.title // Extraire uniquement le titre de la catégorie
    })) ?? []

    return (
        <div className={cn(
            "min-h-screen h-[100dvh] flex flex-col relative overflow-hidden",
            "bg-gradient-to-b from-background to-background/95",
            "dark:from-background dark:to-background/90"
        )}>
            {/* Effets de fond */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Gradient principal */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-80",
                    "from-primary/5 via-background to-secondary/5",
                    "dark:from-primary/10 dark:via-background dark:to-secondary/10"
                )} />
                
                {/* Motif de points */}
                <div className={cn(
                    "absolute inset-0",
                    "bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_1px,transparent_1px)]",
                    "dark:bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.12)_1px,transparent_1px)]",
                    "bg-[length:24px_24px]",
                    "[mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
                )} />
                
                {/* Effet de lumière animé */}
                <div className="absolute -inset-[100%] animate-[spin_60s_linear_infinite] opacity-50">
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-r blur-3xl",
                        "from-primary/10 via-secondary/10 to-primary/10",
                        "dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20"
                    )} />
                </div>
                
                {/* Vagues animées */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-[500px]",
                    "bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm",
                    "dark:from-background/90 dark:to-transparent"
                )} />

                {/* Effet de grain */}
                <div className={cn(
                    "absolute inset-0 opacity-20",
                    "dark:opacity-30",
                    "[background-image:url('/noise.png')]",
                    "pointer-events-none"
                )} />

                {/* Effet de halo */}
                <div className={cn(
                    "absolute -top-[40%] -left-[40%] w-[160%] h-[160%]",
                    "bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.08)_0%,transparent_60%)]",
                    "dark:bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.12)_0%,transparent_60%)]",
                    "animate-[spin_60s_linear_infinite]",
                    "opacity-0 dark:opacity-100"
                )} />
            </div>

            {/* Header amélioré */}
            <div className={cn(
                "flex-none backdrop-blur-xl sticky top-0 z-10 border-b",
                "bg-background/40 border-border/40",
                "dark:bg-background/20 dark:border-border/10",
                "supports-[backdrop-filter]:bg-background/60"
            )}>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                                    Explorez nos formations
                                </h1>
                                <p className="text-muted-foreground dark:text-muted-foreground/70">
                                    Découvrez notre catalogue de formations et commencez votre apprentissage
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={cn(
                                        "transition-all backdrop-blur-xl bg-background/50",
                                        showFilters && "bg-primary/10 border-primary/50"
                                    )}
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                </Button>
                                <div className="h-6 w-[1px] bg-border/50 mx-2" />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "transition-all backdrop-blur-xl bg-background/50",
                                        viewMode === "grid" && "bg-primary/10 border-primary/50"
                                    )}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "transition-all backdrop-blur-xl bg-background/50",
                                        viewMode === "list" && "bg-primary/10 border-primary/50"
                                    )}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher une formation..."
                                            className="pl-10 bg-background/50 backdrop-blur-xl"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Menu Catégories */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full justify-between bg-background/50 backdrop-blur-xl group hover:bg-background/60 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span>
                                                        {selectedCategory 
                                                            ? categories.find(c => c.value === selectedCategory)?.label 
                                                            : "Toutes les catégories"}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            align="end" 
                                            className="w-[300px] p-2"
                                        >
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 p-2 cursor-pointer"
                                                onClick={() => setSelectedCategory(null)}
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <BookOpen className="h-4 w-4" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">Toutes les catégories</span>
                                                        <span className="text-xs text-muted-foreground">Voir tous les cours disponibles</span>
                                                    </div>
                                                </div>
                                                {!selectedCategory && <Check className="h-4 w-4 text-primary" />}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="my-2" />

                                            {categories.map((category) => (
                                                <DropdownMenuItem
                                                    key={category.value}
                                                    className="flex items-center gap-2 p-2 cursor-pointer"
                                                    onClick={() => setSelectedCategory(category.value)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <div className={cn(
                                                            "p-1 rounded bg-gradient-to-br",
                                                            category.color
                                                        )}>
                                                            {category.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{category.label}</span>
                                                            <span className="text-xs text-muted-foreground">{category.description}</span>
                                                        </div>
                                                    </div>
                                                    {selectedCategory === category.value && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Menu Tri */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full justify-between bg-background/50 backdrop-blur-xl group hover:bg-background/60 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    <span>
                                                        {sortOptions.find(s => s.value === selectedSort)?.label}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            align="end" 
                                            className="w-[300px] p-2"
                                        >
                                            {sortOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    className="flex items-center gap-2 p-2 cursor-pointer"
                                                    onClick={() => setSelectedSort(option.value)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <div className="p-1 rounded bg-primary/10">
                                                            {option.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{option.label}</span>
                                                            <span className="text-xs text-muted-foreground">{option.description}</span>
                                                        </div>
                                                    </div>
                                                    {selectedSort === option.value && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Contenu avec animation */}
            <div className="flex-grow overflow-y-auto relative">
                <div className="container mx-auto px-2 py-6">
                    <motion.div
                        layout
                        className={cn(
                            "grid gap-6 sm:gap-8",
                            viewMode === "grid" 
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
                                : "grid-cols-1 lg:grid-cols-2"
                        )}
                    >
                        {isLoading && (
                            Array.from({ length: 6 }).map((_, index) => (
                                <div 
                                    key={index} 
                                    className="bg-glass animate-shimmer"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <CourseSkeleton key={index} viewMode={viewMode} />
                                </div>
                            ))
                        )}
                        <AnimatePresence mode="popLayout">
                            {displayedCourses?.map((course) => {
                                const formattedCourse = formatCourseData(course)
                                return (
                                    <motion.div
                                        key={course._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CourseCard
                                            viewMode={viewMode}
                                            isBookmarked={formattedCourse.bookmark ?? false}
                                            creation={formattedCourse._creationTime}
                                            description={formattedCourse.description ?? "Aucune description"}
                                            category={formattedCourse.category?.title ?? "Non catégorisé"}
                                            lessonLength={calculateLessonLength(formattedCourse)}
                                            chapterLength={Array.isArray(formattedCourse.chapters) ? formattedCourse.chapters.length : 0}
                                            id={formattedCourse._id}
                                            title={formattedCourse.title}
                                            imageUrl={formattedCourse.cover ?? ""}
                                            price={formattedCourse.price ?? 0}
                                            progress={null}
                                            canDelete={formattedCourse.canDelete ?? false}
                                            ratings={formattedCourse.rating?.rates ?? []}
                                            duration={formattedCourse.duration ?? 0}
                                            lastUpdate={formattedCourse.updatedAt ?? formattedCourse._creationTime}
                                        />
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {/* Message si aucun résultat */}
                    {!isLoading && (!displayedCourses || displayedCourses.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-muted-foreground dark:text-muted-foreground/80 text-center">
                                {searchQuery 
                                    ? "Aucun cours ne correspond à votre recherche" 
                                    : "Aucune formation disponible pour le moment"}
                            </p>
                        </div>
                    )}

                    {/* Bouton "Charger plus" */}
                    {!searchQuery && courses && courses.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 mb-12 text-center"
                        >
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className={cn(
                                    "relative group min-w-[200px]",
                                    "h-auto px-8 py-3",
                                    "bg-card hover:bg-card/80",
                                    "border border-border/50 hover:border-primary/50",
                                    "text-card-foreground dark:text-white/90",
                                    "transition-all duration-300",
                                    "backdrop-blur-sm shadow-sm",
                                    "dark:bg-gray-900/40 dark:hover:bg-gray-900/60",
                                    "dark:shadow-lg dark:shadow-black/10",
                                    isLoadingMore && "opacity-90 cursor-wait"
                                )}
                            >
                                <div className="flex items-center justify-center gap-3 relative">
                                    {/* Texte avec effet de fade */}
                                    <motion.div
                                        animate={{
                                            opacity: isLoadingMore ? 0 : 1,
                                            y: isLoadingMore ? 10 : 0
                                        }}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="text-sm font-medium">
                                            Afficher plus de cours
                                        </span>
                                        <motion.div
                                            animate={{ 
                                                y: [0, 5, 0],
                                                opacity: [1, 0.5, 1] 
                                            }}
                                            transition={{ 
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut" 
                                            }}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </motion.div>
                                    </motion.div>

                                    {/* Indicateur de chargement avec animation */}
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: isLoadingMore ? 1 : 0,
                                            scale: isLoadingMore ? 1 : 0.8
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-sm font-medium text-primary">
                                                Chargement...
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Effet de hover et loading */}
                                <motion.div
                                    className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100"
                                    initial={false}
                                    animate={{ 
                                        background: isLoadingMore 
                                            ? "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.1) 0%, transparent 100%)"
                                            : [
                                                "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.075) 0%, transparent 100%)",
                                                "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15) 0%, transparent 100%)"
                                            ]
                                    }}
                                    transition={{ 
                                        duration: isLoadingMore ? 0.8 : 1, 
                                        repeat: Infinity, 
                                        repeatType: "reverse" 
                                    }}
                                />

                                {/* Barre de progression */}
                                {isLoadingMore && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-[2px] bg-primary/30"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                )}
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CoursesExplorerPage

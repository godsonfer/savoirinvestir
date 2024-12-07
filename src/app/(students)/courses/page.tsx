/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useGetCourses } from "@/features/courses/api/use-get-courses"
import { CourseCard } from "@/components/course-card"
import type { ViewMode } from "@/components/course-card"
import { Course } from "@/types"
import { Id } from "@/convex/_generated/dataModel"
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
import type { Course as CourseType } from "@/types"

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

interface ApiRating {
    _id: Id<"ratings">
    _creationTime: number
    rate: number
    comment?: string
    courseId: Id<"courses">
    userId: Id<"users">
}

interface ApiCourseRating {
    rates: ApiRating[]
    average: number
}

interface ApiCategory {
    _id: Id<"categories">
    _creationTime: number
    workspaceId?: Id<"workspaces">
    title: string
    userId: Id<"users">
}

interface ApiLesson {
    _id: Id<"lessons">
    title: string
    isPublished?: boolean
    type: "video" | "article" | "text" | "quiz" | "exercise"
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
}

interface ApiChapter {
    _id: Id<"chapters">
    title: string
    isPublished?: boolean
    lessons: ApiLesson[]
    courseId: Id<"courses">
}

interface ApiCourse {
    _id: Id<"courses">
    userId: Id<"users">
    title: string
    description: string
    imageUrl: string
    price: number
    isPublished?: boolean
    categoryId?: Id<"categories">
    chapters: ApiChapter[]
    category?: ApiCategory
    createdAt: number
    updatedAt?: number
    canDelete: boolean
    rating?: ApiCourseRating
}

interface RawCourse {
    _id: Id<"courses">
    userId: Id<"users">
    title: string
    description: string
    imageUrl: string
    price: number
    isPublished?: boolean
    categoryId?: Id<"categories">
    chapters: {
        _id: Id<"chapters">
        title: string
        isPublished?: boolean
        lessons: {
            _id: Id<"lessons">
            title: string
            isPublished?: boolean
            type?: "video" | "article" | "text" | "quiz" | "exercise"
            muxData: {
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
    _creationTime: number
    updatedAt?: number
    canDelete: boolean
}

interface Course {
    _id: Id<"courses">
    title: string
    description: string
    imageUrl: string
    price: number
    category?: {
        _id: Id<"categories">
        title: string
    }
    rating: {
        rates: number[]
        average: number
    }
    chapters: ApiChapter[]
    createdAt: number
    updatedAt?: number
    canDelete: boolean
    bookmark?: boolean
    _creationTime: number
}

const formatCourseData = (course: RawCourse): Course => {
    // Ensure type is always defined for lessons
    const formattedChapters = course.chapters.map((chapter) => ({
        ...chapter,
        courseId: course._id,
        lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            type: lesson.type || "video" // Default to "video" if type is undefined
        }))
    }))

    return {
        ...course,
        chapters: formattedChapters,
        createdAt: course._creationTime,
        bookmark: false // Default value
    }
}

const formatCourseRating = (course: ApiCourse): Course["rating"] => {
    if (!course.rating) return { rates: [], average: 0 }
    
    const rates = course.rating.rates.map((r) => r.rate)
    const average = rates.length > 0
        ? rates.reduce((acc, curr) => acc + curr, 0) / rates.length
        : 0

    return {
        rates,
        average
    }
}

const formatDisplayedCourse = (course: Course): CourseType => {
    const { category, ...rest } = course
    
    return {
        ...rest,
        rating: formatCourseRating(course),
        category: category ? {
            title: category.title,
            _id: category._id
        } : undefined
    }
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

    const formatCourseData = (course: ApiCourse): Course => {
        const { rating, category, chapters, ...rest } = course
        
        return {
            ...rest,
            rating: formatCourseRating(course),
            category: category ? {
                title: category.title,
                _id: category._id
            } : undefined,
            chapters: chapters.map(chapter => ({
                _id: chapter._id,
                title: chapter.title,
                isPublished: chapter.isPublished,
                lessons: chapter.lessons.map(lesson => ({
                    _id: lesson._id,
                    title: lesson.title,
                    isPublished: lesson.isPublished,
                    type: lesson.type === "video" || lesson.type === "exercise" 
                        ? lesson.type 
                        : "video",
                    muxData: lesson.muxData
                }))
            }))
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
        <div className="flex flex-col min-h-screen h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0097A7]/5 dark:via-[#001e21] dark:to-black relative overflow-hidden">
            {/* Effets de fond améliorés avec animations */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/3 via-transparent to-[#D6620F]/3 dark:from-[#0097A7]/10 dark:to-[#D6620F]/10 animate-gradient-x"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0097A7]/3 to-transparent dark:via-[#0097A7]/10 animate-gradient-y"></div>
                <div className="absolute top-0 -left-4 w-72 h-72 bg-[#0097A7] rounded-full mix-blend-multiply filter blur-xl opacity-[0.15] dark:opacity-10 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-[#D6620F] rounded-full mix-blend-multiply filter blur-xl opacity-[0.15] dark:opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#0097A7] rounded-full mix-blend-multiply filter blur-xl opacity-[0.15] dark:opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header amélioré avec textes ajustés */}
            <div className="shrink-0 px-3 md:px-4 py-3 bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-2xl sticky top-0 z-20 border-b border-[#0097A7]/10 dark:border-[#0097A7]/20 shadow-glass transition-all duration-300">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white/90">
                                    Explorez nos formations
                                </h1>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Découvrez notre catalogue de formations et commencez votre apprentissage
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={cn(
                                        "transition-all backdrop-blur-xl",
                                        showFilters && "bg-[#0097A7]/10 border-[#0097A7]/50"
                                    )}
                                >
                                    <SlidersHorizontal className="h-4 w-4 text-[#0097A7]" />
                                </Button>
                                <div className="h-6 w-[1px] bg-[#0097A7]/10 dark:bg-[#0097A7]/20 mx-2" />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "transition-all backdrop-blur-xl ",
                                        viewMode === "grid" && "bg-[#0097A7]/10 border-[#0097A7]/50"
                                    )}
                                >
                                    <Grid className="h-4 w-4 text-[#0097A7]" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "transition-all backdrop-blur-xl ",
                                        viewMode === "list" && "bg-[#0097A7]/10 border-[#0097A7]/50"
                                    )}
                                >
                                    <List className="h-4 w-4 text-[#0097A7]" />
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
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                                        <Input
                                            placeholder="Rechercher une formation..."
                                            className="pl-10 bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl border-[#0097A7]/10 dark:border-[#0097A7]/20 text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Menus déroulants avec textes ajustés */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full justify-between bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl border-[#0097A7]/10 dark:border-[#0097A7]/20 group text-gray-900 dark:text-white/90"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-[#0097A7]" />
                                                    <span>
                                                        {selectedCategory 
                                                            ? categories.find(c => c.value === selectedCategory)?.label 
                                                            : "Toutes les catégories"}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-[#0097A7]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            align="end" 
                                            className="w-[300px] p-2 bg-white/90 dark:bg-[#001e21]/90 backdrop-blur-xl border-[#0097A7]/10 dark:border-[#0097A7]/20"
                                        >
                                            <DropdownMenuItem
                                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#0097A7]/10 dark:hover:bg-[#0097A7]/20"
                                                onClick={() => setSelectedCategory(null)}
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <BookOpen className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 dark:text-white/90">Toutes les catégories</span>
                                                        <span className="text-xs text-gray-700 dark:text-gray-300">Voir tous les cours disponibles</span>
                                                    </div>
                                                </div>
                                                {!selectedCategory && <Check className="h-4 w-4 text-[#0097A7]" />}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator className="my-2 bg-[#0097A7]/10 dark:bg-[#0097A7]/20" />

                                            {categories.map((category) => (
                                                <DropdownMenuItem
                                                    key={category.value}
                                                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#0097A7]/10 dark:hover:bg-[#0097A7]/20"
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
                                                            <span className="font-medium text-gray-900 dark:text-white/90">{category.label}</span>
                                                            <span className="text-xs text-gray-700 dark:text-gray-300">{category.description}</span>
                                                        </div>
                                                    </div>
                                                    {selectedCategory === category.value && (
                                                        <Check className="h-4 w-4 text-[#0097A7]" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* Menu de tri avec textes ajustés */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="outline" 
                                                className="w-full justify-between bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl border-[#0097A7]/10 dark:border-[#0097A7]/20 group text-gray-900 dark:text-white/90"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-[#0097A7]" />
                                                    <span>
                                                        {sortOptions.find(s => s.value === selectedSort)?.label}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-[#0097A7]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            align="end" 
                                            className="w-[300px] p-2 bg-white/90 dark:bg-[#001e21]/90 backdrop-blur-xl border-[#0097A7]/10 dark:border-[#0097A7]/20"
                                        >
                                            {sortOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#0097A7]/10 dark:hover:bg-[#0097A7]/20"
                                                    onClick={() => setSelectedSort(option.value)}
                                                >
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <div className="p-1 rounded bg-[#0097A7]/10 dark:bg-[#0097A7]/20">
                                                            {option.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900 dark:text-white/90">{option.label}</span>
                                                            <span className="text-xs text-gray-700 dark:text-gray-300">{option.description}</span>
                                                        </div>
                                                    </div>
                                                    {selectedSort === option.value && (
                                                        <Check className="h-4 w-4 text-[#0097A7]" />
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

            {/* Contenu principal avec le nouveau style */}
            <div className="flex-grow overflow-y-auto relative pb-20">
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
                                    className="bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl animate-shimmer border border-[#0097A7]/10 dark:border-[#0097A7]/20 rounded-xl"
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
                                        className="bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl rounded-xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:border-[#0097A7]/30 dark:hover:border-[#0097A7]/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)]"
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

                    {/* Message si aucun résultat avec textes ajustés */}
                    {!isLoading && (!displayedCourses || displayedCourses.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                {searchQuery 
                                    ? "Aucun cours ne correspond à votre recherche" 
                                    : "Aucune formation disponible pour le moment"}
                            </p>
                        </div>
                    )}

                    {/* Bouton "Charger plus" avec textes ajustés */}
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
                                    "bg-white/90 dark:bg-[#001e21]/80",
                                    "border border-[#0097A7]/10 dark:border-[#0097A7]/20",
                                    "hover:border-[#0097A7]/30 dark:hover:border-[#0097A7]/40",
                                    "text-gray-900 dark:text-white/90",
                                    "transition-all duration-300",
                                    "backdrop-blur-xl",
                                    "hover:shadow-[0_0_15px_rgba(0,151,167,0.1)]",
                                    isLoadingMore && "opacity-90 cursor-wait"
                                )}
                            >
                                <div className="flex items-center justify-center gap-3 relative">
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
                                            <Loader2 className="h-4 w-4 animate-spin text-[#0097A7]" />
                                            <span className="text-sm font-medium text-[#0097A7]">
                                                Chargement...
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Ajout des keyframes pour les animations */}
            <style jsx global>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50% }
                    50% { background-position: 100% 50% }
                }
                @keyframes gradient-y {
                    0%, 100% { background-position: 50% 0% }
                    50% { background-position: 50% 100% }
                }
                .animate-gradient-x {
                    animation: gradient-x 15s ease infinite;
                    background-size: 200% 200%;
                }
                .animate-gradient-y {
                    animation: gradient-y 15s ease infinite;
                    background-size: 200% 200%;
                }
            `}</style>
        </div>
    )
}

export default CoursesExplorerPage

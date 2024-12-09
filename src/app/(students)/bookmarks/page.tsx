/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Bookmark } from "lucide-react"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { SearchBar } from "@/components/bookmarks/SearchBar"
import { ViewControls } from "@/components/bookmarks/ViewControls"
import { CourseCard } from "@/components/bookmarks/CourseCard"
import { CourseSkeleton } from "@/components/bookmarks/CourseSkeleton"
import { EmptyState } from "@/components/bookmarks/EmptyState"
import { CoursesLineChart, LineChartProps } from "@/components/charts/CoursesLineChart"
import { CoursesBarChart, BarChartProps } from "@/components/charts/CoursesBarChart"
import { HoursBarChart, HoursChartProps } from "@/components/charts/HoursBarChart"
import { Id } from "../../../../convex/_generated/dataModel"
import { useCreateBookmark } from "@/features/bookmarks/use-create-bookmark"
import { SortOption as ImportedSortOption } from "@/types/course"

import { useGetBookmarkPurchase } from "@/features/bookmarks/use-user-bookmark-purchase"
// Types de base
type ViewMode = 'grid' | 'list';
type SortOption = ImportedSortOption;

interface EditingNote {
    courseId: string;
    note?: string;
}

// Définition des types pour les chapitres et leçons
interface Lesson {
    _id: Id<"lessons">;
    title: string;
    completed?: boolean;
    duration?: number;
    description?: string;
    videoUrl?: string;
    muxData?: {
        _id: Id<"muxData">;
        _creationTime: number;
        playback?: string;
        courseId: Id<"courses">;
        lessonId: Id<"lessons">;
        chapterId: Id<"chapters">;
        assetId: string;
    } | null;
}

interface Chapter {
    _id: Id<"chapters">;
    title: string;
    description?: string;
    lessons: Lesson[];
    courseId: Id<"courses">;
}

interface Course {
    _id: Id<"courses">;
    title: string;
    description?: string;
    chapters?: Chapter[];
    duration?: number;
    category?: string;
    instructor?: string;
    price?: number;
    cover?: string;
    certification?: boolean;
    updatedAt?: number;
    _creationTime: number;
}

interface BookmarkedCourse {
    course: Course;
    progress?: number;
    _creationTime: number;
    type: 'bookmark';
    note?: string;
    rating?: number;
    totalStudents?: number;
    bookmarkedAt?: number;
    thumbnailUrl?: string;
}

interface ChartData {
    id: string;
    title: string;
    description: string;
    instructor: string;
    price: number;
    duration: number;
    progress: number;
    category?: string;
    rating?: number;
    totalStudents?: number;
    completedLessons?: number;
    totalLessons?: number;
}

// Types pour les graphiques
interface BaseChartData {
    id: string;
    title: string;
    category?: string;
}

interface LineChartData extends BaseChartData {
    progress: number;
    timestamp: number;
}

interface BarChartData extends BaseChartData {
    count: number;
}

interface HoursChartData extends BaseChartData {
    duration: number;
    completed: number;
}

// Props pour les composants de graphiques
declare module "@/components/charts/CoursesLineChart" {
    export interface LineChartProps {
        courses: LineChartData[];
    }
}

declare module "@/components/charts/CoursesBarChart" {
    export interface BarChartProps {
        courses: BarChartData[];
    }
}

declare module "@/components/charts/HoursBarChart" {
    export interface HoursChartProps {
        courses: HoursChartData[];
    }
}

interface ChartDataConverters {
    toLineChart: (courses: BookmarkedCourse[]) => LineChartData[];
    toBarChart: (courses: BookmarkedCourse[]) => BarChartData[];
    toHoursChart: (courses: BookmarkedCourse[]) => HoursChartData[];
}

const chartConverters: ChartDataConverters = {
    toLineChart: (courses) => {
        return courses.map(course => ({
            id: course.course._id,
            title: course.course.title,
            progress: course.progress || 0,
            timestamp: course._creationTime,
            category: course.course.category
        }));
    },

    toBarChart: (courses) => {
        const categoryCount = courses.reduce((acc, course) => {
            const category = course.course.category || "Non catégorisé";
            if (!acc[category]) {
                acc[category] = {
                    id: category,
                    title: category,
                    count: 0,
                    category
                };
            }
            acc[category].count++;
            return acc;
        }, {} as Record<string, BarChartData>);

        return Object.values(categoryCount);
    },

    toHoursChart: (courses) => {
        return courses.map(course => {
            const totalDuration = course.course.duration || 0;
            const progress = course.progress || 0;
            return {
                id: course.course._id,
                title: course.course.title,
                duration: totalDuration,
                completed: (totalDuration * progress) / 100,
                category: course.course.category
            };
        });
    }
};

// Fonction utilitaire pour calculer le nombre total d'exercices
const calculateTotalExercises = (courses: BookmarkedCourse[]): number => {
    return courses.reduce((acc, course) => {
        const chaptersExercises = course.course.chapters?.reduce((chAcc: number, ch: Chapter) => {
            return chAcc + (ch.lessons?.length || 0);
        }, 0) || 0;
        return acc + chaptersExercises;
    }, 0);
};

// Fonction utilitaire pour formater les durées
const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes}min`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
};

// Fonction utilitaire pour formater les dates
const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Fonction utilitaire pour formater les pourcentages
const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
};

const calculateStatistics = (courses: BookmarkedCourse[]) => {
    const totalCourses = courses.length;
    const totalExercises = courses.reduce((acc, course) => {
        return acc + (course.course.chapters?.reduce((chAcc, ch) => {
            return chAcc + (ch.lessons?.length || 0);
        }, 0) || 0);
    }, 0);
    
    const completedExercises = courses.reduce((acc, course) => {
        return acc + (course.course.chapters?.reduce((chAcc, ch) => {
            return chAcc + (ch.lessons?.filter(lesson => lesson.completed)?.length || 0);
        }, 0) || 0);
    }, 0);

    const totalDuration = courses.reduce((acc, course) => {
        return acc + (course.course.duration || 0);
    }, 0);

    const averageProgress = courses.reduce((acc, course) => {
        return acc + (course.progress || 0);
    }, 0) / (totalCourses || 1); // Éviter la division par zéro

    const lastUpdated = Math.max(...courses.map(c => c._creationTime));

    const categoriesCount = courses.reduce((acc, course) => {
        const category = course.course.category || "Non catégorisé";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoriesCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "Non catégorisé";

    return {
        totalCourses,
        totalExercises,
        completedExercises,
        completionRate: totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0,
        totalDuration,
        averageProgress,
        lastUpdated,
        topCategory,
        categoriesCount,
        formattedDuration: formatDuration(totalDuration),
        formattedAverageDuration: formatDuration(Math.round(totalDuration / (totalCourses || 1))),
        formattedLastUpdated: formatDate(lastUpdated),
        formattedProgress: formatPercentage(averageProgress),
        formattedCompletionRate: formatPercentage((completedExercises / (totalExercises || 1)) * 100)
    };
};

const BookmarksPage = () => {

    const { results: bookmarkedCourses } = useGetBookmarkPurchase()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [editingNote, setEditingNote] = useState<EditingNote | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const {mutate: deleteBookmark} = useCreateBookmark()

    useEffect(() => {
        // Réduire le temps de chargement à 500ms
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const filteredCourses = bookmarkedCourses.filter(course => 
    {
      return   course.course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.course.description?.toLowerCase().includes(searchQuery.toLowerCase()) 
    } )

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return b._creationTime - a._creationTime;
            case 'title':
                return a.course.title.localeCompare(b.course.title);
            default:
                return b._creationTime - a._creationTime;
        }
    });

    const handleRemoveBookmark = (courseId: Id<'courses'>) => {
        deleteBookmark({courseId}, {
            onSuccess: () => {
                toast.success(`Cours retiré des favoris`)
            },
            onError: () => {
                toast.error(`Une erreur est survenue lors de la suppression du cours des favoris`)
            }
        })
    }

    const handleLike = (courseId: Id<'courses'>) => {
   
        toast.success("Statut du like mis à jour")
    }

    const handleEdit = (courseId: Id<'courses'>, note?: string) => {
        setEditingNote({ courseId, note: note || '' })
    }

    const handleSaveNote = (courseId: Id<'courses'>, newNote: string) => {
        setEditingNote({ courseId, note: newNote || '' })
        toast.success("Note mise à jour")
    }

    const handleCancelEdit = () => {
        setEditingNote(null)
    }

    const stats = calculateStatistics(bookmarkedCourses);
    const lineChartData = chartConverters.toLineChart(bookmarkedCourses);
    const barChartData = chartConverters.toBarChart(bookmarkedCourses);
    const hoursChartData = chartConverters.toHoursChart(bookmarkedCourses);

    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
    };

    const handleViewModeChange = (value: ViewMode) => {
        setViewMode(value);
    };

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const style = document.createElement('style');
            style.textContent = `
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
            `;
            document.head.appendChild(style);
        }
    }, []);

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

            {/* En-tête fixe avec navigation et recherche */}
            <header className="shrink-0 px-3 md:px-4 py-3 bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-2xl sticky top-0 z-20 border-b border-[#0097A7]/10 dark:border-[#0097A7]/20 shadow-glass transition-all duration-300">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-neon-emerald hover:bg-emerald-500/15 transition-all duration-300 hover:scale-105 animate-float">
                                <Bookmark className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="animate-slide-right">
                                <h1 className="text-xl font-bold dark:text-white tracking-tight">Mes cours</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 animate-slide-left">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                            <ViewControls 
                                sortBy={sortBy}
                                onSortChange={handleSortChange}
                                viewMode={viewMode}
                                onViewModeChange={handleViewModeChange}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal défilant */}
            <main className="flex-1 overflow-y-auto overscroll-auto px-3 md:px-2 py-2 pb-20 relative z-10">
                <div className="container mx-auto space-y-6">
                    {isLoading ? (
                        <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "grid grid-cols-1 md:grid-cols-2 gap-6"
                        }>
                            {[...Array(6)].map((_, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl animate-shimmer"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <CourseSkeleton key={index} viewMode={viewMode} />
                                </div>
                            ))}
                        </div>
                    ) : sortedCourses.length === 0 ? (
                        <div className="animate-scale-up">
                            <EmptyState />
                        </div>
                    ) : (
                        <>
                            {/* Cartes statistiques */}
                            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <div className="group bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:bg-[#0097A7]/5 dark:hover:bg-[#002a2f]/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)] hover:border-[#0097A7]/20 dark:hover:border-[#0097A7]/30 hover:scale-102 animate-scale-up">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Cours suivis</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all duration-300 group-hover:scale-105">
                                                {stats.totalCourses}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#0097A7]/10 group-hover:bg-[#0097A7]/15 transition-all duration-300 group-hover:scale-110 shadow-neon">
                                            <svg className="w-6 h-6 text-[#0097A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Progression moyenne</p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700/30 rounded-full h-2 mt-2 overflow-hidden shadow-inner-glow">
                                            <div 
                                                className="bg-gradient-to-r from-[#0097A7] to-[#D6620F] h-2 rounded-full transition-all duration-500 ease-elastic animate-glow-pulse" 
                                                style={{ width: `${stats.averageProgress}%` }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:bg-[#0097A7]/5 dark:hover:bg-[#002a2f]/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)] hover:border-[#0097A7]/20 dark:hover:border-[#0097A7]/30 hover:scale-102 animate-scale-up">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Exercices complétés</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all duration-300 group-hover:scale-105">
                                                    {stats.completedExercises}
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-400">/ {stats.totalExercises}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/15 transition-all duration-300 group-hover:scale-110 shadow-neon-emerald">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Taux de réussite</p>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700/30 rounded-full h-2 mt-2 overflow-hidden shadow-inner-glow">
                                            <div 
                                                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-elastic animate-glow-pulse" 
                                                style={{ width: `${stats.completionRate}%` }}>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-700 dark:text-gray-400 mt-2 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">
                                            {stats.formattedCompletionRate} de réussite
                                        </p>
                                    </div>
                                </div>

                                <div className="group bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:bg-[#0097A7]/5 dark:hover:bg-[#002a2f]/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)] hover:border-[#0097A7]/20 dark:hover:border-[#0097A7]/30 hover:scale-102 animate-scale-up">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Temps d&apos;apprentissage</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all duration-300 group-hover:scale-105">
                                                    {stats.formattedDuration}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/15 transition-all duration-300 group-hover:scale-110 shadow-neon-purple">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Catégorie principale</p>
                                        <p className="text-sm text-gray-300 mt-1 group-hover:text-white transition-colors">
                                            {stats.topCategory}
                                        </p>
                                        <p className="text-xs text-gray-700 dark:text-gray-400 mt-2 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">
                                            Dernière mise à jour : {stats.formattedLastUpdated}
                                        </p>
                                    </div>
                                </div>

                                <div className="group bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:bg-[#0097A7]/5 dark:hover:bg-[#002a2f]/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)] hover:border-[#0097A7]/20 dark:hover:border-[#0097A7]/30 hover:scale-102 animate-scale-up">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Temps moyen / cours</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-all duration-300 group-hover:scale-105">
                                                    {stats.formattedAverageDuration}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-pink-500/10 group-hover:bg-pink-500/15 transition-all duration-300 group-hover:scale-110 shadow-neon">
                                            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-700 dark:text-gray-400 group-hover:text-[#0097A7] dark:group-hover:text-gray-300 transition-colors">Répartition des catégories</p>
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(stats.categoriesCount)
                                                .sort(([,a], [,b]) => b - a)
                                                .slice(0, 3)
                                                .map(([category, count]) => (
                                                    <div key={category} className="flex items-center justify-between">
                                                        <p className="text-xs text-gray-700 dark:text-gray-400">{category}</p>
                                                        <p className="text-xs text-gray-300">{count} cours</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section des graphiques */}
                            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div className="group bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#0097A7]/10 dark:border-[#0097A7]/20 hover:bg-[#0097A7]/5 dark:hover:bg-[#002a2f]/80 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,151,167,0.1)] hover:scale-102 animate-scale-up">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#0097A7] dark:group-hover:text-white transition-colors">Progression des cours</h3>
                                    <CoursesLineChart courses={lineChartData} />
                                </div>
                                <div className="bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-4 rounded-xl border border-[#0097A7]/10 dark:border-[#0097A7]/20">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Répartition par catégorie</h3>
                                    <CoursesBarChart courses={barChartData} />
                                </div>
                                <div className="md:col-span-2 xl:col-span-1 bg-white/90 dark:bg-[#001e21]/80 backdrop-blur-xl p-4 rounded-xl border border-[#0097A7]/10 dark:border-[#0097A7]/20">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Heures de formation</h3>
                                    <HoursBarChart courses={hoursChartData} />
                                </div>
                            </section>

                            {/* Liste des cours avec animation améliorée */}
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "grid grid-cols-1 md:grid-cols-2 gap-6"
                            }>
                                {sortedCourses.map((course, index) => (
                                    <div 
                                        key={course.course._id} 
                                        className="animate-scale-up transition-all duration-300 hover:scale-102"
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <CourseCard 
                                            isBookmarked={course.type === 'bookmark'}
                                            course={{
                                                id: course.course._id,
                                                liked: false,
                                                course: {
                                                    _id: course.course._id,
                                                    title: course.course.title,
                                                    description: course.course?.description || "",
                                                    cover: course.course.cover || "",
                                                    price: course.course.price || 0,
                                                    duration: course.course.duration || 0,
                                                    certification: course.course.certification || true,
                                                    lastUpdated: course.course.updatedAt || course.course._creationTime,
                                                    chapters: course.course.chapters || []
                                                }
                                            }}
                                            viewMode={viewMode}
                                            bookmark={{
                                                note: course.note || "",
                                                creation: course._creationTime
                                            }}
                                            editingNote={course.note ? { courseId: course.course._id, note: course.note } : null}
                                            onLike={() => handleLike(course.course._id)}
                                            onRemove={() => handleRemoveBookmark(course.course._id)}
                                            onEdit={(note) => handleEdit(course.course._id, note)}
                                            onSaveNote={(newNote) => handleSaveNote(course.course._id, newNote)}
                                            onCancelEdit={handleCancelEdit}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default BookmarksPage 

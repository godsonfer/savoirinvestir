'use client'

import { BookOpen, Clock, Target, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { CourseStats } from "@/types/dashboard"
import { StatCard } from "@/components/dashboard/StatCard"
import { BarChart } from "@/components/dashboard/BarChart"
import { LineChart } from "@/components/dashboard/LineChart"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useGetBookmarkPurchase } from "@/features/bookmarks/use-user-bookmark-purchase"
import { Id } from "../../../../convex/_generated/dataModel"

interface Bookmark {
    _id: Id<"bookmarks">
    _creationTime: number
    note?: string
    lessonId?: Id<"lessons">
    chapterId?: Id<"chapters">
    userId: Id<"users">
    courseId: Id<"courses">
    creation: number
}

const DashboardPage = () => {
    const [stats] = useState<CourseStats>({
        totalCourses: 12,
        completedCourses: 5,
        inProgressCourses: 7,
        totalExercises: 156,
        completedExercises: 89,
        inProgressExercises: 12,
        totalTime: 2450,
        averageProgress: 65,
        coursesByCategory: [
            { category: 'Développement Web', count: 5 },
            { category: 'Design', count: 3 },
            { category: 'Marketing', count: 2 },
            { category: 'Business', count: 2 },
        ],
        progressByMonth: [
            { month: 'Jan', completed: 1, started: 2 },
            { month: 'Fév', completed: 2, started: 3 },
            { month: 'Mar', completed: 1, started: 1 },
            { month: 'Avr', completed: 1, started: 2 },
            { month: 'Mai', completed: 0, started: 2 },
            { month: 'Juin', completed: 0, started: 1 },
        ],
        exercisesByType: [
            { type: 'Quiz', total: 45, completed: 32 },
            { type: 'Projet', total: 24, completed: 15 },
            { type: 'Exercice', total: 87, completed: 42 },
        ],
        timeSpentByDay: [
            { day: 'Lun', minutes: 120 },
            { day: 'Mar', minutes: 90 },
            { day: 'Mer', minutes: 180 },
            { day: 'Jeu', minutes: 60 },
            { day: 'Ven', minutes: 150 },
            { day: 'Sam', minutes: 210 },
            { day: 'Dim', minutes: 30 },
        ],
    })
    const [isLoading, setIsLoading] = useState(true)
    const { theme } = useTheme()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const { results: bookmarks } = useGetBookmarkPurchase()

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    }

    const chartColors = {
        primary: theme === 'dark' ? '#8B5CF6' : '#6366F1',
        secondary: theme === 'dark' ? '#10B981' : '#059669',
        tertiary: theme === 'dark' ? '#EC4899' : '#DB2777',
        background: theme === 'dark' ? '#1F2937' : '#F3F4F6',
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        // Simuler le chargement des données
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}min`
    }

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="container mx-auto space-y-8 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-gray-800/50" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-96 rounded-2xl bg-gray-800/50" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <motion.div 
                className="container mx-auto space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* En-tête */}
                <motion.div {...fadeInUp}>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Tableau de bord
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Suivez votre progression et vos performances
                    </p>
                </motion.div>

                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            title: "Cours suivis",
                            value: stats.totalCourses,
                            description: `${stats.completedCourses} terminés, ${stats.inProgressCourses} en cours`,
                            icon: BookOpen,
                            trend: { value: 12, isPositive: true }
                        },
                        {
                            title: "Exercices",
                            value: stats.totalExercises,
                            description: `${stats.completedExercises} terminés, ${stats.inProgressExercises} en cours`,
                            icon: Target,
                            trend: { value: 8, isPositive: true }
                        },
                        {
                            title: "Temps total",
                            value: formatTime(stats.totalTime),
                            description: "Cette semaine",
                            icon: Clock,
                            trend: { value: 5, isPositive: false }
                        },
                        {
                            title: "Progression moyenne",
                            value: `${stats.averageProgress}%`,
                            description: "Sur tous les cours",
                            icon: Award,
                            trend: { value: 15, isPositive: true }
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Exercices par type</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                    <span className="text-sm text-muted-foreground">Terminés</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                    <span className="text-sm text-muted-foreground">En cours</span>
                                </div>
                            </div>
                        </div>
                        <BarChart
                            title="Types d'exercices"
                            data={stats.exercisesByType.map(item => ({
                                label: item.type,
                                values: [
                                    item.completed,
                                    item.total - item.completed
                                ],
                                colors: [chartColors.primary, chartColors.secondary]
                            }))}
                            categories={['Terminés', 'En cours']}
                        />
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {stats.exercisesByType.map((item, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-sm font-medium">{item.type}</p>
                                    <p className="text-2xl font-bold text-primary">{item.completed}</p>
                                    <p className="text-xs text-muted-foreground">sur {item.total}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Progression mensuelle</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.primary }}></div>
                                    <span className="text-sm text-muted-foreground">Cours terminés</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors.tertiary }}></div>
                                    <span className="text-sm text-muted-foreground">Cours commencés</span>
                                </div>
                            </div>
                        </div>
                        <LineChart
                            title="Évolution mensuelle"
                            data={[
                                {
                                    label: 'Cours terminés',
                                    values: stats.progressByMonth.map(m => m.completed),
                                    color: chartColors.primary,
                                },
                                {
                                    label: 'Cours commencés',
                                    values: stats.progressByMonth.map(m => m.started),
                                    color: chartColors.tertiary,
                                }
                            ]}
                            labels={stats.progressByMonth.map(m => m.month)}
                        />
                        <div className="mt-4 flex justify-between">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Total terminés</p>
                                <p className="text-2xl font-bold text-primary">
                                    {stats.progressByMonth.reduce((acc, curr) => acc + curr.completed, 0)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Moyenne mensuelle</p>
                                <p className="text-2xl font-bold text-primary">
                                    {Math.round(stats.progressByMonth.reduce((acc, curr) => acc + curr.completed, 0) / stats.progressByMonth.length)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">En cours</p>
                                <p className="text-2xl font-bold text-tertiary">
                                    {stats.progressByMonth.reduce((acc, curr) => acc + curr.started, 0)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Temps passé par jour */}
                <motion.div
                    className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <LineChart
                        title="Temps passé par jour"
                        data={[{
                            label: 'Minutes',
                            values: stats.timeSpentByDay.map(d => d.minutes),
                            color: chartColors.primary
                        }]}
                        labels={stats.timeSpentByDay.map(d => d.day)}
                    />
                </motion.div>

                {/* Répartition par catégorie */}
                <motion.div
                    className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <BarChart
                        title="Répartition par catégorie"
                        data={[{
                            label: 'Cours',
                            values: stats.coursesByCategory.map(c => c.count),
                            colors: stats.coursesByCategory.map(() => chartColors.secondary)
                        }]}
                        categories={stats.coursesByCategory.map(c => c.category)}
                    />
                </motion.div>

                {/* Section Bookmarks */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Vos Bookmarks
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 rounded-full bg-card hover:bg-card/80 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 rounded-full bg-card hover:bg-card/80 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto pb-4 hide-scrollbar"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                            {!bookmarks ? (
                                <div className="flex items-center justify-center w-full h-48">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : bookmarks.length === 0 ? (
                                <div className="flex items-center justify-center w-full h-48 text-muted-foreground">
                                    Aucun bookmark pour le moment
                                </div>
                            ) : (
                                bookmarks.map((bookmark: Bookmark, index: number) => (
                                    <motion.div
                                        key={bookmark._id}
                                        className="min-w-[300px] p-6 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <BarChart
                                            title={`Bookmark #${index + 1}`}
                                            data={[{
                                                label: 'Progression',
                                                values: [bookmark.creation || 0, 100 - (bookmark.creation || 0)],
                                                colors: [chartColors.primary, chartColors.background]
                                            }]}
                                            categories={['Complété', 'Restant']}
                                        />
                                        {bookmark.note && (
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                {bookmark.note}
                                            </p>
                                        )}
                                        <div className="mt-2 text-xs text-muted-foreground">
                                            {new Date(bookmark._creationTime).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}

export default DashboardPage 

'use client'

import { useState, useEffect } from "react"
import { BookOpen, Clock, Target, Award, Bookmark, Grid, List } from "lucide-react"
import { CourseStats } from "@/types/dashboard"
import { BookmarkedCourse, SortOption, ViewMode } from "@/types/course"
import { StatCard } from "@/components/dashboard/StatCard"
import { BarChart } from "@/components/dashboard/BarChart"
import { LineChart } from "@/components/dashboard/LineChart"
import { SearchBar } from "@/components/bookmarks/SearchBar"
import { ViewControls } from "@/components/bookmarks/ViewControls"
import { CourseCard } from "@/components/bookmarks/CourseCard"
import { EmptyState } from "@/components/bookmarks/EmptyState"

const ProfilePage = () => {
    // États pour les statistiques
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

    // États pour les favoris
    const [bookmarkedCourses, setBookmarkedCourses] = useState<BookmarkedCourse[]>([
        {
            id: '1',
            title: 'Introduction au Développement Web',
            description: 'Apprenez les bases du développement web avec HTML, CSS et JavaScript',
            instructor: 'John Doe',
            duration: 120,
            rating: 4.8,
            totalStudents: 1234,
            note: 'Très bon cours pour les débutants',
            bookmarkedAt: new Date(),
            thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
            progress: 45,
            price: 49.99,
            originalPrice: 199.99,
            certification: true,
            reviews: 234,
            liked: true,
            lastUpdated: new Date('2024-02-15'),
        },
        {
            id: '2',
            title: 'React.js pour les Débutants',
            description: 'Maîtrisez React.js et créez des applications web modernes',
            instructor: 'Jane Smith',
            duration: 180,
            rating: 4.9,
            totalStudents: 2156,
            note: 'Excellent cours sur React',
            bookmarkedAt: new Date(),
            thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
            progress: 75,
            price: 59.99,
            originalPrice: 299.99,
            certification: true,
            reviews: 156,
            liked: false,
            lastUpdated: new Date('2024-02-10'),
        },
    ])

    // États pour la recherche et le tri
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [editingNote, setEditingNote] = useState<{ courseId: string; note: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simuler le chargement des données
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // Fonctions utilitaires
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}min`
    }

    // Fonctions de gestion des favoris
    const handleRemoveBookmark = (courseId: string) => {
        setBookmarkedCourses(prev => prev.filter(course => course.id !== courseId))
    }

    const handleLike = (courseId: string) => {
        setBookmarkedCourses(prev => prev.map(course => 
            course.id === courseId 
                ? { ...course, liked: !course.liked }
                : course
        ))
    }

    const handleEdit = (courseId: string, note?: string) => {
        setEditingNote({ courseId, note: note || '' })
    }

    const handleSaveNote = (courseId: string, newNote: string) => {
        setBookmarkedCourses(prev => prev.map(course => 
            course.id === courseId 
                ? { ...course, note: newNote.trim() }
                : course
        ))
        setEditingNote(null)
    }

    // Filtrage et tri des cours
    const filteredCourses = bookmarkedCourses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortBy) {
            case 'recent':
                return b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime()
            case 'title':
                return a.title.localeCompare(b.title)
            case 'progress':
                return b.progress - a.progress
            case 'rating':
                return b.rating - a.rating
            default:
                return 0
        }
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 animate-fade-in">
                {/* En-tête */}
                <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800/50">
                    <div className="container mx-auto px-4 py-8">
                        <div className="h-8 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
                        <div className="h-4 w-96 bg-gray-800/50 rounded-lg mt-4 animate-pulse" />
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="container mx-auto px-4 py-8 space-y-12">
                    {/* Section Statistiques */}
                    <section>
                        <div className="h-6 w-36 bg-gray-800/50 rounded-lg mb-6 animate-pulse" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 rounded-2xl bg-gray-800/50 animate-pulse" />
                            ))}
                        </div>
                    </section>

                    {/* Section Graphiques */}
                    <section>
                        <div className="h-6 w-48 bg-gray-800/50 rounded-lg mb-6 animate-pulse" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="h-96 rounded-2xl bg-gray-800/50 animate-pulse" />
                            ))}
                        </div>
                    </section>

                    {/* Section Favoris */}
                    <section>
                        <div className="h-6 w-40 bg-gray-800/50 rounded-lg mb-6 animate-pulse" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[400px] rounded-2xl bg-gray-800/50 animate-pulse" />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* En-tête */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800/50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-100">Mon profil</h1>
                    <p className="mt-2 text-gray-400">
                        Gérez vos cours et suivez votre progression
                    </p>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Section Statistiques */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-100 mb-6">Vue d&apos;ensemble</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Cours suivis"
                            value={stats.totalCourses}
                            description={`${stats.completedCourses} terminés, ${stats.inProgressCourses} en cours`}
                            icon={BookOpen}
                            trend={{ value: 12, isPositive: true }}
                        />
                        <StatCard
                            title="Exercices"
                            value={stats.totalExercises}
                            description={`${stats.completedExercises} terminés, ${stats.inProgressExercises} en cours`}
                            icon={Target}
                            trend={{ value: 8, isPositive: true }}
                        />
                        <StatCard
                            title="Temps total"
                            value={formatTime(stats.totalTime)}
                            description="Cette semaine"
                            icon={Clock}
                            trend={{ value: 5, isPositive: false }}
                        />
                        <StatCard
                            title="Progression moyenne"
                            value={`${stats.averageProgress}%`}
                            description="Sur tous les cours"
                            icon={Award}
                            trend={{ value: 15, isPositive: true }}
                        />
                    </div>
                </section>

                {/* Section Graphiques */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-100 mb-6">Progression détaillée</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LineChart
                            title="Progression mensuelle"
                            data={[
                                {
                                    label: 'Cours terminés',
                                    values: stats.progressByMonth.map(m => m.completed),
                                    color: '#10B981'
                                },
                                {
                                    label: 'Cours commencés',
                                    values: stats.progressByMonth.map(m => m.started),
                                    color: '#6366F1'
                                }
                            ]}
                            labels={stats.progressByMonth.map(m => m.month)}
                        />
                        <BarChart
                            title="Exercices par type"
                            data={stats.exercisesByType.map(item => ({
                                label: item.type,
                                values: [item.completed, item.total - item.completed],
                                colors: ['bg-emerald-500', 'bg-gray-700']
                            }))}
                            categories={['Terminés', 'Restants']}
                        />
                    </div>
                </section>

                {/* Section Favoris */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-[#178F65]/20 to-teal-500/20 
                                backdrop-blur-xl border border-emerald-500/10">
                                <Bookmark className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-100">Mes cours favoris</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'text-gray-400 hover:bg-white/5'
                                }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : 'text-gray-400 hover:bg-white/5'
                                }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                            </div>
                            <div className="w-full md:w-64">
                                <ViewControls
                                    sortBy={sortBy}
                                    onSortChange={setSortBy}
                                    viewMode={viewMode}
                                    onViewModeChange={setViewMode}
                                />
                            </div>
                        </div>

                        {sortedCourses.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "flex flex-col gap-4"
                            }>
                                {sortedCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        viewMode={viewMode}
                                        editingNote={editingNote}
                                        onLike={handleLike}
                                        onRemove={handleRemoveBookmark}
                                        onEdit={handleEdit}
                                        onSaveNote={handleSaveNote}
                                        onCancelEdit={() => setEditingNote(null)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ProfilePage 

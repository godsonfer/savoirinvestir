'use client'

import { Bookmark, Clock, PlayCircle, Star, Trash2, User, Heart, Pencil, BookOpen, GraduationCap, Calendar, Search, Grid, List, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

type BookmarkedCourse = {
    id: string
    title: string
    description: string
    instructor: string
    duration: number
    rating: number
    totalStudents: number
    note?: string
    bookmarkedAt: Date
    thumbnailUrl: string
    progress: number
    price: number
    originalPrice?: number
    certification: boolean
    reviews: number
    liked: boolean
    lastUpdated: Date
}

type SortOption = 'recent' | 'title' | 'progress' | 'rating';
type ViewMode = 'grid' | 'list';
type EditingNote = {
    courseId: string;
    note: string;
} | null;

const BookmarksPage = () => {
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
        {
            id: '3',
            title: 'Node.js et Express',
            description: 'Développez des applications backend avec Node.js',
            instructor: 'Mike Johnson',
            duration: 150,
            rating: 4.7,
            totalStudents: 1876,
            note: 'Très complet sur le backend',
            bookmarkedAt: new Date(),
            thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60',
            progress: 30,
            price: 39.99,
            originalPrice: 199.99,
            certification: false,
            reviews: 123,
            liked: false,
            lastUpdated: new Date('2024-02-05'),
        }
    ])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [editingNote, setEditingNote] = useState<EditingNote>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (editingNote && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingNote]);

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

    const handleRemoveBookmark = (courseId: string) => {
        toast.success(`Cours ${courseId} retiré des favoris`)
        // Ajoutez ici la logique pour supprimer le favori
    }

    const handleLike = (courseId: string) => {
        toast.success("Statut du like mis à jour");
        // Logique pour mettre à jour le statut "liked"
    }

    const handleEdit = (courseId: string, note?: string) => {
        setEditingNote({ courseId, note: note || '' });
    };

    const handleSaveNote = (courseId: string, newNote: string) => {
        setBookmarkedCourses(prev => prev.map(course => 
            course.id === courseId 
                ? { ...course, note: newNote.trim() }
                : course
        ));
        setEditingNote(null);
        toast.success("Note mise à jour");
    };

    const CoursePopover = ({ course }: { course: BookmarkedCourse }) => {
        return (
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 
                transition-all duration-300 z-50 bg-gray-900/95 backdrop-blur-lg
                border-t border-white/10 overflow-hidden
                transform translate-y-full group-hover:translate-y-0"
            >
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-gray-100 font-semibold text-lg">
                            {course.title}
                        </h4>
                        <div className="px-2 py-1 bg-emerald-500/20 rounded-md">
                            <span className="text-emerald-400 text-sm font-medium">
                                {course.price}€
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm">
                        {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            <span>{course.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <GraduationCap className="w-4 h-4" />
                            <span>{course.totalStudents} étudiants</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Mis à jour {new Date(course.lastUpdated).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating} ({course.reviews} avis)</span>
                        </div>
                    </div>

                    {course.certification && (
                        <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 p-2 rounded-lg">
                            <GraduationCap className="w-4 h-4" />
                            <span>Certification incluse</span>
                        </div>
                    )}

                    {course.note || editingNote?.courseId === course.id ? (
                        <div className="flex flex-col gap-3 p-3 md:p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10
                            border border-emerald-500/20">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 md:p-2 rounded-lg bg-emerald-500/10">
                                    <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                                </div>
                                <span className="text-xs md:text-sm font-medium text-emerald-400">
                                    Ma note personnelle
                                </span>
                            </div>
                            {editingNote?.courseId === course.id ? (
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        ref={textareaRef}
                                        value={editingNote.note}
                                        onChange={(e) => setEditingNote(prev => prev ? { ...prev, note: e.target.value } : null)}
                                        placeholder="Écrivez votre note ici..."
                                        className="w-full h-20 md:h-24 px-2.5 md:px-3 py-2 text-sm text-gray-200 
                                            bg-gray-800/50 rounded-lg border border-gray-700 
                                            focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 
                                            outline-none resize-none"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setEditingNote(null)}
                                            className="px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium
                                                bg-gray-800/50 hover:bg-gray-800 text-gray-300
                                                transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => handleSaveNote(course.id, editingNote.note)}
                                            className="px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium
                                                bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400
                                                transition-colors"
                                        >
                                            Sauvegarder
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs md:text-sm text-gray-300 italic">
                                        &quot;{course.note}&quot;
                                    </p>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(course.id, course.note);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-emerald-400
                                            transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(course.id);
                            }}
                            className="flex items-center gap-2 p-2.5 md:p-3 rounded-lg text-xs md:text-sm
                                bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-emerald-400
                                transition-colors w-full"
                        >
                            <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Ajouter une note</span>
                        </button>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-white/10">
                        <Link
                            href={`/courses/${course.id}`}
                            className="flex-1 px-4 py-2 rounded-lg font-medium text-center
                                bg-gradient-to-r from-emerald-500 to-teal-600
                                hover:from-emerald-600 hover:to-teal-700
                                text-white transition-all duration-300"
                        >
                            Commencer
                        </Link>
                        <Link
                            href={`/courses/${course.id}/details`}
                            className="px-4 py-2 rounded-lg font-medium
                                bg-white/10 hover:bg-white/20 text-white
                                transition-all duration-300"
                        >
                            Plus d'infos
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const CourseSkeleton = ({ viewMode }: { viewMode: ViewMode }) => {
        return (
            <div className={`relative rounded-2xl overflow-hidden
                bg-gradient-to-b from-gray-900/80 to-gray-900/60
                border border-gray-800/50 backdrop-blur-sm
                animate-pulse
                ${viewMode === 'list' ? 'flex flex-col md:flex-row md:h-[240px]' : ''}`}
            >
                {/* Image skeleton */}
                <div className={`relative bg-gray-800/50 ${
                    viewMode === 'list' 
                        ? 'w-full md:w-[360px] h-[200px] md:h-full shrink-0' 
                        : 'aspect-video'
                }`} />

                {/* Contenu skeleton */}
                <div className={`relative flex flex-col ${
                    viewMode === 'list' ? 'flex-1 p-4 md:p-6' : 'p-6'
                }`}>
                    {/* En-tête */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-2/3 h-6 bg-gray-800/50 rounded-lg" />
                        <div className="w-20 h-8 bg-gray-800/50 rounded-lg" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mb-4">
                        <div className="w-full h-4 bg-gray-800/50 rounded-lg" />
                        <div className="w-4/5 h-4 bg-gray-800/50 rounded-lg" />
                    </div>

                    {/* Stats */}
                    <div className={`grid gap-3 mb-6 ${
                        viewMode === 'list' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
                    }`}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-800/50 rounded-lg" />
                                <div className="flex flex-col gap-1">
                                    <div className="w-16 h-3 bg-gray-800/50 rounded-lg" />
                                    <div className="w-12 h-4 bg-gray-800/50 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 mb-6">
                        <div className="w-24 h-6 bg-gray-800/50 rounded-lg" />
                        <div className="w-32 h-6 bg-gray-800/50 rounded-lg" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 mt-auto">
                        <div className="flex gap-2">
                            <div className="w-24 h-9 bg-gray-800/50 rounded-lg" />
                            <div className="hidden md:block w-20 h-9 bg-gray-800/50 rounded-lg" />
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-9 h-9 bg-gray-800/50 rounded-lg" />
                            <div className="w-9 h-9 bg-gray-800/50 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen h-[100dvh]">
            {/* En-tête fixe */}
            <div className="shrink-0 px-3 md:px-4 py-4 md:py-8 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="container mx-auto">
                    {/* En-tête plus compact sur mobile */}
                    <div className="flex flex-col gap-3 mb-4 md:mb-8">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 via-[#178F65]/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/10">
                                <Bookmark className="w-5 h-5 md:w-7 md:h-7 text-gray-200" />
                            </div>
                            <h1 className="text-xl md:text-3xl font-bold text-gray-100">
                                Mes cours favoris
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-gray-400 max-w-2xl font-medium">
                            Retrouvez ici tous vos cours favoris pour y accéder rapidement
                        </p>
                    </div>

                    {/* Contrôles plus adaptés au mobile */}
                    <div className="flex flex-col gap-3 md:gap-4">
                        {/* Recherche */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un cours..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base rounded-lg bg-white/5 border border-white/10
                                    focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25
                                    text-gray-100 placeholder-gray-400 outline-none transition-all"
                            />
                        </div>

                        {/* Contrôles sur une ligne */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* Tri */}
                            <div className="flex-1">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="w-full text-sm md:text-base appearance-none px-3 py-2 rounded-lg bg-white/5 border border-white/10
                                        text-gray-100 outline-none cursor-pointer transition-all
                                        focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25"
                                >
                                    <option value="recent">Plus récents</option>
                                    <option value="title">Alphabétique</option>
                                    <option value="progress">Progression</option>
                                    <option value="rating">Note</option>
                                </select>
                            </div>

                            {/* Basculer la vue */}
                            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 md:p-2 rounded-md transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                            : 'text-gray-400 hover:bg-white/5'
                                    }`}
                                >
                                    <Grid className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 md:p-2 rounded-md transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                            : 'text-gray-400 hover:bg-white/5'
                                    }`}
                                >
                                    <List className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zone de défilement */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 md:px-4 pb-6 md:pb-8">
                <div className="container mx-auto">
                    {isLoading ? (
                        <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                            : "flex flex-col gap-3 md:gap-4"
                        }>
                            {[...Array(6)].map((_, index) => (
                                <CourseSkeleton key={index} viewMode={viewMode} />
                            ))}
                        </div>
                    ) : sortedCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                            <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-500/20 mb-4" />
                            <h2 className="text-lg md:text-xl font-semibold text-gray-300 mb-2">
                                Aucun résultat trouvé
                            </h2>
                            <p className="text-sm md:text-base text-gray-400">
                                Essayez avec d&apos;autres termes de recherche
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                            : "flex flex-col gap-3 md:gap-4"
                        }>
                            {sortedCourses.map((course) => (
                                <div 
                                    key={course.id} 
                                    className={`group relative rounded-2xl overflow-hidden transition-all duration-500
                                        bg-gradient-to-b from-gray-900/80 to-gray-900/60
                                        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                                        border border-gray-800/50 hover:border-emerald-500/30
                                        backdrop-blur-sm
                                        ${viewMode === 'list' 
                                            ? 'flex flex-col md:flex-row md:h-[240px]' 
                                            : ''}`}
                                >
                                    <div className={`relative ${viewMode === 'list' 
                                        ? 'w-full md:w-[360px] h-[200px] md:h-full shrink-0' 
                                        : 'aspect-video'}`}
                                    >
                                        <img 
                                            src={course.thumbnailUrl} 
                                            alt={course.title}
                                            className={`w-full h-full object-cover transition-all duration-500
                                                group-hover:brightness-110
                                                ${viewMode === 'list' 
                                                    ? 'md:rounded-l-2xl md:object-center' 
                                                    : 'group-hover:scale-105'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400
                                                            relative overflow-hidden rounded-full
                                                            after:absolute after:inset-0 after:bg-gradient-to-r 
                                                            after:from-white/20 after:via-white/40 after:to-transparent
                                                            after:animate-shimmer"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-white/90">
                                                    {Math.round(course.progress)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`relative flex flex-col ${viewMode === 'list' 
                                        ? 'flex-1 p-4 md:p-6' 
                                        : 'p-6'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4 md:mb-0">
                                            <h3 className="text-lg font-semibold text-white line-clamp-2 pr-4">
                                                {course.title}
                                            </h3>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                    <span className="text-emerald-400 font-semibold">{course.price}€</span>
                                                </div>
                                                {course.originalPrice && (
                                                    <span className="text-gray-500 line-through text-sm hidden md:inline-block">
                                                        {course.originalPrice}€
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                            {course.description}
                                        </p>

                                        <div className={`grid gap-3 mb-4 md:mb-6 ${
                                            viewMode === 'list' 
                                                ? 'grid-cols-2 sm:grid-cols-4' 
                                                : 'grid-cols-2'
                                        }`}>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-gray-800/50">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">Instructeur</span>
                                                    <span className="text-sm text-gray-300">{course.instructor}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-yellow-500/10">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">Note</span>
                                                    <span className="text-sm text-gray-300">{course.rating} ({course.reviews} avis)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-gray-800/50">
                                                    <BookOpen className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">Durée</span>
                                                    <span className="text-sm text-gray-300">{course.duration} min</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-gray-800/50">
                                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">Étudiants</span>
                                                    <span className="text-sm text-gray-300">{course.totalStudents.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {course.certification && (
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs 
                                                    font-medium border border-blue-500/20 flex items-center gap-1">
                                                    <GraduationCap className="w-3 h-3" />
                                                    <span className="hidden md:inline">Certification</span>
                                                </span>
                                            )}
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs 
                                                font-medium border border-purple-500/20 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span className="hidden md:inline">Mis à jour </span>
                                                {new Date(course.lastUpdated).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                    className="px-3 md:px-4 py-2 rounded-lg font-medium text-sm
                                                        bg-gradient-to-r from-emerald-500 to-teal-600
                                                        hover:from-emerald-600 hover:to-teal-700
                                                        text-white transition-all duration-300
                                                        shadow-lg shadow-emerald-500/20"
                                                >
                                                    Continuer
                                                </Link>
                                                <Link
                                                    href={`/courses/${course.id}/details`}
                                                    className="px-3 md:px-4 py-2 rounded-lg font-medium text-sm
                                                        bg-gray-800/50 hover:bg-gray-800
                                                        text-gray-300 hover:text-white
                                                        border border-gray-700 hover:border-gray-600
                                                        transition-all duration-300
                                                        hidden md:block"
                                                >
                                                    Détails
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button 
                                                    onClick={() => handleLike(course.id)}
                                                    className={`p-2 rounded-lg transition-all duration-300 
                                                        ${course.liked 
                                                            ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' 
                                                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-pink-400'}`}
                                                >
                                                    <Heart className={`w-4 h-4 ${course.liked ? 'fill-pink-400' : ''}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveBookmark(course.id)}
                                                    className="p-2 bg-gray-800/50 text-gray-400 hover:text-red-400 rounded-lg 
                                                        hover:bg-gray-800 transition-all duration-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {viewMode === 'grid' && <CoursePopover course={course} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookmarksPage 

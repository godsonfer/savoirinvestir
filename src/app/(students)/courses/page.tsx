/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useGetCourses } from "@/features/courses/api/use-get-courses"
import { CourseCard } from "@/components/course-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Course } from "@/types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useSearchCourses } from "@/features/courses/api/use-search-courses"

const CourseCardSkeleton = () => {
    return (
        <div className="flex flex-col rounded-lg overflow-hidden bg-card border animate-pulse">
            {/* Image skeleton */}
            <div className="relative aspect-video bg-muted">
                {/* Badge prix */}
                <div className="absolute top-2 right-2">
                    <div className="h-5 w-16 bg-muted-foreground/15 rounded-full" />
                </div>
                {/* Badge bookmark */}
                <div className="absolute top-2 left-2">
                    <div className="h-8 w-8 bg-muted-foreground/15 rounded-full" />
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Title skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Metadata skeletons */}
                <div className="space-y-3">
                    {/* Category and rating */}
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-12" />
                    </div>

                    {/* Chapters and lessons */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Date */}
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </div>
    )
}

const CoursesExplorerPage = () => {
    const { results: courses, status: coursesLoading, loadMore } = useGetCourses()
    const { searchQuery, setSearchQuery, searchResults, isLoading: isSearching } = useSearchCourses()
    const [isLoadingMore, setIsLoadingMore] = useState(false)
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

    return (
        <div className="h-screen flex flex-col">
            {/* Header fixe */}
            <div className="flex-none bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">Explorez nos formations</h1>
                        <p className="text-muted-foreground">
                            Découvrez notre catalogue de formations et commencez votre apprentissage
                        </p>
                    </div>

                    {/* Barre de recherche améliorée */}
                    <div className="max-w-2xl mx-auto">
                        {/* <SearchForm 
                            value={searchQuery}
                            onChange={setSearchQuery}
                            isLoading={isSearching}
                            results={searchResults}
                        /> */}
                    </div>
                </div>
            </div>

            {/* Contenu défilable */}
            <div className="flex-grow overflow-y-auto mt-4">
                <div className="container mx-auto px-2">
                    {/* Grille des cours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {isLoading && (
                            Array.from({ length: 8 }).map((_, index) => (
                                <CourseCardSkeleton key={index} />
                            ))
                        )}
                        {displayedCourses?.map((course) => (
                            <CourseCard
                                key={course._id}
                                isBookmarked={course.bookmark ?? false}
                                creation={course._creationTime}
                                description={course?.description ?? "Aucune description"}
                                category={course?.category?.title ?? "Non catégorisé"}
                                lessonLength={calculateLessonLength(course)}
                                chapterLength={Array.isArray(course?.chapters) ? course.chapters.length : 0}
                                id={course._id}
                                title={course.title}
                                imageUrl={course.cover ?? ""}
                                price={course?.price ?? 0}
                                progress={null}
                                canDelete={course?.canDelete ?? false}
                                ratings={course?.rating?.rates ?? []}
                                duration={course?.duration ?? 0}
                                lastUpdate={course?.updatedAt ?? course?._creationTime}
                            />
                        ))}
                    </div>

                    {/* Message si aucun résultat */}
                    {!isLoading && (!displayedCourses || displayedCourses.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-muted-foreground text-center">
                                {searchQuery 
                                    ? "Aucun cours ne correspond à votre recherche" 
                                    : "Aucune formation disponible pour le moment"}
                            </p>
                        </div>
                    )}

                    {/* Bouton "Charger plus" avec état de chargement */}
                    {!searchQuery && courses && courses.length > 0 && (
                        <div className="mt-8 pb-8 text-center">
                            <Button
                                variant="secondary"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className={cn(
                                    "px-6 py-2 rounded-full",
                                    "bg-primary/10 hover:bg-primary/20",
                                    "text-primary transition-all duration-300",
                                    "flex items-center gap-2",
                                    isLoadingMore && "opacity-80"
                                )}
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-muted-foreground text-xs">Chargement...</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground text-xs">Charger plus de cours</span>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CoursesExplorerPage

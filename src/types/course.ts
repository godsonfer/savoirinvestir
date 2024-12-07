export type BookmarkedCourse = {
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

export type SortOption = 'recent' | 'title' | 'progress' | 'rating'
export type ViewMode = 'grid' | 'list'
export type EditingNote = {
    courseId: string
    note: string
} | null 

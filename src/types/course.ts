export interface Course {
    _id: string
    title: string
    description?: string
    cover?: string
    price: number
    duration: number
    studentsCount: number
    rating: string
    reviewsCount: number
    category?: string
    level?: string
    hasCertification?: boolean
    quizCount?: number
    skills?: string[]
    prerequisites?: string[]
    targetAudience?: string[]
}

export interface Lesson {
    _id: string
    title: string
    description?: string
    duration?: number
    position?: number
    chapterId: string
    type: 'video' | 'text' | 'article' | 'quiz'
    content?: string
    thumbnail?: string
    playbackId?: string
    muxData?: {
        playback: string
        assetId : string
    }
}

export interface Chapter {
    _id: string
    title: string
    description?: string
    position?: number
    lessons: Lesson[]
}

export interface Progress {
    completedLessons: string[]
    totalLessons: number
    completedChapters: string[]
    totalChapters: number
    percentageCompleted: number
}

export interface HTMLNode {
    type: string
    name?: string
    attribs?: Record<string, string>
    children?: HTMLNode[]
    data?: string
}

export interface Comment {
    id: string
    user: {
        id: string
        name: string
        avatar?: string
    }
    content: string
    createdAt: Date
    type: 'text' | 'audio'
    replies?: Comment[]
}

export interface Resource {
    id: string
    title: string
    type: 'pdf' | 'video' | 'image' | 'other'
    size: string
    url: string
    description?: string
    addedAt: Date
    downloadProgress?: number
} 

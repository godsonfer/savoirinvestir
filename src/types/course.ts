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

export interface Progress {
  completedLessons: string[];
  totalLessons: number;
  completedChapters: string[];
  totalChapters: number;
  percentageCompleted: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  price: number;
  isPublished: boolean;
  instructor: string;
  category: string;
  level: string;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  skills?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  cover?: string;
}

export interface Chapter {
  _id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isPublished: boolean;
}

export interface LessonFromAPI {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  isPublished?: boolean;
  isFree?: boolean;
  duration?: number;
  chapterId: string;
  content?: string;
  muxData?: {
    _id: string;
    playback?: string;
    assetId: string;
  } | null;
}

export interface Lesson extends Omit<LessonFromAPI, 'isPublished' | 'isFree' | 'chapterId'> {
  isPublished: boolean;
  isFree: boolean;
  type?: 'video' | 'article' | 'text';
}

export interface HTMLNode {
  tag: string;
  attrs?: Record<string, string>;
  content?: string;
  children?: HTMLNode[];
}

export interface CourseFromAPI {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  studentsCount: number;
  rating: string;
  reviewsCount: number;
  category?: string;
  cover?: string;
  userId: string;
}

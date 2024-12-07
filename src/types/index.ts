import { Id } from "../../convex/_generated/dataModel"

export interface Course {
  _id: Id<"courses">
  _creationTime: number
  title: string
  updatedAt?: number
  price?: number
  description?: string
  isPublished?: boolean
  duration?: number
  cover?: string
  categoryId?: Id<"categories">
  canDelete?: boolean
  rating?: {
    rates: number[]
    average: number
  }
  category?: {
    title: string
    _id: Id<"categories">
  }
  bookmark?: boolean
  enrollments?: {
    _id: Id<"purchases">
    userId: Id<"users">
  }[]
  chapters?: {
    _id: Id<"chapters">
    title: string
    isPublished?: boolean
    lessons?: {
      _id: Id<"lessons">
      title: string
      isPublished?: boolean
      type: "video" | "exercise"
    }[]
  }[]
} 

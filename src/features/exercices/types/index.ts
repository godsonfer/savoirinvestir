import { Id } from "../../../../convex/_generated/dataModel"

export type Difficulty = "Facile" | "Moyen" | "Difficile"

export interface Option {
  text: string
  isCorrect: boolean
  explanation: string
}

export interface Question {
  text: string
  points: number
  category?: string
  hint?: string
  options: Option[]
}

export interface Attachment {
  name: string
  url: string
  type: string
}

export interface Exercise {
  _id: Id<"exercices">
  _creationTime: number
  title: string
  description: string
  difficulty: Difficulty
  points: number
  courseId: Id<"courses">
  chapterId: Id<"chapters">
  lessonId: Id<"lessons">
  questions: Question[]
  attachments: Attachment[]
  isPublished?: boolean
  position?: number
  userId: string
  createdAt: number
  updatedAt: number
}

export type CreateExerciseInput = Omit<Exercise, "_id" | "_creationTime" | "userId" | "createdAt" | "updatedAt">
export type UpdateExerciseInput = Partial<CreateExerciseInput> 

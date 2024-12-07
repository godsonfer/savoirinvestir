import { Id } from "../../../../convex/_generated/dataModel"

export type Difficulty = "Facile" | "Moyen" | "Difficile"
export type CourseDifficulty = "Débutant" | "Intermédiaire" | "Avancé"

export interface Course {
  id: string
  title: string
  description: string
  progress: number
  difficulty: CourseDifficulty
  chapters: Chapter[]
}

interface Lesson {
  id: string
  title: string
  courseId: string
  progress: number
}

export interface Chapter {
    id: string
    title: string
    courseId: string
    progress: number
    lessons: Lesson[]
    exercicesDone: Exercise[]
    exercices: Exercise[]
}

export interface Exercise {
  _id: Id<"exercices">
  id: string
  title: string
  description: string
  chapterId: string
  isCompleted: boolean
  difficulty: Difficulty
  points: number
  score?: number
  mistakes?: string[]
  attachments: Attachment[]
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  options: Option[]
  points: number
  hint?: string
  category?: string
}

export interface Option {
  id: string
  text: string
  isCorrect: boolean
  explanation: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
}

export interface Stats {
  totalExercises: number
  completedExercises: number
  totalPoints: number
  earnedPoints: number
} 

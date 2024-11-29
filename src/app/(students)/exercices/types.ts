export interface Progress {
  completed: boolean
  score: number
  submittedAt?: Date
  attempts: number
}

export interface Question {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
  questions: Question[]
  progress?: Progress
}

export interface Chapter {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  progress?: Progress
}

export interface Course {
  id: string
  title: string
  description: string
  coverImage: string
  duration: string
  studentsCount: number
  isCertified: boolean
  chapters: Chapter[]
  progress?: Progress
} 

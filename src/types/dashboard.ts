export interface CourseStats {
    totalCourses: number
    completedCourses: number
    inProgressCourses: number
    totalExercises: number
    completedExercises: number
    inProgressExercises: number
    totalTime: number // en minutes
    averageProgress: number
    coursesByCategory: {
        category: string
        count: number
    }[]
    progressByMonth: {
        month: string
        completed: number
        started: number
    }[]
    exercisesByType: {
        type: string
        total: number
        completed: number
    }[]
    timeSpentByDay: {
        day: string
        minutes: number
    }[]
} 

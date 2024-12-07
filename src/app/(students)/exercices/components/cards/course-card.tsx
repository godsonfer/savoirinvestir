'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Course } from "../../types"
import { DifficultyBadge } from "../ui/difficulty-badge"
import { CourseProgress } from "../ui/course-progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ExerciseDialog } from "../dialogs/exercise-dialog"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: Course
  className?: string
}

export function CourseCard({ course, className }: CourseCardProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="h-full"
    >
      <Card className={cn(
        "group overflow-hidden bg-white/80 dark:bg-gray-800 backdrop-blur-md border-0",
        "shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10",
        "dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/10",
        "hover:bg-white/90 dark:hover:bg-gray-700/90",
        "transition-all duration-500 transform hover:scale-[1.01]",
        "flex flex-col h-full",
        className
      )}>
        <CardHeader className="relative bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700 p-4 md:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <DifficultyBadge difficulty={course.difficulty} />
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base">
                  {course.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary dark:text-blue-200 border-0 group-hover:bg-primary/20 transition-colors duration-300">
                {course.chapters.length} chapitres
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary dark:text-blue-200 border-0 group-hover:bg-primary/20 transition-colors duration-300">
                {course.chapters.reduce((acc, ch) => acc + ch.exercises.length, 0)} exercices
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/90">
            <CourseProgress course={course} />
          </div>
          <ScrollArea className="h-[300px] px-4 md:px-6 py-4">
            <div className="space-y-6">
              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                      {chapter.title}
                    </h4>
                    <Badge variant="outline" className="bg-primary/5 text-primary dark:text-blue-200 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                      {chapter.exercises.length} exercices
                    </Badge>
                  </div>
                  <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-3">
                    {chapter.exercises.map((exercise, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                              "p-3 md:p-4 rounded-lg transition-all duration-300",
                              "bg-white/80 dark:bg-gray-800 hover:bg-white/90 dark:hover:bg-gray-700",
                              "border border-gray-200 dark:border-gray-700",
                              "hover:border-primary/20 hover:shadow-md hover:scale-[1.02]",
                              "cursor-pointer transform",
                              exercise.isCompleted && "border-l-4 border-l-green-500"
                            )}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="space-y-1 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className="font-medium text-gray-900 dark:text-white">
                                    {exercise.title}
                                  </h5>
                                  <DifficultyBadge difficulty={exercise.difficulty} showIcon={false} />
                                  {exercise.isCompleted && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-0">
                                      {exercise.score}%
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                  {exercise.description}
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-primary/10 text-primary dark:text-blue-200 border-0 shrink-0 group-hover:bg-primary/20 transition-colors duration-300 self-start sm:self-center">
                                {exercise.points} pts
                              </Badge>
                            </div>
                          </motion.div>
                        </DialogTrigger>
                        <ExerciseDialog exercise={exercise} key={exercise.id} />
                      </Dialog>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
} 

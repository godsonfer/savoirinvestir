'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ProgressRing } from "./progress-ring"
import { Course } from "../../types"

interface CourseProgressProps {
  course: Course
  className?: string
}

export function CourseProgress({ course, className }: CourseProgressProps) {
  const totalExercises = course.chapters.reduce((acc, ch) => acc + ch.exercises.length, 0)
  const completedExercises = course.chapters.reduce((acc, ch) => 
    acc + ch.exercises.filter(ex => ex.isCompleted).length, 0
  )

  const totalPoints = course.chapters.reduce((acc, ch) => {
    return acc + ch.exercises.reduce((exAcc, ex) => exAcc + ex.points, 0)
  }, 0)

  const earnedPoints = course.chapters.reduce((acc, ch) => {
    return acc + ch.exercises.reduce((exAcc, ex) => 
      ex.isCompleted ? exAcc + ex.points : exAcc, 0)
  }, 0)

  return (
    <motion.div 
      className={cn(
        "p-4 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm",
        "border border-gray-200/50 dark:border-gray-700/50",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Progression du cours
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedExercises} sur {totalExercises} exercices complétés
          </p>
        </div>
        <ProgressRing progress={course.progress} size={70} color="primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Exercices
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Math.round((completedExercises / totalExercises) * 100)}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedExercises / totalExercises) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Points
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Math.round((earnedPoints / totalPoints) * 100)}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(earnedPoints / totalPoints) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <motion.div 
          className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Exercices complétés
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {completedExercises}
            <span className="text-sm font-normal text-blue-600/70 dark:text-blue-400/70 ml-1">
              / {totalExercises}
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-sm text-green-600 dark:text-green-400">
            Points gagnés
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {earnedPoints}
            <span className="text-sm font-normal text-green-600/70 dark:text-green-400/70 ml-1">
              / {totalPoints}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
} 

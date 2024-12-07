'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Stats } from "../../types"

interface StatsOverviewProps {
  stats: Stats
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="space-y-6">
        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={springTransition}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Exercices complétés
            </h4>
            <span className="text-sm font-medium text-primary">
              {Math.round((stats.completedExercises / stats.totalExercises) * 100)}%
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-lg opacity-50" />
            <Progress 
              value={(stats.completedExercises / stats.totalExercises) * 100}
              className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.completedExercises} sur {stats.totalExercises} exercices
          </p>
        </motion.div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.02 }}
          transition={springTransition}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Points gagnés
            </h4>
            <span className="text-sm font-medium text-primary">
              {Math.round((stats.earnedPoints / stats.totalPoints) * 100)}%
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-lg opacity-50" />
            <Progress 
              value={(stats.earnedPoints / stats.totalPoints) * 100}
              className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.earnedPoints} sur {stats.totalPoints} points
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border-0 shadow-lg shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50" />
            <CardContent className="relative pt-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.completedExercises}
              </div>
              <div className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                Exercices terminés
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
          transition={springTransition}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border-0 shadow-lg shadow-green-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-50" />
            <CardContent className="relative pt-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.earnedPoints}
              </div>
              <div className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                Points totaux
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
} 

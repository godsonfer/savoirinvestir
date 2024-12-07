'use client'

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Difficulty, CourseDifficulty } from "../../types"

const difficultyColors = {
  Facile: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800/30",
  Moyen: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30",
  Difficile: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800/30",
  Débutant: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
  Intermédiaire: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800/30",
  Avancé: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200 dark:border-orange-800/30"
} as const

interface DifficultyBadgeProps {
  difficulty: Difficulty | CourseDifficulty
  className?: string
  showIcon?: boolean
}

export function DifficultyBadge({ difficulty, className, showIcon = true }: DifficultyBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge 
        variant="outline" 
        className={cn(
          "font-medium transition-all duration-300 shadow-sm hover:shadow-md",
          "flex items-center space-x-1 px-3 py-1",
          difficultyColors[difficulty],
          className
        )}
      >
        {showIcon && (
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx="4" cy="4" r="3" />
          </svg>
        )}
        <span>{difficulty}</span>
      </Badge>
    </motion.div>
  )
} 

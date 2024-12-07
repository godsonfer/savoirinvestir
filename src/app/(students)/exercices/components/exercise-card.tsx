'use client'

import { motion } from "framer-motion"
import { Exercise } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy } from "lucide-react"

interface ExerciseCardProps {
  exercise: Exercise
  delay?: number
}

export function ExerciseCard({ exercise, delay = 0 }: ExerciseCardProps) {
  const difficultyColors = {
    Facile: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
    Moyen: "bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20",
    Difficile: "bg-red-500/10 text-red-500 dark:bg-red-500/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="group overflow-hidden border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
              {exercise.difficulty}
            </Badge>
            {exercise.isCompleted && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Complété
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {exercise.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {exercise.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Trophy className="h-4 w-4 text-primary" />
              <span>{exercise.points} points</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{exercise.questions.length} questions</span>
            </div>
          </div>

          {exercise.isCompleted && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Score</span>
                <span className="font-medium text-primary">
                  {exercise.score} / {exercise.points}
                </span>
              </div>
              <Progress value={(exercise.score || 0) / exercise.points * 100} />
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            variant="default" 
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
          >
            {exercise.isCompleted ? "Revoir l'exercice" : "Commencer l'exercice"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 

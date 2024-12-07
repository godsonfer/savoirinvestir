'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Question } from "../../types"
import { CheckCircle, X } from "lucide-react"

interface QuestionCardProps {
  question: Question
  onAnswer: (optionId: string) => void
  userAnswer?: string
  showResult: boolean
  practiceMode?: boolean
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

export function QuestionCard({ 
  question,
  onAnswer,
  userAnswer,
  showResult,
  practiceMode = false
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)

  return (
    <Card className="overflow-hidden border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg group">
      <CardHeader className="relative bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {question.text}
            </h4>
            {question.category && (
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-900/50">
                {question.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {!practiceMode && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {question.points} points
              </Badge>
            )}
            {question.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="hover:bg-primary/10 hover:text-primary"
              >
                {showHint ? "Masquer l'indice" : "Voir l'indice"}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showHint && question.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-2">
                  <div className="p-1 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                    <svg
                      className="w-4 h-4 text-yellow-600 dark:text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm flex-1">{question.hint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = userAnswer === option.id
            const isCorrect = option.isCorrect
            const showCorrection = showResult && isSelected

            return (
              <motion.div
                key={option.id}
                className="space-y-2"
                whileHover={{ scale: !showResult ? 1.01 : 1 }}
                whileTap={{ scale: !showResult ? 0.99 : 1 }}
                transition={springTransition}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal p-4 h-auto",
                    !showResult && "hover:border-primary/50 hover:bg-primary/5",
                    showCorrection && isCorrect && "bg-green-50 hover:bg-green-50 text-green-800 border-green-200",
                    showCorrection && !isCorrect && "bg-red-50 hover:bg-red-50 text-red-800 border-red-200"
                  )}
                  onClick={() => !showResult && onAnswer(option.id)}
                  disabled={showResult}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected ? "border-primary bg-primary text-white" : "border-gray-300",
                      showCorrection && isCorrect && "border-green-500 bg-green-500",
                      showCorrection && !isCorrect && "border-red-500 bg-red-500"
                    )}>
                      {showCorrection ? (
                        isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <X className="h-4 w-4 text-white" />
                        )
                      ) : isSelected ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </div>
                </Button>

                <AnimatePresence>
                  {showResult && isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "p-4 rounded-xl border text-sm",
                        isCorrect 
                          ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800"
                          : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
                      )}>
                        <div className="flex items-start space-x-2">
                          <div className={cn(
                            "p-1 rounded-lg",
                            isCorrect ? "bg-green-100 dark:bg-green-800" : "bg-red-100 dark:bg-red-800"
                          )}>
                            {isCorrect ? (
                              <svg
                                className="w-4 h-4 text-green-600 dark:text-green-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-red-600 dark:text-red-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="flex-1">{option.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 

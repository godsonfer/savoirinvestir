/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'
import { cn } from "@/lib/utils"
import { Exercise } from "../../types"
import { DifficultyBadge } from "../ui/difficulty-badge"
import { Clock, CheckCircle, ArrowRight, Trophy, Star } from "lucide-react"

const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false
})

interface ExerciseDialogProps {
  exercise: Exercise
}

interface QuestionCardProps {
  question: {
    id: string
    text: string
    options: {
      id: string
      text: string
      isCorrect: boolean
      explanation: string
    }[]
    points: number
    hint?: string
    category?: string
  }
  onAnswer: (optionId: string) => void
  userAnswer?: string[]
  showResult: boolean
  practiceMode?: boolean
}

const LearningTips = ({ mistakes }: { mistakes: string[] }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
      <h4 className="font-semibold text-lg text-blue-800 dark:text-blue-200 flex items-center space-x-2">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-300"
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
        <span>Conseils d&apos;apprentissage</span>
      </h4>
      <ul className="list-none space-y-2">
        {mistakes.map((mistake, index) => (
          <li key={index} className="flex items-start space-x-3 text-blue-700 dark:text-blue-200">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mt-0.5">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">{index + 1}</span>
            </span>
            <span className="flex-1">{mistake}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const QuestionCard = ({ 
  question,
  onAnswer,
  userAnswer,
  showResult,
  practiceMode = false
}: QuestionCardProps & { userAnswer?: string[] }) => {
  const [showHint, setShowHint] = useState(false)

  return (
    <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800 backdrop-blur-md shadow-lg group">
      <CardHeader className="relative bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {question.text}
            </h4>
            {question.category && (
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-200">
                {question.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 self-end sm:self-start">
            {!practiceMode && (
              <Badge variant="secondary" className="bg-primary/10 text-primary dark:text-blue-200 border-0">
                {question.points} points
              </Badge>
            )}
            {question.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="hover:bg-primary/10 hover:text-primary text-gray-700 dark:text-gray-200 transition-colors duration-300"
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
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex-shrink-0">
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
                  <p className="text-sm flex-1 leading-relaxed">{question.hint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = userAnswer?.includes(option.id) || false
            const isCorrect = option.isCorrect
            const showCorrection = showResult && isSelected

            return (
              <motion.div
                key={option.id}
                className="space-y-3"
                whileHover={{ scale: !showResult ? 1.01 : 1 }}
                whileTap={{ scale: !showResult ? 0.99 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal p-4 h-auto",
                    !showResult && "hover:border-primary/50 hover:bg-primary/5 text-gray-700 dark:text-gray-200",
                    showCorrection && isCorrect && "bg-green-50 dark:bg-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
                    showCorrection && !isCorrect && "bg-red-50 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                  )}
                  onClick={() => !showResult && onAnswer(option.id)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isSelected ? "border-primary bg-primary text-white scale-110" : "border-gray-300 dark:border-gray-600",
                      showCorrection && isCorrect && "border-green-500 bg-green-500 scale-110",
                      showCorrection && !isCorrect && "border-red-500 bg-red-500 scale-110"
                    )}>
                      {showCorrection ? (
                        isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <ArrowRight className="h-4 w-4 text-white" />
                        )
                      ) : isSelected ? (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      ) : null}
                    </div>
                    <span className="flex-1 text-base">{option.text}</span>
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
                          ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                      )}>
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-1.5 rounded-lg flex-shrink-0",
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
                          <p className="flex-1 leading-relaxed">{option.explanation}</p>
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

const SuccessStars = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, (i - 2) * 100],
            y: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: 2,
            repeatType: "reverse"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
        </motion.div>
      ))}
    </div>
  )
}

export function ExerciseDialog({ exercise }: ExerciseDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [mistakes, setMistakes] = useState<string[]>([])
  const [attempts, setAttempts] = useState<number>(0)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || []
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId]
      
      return {
        ...prev,
        [questionId]: newAnswers
      }
    })
  }

  const calculateScore = () => {
    let earnedPoints = 0
    let totalPoints = 0
    const newMistakes: string[] = []

    exercise.questions.forEach(question => {
      totalPoints += question.points
      const userAnswers = answers[question.id] || []
      const correctOptions = question.options.filter(opt => opt.isCorrect)
      const incorrectOptions = question.options.filter(opt => !opt.isCorrect)
      
      // Calcul des points partiels
      let questionScore = 0
      const pointsPerCorrectAnswer = question.points / correctOptions.length

      // Points pour les bonnes réponses sélectionnées
      correctOptions.forEach(opt => {
        if (userAnswers.includes(opt.id)) {
          questionScore += pointsPerCorrectAnswer
        }
      })

      // Pénalité pour les mauvaises réponses sélectionnées
      const incorrectSelected = userAnswers.filter(answerId => 
        incorrectOptions.find(opt => opt.id === answerId)
      )
      
      if (incorrectSelected.length > 0) {
        // Réduire le score de 50% si des réponses incorrectes sont sélectionnées
        questionScore *= 0.5
      }

      // Arrondir le score à 2 décimales
      questionScore = Math.round(questionScore * 100) / 100
      earnedPoints += questionScore

      // Génération des messages d'erreur plus détaillés
      if (questionScore < question.points) {
        let errorMessage = `Pour "${question.text}" : `
        
        const missedCorrect = correctOptions.filter(opt => !userAnswers.includes(opt.id))
        const wrongSelected = incorrectSelected.map(id => 
          question.options.find(opt => opt.id === id)?.text
        )

        if (missedCorrect.length > 0) {
          errorMessage += `Vous avez manqué ${missedCorrect.length} bonne(s) réponse(s). `
        }
        
        if (wrongSelected.length > 0) {
          errorMessage += `Vous avez sélectionné ${wrongSelected.length} mauvaise(s) réponse(s). `
        }

        newMistakes.push(errorMessage)
      }
    })

    setMistakes(newMistakes)

    return {
      score: Math.round(earnedPoints * 100) / 100,
      total: totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100)
    }
  }

  const handleSubmit = () => {
    setAttempts(prev => prev + 1)
    const result = calculateScore()
    setScore(result.score)
    
    // Vérifier si c'est un score parfait
    if (result.score === exercise.points) {
      if (attempts === 0) {
        // Première tentative parfaite
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      } else {
        // Réussite après plusieurs tentatives
        setShowStars(true)
        setTimeout(() => setShowStars(false), 6000)
      }
    }
    
    if (bestScore === null || result.score > bestScore) {
      setBestScore(result.score)
    }
    setShowResults(true)
  }

  const handleReset = () => {
    setAnswers({})
    setShowResults(false)
    setScore(null)
    setMistakes([])
    // Ne pas réinitialiser attempts et bestScore
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group
                         bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {exercise.title}
                    </h4>
                    <DifficultyBadge difficulty={exercise.difficulty} />
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </motion.div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                  {exercise.isCompleted ? (
                    <div className="flex items-center space-x-1 text-green-500 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Complété - Score: {exercise.score}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-orange-500 dark:text-orange-400">
                      <Clock className="h-4 w-4" />
                      <span>À faire</span>
                    </div>
                  )}
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center space-x-1">
                    <span>{exercise.points} points possibles</span>
                  </div>
                  {attempts > 0 && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center space-x-1">
                        <span>{attempts} tentative{attempts > 1 ? 's' : ''}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            {/* <CardContent className="relative">
              <p className="text-gray-600 dark:text-gray-300">{exercise.description}</p>
              {exercise.attachments && exercise.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="space-y-2">
                    {exercise.attachments.map((attachment) => (
                      <Button
                        key={attachment.id}
                        variant="outline"
                        size="sm"
                        className="w-full flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        asChild
                      >
                        <a href={attachment.url} download>
                          <span>{attachment.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {attachment.type}
                          </Badge>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent> */}
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent className={cn(
        "max-w-2xl h-[95vh] sm:h-auto p-0 gap-0 overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl"
      )}>
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        {showStars && <SuccessStars />}
        <ScrollArea className="h-full max-h-[95vh]">
          <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
            <DialogTitle className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exercise.title}
                  </span>
                  <DifficultyBadge difficulty={exercise.difficulty} />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPracticeMode(!practiceMode)
                    handleReset()
                  }}
                  className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300
                            hover:bg-primary/10 hover:text-primary hover:border-primary/50
                            text-gray-700 dark:text-gray-200"
                >
                  {practiceMode ? "Mode évaluation" : "Mode entraînement"}
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base mt-3 text-gray-700 dark:text-gray-200">
              {exercise.description}
              {practiceMode && (
                <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-200">
                  Mode entraînement : pas de points, focus sur l&apos;apprentissage
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-8">
            {exercise.questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <QuestionCard
                  question={question}
                  onAnswer={(optionId) => handleAnswer(question.id, optionId)}
                  userAnswer={answers[question.id]}
                  showResult={showResults}
                  practiceMode={practiceMode}
                />
              </motion.div>
            ))}

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {!practiceMode && score !== null && (
                  <div className={cn(
                    "p-6 rounded-xl border relative",
                    score === exercise.points 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200" 
                      : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200"
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold mb-2">
                          Résultat: {score} / {exercise.points} points
                        </h3>
                        <div className="space-y-2">
                          <p className="text-base opacity-90">
                            {attempts === 1 && score === exercise.points 
                              ? "Extraordinaire ! Score parfait du premier coup ! 🎉"
                              : score === exercise.points 
                                ? "Bravo ! Votre persévérance a payé ! ⭐"
                                : "Continuez à pratiquer pour améliorer votre score."}
                          </p>
                          <div className="text-sm opacity-80">
                            <p>Tentative n°{attempts}</p>
                            {bestScore !== null && (
                              <p>Meilleur score: {bestScore} / {exercise.points} points</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {attempts === 1 && score === exercise.points ? (
                        <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                      ) : score === exercise.points && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* {mistakes.length > 0 && (
                  <LearningTips mistakes={mistakes} />
                )} */}
              </motion.div>
            )}

            <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 -mx-6 border-t border-gray-100 dark:border-gray-700">
              {!showResults ? (
                <Button 
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-white transition-colors duration-300"
                >
                  Soumettre les réponses
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300
                            hover:bg-primary/10 hover:text-primary hover:border-primary/50
                            text-gray-700 dark:text-gray-200"
                >
                  {practiceMode ? "Réessayer" : "Recommencer"}
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Question, Lesson, Progress } from '../types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, XCircle } from 'lucide-react'

interface LessonQuizDialogProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onProgressUpdate: (progress: Progress) => void
}

export default function LessonQuizDialog({ lesson, isOpen, onClose, onProgressUpdate }: LessonQuizDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [attempts, setAttempts] = useState(lesson.progress?.attempts || 0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const currentQuestion = lesson.questions[currentQuestionIndex]

  const handleAnswer = (answer: boolean) => {
    const correct = answer === currentQuestion.isCorrect
    setIsCorrect(correct)
    setShowFeedback(true)
    setAttempts(prev => prev + 1)

    if (correct) {
      setCorrectAnswers(prev => prev + 1)
      if (currentQuestionIndex === lesson.questions.length - 1) {
        const score = Math.round((correctAnswers + 1) / lesson.questions.length * 100)
        const progress: Progress = {
          completed: true,
          score,
          submittedAt: new Date(),
          attempts
        }
        onProgressUpdate(progress)
        setCompleted(true)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowFeedback(false)
    }
  }

  const handleRetry = () => {
    setShowFeedback(false)
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setShowFeedback(false)
    setIsCorrect(false)
    setCompleted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
          <DialogDescription>
            Question {currentQuestionIndex + 1} sur {lesson.questions.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {completed ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="text-xl font-semibold">Félicitations !</h3>
              <p>Vous avez complété toutes les questions avec succès.</p>
              <Button onClick={resetQuiz}>Terminer</Button>
            </div>
          ) : (
            <>
              <div className="text-lg font-medium">{currentQuestion.text}</div>

              {showFeedback ? (
                <div className="space-y-4">
                  <Alert variant={isCorrect ? "default" : "destructive"}>
                    <AlertDescription className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Bonne réponse !
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          Mauvaise réponse. Essayez encore !
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
                  )}
                  {isCorrect ? (
                    <Button onClick={handleNext} className="w-full">
                      Question suivante
                    </Button>
                  ) : (
                    <Button onClick={handleRetry} variant="outline" className="w-full">
                      Réessayer
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    className="h-20 text-lg"
                  >
                    Vrai
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    className="h-20 text-lg"
                  >
                    Faux
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 

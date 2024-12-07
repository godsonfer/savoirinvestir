'use client'

import { useState, } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Sparkles } from "lucide-react"
import { Difficulty, Exercise } from "../../types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { Id } from "../../../../../../convex/_generated/dataModel"

import { useCreateExercice } from "@/features/exercices/api/use-create-exercice"

// Types pour les cours, chapitres et leçons
interface Course {
  id: string
  title: string
  chapters: Chapter[]
}

interface Chapter {
  id: string
  title: string
  courseId: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  chapterId: string
}

type NewExercise = Omit<Exercise, 'id' | 'chapterId' | 'score' | 'mistakes'> 

interface AddExerciseDialogProps {
  children: React.ReactNode
  onAdd?: (exercise: NewExercise) => void
  courseId: Id<"courses">
  chapterId: Id<"chapters">
  courses: Course[] // Ajout des cours disponibles
}

interface QuestionForm {
  text: string
  points: number
  hint?: string
  category?: string
  courseId : Id<"courses">
  chapterId : Id<"chapters">

}

const QuestionFormComponent = ({
  question,
  onChange,
  onDelete,
  index
}: {
  question: QuestionForm
  onChange: (question: QuestionForm) => void
  onDelete: () => void
  index: number
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
      className={cn(
        "space-y-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700",
        "bg-gradient-to-br from-gray-200/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30",
        "shadow-lg hover:shadow-xl",
        "transform transition-all duration-300",
        isHovered && "scale-[1.02] border-primary/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            Question {index + 1}
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-primary"
              >
                <Sparkles className="h-4 w-4" />
              </motion.span>
            )}
          </Label>
          <Input
            value={question.text}
            onChange={(e) => onChange({ ...question, text: e.target.value })}
            placeholder="Entrez la question..."
            className={cn(
              "bg-white/50 dark:bg-gray-900/50",
              "transition-all duration-300",
              "border-gray-200 dark:border-gray-700",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500"
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className={cn(
            "text-red-500 hover:text-red-600",
            "hover:bg-red-50 dark:hover:bg-red-900/20",
            "transition-all duration-300",
            "rounded-full h-8 w-8 p-0"
          )}
        >
          <Plus className="h-4 w-4 rotate-45 transition-transform" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Points</Label>
          <Input
            type="number"
            min="0"
            value={question.points}
            onChange={(e) => onChange({ ...question, points: parseInt(e.target.value) })}
            className={cn(
              "bg-white/50 dark:bg-gray-900/50",
              "transition-all duration-300",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary"
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Catégorie</Label>
          <Input
            value={question.category || ""}
            onChange={(e) => onChange({ ...question, category: e.target.value })}
            placeholder="Ex: Analyse technique"
            className={cn(
              "bg-white/50 dark:bg-gray-900/50",
              "transition-all duration-300",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary"
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Indice</Label>
        <Input
          value={question.hint || ""}
          onChange={(e) => onChange({ ...question, hint: e.target.value })}
          placeholder="Donnez un indice pour aider à répondre..."
          className={cn(
            "bg-white/50 dark:bg-gray-900/50",
            "transition-all duration-300",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary"
          )}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Options de réponse
        </Label>
        <AnimatePresence mode="popLayout">
          {question.options.map((option, optIndex) => (
            <motion.div
              key={optIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: optIndex * 0.1 }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...question.options]
                    newOptions[optIndex] = { ...option, text: e.target.value }
                    onChange({ ...question, options: newOptions })
                  }}
                  placeholder={`Option ${optIndex + 1}`}
                  className={cn(
                    "bg-white/50 dark:bg-gray-900/50",
                    "transition-all duration-300",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  )}
                />
                <Button
                  type="button"
                  variant={option.isCorrect ? "default" : "outline"}
                  className={cn(
                    "transition-all duration-300 min-w-[100px]",
                    option.isCorrect
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                      : "hover:bg-green-50 dark:hover:bg-green-900/20"
                  )}
                  onClick={() => {
                    const newOptions = question.options.map((opt, i) => ({
                      ...opt,
                      isCorrect: i === optIndex
                    }))
                    onChange({ ...question, options: newOptions })
                  }}
                >
                  {option.isCorrect ? "Correcte ✓" : "Correcte"}
                </Button>
              </div>
              <Textarea
                value={option.explanation}
                onChange={(e) => {
                  const newOptions = [...question.options]
                  newOptions[optIndex] = { ...option, explanation: e.target.value }
                  onChange({ ...question, options: newOptions })
                }}
                placeholder="Explication de la réponse..."
                className={cn(
                  "bg-white/50 dark:bg-gray-900/50",
                  "transition-all duration-300",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  "min-h-[80px] resize-y"
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function AddExerciseDialog({ children,  courseId, chapterId }: AddExerciseDialogProps) {
    const  {mutate : createExercise} = useCreateExercice()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("Facile")
  const [points, setPoints] = useState("10")
  const [questions, setQuestions] = useState<QuestionForm[]>([])
  
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        points: 10,
        courseId,
        chapterId,
        options: [
          { text: "", isCorrect: true, explanation: "" },
          { text: "", isCorrect: false, explanation: "" },
          { text: "", isCorrect: false, explanation: "" }
        ]
      }
    ])
  }

  const handleSubmit = () => {
    const totalPoints = questions.reduce((acc, q) => acc + q.points, parseInt(points))
    createExercise( {
        title,
        description,
        difficulty,
        score: totalPoints,
        points: totalPoints,
        courseId,
        chapterId,
        questions: questions.map((q, i) => ({
                questionId: `new-q-${i}-${new Date().getTime()}`,
                question: q.text,
                points: q.points,
                hint: q.hint || "",
                category: q.category || "",
          options: q.options.map((opt, j) => ({
            id: `new-opt-${j}-${new Date().getTime()}`,
            text: opt.text,
            isCorrect: opt.isCorrect,
            explanation: opt.explanation
          }))
        })),
    }, {
        onSuccess : ()=> {
            toast.success("Exercice ajouté avec succès")
            setOpen(false)
            setTitle("")
            setDescription("")
            setDifficulty("Facile")
            setPoints("10")
            setQuestions([])
        }, 
        onError : ()=> {

            toast.error("Erreur lors de l'ajout de l'exercice", )
            setOpen(false)
            setTitle("")
            setDescription("")
            setDifficulty("Facile")
            setPoints("10")
            setQuestions([])
        }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 bg-gradient-to-br from-white to-white/90 dark:from-gray-800/95 dark:to-gray-800/90 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 flex items-center gap-3">
            <Plus className="h-6 w-6 text-primary" />
            Ajouter un exercice
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="p-6 space-y-6">
           
              {/* Informations de base */}
              <div className="grid gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Titre de l&apos;exercice
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entrez le titre de l'exercice"
                    className="bg-white/50 dark:bg-gray-900/50 transition-colors focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez l'exercice..."
                    className="bg-white/50 dark:bg-gray-900/50 transition-colors focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                    required
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Difficulté
                    </Label>
                    <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                      <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 transition-colors focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Choisir la difficulté" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facile">Facile</SelectItem>
                        <SelectItem value="Moyen">Moyen</SelectItem>
                        <SelectItem value="Difficile">Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Points de base
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      className="bg-white/50 dark:bg-gray-900/50 transition-colors focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Questions
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestion}
                    className="gap-2 hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une question
                  </Button>
                </div>

                <AnimatePresence>
                  {questions.map((question, index) => (
                    <QuestionFormComponent
                      key={index}
                      question={question}
                      index={index}
                      onChange={(updatedQuestion) => {
                        const newQuestions = [...questions]
                        newQuestions[index] = updatedQuestion
                        setQuestions(newQuestions)
                      }}
                      onDelete={() => {
                        setQuestions(questions.filter((_, i) => i !== index))
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 flex justify-end gap-3 bg-gray-50/80 dark:bg-gray-800/80 sticky bottom-0 z-10">
              <Button 
                type="button"
                variant="outline" 
                className="bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white transition-colors"
                disabled={!title || !description || questions.length === 0  }
              >
                Ajouter l&apos;exercice
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 

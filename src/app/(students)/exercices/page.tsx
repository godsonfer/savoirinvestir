/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Search,    BookOpen, GraduationCap, Trophy,  } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { CourseCard } from "./components/cards/course-card"
import { StatsOverview } from "./components/stats/stats-overview"
import { DetailedStats } from "./components/stats/detailed-stats"
import { mockCourses } from "./data/mock-data"
import { Course, Chapter, Exercise } from "./types"
import {  useGetBookmarkPurchase } from "@/features/bookmarks/use-user-bookmark-purchase"

// Composant de recherche amélioré
const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 h-5 w-5 transition-colors group-hover:text-primary" />
        <Input
          placeholder="Rechercher un cours ou un exercice..."
          className={cn(
            "w-full pl-12 h-14 text-lg bg-white/80 dark:bg-gray-800 backdrop-blur-sm",
            "border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white",
            "transition-all duration-300 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "group-hover:shadow-lg group-hover:shadow-primary/5",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
          )}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </motion.div>
  )
}

// Composant de filtrage amélioré
const FilterBar = ({ 
  onDifficultyChange, 
  onCompletionChange 
}: { 
  onDifficultyChange: (difficulty: string) => void
  onCompletionChange: (status: string) => void
}) => {
  return (
    <motion.div 
      className="flex gap-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Select onValueChange={onDifficultyChange}>
        <SelectTrigger className={cn(
          "flex-1 min-w-[180px] bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl",
          "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white",
          "transition-all duration-300 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        )}>
          <SelectValue placeholder="Difficulté" className="text-gray-700 dark:text-gray-200" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-gray-800 backdrop-blur-lg border-gray-200 dark:border-gray-700">
          <SelectItem value="all" className="text-gray-700 dark:text-gray-200">Toutes les difficultés</SelectItem>
          <SelectItem value="Facile" className="text-gray-700 dark:text-gray-200">Facile</SelectItem>
          <SelectItem value="Moyen" className="text-gray-700 dark:text-gray-200">Moyen</SelectItem>
          <SelectItem value="Difficile" className="text-gray-700 dark:text-gray-200">Difficile</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onCompletionChange}>
        <SelectTrigger className={cn(
          "flex-1 min-w-[180px] bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-xl",
          "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white",
          "transition-all duration-300 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        )}>
          <SelectValue placeholder="Statut" className="text-gray-700 dark:text-gray-200" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-gray-800 backdrop-blur-lg border-gray-200 dark:border-gray-700">
          <SelectItem value="all" className="text-gray-700 dark:text-gray-200">Tous les statuts</SelectItem>
          <SelectItem value="completed" className="text-gray-700 dark:text-gray-200">Complétés</SelectItem>
          <SelectItem value="inProgress" className="text-gray-700 dark:text-gray-200">En cours</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  )
}

// Composant de tri
// const SortDropdown = ({ onSort }: { onSort: (key: string) => void }) => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="sm" className={cn(
//           "ml-2 bg-white/80 dark:bg-gray-800 backdrop-blur-sm",
//           "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white",
//           "transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
//         )}>
//           <ArrowUpDown className="h-4 w-4 mr-2" />
//           Trier
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800 backdrop-blur-lg border-gray-200 dark:border-gray-700">
//         <DropdownMenuItem onClick={() => onSort("difficulty")} className="text-gray-700 dark:text-gray-200">
//           Par difficulté
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => onSort("points")} className="text-gray-700 dark:text-gray-200">
//           Par points
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => onSort("completion")} className="text-gray-700 dark:text-gray-200">
//           Par progression
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// Composant de thème


// Composant de statistiques rapides
const QuickStats = ({ stats }: { stats: { totalExercises: number; completedExercises: number; earnedPoints: number } }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <motion.div 
        className={cn(
          "p-4 rounded-xl bg-white/80 dark:bg-gray-800 backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-700",
          "flex items-center space-x-3 group hover:bg-white/90 dark:hover:bg-gray-700/90",
          "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total exercices</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalExercises}</div>
        </div>
      </motion.div>

      <motion.div 
        className={cn(
          "p-4 rounded-xl bg-white/80 dark:bg-gray-800 backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-700",
          "flex items-center space-x-3 group hover:bg-white/90 dark:hover:bg-gray-700/90",
          "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Complétés</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.completedExercises}</div>
        </div>
      </motion.div>

      <motion.div 
        className={cn(
          "p-4 rounded-xl bg-white/80 dark:bg-gray-800 backdrop-blur-sm",
          "border border-gray-200 dark:border-gray-700",
          "flex items-center space-x-3 group hover:bg-white/90 dark:hover:bg-gray-700/90",
          "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Points gagnés</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.earnedPoints}</div>
        </div>
      </motion.div>
    </div>
  )
}

type NewExercise = Omit<Exercise, 'id' | 'chapterId' | 'score' | 'mistakes'> & {
  chapterId?: string
}

interface ExerciceType {
  isCompleted?: boolean;
  points?: number;
  _id?: string;
}

interface ChapterType {
  exercicesDone?: ExerciceType[];
  exercices?: ExerciceType[];
}

// Composant principal amélioré
const ExercicesPage = () => {
  const { results, status, loadMore } = useGetBookmarkPurchase();
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [completionFilter, setCompletionFilter] = useState("all")
  const [sortKey, setSortKey] = useState("")
  const [activeStatsTab, setActiveStatsTab] = useState<"overview" | "detailed">("overview")
  
  const stats = useMemo(() => {
    if (!results || results.length === 0) return {
      totalExercises: 0,
      completedExercises: 0,
      totalPoints: 0,
      earnedPoints: 0
    }

    console.log("Structure complète d'un résultat:", {
      result: results[0],
      exercicesDone: results[0].exercicesDone,
      courseExercicesDone: results[0].course.exercicesDone,
      premierChapitre: results[0].course.chapters[0],
    });

    const totalExercises = results.reduce((acc: number, result) => 
      acc + result.course.chapters.reduce((chAcc: number, ch: { exercices: any[] }) => 
        chAcc + ch.exercices.length, 0
      ), 0
    )


    const completedExercises = results.reduce((acc: number, result) => {
      // Exercices complétés au niveau du cours
      const courseCompleted = result.course.exercices?.filter((ex: ExerciceType) => ex.isCompleted).length || 0;
      
      // Exercices complétés au niveau des chapitres
      const chaptersCompleted = result.course.chapters.reduce((chAcc: number, chapter: ChapterType) => {
        return chAcc + (chapter.exercicesDone?.length || 0);
      }, 0);
      
      return acc + courseCompleted + chaptersCompleted;
    }, 0);

    const totalPoints = results.reduce((acc: number, result) => {
      return acc + result.course.chapters.reduce((chAcc: number, ch: { exercices: Array<{ points?: number }> }) => {
        return chAcc + ch.exercices.reduce((exAcc: number, ex: { points?: number }) => 
          exAcc + (ex.points || 0), 0
        )
      }, 0)
    }, 0)

    const earnedPoints = results.reduce((acc: number, result) => {
      // Points des exercices complétés au niveau du cours
      const coursePoints = result.course.exercices?.reduce((exAcc: number, ex: ExerciceType) => 
        ex.isCompleted ? exAcc + (ex.points || 0) : exAcc, 0
      ) || 0;
      
      // Points des exercices complétés au niveau des chapitres
      const chaptersPoints = result.course.chapters.reduce((chAcc: number, chapter: ChapterType) => {
        return chAcc + (chapter.exercicesDone?.reduce((exAcc: number, ex: ExerciceType) => 
          exAcc + (ex.points || 0), 0
        ) || 0);
      }, 0);
      
      return acc + coursePoints + chaptersPoints;
    }, 0);

    return {
      totalExercises,
      completedExercises,
      totalPoints,
      earnedPoints
    }
  }, [results])

  const filteredAndSortedCourses = useMemo(() => {
    if (!results || results.length === 0) return []

    return results
      .map((courseData: { course: any; exercisesDone: string[] }) => {
        const course = courseData.course
        return {
          id: course._id,
          title: course.title,
          description: course.description,
          difficulty: course.difficulty,
          progress: course.progress,
          chapters: course.chapters.map((chapter: { 
            _id: string; 
            title: string; 
            description: string; 
            exercices: any[];
            exercicesDone: any[];
          }) => {
            // Créer un Set des IDs des exercices faits pour une recherche plus rapide
            const completedExerciseIds = new Set(
              chapter.exercicesDone?.map(ex => ex._id) || []
            );

            // Calculer le nombre d'exercices faits dans ce chapitre
            const chapterCompletedCount = chapter.exercicesDone?.length || 0;
            
            return {
              id: chapter._id,
              title: chapter.title,
              description: chapter.description,
              completedCount: chapterCompletedCount,
              totalCount: chapter.exercices.length,
              exercises: chapter.exercices
                .filter((exercise: { 
                  title?: string; 
                  description?: string; 
                  difficulty?: string; 
                  _id?: string 
                }) => {
                  const matchesSearch = 
                    exercise.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exercise.description?.toLowerCase().includes(searchQuery.toLowerCase())
                  
                  const matchesDifficulty = 
                    difficultyFilter === "all" || exercise.difficulty === difficultyFilter
                  
                  const isExerciseDone = completedExerciseIds.has(exercise._id);
                  
                  const matchesCompletion = 
                    completionFilter === "all" ||
                    (completionFilter === "completed" && isExerciseDone) ||
                    (completionFilter === "inProgress" && !isExerciseDone)
                  
                  return matchesSearch && matchesDifficulty && matchesCompletion
                })
                .map((exercise: { 
                  title?: string; 
                  description?: string; 
                  difficulty?: string; 
                  _id?: string 
                }) => ({
                  ...exercise,
                  isCompleted: completedExerciseIds.has(exercise._id),
                  isDisabled: completedExerciseIds.has(exercise._id) // Désactiver si déjà fait
                }))
            }
          })
        }
      })
      .filter(course => 
        course.chapters.some((chapter: { exercises: any[] }) => chapter.exercises.length > 0)
      )
  }, [results, searchQuery, difficultyFilter, completionFilter])



  return (
    <LayoutGroup>
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-gray-50/50 via-gray-100/50 to-white",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "relative"
      )}>
        <div className="h-[100dvh] overflow-auto">
          <div className="p-2 sm:p-4 md:p-8 pb-40">
            <div className="max-w-[1800px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Colonne de gauche : Statistiques */}
                <div className="lg:col-span-1 hidden lg:block">
                  <div className="sticky top-4 md:top-8 space-y-6">
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={cn(
                        "bg-white/80 dark:bg-gray-800 backdrop-blur-md border-0",
                        "shadow-xl shadow-primary/5 overflow-hidden rounded-2xl",
                        "hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                      )}>
                        <div className="border-b border-gray-100 dark:border-gray-700 p-4 md:p-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Statistiques
                          </h2>
                        </div>
                        <div className="p-4 md:p-6 space-y-6">
                          <div className="flex space-x-4">
                            <Button
                              variant={activeStatsTab === "overview" ? "default" : "outline"}
                              onClick={() => setActiveStatsTab("overview")}
                              className="flex-1 transition-all duration-300"
                            >
                              Vue d&apos;ensemble
                            </Button>
                            <Button
                              variant={activeStatsTab === "detailed" ? "default" : "outline"}
                              onClick={() => setActiveStatsTab("detailed")}
                              className="flex-1 transition-all duration-300"
                            >
                              Graphiques
                            </Button>
                          </div>

                          <AnimatePresence mode="wait">
                            {activeStatsTab === "overview" ? (
                              <StatsOverview key="overview" stats={stats} />
                            ) : (
                              <DetailedStats key="detailed" />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Colonne de droite : Liste des exercices */}
                <div className="lg:col-span-2">
                  <div className={cn(
                    "z-10 bg-gradient-to-b from-gray-50/95 via-gray-50/95 to-transparent",
                    "dark:from-gray-900 dark:via-gray-900 dark:to-transparent",
                    "pb-4 lg:sticky lg:top-0"
                  )}>
                    <div className="space-y-4 pt-2 px-2">
                      <div className="flex items-center justify-between">
                        <motion.h1 
                          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-clip-text"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          Cours et Exercices
                        </motion.h1>
                        <div className="flex items-center gap-2">
                       
                          <div className="block lg:hidden">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setActiveStatsTab(activeStatsTab === "overview" ? "detailed" : "overview")}
                              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                            >
                              <GraduationCap className="h-5 w-5" />
                            </Button>
                          </div>
                       
                        </div>
                      </div>

                      {/* Stats pour mobile */}
                      <div className="block lg:hidden">
                        <AnimatePresence mode="wait">
                          {activeStatsTab === "overview" ? (
                            <StatsOverview key="overview" stats={stats} />
                          ) : (
                            <DetailedStats key="detailed" />
                          )}
                        </AnimatePresence>
                      </div>

                      <QuickStats stats={stats} />

                      <div className="space-y-4">
                        <SearchBar onSearch={setSearchQuery} />
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          <FilterBar 
                            onDifficultyChange={setDifficultyFilter}
                            onCompletionChange={setCompletionFilter}
                          />
                          {/* <SortDropdown onSort={setSortKey} /> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pb-20 px-2 mt-6">
                    <AnimatePresence mode="wait">
                      {filteredAndSortedCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <CourseCard course={course} />
                        </motion.div>
                      ))}
                      {filteredAndSortedCourses.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "text-center py-16 bg-white/80 dark:bg-gray-800 backdrop-blur-md rounded-2xl shadow-lg"
                          )}
                        >
                          <p className="text-gray-500 dark:text-white">
                            Aucun résultat trouvé pour vos critères de recherche
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  )
}

export default ExercicesPage

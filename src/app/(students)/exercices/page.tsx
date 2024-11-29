'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Course, Lesson, Progress } from './types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LessonQuizDialog from './components/LessonQuizDialog'
import ProgressIndicator from './components/ProgressIndicator'
import { Clock, Users, Award } from 'lucide-react'
import classNames from 'classnames'

const BackgroundPattern = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_85%)]" />
    <div className="absolute -top-1/2 right-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-indigo-400/20 blur-[128px]" />
  </div>
)

const calculateCourseRating = (course: Course): number => {
  let totalScore = 0;
  let totalExercises = 0;

  course.chapters.forEach(chapter => {
    chapter.lessons.forEach(lesson => {
      if (lesson.progress) {
        // Formule : score / (nombre de tentatives * 10)
        // Plus il y a de tentatives, plus la note diminue
        const lessonRating = lesson.progress.score / (lesson.progress.attempts * 10);
        totalScore += Math.min(5, lessonRating); // Maximum 5 étoiles
        totalExercises++;
      }
    });
  });

  // Si aucun exercice n'a été tenté, retourne 0
  if (totalExercises === 0) return 0;
  
  // Moyenne sur 5 étoiles
  return Math.round((totalScore / totalExercises) * 2) / 2; // Arrondi au 0.5 près
};

export default function ExercisesPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [isMobileChaptersOpen, setIsMobileChaptersOpen] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulation de données pour l'exemple
        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'Introduction à la Programmation JavaScript',
            description: 'Apprenez les bases de la programmation avec JavaScript',
            coverImage: '/images/javascript-course.jpg',
            duration: '12h',
            studentsCount: 1234,
            isCertified: true,
            chapters: [
              {
                id: '1',
                title: 'Les Fondamentaux',
                description: 'Les concepts de base de la programmation',
                order: 1,
                lessons: [
                  {
                    id: '1',
                    title: 'Variables et Types',
                    description: 'Comprendre les variables et les types en JS',
                    difficulty: 'easy',
                    order: 1,
                    questions: [
                      {
                        id: '1',
                        text: 'En JavaScript, "const" permet de déclarer une variable dont la valeur peut être modifiée.',
                        isCorrect: false,
                        explanation: 'Une variable déclarée avec "const" ne peut pas être réassignée. Sa valeur est constante.'
                      },
                      {
                        id: '2',
                        text: 'Le type "undefined" est attribué automatiquement à une variable déclarée sans valeur initiale.',
                        isCorrect: true,
                        explanation: 'En JavaScript, une variable déclarée sans valeur reçoit automatiquement la valeur "undefined".'
                      }
                    ]
                  },
                  {
                    id: '2',
                    title: 'Opérateurs',
                    description: 'Les différents opérateurs en JavaScript',
                    difficulty: 'easy',
                    order: 2,
                    questions: [
                      {
                        id: '3',
                        text: 'En JavaScript, "+" peut être utilisé pour concaténer des chaînes de caractères.',
                        isCorrect: true,
                        explanation: 'En JavaScript, "+" peut être utilisé pour concaténer des chaînes de caractères.'
                      },
                      {
                        id: '4',
                        text: 'En JavaScript, "++" est un opérateur d\'incrémentation.',
                        isCorrect: false,
                        explanation: 'En JavaScript, "++" n\'est pas un opérateur d\'incrémentation. C\'est un opérateur d\'affectation après incrémentation.'
                      }
                    ]
                  }
                ]
              },
              {
                id: '2',
                title: 'Structures de Contrôle',
                description: 'Maîtrisez le flux de votre programme',
                order: 2,
                lessons: [
                  {
                    id: '3',
                    title: 'Conditions',
                    description: 'Les instructions if, else, et switch',
                    difficulty: 'medium',
                    order: 1,
                    questions: [
                      {
                        id: '5',
                        text: 'En JavaScript, "if" est utilisé pour tester une condition.',
                        isCorrect: true,
                        explanation: 'En JavaScript, "if" est utilisé pour tester une condition.'
                      },
                      {
                        id: '6',
                        text: 'En JavaScript, "else" est utilisé pour exécuter un bloc de code si la condition est fausse.',
                        isCorrect: true,
                        explanation: 'En JavaScript, "else" est utilisé pour exécuter un bloc de code si la condition est fausse.'
                      }
                    ]
                  },
                  {
                    id: '4',
                    title: 'Boucles',
                    description: 'Les boucles for et while',
                    difficulty: 'medium',
                    order: 2,
                    questions: [
                      {
                        id: '7',
                        text: 'En JavaScript, "for" est utilisé pour répéter un bloc de code un nombre spécifique de fois.',
                        isCorrect: true,
                        explanation: 'En JavaScript, "for" est utilisé pour répéter un bloc de code un nombre spécifique de fois.'
                      },
                      {
                        id: '8',
                        text: 'En JavaScript, "while" est utilisé pour répéter un bloc de code tant qu\'une condition est vraie.',
                        isCorrect: true,
                        explanation: 'En JavaScript, "while" est utilisé pour répéter un bloc de code tant qu\'une condition est vraie.'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: '2',
            title: 'React Avancé',
            description: 'Maîtrisez les concepts avancés de React',
            coverImage: '/images/react-course.jpg',
            duration: '15h',
            studentsCount: 856,
            isCertified: true,
            chapters: [
              // Ajoutez d'autres chapitres ici
            ]
          }
        ]
        setCourses(mockCourses)
        setCourse(mockCourses[0]) // Définir le premier cours par défaut
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const getDifficultyColor = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-600'
      case 'medium':
        return 'text-amber-600'
      case 'hard':
        return 'text-rose-600'
    }
  }, [])

  const handleProgressUpdate = useCallback((lessonId: string, progress: Progress) => {
    if (!course) return

    const updatedCourse = { ...course }
    
    // Mise à jour de la progression de la leçon
    updatedCourse.chapters = updatedCourse.chapters.map(chapter => ({
      ...chapter,
      lessons: chapter.lessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, progress }
          : lesson
      )
    }))

    // Calcul de la progression du chapitre
    updatedCourse.chapters = updatedCourse.chapters.map(chapter => ({
      ...chapter,
      progress: {
        completed: chapter.lessons.every(l => l.progress?.completed),
        score: Math.round(
          chapter.lessons.reduce((acc, l) => acc + (l.progress?.score || 0), 0) / 
          chapter.lessons.length
        ),
        attempts: chapter.lessons.reduce((acc, l) => acc + (l.progress?.attempts || 0), 0),
        submittedAt: new Date()
      }
    }))

    // Calcul de la progression du cours
    const courseProgress: Progress = {
      completed: updatedCourse.chapters.every(c => c.progress?.completed),
      score: Math.round(
        updatedCourse.chapters.reduce((acc, c) => acc + (c.progress?.score || 0), 0) / 
        updatedCourse.chapters.length
      ),
      attempts: updatedCourse.chapters.reduce((acc, c) => acc + (c.progress?.attempts || 0), 0),
      submittedAt: new Date()
    }
    updatedCourse.progress = courseProgress

    setCourse(updatedCourse)
    // TODO: Sauvegarder la progression dans la base de données
  }, [course])

  const handleCourseClick = (selectedCourse: Course) => {
    setCourse(selectedCourse)
    if (window.innerWidth < 1024) {
      setIsMobileChaptersOpen(true)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>
  }

  if (!course) {
    return <div>Aucun cours trouvé</div>
  }

  return (
    <div className="relative min-h-screen bg-gray-50/80 backdrop-blur-sm">
      <BackgroundPattern />
      <div className="container mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar améliorée avec animations */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 h-[calc(100vh-2rem)] sticky top-4 flex flex-col">
              {/* Header fixe */}
              <div className="p-6 border-b border-gray-100/50 backdrop-blur-md bg-white/50">
                <h2 className="text-2xl font-bold text-gray-900">Mes Cours</h2>
                <p className="text-gray-500 mt-1">Sélectionnez un cours pour commencer</p>
              </div>
              
              {/* Liste des cours avec défilement */}
              <div className="flex-1 overflow-hidden hover:overflow-y-auto transition-all duration-300 custom-scrollbar">
                <div className="p-6 space-y-6">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className={classNames(
                        'group rounded-xl bg-white shadow-sm transition-all duration-300',
                        'hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer relative',
                        'border-2 hover:border-indigo-500/30',
                        { 
                          'ring-2 ring-indigo-500 border-transparent': course?.id === c.id,
                          'border-gray-100': course?.id !== c.id 
                        }
                      )}
                      onClick={() => setCourse(c)}
                    >
                      {/* Effet de brillance */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shine_1.5s_ease-in-out]" />
                      </div>

                      {/* Image de couverture */}
                      <div className="relative h-32 overflow-hidden rounded-t-xl">
                        <img
                          src={c.coverImage}
                          alt={c.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {c.isCertified && (
                          <div className="absolute top-3 right-3 bg-white/90 text-indigo-600 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm">
                            <Award className="h-4 w-4" />
                            <span>Certifié</span>
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                          {c.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>

                        {/* Métriques et Note */}
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{c.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{c.studentsCount} étudiants</span>
                            </div>
                          </div>
                          
                          {/* Note du cours */}
                          {c.progress && (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const rating = calculateCourseRating(c);
                                  const isHalf = rating + 0.5 === star;
                                  const isFull = rating >= star;
                                  
                                  return (
                                    <div key={star} className="relative">
                                      {/* Étoile de base (vide) */}
                                      <svg 
                                        className="w-4 h-4 text-gray-300" 
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round" 
                                          strokeWidth={2} 
                                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        />
                                      </svg>
                                      {/* Étoile remplie */}
                                      <div 
                                        className="absolute inset-0 overflow-hidden"
                                        style={{ width: isHalf ? '50%' : isFull ? '100%' : '0%' }}
                                      >
                                        <svg 
                                          className="w-4 h-4 text-yellow-400" 
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path 
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <span className="text-sm font-medium text-yellow-600">
                                {calculateCourseRating(c).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Barre de progression */}
                        {c.progress && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Progression</span>
                              <span className="font-medium text-indigo-600">{c.progress.score}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${c.progress.score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal avec animations */}
          <div className="lg:col-span-8 xl:col-span-9">
            {course && (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm p-6 mb-6 border border-white/20 relative overflow-hidden group sticky top-4 z-10">
                {/* Effet de pulse sur le header */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 mt-2 text-lg">{course.description}</p>
                {course.progress && (
                  <div className="mt-6">
                    <ProgressIndicator 
                      progress={course.progress} 
                      label="Progression globale" 
                    />
                  </div>
                )}
              </div>
            )}

            {/* Conteneur avec défilement pour les chapitres */}
            <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
              <Accordion type="multiple" className="space-y-6">
                {course?.chapters.map((chapter) => (
                  <AccordionItem 
                    key={chapter.id} 
                    value={chapter.id} 
                    className="border border-white/20 rounded-xl shadow-sm bg-white/80 backdrop-blur-md overflow-hidden group transition-all duration-300 hover:shadow-lg"
                  >
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex flex-col items-start w-full">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Chapitre {chapter.order}: {chapter.title}
                        </h2>
                        <p className="text-gray-600 mt-1">{chapter.description}</p>
                        {chapter.progress && (
                          <div className="w-full mt-4">
                            <ProgressIndicator progress={chapter.progress} />
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {chapter.lessons.map((lesson) => (
                          <Card 
                            key={lesson.id} 
                            className={classNames(
                              "border-l-4 group/card relative overflow-hidden",
                              "transition-all duration-300 hover:scale-[1.02]",
                              {
                                'border-emerald-500 hover:shadow-emerald-500/20 hover:shadow-xl': lesson.difficulty === 'easy',
                                'border-amber-500 hover:shadow-amber-500/20 hover:shadow-xl': lesson.difficulty === 'medium',
                                'border-rose-500 hover:shadow-rose-500/20 hover:shadow-xl': lesson.difficulty === 'hard'
                              }
                            )}
                          >
                            {/* Effet de particules */}
                            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                              <div className={classNames(
                                "absolute h-40 w-40 rounded-full blur-3xl transition-all duration-500",
                                {
                                  'bg-emerald-500/10 group-hover/card:translate-x-full': lesson.difficulty === 'easy',
                                  'bg-amber-500/10 group-hover/card:translate-x-full': lesson.difficulty === 'medium',
                                  'bg-rose-500/10 group-hover/card:translate-x-full': lesson.difficulty === 'hard'
                                }
                              )} />
                            </div>

                            <CardHeader className={classNames(
                              'pb-2',
                              {
                                'bg-emerald-50/30': lesson.difficulty === 'easy',
                                'bg-amber-50/30': lesson.difficulty === 'medium',
                                'bg-rose-50/30': lesson.difficulty === 'hard'
                              }
                            )}>
                              <CardTitle className="flex justify-between items-center flex-wrap gap-2">
                                <span className="text-base sm:text-lg">{lesson.title}</span>
                                <span className={classNames(
                                  'text-sm px-3 py-1 rounded-full',
                                  {
                                    'bg-emerald-100 text-emerald-700': lesson.difficulty === 'easy',
                                    'bg-amber-100 text-amber-700': lesson.difficulty === 'medium',
                                    'bg-rose-100 text-rose-700': lesson.difficulty === 'hard'
                                  }
                                )}>
                                  {lesson.difficulty}
                                </span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-4 text-sm text-gray-600">{lesson.description}</p>
                              {lesson.progress && (
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-600">Progression</span>
                                    <span className={classNames(
                                      'font-medium',
                                      {
                                        'text-emerald-600': lesson.difficulty === 'easy',
                                        'text-amber-600': lesson.difficulty === 'medium',
                                        'text-rose-600': lesson.difficulty === 'hard'
                                      }
                                    )}>{lesson.progress.score}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={classNames(
                                        'h-full rounded-full transition-all duration-300',
                                        {
                                          'bg-gradient-to-r from-emerald-500 to-emerald-600': lesson.difficulty === 'easy',
                                          'bg-gradient-to-r from-amber-500 to-amber-600': lesson.difficulty === 'medium',
                                          'bg-gradient-to-r from-rose-500 to-rose-600': lesson.difficulty === 'hard'
                                        }
                                      )}
                                      style={{ width: `${lesson.progress.score}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              <Button 
                                className={classNames(
                                  'w-full relative overflow-hidden group/button',
                                  {
                                    'bg-emerald-600 hover:bg-emerald-700': lesson.difficulty === 'easy',
                                    'bg-amber-600 hover:bg-amber-700': lesson.difficulty === 'medium',
                                    'bg-rose-600 hover:bg-rose-700': lesson.difficulty === 'hard'
                                  }
                                )}
                                onClick={() => setSelectedLesson(lesson)}
                              >
                                {/* Effet de pulse sur le bouton */}
                                <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100">
                                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                                <span className="relative">
                                  {lesson.progress?.completed ? 'Reprendre' : 'Commencer'} la leçon
                                </span>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour mobile */}
      <Dialog open={isMobileChaptersOpen} onOpenChange={setIsMobileChaptersOpen}>
        <DialogContent className="max-w-full h-[100dvh] p-0 gap-0 bg-gray-50/80 backdrop-blur-sm">
          <div className="h-full flex flex-col overflow-hidden">
            {/* Header du modal */}
            <div className="bg-white/80 backdrop-blur-md p-6 border-b border-gray-100 sticky top-0 z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{course?.title}</h2>
                  <p className="text-gray-600 mt-1">{course?.description}</p>
                </div>
                <button
                  onClick={() => setIsMobileChaptersOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {course?.progress && (
                <ProgressIndicator 
                  progress={course.progress} 
                  label="Progression globale" 
                />
              )}
            </div>

            {/* Contenu du modal avec défilement */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-4 space-y-4">
                {course?.chapters.map((chapter) => (
                  <div 
                    key={chapter.id}
                    className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 overflow-hidden"
                  >
                    {/* En-tête du chapitre */}
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Chapitre {chapter.order}: {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                      {chapter.progress && (
                        <div className="mt-3">
                          <ProgressIndicator progress={chapter.progress} />
                        </div>
                      )}
                    </div>

                    {/* Liste des leçons */}
                    <div className="divide-y divide-gray-100">
                      {chapter.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className={classNames(
                            "p-4 hover:bg-gray-50/50 transition-colors",
                            "flex items-center justify-between gap-4"
                          )}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {lesson.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                              {lesson.description}
                            </p>
                            {lesson.progress && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={classNames(
                                      'h-full rounded-full transition-all duration-300',
                                      {
                                        'bg-emerald-500': lesson.difficulty === 'easy',
                                        'bg-amber-500': lesson.difficulty === 'medium',
                                        'bg-rose-500': lesson.difficulty === 'hard'
                                      }
                                    )}
                                    style={{ width: `${lesson.progress.score}%` }}
                                  />
                                </div>
                                <span className={classNames(
                                  'text-xs font-medium',
                                  {
                                    'text-emerald-600': lesson.difficulty === 'easy',
                                    'text-amber-600': lesson.difficulty === 'medium',
                                    'text-rose-600': lesson.difficulty === 'hard'
                                  }
                                )}>
                                  {lesson.progress.score}%
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Badge de difficulté et flèche */}
                          <div className="flex items-center gap-3">
                            <span className={classNames(
                              'text-xs px-2 py-1 rounded-full',
                              {
                                'bg-emerald-100 text-emerald-700': lesson.difficulty === 'easy',
                                'bg-amber-100 text-amber-700': lesson.difficulty === 'medium',
                                'bg-rose-100 text-rose-700': lesson.difficulty === 'hard'
                              }
                            )}>
                              {lesson.difficulty}
                            </span>
                            <svg 
                              className="h-5 w-5 text-gray-400" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de la leçon */}
      {selectedLesson && (
        <LessonQuizDialog
          lesson={selectedLesson}
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onProgressUpdate={(progress) => handleProgressUpdate(selectedLesson.id, progress)}
        />
      )}
    </div>
  )
}

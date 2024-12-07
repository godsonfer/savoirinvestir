import { Exercise } from "./types"

export const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Introduction aux marchés financiers",
    description: "Comprendre les bases des marchés financiers et leurs fonctionnements",
    chapterId: "ch1",
    isCompleted: true,
    difficulty: "Facile",
    points: 100,
    score: 85,
    mistakes: [],
    attachments: [],
    questions: [
      {
        id: "q1",
        text: "Qu'est-ce qu'une action ?",
        points: 20,
        category: "Bases",
        options: [
          {
            id: "opt1",
            text: "Une part de propriété d'une entreprise",
            isCorrect: true,
            explanation: "Une action représente une part de propriété dans une entreprise"
          },
          {
            id: "opt2",
            text: "Un prêt à une entreprise",
            isCorrect: false,
            explanation: "C'est une obligation qui représente un prêt, pas une action"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Analyse technique de base",
    description: "Apprendre à lire et interpréter les graphiques boursiers",
    chapterId: "ch2",
    isCompleted: false,
    difficulty: "Moyen",
    points: 150,
    attachments: [],
    questions: [
      {
        id: "q2",
        text: "Qu'est-ce qu'une tendance haussière ?",
        points: 30,
        category: "Graphiques",
        options: [
          {
            id: "opt3",
            text: "Une série de plus hauts et plus bas successifs",
            isCorrect: true,
            explanation: "Une tendance haussière se caractérise par des sommets et des creux ascendants"
          },
          {
            id: "opt4",
            text: "Une ligne horizontale sur le graphique",
            isCorrect: false,
            explanation: "Une ligne horizontale indique une phase de consolidation, pas une tendance"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Stratégies de trading avancées",
    description: "Découvrir les stratégies de trading professionnelles",
    chapterId: "ch3",
    isCompleted: false,
    difficulty: "Difficile",
    points: 200,
    attachments: [],
    questions: [
      {
        id: "q3",
        text: "Qu'est-ce que le scalping ?",
        points: 40,
        category: "Stratégies",
        options: [
          {
            id: "opt5",
            text: "Prendre de nombreuses petites positions sur une courte durée",
            isCorrect: true,
            explanation: "Le scalping consiste à réaliser de nombreux trades rapides avec de petits gains"
          },
          {
            id: "opt6",
            text: "Garder une position pendant plusieurs mois",
            isCorrect: false,
            explanation: "C'est plutôt une stratégie de trading à long terme"
          }
        ]
      }
    ]
  }
] 

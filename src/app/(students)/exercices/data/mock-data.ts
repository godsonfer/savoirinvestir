import { Course } from "../types"

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Finance de base",
    description: "Introduction aux concepts fondamentaux de la finance",
    progress: 65,
    difficulty: "Débutant",
    chapters: [
      {
        id: "1",
        title: "Introduction à la Finance",
        courseId: "1",
        progress: 75,
        lessons : [ {
          id: "1",
          title: "Introduction à la Finance",
          courseId: "1",
          progress: 75,
        } ],
        exercises: [
          {
            id: "1",
            title: "Les bases de l'investissement",
            description: "Testez vos connaissances sur les principes fondamentaux",
            chapterId: "1",
            isCompleted: false,
            difficulty: "Facile",
            points: 20,
            questions: [
              {
                id: "q1",
                text: "Qu'est-ce que la diversification en investissement ?",
                points: 10,
                hint: "Pensez au dicton 'Ne mettez pas tous vos œufs dans le même panier'",
                category: "Gestion des risques",
                options: [
                  {
                    id: "a",
                    text: "Investir tout son argent dans une seule entreprise",
                    isCorrect: false,
                    explanation: "Cette approche est risquée car elle expose l'investisseur à un risque important si l'entreprise rencontre des difficultés."
                  },
                  {
                    id: "b",
                    text: "Répartir ses investissements dans différents actifs",
                    isCorrect: true,
                    explanation: "La diversification permet de réduire le risque en répartissant les investissements sur différents actifs, secteurs ou zones géographiques."
                  },
                  {
                    id: "c",
                    text: "Garder tout son argent en espèces",
                    isCorrect: false,
                    explanation: "Garder tout en espèces expose à l'inflation et ne permet pas de bénéficier des opportunités de croissance du marché."
                  }
                ]
              },
              {
                id: "q2",
                text: "Quel est l'avantage principal de l'investissement à long terme ?",
                points: 10,
                hint: "Réfléchissez à l'effet cumulatif du temps sur les rendements",
                category: "Stratégie d'investissement",
                options: [
                  {
                    id: "a",
                    text: "Gains rapides garantis",
                    isCorrect: false,
                    explanation: "Il n'existe pas de gains garantis en investissement, surtout à court terme."
                  },
                  {
                    id: "b",
                    text: "Moins de frais de transaction",
                    isCorrect: false,
                    explanation: "Bien que cela soit un avantage, ce n'est pas le principal bénéfice de l'investissement à long terme."
                  },
                  {
                    id: "c",
                    text: "Capitalisation des intérêts composés",
                    isCorrect: true,
                    explanation: "Les intérêts composés permettent de générer des rendements sur les rendements précédents, créant un effet boule de neige sur le long terme."
                  }
                ]
              }
            ],
            attachments: [
              {
                id: "1",
                name: "Guide d'investissement.pdf",
                url: "/files/guide.pdf",
                type: "pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Analyse technique",
    description: "Apprenez à analyser les graphiques et les tendances du marché",
    progress: 30,
    difficulty: "Intermédiaire",
    chapters: [
      {
        id: "2",
        title: "Les indicateurs techniques",
        courseId: "2",
        progress: 45,
        lessons : [ {
          id: "1",
          title: "Introduction à la Finance",
          courseId: "1",
          progress: 75,
        } ],
        exercises: [
          {
            id: "2",
            title: "Comprendre les moyennes mobiles",
            description: "Maîtrisez l'utilisation des moyennes mobiles dans l'analyse technique",
            chapterId: "2",
            isCompleted: true,
            difficulty: "Moyen",
            points: 25,
            score: 80,
            questions: [
              {
                id: "q3",
                text: "Quelle est la principale utilité d'une moyenne mobile ?",
                points: 15,
                hint: "Pensez à la notion de tendance et de bruit du marché",
                category: "Analyse technique",
                options: [
                  {
                    id: "a",
                    text: "Prédire exactement les prix futurs",
                    isCorrect: false,
                    explanation: "Les moyennes mobiles sont des indicateurs de suivi de tendance, pas des outils de prédiction exacte."
                  },
                  {
                    id: "b",
                    text: "Lisser les prix pour identifier la tendance",
                    isCorrect: true,
                    explanation: "Les moyennes mobiles permettent de filtrer le bruit quotidien pour mieux visualiser la tendance générale."
                  },
                  {
                    id: "c",
                    text: "Calculer la volatilité du marché",
                    isCorrect: false,
                    explanation: "Bien que liées à la volatilité, les moyennes mobiles sont principalement utilisées pour identifier les tendances."
                  }
                ]
              }
            ],
            attachments: []
          }
        ]
      }
    ]
  }
] 

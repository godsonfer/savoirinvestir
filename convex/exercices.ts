/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server";

// Mutations
export const createExercise = mutation({
  args: {
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
    title: v.string(),
    difficulty: v.optional(v.string()),
    score: v.optional(v.number()),
    points: v.optional(v.number()),
    description: v.optional(v.string()),
    isPublished: v.optional(v.boolean() || false),
    questions : v.array( 
        v.object({
          questionId : v.string(),
          question : v.string(),
          points: v.optional(v.number()),
          category: v.optional(v.string()),
          hint: v.optional(v.string()),
          options: v.optional(v.array(v.object({
            id: v.string(),
            text: v.string(),
            isCorrect: v.boolean(),
            explanation: v.optional(v.string()),
          }))),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized");
    // Vérifier si l'utilisateur existe
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");
    // Vérifier si l'utilisateur est un admin, un professeur ou un assistant
    if (user.role !== "admin" && user.role !== "teacher" && user.role !== "assistant")
      throw new Error("Unauthorized");

    // Vérifier si le cours, le chapitre et la leçon existent
    const course = await ctx.db.get(args.courseId)
    if (!course) throw new Error("Cours introuvable")

    if (args.chapterId) {
      const chapter = await ctx.db.get(args.chapterId)
      if (!chapter) throw new Error("Chapitre introuvable")
    }


    // Créer l'exercice
    const exerciseId = await ctx.db.insert("exercices", {
      authorId: userId,
      title: args.title,
      courseId: args.courseId,
      chapterId: args.chapterId,
      difficulty: args.difficulty,
      score: args.score,
      points: args.points,
      description: args.description,
      updatedAt: Date.now(), 
      questions: args.questions
    })

    if(!exerciseId) throw new Error("Erreur lors de la création de l'exercice")

    return exerciseId
  }
})

export const executeExercise = mutation({
    args: {
        exerciseId: v.id("exercices"),
        courseId: v.id("courses"),
        chapterId: v.id("chapters"),
        points: v.optional(v.number()),
        mark: v.optional(v.number()),
        note: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("Unauthorized");
        const hasDoneExercise = await ctx.db.query("useExercices").filter(q => q.eq(q.field("userId"), userId) && q.eq(q.field("exercicesId"), args.exerciseId)).first()
        if (hasDoneExercise) {
            const exerciceDoneId = await ctx.db.patch(hasDoneExercise._id, {
                points: args.points,
                mark: args.mark,
                note: args.note,
                updatedAt: Date.now()
              })
        
              return exerciceDoneId
        }
       
        // Vérifier si le cours, le chapitre et la leçon existent  et l'exercice
      const course = await ctx.db.get(args.courseId)
      if (!course) throw new Error("Cours introuvable")
  
      if (args.chapterId) {
        const chapter = await ctx.db.get(args.chapterId)
        if (!chapter) throw new Error("Chapitre introuvable")
      }

      const exercise = await ctx.db.get(args.exerciseId)
      if (!exercise) throw new Error("Exercice introuvable")

      // Vérifier si l'exercice est dans le cours
      if (exercise.courseId !== args.courseId) throw new Error("Exercice introuvable dans le cours")

      // Vérifier si l'exercice est dans le chapitre
      if (exercise.chapterId !== args.chapterId) throw new Error("Exercice introuvable dans le chapitre")

      // Créer l'exercice
      const exerciceDoneId = await ctx.db.insert("useExercices", {
        userId: userId,
        courseId: args.courseId,
        chapterId: args.chapterId,
        exercicesId: args.exerciseId,
        executedDate: Date.now(),
        points: args.points,
        mark: args.mark,
        note: args.note,
      })

      return exerciceDoneId
    }
})

// export const updateExercise = mutation({
//   args: {
//     exerciseId: v.id("exercices"),
//     ...exerciseSchema
//   },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw new Error("Non autorisé")

//     const { exerciseId, ...data } = args

//     // Vérifier si l'exercice existe
//     const exercise = await ctx.db.get(exerciseId)
//     if (!exercise) throw new Error("Exercice introuvable")

//     // Vérifier si l'utilisateur est autorisé
//     if (exercise.authorId !== userId) throw new Error("Non autorisé")

//     // Mettre à jour l'exercice
//     await ctx.db.patch(exerciseId, {
//       ...data,
//       updatedAt: Date.now()
//     })

//     return exerciseId
//   }
// })

// export const deleteExercise = mutation({
//   args: { exerciseId: v.id("exercices") },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw new Error("Non autorisé")

//     // Vérifier si l'exercice existe
//     const exercise = await ctx.db.get(args.exerciseId)
//     if (!exercise) throw new Error("Exercice introuvable")

//     // Vérifier si l'utilisateur est autorisé
//     if (exercise.authorId !== userId) throw new Error("Non autorisé")

//     // Supprimer l'exercice
//     await ctx.db.delete(args.exerciseId)

//     return args.exerciseId
//   }
// })

// export const publishExercise = mutation({
//   args: { 
//     exerciseId: v.id("exercices"),
//     isPublished: v.boolean()
//   },
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx)
//     if (!userId) throw new Error("Non autorisé")

//     // Vérifier si l'exercice existe
//     const exercise = await ctx.db.get(args.exerciseId)
//     if (!exercise) throw new Error("Exercice introuvable")

//     // Vérifier si l'utilisateur est autorisé
//     if (exercise.authorId !== userId) throw new Error("Non autorisé")

//     // Publier/dépublier l'exercice
//     await ctx.db.patch(args.exerciseId, {
//       isPublished: args.isPublished,
//       updatedAt: Date.now()
//     })

//     return args.exerciseId
//   }
// }) 


// Queries
// export const getExercises = query({
//     args: {
//       courseId: v.optional(v.id("courses")),
//       chapterId: v.optional(v.id("chapters")),
//       lessonId: v.optional(v.id("lessons"))
//     },
//     handler: async (ctx, args) => {
//       const userId = await getAuthUserId(ctx)
//       if (!userId) return null
  
//       let exercisesQuery = ctx.db
//         .query("exercices")
//         .order("desc")
  
//       if (args.courseId) {
//         exercisesQuery = exercisesQuery.filter(q => q.eq(q.field("courseId"), args.courseId))
//       }
//       if (args.chapterId) {
//         exercisesQuery = exercisesQuery.filter(q => q.eq(q.field("chapterId"), args.chapterId))
//       }
//       if (args.lessonId) {
//         exercisesQuery = exercisesQuery.filter(q => q.eq(q.field("lessonId"), args.lessonId))
//       }
  
//       const exercises = await exercisesQuery.collect()
//       return exercises
//     }
//   })
  
//   export const getExercise = query({
//     args: { exerciseId: v.id("exercices") },
//     handler: async (ctx, args) => {
//       const userId = await getAuthUserId(ctx)
//       if (!userId) return null
  
//       const exercise = await ctx.db.get(args.exerciseId)
//       return exercise
//     }
//   })

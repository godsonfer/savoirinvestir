/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";


const populateChaptersLessons = async (
  ctx: QueryCtx,
  chapterId: Id<"chapters">
) => {
  return await ctx.db
    .query("lessons")
    .withIndex("by_chapter_id", (q) => q.eq("chapterId", chapterId))
  
    .collect();
};

const populateExercises  = async (ctx: QueryCtx, courseId: Id<"courses">) => {
  return await ctx.db
    .query("exercices")
    .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
    .collect();
};

const populateDoneExercises  = async (ctx: QueryCtx, courseId: Id<"courses">, userId: Id<"users">) => {
  return await ctx.db
    .query("useExercices")
    .withIndex("by_user_id_course_id", (q) => q.eq("userId", userId).eq("courseId", courseId))
    .collect();
};

const populateProgress = async (ctx: QueryCtx, courseId: Id<"courses">, userId: Id<"users">) => {
  return await ctx.db
    .query("userProgress")
    .withIndex("by_user_id_course_id", (q) => q.eq("userId", userId).eq("courseId", courseId))
    .first();
};
const populateCategory = async (ctx: QueryCtx, categoryId: Id<"categories">) => {
  return await ctx.db.get(categoryId);
};

  // Populate Exercises
  const populateChapterExercises = async (ctx: QueryCtx,chapterId: Id<"chapters">) => {
    return await ctx.db.query("exercices").withIndex("by_chapter_id", (q) => q.eq("chapterId", chapterId)).collect();
  }

   // Populate Exercises Done
   const populateChapterDone = async (ctx: QueryCtx,chapterId: Id<"chapters">, userId: Id<"users">) => {
    return await ctx.db.query("useExercices").withIndex ("by_user_id_chapter_id", (q) => q.eq("userId", userId).eq("chapterId", chapterId)).collect();
  }

const populateChapters = async (ctx: QueryCtx, courseId: Id<"courses">, userId: Id<"users">) => {
  const chapters = await ctx.db
    .query("chapters")
    .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
    .collect();
  const chaptersWithExercisesAndLessons = await Promise.all(
    chapters.map(async (chapter) => {
      const exercises = await populateChapterExercises(ctx, chapter._id);
      const exercisesDone = await populateChapterDone(ctx, chapter._id, userId);
      const lessons = await populateChaptersLessons(ctx, chapter._id);
      const lessonsWithMuxData = await Promise.all(
        lessons.map(async (lesson) => {
          const muxData = await ctx.db
            .query("muxData")
            .withIndex("by_lesson_id", (q) => q.eq("lessonId", lesson._id))
            .first();
          return {
            ...lesson,
            muxData
          };
        })
      );
      
      return {
        ...chapter,
        exercices: exercises,
        lessons: lessonsWithMuxData,
        numberExercisesDone: exercisesDone.length,
        exercicesDone: exercisesDone
      };
    })
  );

  return chaptersWithExercisesAndLessons;
};

const populateCourse = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  courseId: Id<"courses">
) => {
      const course = await ctx.db.get(courseId);
      if (!course) return null;
      const chapters = await populateChapters(ctx, courseId, userId)
       const progress = await populateProgress(ctx, courseId, userId);
       const category = course.categoryId && await ctx.db.get(course.categoryId)
       const certificate = await populateCertificate(ctx, userId, courseId)
      return {
        ...course,
        chapters,
        progress,
        category,
        certificate
      };
    }
    
  const populateCertificate = async (ctx: QueryCtx, userId: Id<"users">, courseId: Id<"courses">) => {
      return await ctx.db.query("certificats").withIndex("by_user_id_course_id", (q) => q.eq("userId", userId).eq("courseId", courseId)).first()
    }

export const createBookmark = mutation({
  args: {
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
    chapterId: v.optional(v.id("chapters")),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { courseId, lessonId, note, chapterId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const isBookmarked = await ctx.db.query("bookmarks").withIndex("by_user_id_course_id", (q) => q.eq("userId", userId).eq("courseId", courseId)).first()
   
    if (isBookmarked) {
      await ctx.db.delete(isBookmarked._id);
       throw new Error("Vous n'avez pas acheté ce cours")
    }
    const isPurchased = 
    await ctx.db.query("purchases").withIndex("by_user_id_course_id", (q) => q.eq("userId", userId).eq("courseId", courseId)).first()
    if (isPurchased) throw new Error("Vous n'avez pas acheté ce cours")
   
    const newCourse = await ctx.db.insert("bookmarks", {
      courseId: courseId,
      creation: Date.now(),
      chapterId,
      lessonId,
      userId,
      note,
    });

    return newCourse;
  },
});


export const getBookmarkPurchase = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autorisé");

    // Récupération des favoris
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    // Récupération des achats
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    // Traitement des favoris pour inclure les détails des cours
    const bookmarksWithCourses = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const course = await populateCourse(ctx, userId, bookmark.courseId);
        const exercises = await populateDoneExercises(ctx, bookmark.courseId, userId);
        const existExercises = await populateExercises(ctx, bookmark.courseId);
        const category = course?.categoryId && await populateCategory(ctx, course.categoryId);
        if (!course) return null;
        return {
          type: 'bookmark',
          date: bookmark.creation,
          ...bookmark,
          course,
          exercises,
          existExercises,
          category
        };
      })
    );

    // Traitement des achats pour inclure les détails des cours
    const purchasesWithCourses = await Promise.all(
      purchases.map(async (purchase) => {

        const course = await populateCourse(ctx, userId, purchase.courseId);
        const exercises = await populateDoneExercises(ctx, purchase.courseId, userId);
        const existExercises = await populateExercises(ctx, purchase.courseId);
        const category = course?.categoryId && await populateCategory(ctx, course.categoryId);
        if (!course) return null;
        return {
          type: 'purchase',
          date: purchase.purchaseDate,
          ...purchase,
          course,
          exercises,
          existExercises,
          exercisesDoneCount: exercises.length,
          existExercisesCount: existExercises.length,
          category
        };
      })
    );

    // Filtrer les éléments nuls et combiner les deux listes
    const filteredBookmarks = bookmarksWithCourses.filter((item): item is NonNullable<typeof item> => item !== null);
    const filteredPurchases = purchasesWithCourses.filter((item): item is NonNullable<typeof item> => item !== null);
    
    // Combiner et trier par date décroissante
    const combinedItems = [...filteredBookmarks, ...filteredPurchases]
      .sort((a, b) => b.date - a.date);

    // Appliquer la pagination manuellement
    const currentPage = paginationOpts.cursor ? Number(paginationOpts.cursor) : 0;
    const startIndex = paginationOpts.numItems * currentPage;
    const items = combinedItems.slice(startIndex, startIndex + paginationOpts.numItems);
    
    return {
      page: items,
      continueCursor: startIndex + paginationOpts.numItems < combinedItems.length 
        ? String(currentPage + 1)
        : null,
      isDone: startIndex + paginationOpts.numItems >= combinedItems.length
    };
  },
});

export const deleteBookmark = mutation({
  args: {
    bookmarkId: v.id("bookmarks"),
  },
  handler: async (ctx, { bookmarkId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autorisé");

    const bookmark = await ctx.db.get(bookmarkId);
    if (!bookmark) throw new Error("Favori non trouvé");
    if (bookmark.userId !== userId) throw new Error("Non autorisé à supprimer ce favori");

    await ctx.db.delete(bookmarkId);
    return { success: true };
  },
});




/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";


const populateChapters = async (ctx: QueryCtx, courseId: Id<"courses">) => {
  const chapters = await ctx.db
    .query("chapters")
    .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
    .collect();
  
  const chaptersWithLessons = await Promise.all(
    chapters.map(async (chapter) => {
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
        lessons: lessonsWithMuxData,
      };
    })
  );

  return chaptersWithLessons;
};

const populateChaptersLessons = async (
  ctx: QueryCtx,
  chapterId: Id<"chapters">
) => {
  return await ctx.db
    .query("lessons")
    .withIndex("by_chapter_id", (q) => q.eq("chapterId", chapterId))
  
    .collect();
};

const populatePurchass = async (ctx: QueryCtx, courseId: Id<"courses">) => {
  return await ctx.db
    .query("purchases")
    .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
    .collect();
};

const populateCategory = async (
  ctx: QueryCtx,
  categoryId: Id<"categories">
) => {
  return await ctx.db.get(categoryId);
};

const populateBookmarks = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  courseId: Id<"courses">
) => {
  const bookmarks = await ctx.db
    .query("bookmarks")
    .withIndex("by_user_id_course_id", (q) =>
      q.eq("userId", userId).eq("courseId", courseId)
    )
    .collect();
  return bookmarks;
};
const populateRating = async (ctx: QueryCtx, courseId: Id<"courses">) => {
  const ratings = await ctx.db
    .query("ratings")
    .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
    .collect();
  const _raters = [];
  for (const rating of ratings) {
    const user = await ctx.db.get(rating.userId);
    _raters.push({
      name: user?.name,
      createdAt: user?._creationTime,
    });
  }
  return {
    users: _raters,
    rates: ratings.map((rating) => ({
      rate: rating.rating,
      createdAt: rating._creationTime,
      comment: rating.comment,
    })),
  };
};

export const createCourse = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");
    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    const course = await ctx.db.insert("courses", {
      title,
      userId,
      slug: slugify(title),
    });

    return course;
  },
});

export const courseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);

    const course = await ctx.db.get(courseId);
    if (!course) return null;

    // Vérifier si l'utilisateur peut accéder au cours
    const isAuthor = course.userId === userId;
    const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";
    
    if (!course.isPublished && !isAuthor && !isAdminOrTeacher) {
      return null;
    }

    const [chapters, purchases, rating, bookmark] = await Promise.all([
      populateChapters(ctx, courseId),
      populatePurchass(ctx, courseId),
      populateRating(ctx, courseId),
      populateBookmarks(ctx, userId, courseId)
    ]);

    // Filtrer les chapitres et leçons si nécessaire
    const filteredChapters = isAuthor || isAdminOrTeacher
      ? chapters
      : chapters.map(chapter => ({
          ...chapter,
          lessons: chapter.lessons.filter(lesson => lesson.isPublished)
        })).filter(chapter => chapter.lessons.length > 0);

    const category = course.categoryId
      ? await populateCategory(ctx, course.categoryId)
      : null;

    // Calcul des statistiques
    const studentsCount = purchases.length;
    const averageRating = rating.rates.length > 0
      ? rating.rates.reduce((acc, curr) => acc + curr.rate, 0) / rating.rates.length
      : 0;
    const reviewsCount = rating.rates.length;

    // Construction de l'objet de retour
    return {
      course: {
        ...course,
        title: course.title,
        description: course.description,
        cover: course.cover,
        price: course.price || 0,
        duration: course.duration || 0,
        studentsCount,
        rating: averageRating.toFixed(1),
        reviewsCount,
        category: category?.title,
        isBookmarked: bookmark.length > 0,
        chaptersCount: filteredChapters.length,
      },
      chapters: filteredChapters,
      purchases,
      category,
      rating,
      isBookmarked: bookmark.length > 0
    };
  },
});

export const updateTitle = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
  },
  handler: async (ctx, { courseId, title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { title });

    return course;
  },
});

export const updateDescription = mutation({
  args: {
    courseId: v.id("courses"),
    description: v.string(),
  },
  handler: async (ctx, { courseId, description }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { description });

    return course;
  },
});

export const updateSkills = mutation({
  args: {
    courseId: v.id("courses"),
    skills: v.array(v.string()),
  },
  handler: async (ctx, { courseId, skills }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { skills });

    return course;
  },
});

export const updateLevel = mutation({
  args: {
    courseId: v.id("courses"),
    level: v.optional(v.string()  ),
  },
  handler: async (ctx, { courseId, level }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { level });

    return course;
  },
});
export const updatePrice = mutation({
  args: {
    courseId: v.id("courses"),
    price: v.number(),
  },
  handler: async (ctx, { courseId, price }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { price });

    return course;
  },
});

export const updateCategory = mutation({
  args: {
    courseId: v.id("courses"),
    categoryId: v.id("categories"),
  },
  handler: async (ctx, { courseId, categoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const category = await ctx.db.get(categoryId);
    if (!category) throw new Error("Auncune catégorie enregistrée");
    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { categoryId });

    return course;
  },
});

export const updateImage = mutation({
  args: {
    courseId: v.id("courses"),
    imageUrl: v.array(v.string()),
  },
  handler: async (ctx, { courseId, imageUrl }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { imageUrl });

    return course;
  },
});

export const updateDuration = mutation({
  args: {
    courseId: v.id("courses"),
    duration: v.number(),
  },
  handler: async (ctx, { courseId, duration }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { duration });

    return course;
  },
});

export const updateCover = mutation({
  args: {
    courseId: v.id("courses"),
    cover: v.string(),
  },
  handler: async (ctx, { courseId, cover }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { cover });

    return course;
  },
});

export const publishCourse = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(courseId, { isPublished: true });

    return course;
  },
});

export const deleteCourse = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    const courseExist = await ctx.db.get(courseId);
    if (
      (courseExist && courseExist.userId !== userId) ||
      user?.role === "admin"
    )
      throw new Error("Unauthorized");
    // supprimer les chapitres et lecons du cours

    const [chapters, lessons] = await Promise.all([
      ctx.db
        .query("chapters")
        .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
        .collect(),

      ctx.db
        .query("lessons")
        .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
        .collect(),
    ]);
    for (const chapter of chapters) {
      await ctx.db.delete(chapter._id);
    }
    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }

    const course = await ctx.db.delete(courseId);

    return course;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Non autorisé");
    const user = await ctx.db.get(userId);

    let coursesQuery = ctx.db.query("courses");

    // Si l'utilisateur n'est pas admin ou professeur, filtrer uniquement les cours publiés
    if (user?.role !== "admin" && user?.role !== "teacher") {
      coursesQuery = coursesQuery.filter(q => q.eq(q.field("isPublished"), true));
    }

    const courses = await coursesQuery.order("desc").paginate(paginationOpts);

    return {
      ...courses,
      page: (
        await Promise.all(
          (await courses).page.map(async (course) => {
            // Vérifier si l'utilisateur est l'auteur du cours
            const isAuthor = course.userId === userId;
            const isAdminOrTeacher = user?.role === "admin" || user?.role === "teacher";

            const chapters = await populateChapters(ctx, course._id);
            if (!chapters) return null;

            // Filtrer les chapitres et leçons si l'utilisateur n'est pas l'auteur
            const filteredChapters = isAuthor || isAdminOrTeacher
              ? chapters
              : chapters.map(chapter => ({
                  ...chapter,
                  lessons: chapter.lessons.filter(lesson => lesson.isPublished)
                })).filter(chapter => chapter.lessons.length > 0);

            const purchases = await populatePurchass(ctx, course._id);
            if (!purchases) return null;
            
            const category = course.categoryId
              ? await populateCategory(ctx, course.categoryId)
              : null;
            const rating = await populateRating(ctx, course._id);
            const bookmark = await populateBookmarks(ctx, userId, course._id);
            const isBookmarked = bookmark.length ? true : false;
            const canDelete = isAdminOrTeacher ? true : false;

            return {
              ...course,
              canDelete,
              chapters: filteredChapters,
              bookmark: isBookmarked,
              enrollments: purchases,
              category,
              rating,
            };
          })
        )
      ).filter((course) => course !== null),
    };
  },
});


export const getHomeCourses = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {


    const courses = await  ctx.db.query("courses").filter((q) => q.eq(q.field("isPublished"), true)).order("desc").paginate(paginationOpts);

    return {
      ...courses,
      page: (
        await Promise.all(
          (await courses).page.map(async (course) => {
            // Vérifier si l'utilisateur est l'auteur du cours
        

            const chapters = await populateChapters(ctx, course._id);
            if (!chapters) return null;

            // Filtrer les chapitres et leçons si l'utilisateur n'est pas l'auteur
            const filteredChapters =  chapters.map(chapter => ({
                  ...chapter,
                  lessons: chapter.lessons.filter(lesson => lesson.isPublished)
                })).filter(chapter => chapter.lessons.length > 0);

            const purchases = await populatePurchass(ctx, course._id);
            if (!purchases) return null;
            
            const category = course.categoryId
              ? await populateCategory(ctx, course.categoryId)
              : null;
            const rating = await populateRating(ctx, course._id);
         
            return {
              ...course,
              chapters: filteredChapters,
              enrollments: purchases,
              category,
              rating,
            };
          })
        )
      ).filter((course) => course !== null),
    };
  },
});


export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const { query } = args;
        
        const courses = await ctx.db
            .query("courses")
            .filter((q) => q.eq(q.field("title"), query) || q.eq(q.field("description"), query))
            .order("desc")
            .collect();

        // Enrichir les résultats avec les informations supplémentaires
        const enrichedCourses = await Promise.all(
            courses.map(async (course) => {
                const [chapters, purchases, rating] = await Promise.all([
                    populateChapters(ctx, course._id),
                    populatePurchass(ctx, course._id),
                    populateRating(ctx, course._id),
                ]);

                const category = course.categoryId
                    ? await populateCategory(ctx, course.categoryId)
                    : null;

                const studentsCount = purchases.length;
                const averageRating = rating.rates.length > 0
                    ? rating.rates.reduce((acc, curr) => acc + curr.rate, 0) / rating.rates.length
                    : 0;

                return {
                    ...course,
                    category: category?.title,
                    studentsCount,
                    rating: averageRating.toFixed(1),
                    chaptersCount: chapters.length,
                };
            })
        );

        return enrichedCourses;
    },
});

function slugify(title: string): string {
  return title.toLowerCase().replace(/ /g, '-');
}


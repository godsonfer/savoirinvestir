import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
    });

    return course;
  },
});

export const courseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const course = await ctx.db.get(courseId);
    if (!course) return null;

    return course;
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

    const courseExist = await ctx.db.get(courseId);

    if (!courseExist || courseExist.userId !== userId)
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

export const courses = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const courses = await ctx.db.query("courses").collect();

    return courses;
  },
});

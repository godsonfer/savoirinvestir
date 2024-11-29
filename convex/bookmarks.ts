import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const categoryById = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const category = await ctx.db.get(categoryId);
    if (!category) throw new Error("Category not found");

    return category;
  },
});

export const categories = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

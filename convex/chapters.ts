import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createChapter = mutation({
  args: {
    title: v.string(),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { title, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");

    const chapter = await ctx.db.insert("chapters", {
      title,
      courseId,
    });

    return chapter;
  },
});

export const chapters = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
      .collect();
    const orderPosition = chapters.sort(
      (a, b) => (a?.position ?? 0) - (b?.position ?? 0),
    );
    return orderPosition;
  },
});

export const chapterById = query({
  args: { chapterId: v.id("chapters"), courseId: v.id("courses") },
  handler: async (ctx, { chapterId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const chapter = await ctx.db.get(chapterId);
    if (!chapter) throw new Error("Chapter not found");
    if (chapter.courseId !== courseId) throw new Error("Chapter not found");
    return chapter;
  },
});

export const reoaderChapter = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    position: v.number(),
  },
  handler: async (ctx, { chapterId, courseId, position }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const chapter = await ctx.db.get(chapterId);
    if (!chapter) throw new Error("Chapter not found");
    if (chapter.courseId !== courseId) throw new Error("Chapter not found");
    const orderedChapter = await ctx.db.patch(chapterId, { position });
    return orderedChapter;
  },
});

export const removeChapter = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { chapterId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const chapter = await ctx.db.get(chapterId);
    if (!chapter) throw new Error("Chapter not found");
    if (chapter.courseId !== courseId) throw new Error("Chapter not found");

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter_id_course_id", (q) =>
        q.eq("chapterId", chapterId).eq("courseId", courseId),
      )
      .collect();

    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }
    const removedChapter = await ctx.db.delete(chapterId);
    return removedChapter;
  },
});

export const updateChapterTitle = mutation({
  args: {
    chapterId: v.id("chapters"),
    title: v.string(),
  },
  handler: async (ctx, { chapterId, title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const chapter = await ctx.db.get(chapterId);
    if (!chapter) throw new Error("Chapter not found");
    const orderedChapter = await ctx.db.patch(chapterId, { title });
    return orderedChapter;
  },
});

export const publishChapter = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { chapterId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);
    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const chapterExist = await ctx.db.get(chapterId);
    if (!chapterExist || chapterExist._id !== chapterId)
      throw new Error("Unauthorized");

    const course = await ctx.db.patch(chapterId, { isPublished: true });

    return course;
  },
});

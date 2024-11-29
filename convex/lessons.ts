/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createLesson = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    title: v.string(),
  },
  handler: async (ctx, { chapterId, courseId, title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    // lessonn creation
    const lesson = await ctx.db.insert("lessons", {
      title: title,
      courseId,
      chapterId,
    });

    return lesson;
  },
});

export const lessons = query({
  args: {
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { chapterId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter_id", (q) => q.eq("chapterId", chapterId))
      .collect();

    const orderPosition = lessons.sort(
      (a, b) => (a?.position ?? 0) - (b?.position ?? 0)
    );
    return orderPosition;
  },
});

export const lessonById = query({
  args: {
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { lessonId, courseId, chapterId }) => {
    if (!lessonId) {
      return null;
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const lesson = await ctx.db.get(lessonId);
    if (!lesson) throw new Error("Lesson not found");

    return lesson;
  },
});

export const reoaderLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    position: v.number(),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { lessonId, position, chapterId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    const courseOwner = await ctx.db.get(courseId);
    if (courseOwner?.userId !== userId) throw new Error("Unauthorized");

    const isOwner = await ctx.db
      .query("lessons")
      .withIndex("by_chapter_id_course_id", (q) =>
        q.eq("chapterId", chapterId).eq("courseId", courseId)
      )
      .collect();

    if (!isOwner) throw new Error("Unauthorized");

    const lesson = await ctx.db.get(lessonId);
    if (!lesson) throw new Error("Lesson not found");
    const orderedLesson = await ctx.db.patch(lessonId, { position });
    return orderedLesson;
  },
});

export const removeLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { lessonId, courseId, chapterId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    const courseOwner = await ctx.db.get(courseId);
    if (courseOwner?.userId !== userId) throw new Error("Unauthorized");

    const isOwner = await ctx.db
      .query("lessons")
      .withIndex("by_chapter_id_course_id", (q) =>
        q.eq("chapterId", chapterId).eq("courseId", courseId)
      )
      .collect();

    if (!isOwner) throw new Error("Unauthorized");

    const lesson = await ctx.db.get(lessonId);
    if (!lesson) throw new Error("Lesson not found");

    const removedLesson = await ctx.db.delete(lessonId);
    return removedLesson;
  },
});

export const updateLessonTitle = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    title: v.string(),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { chapterId, courseId, title, lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    // lessonn creation
    const lesson = await ctx.db.patch(lessonId, {
      title: title,
    });

    return lesson;
  },
});

export const updateLessonDescription = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    description: v.optional(v.string()),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { chapterId, courseId, description, lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    // lessonn creation
    const lesson = await ctx.db.patch(lessonId, {
      description: description,
    });

    return lesson;
  },
});
// TODO  Instaurer une sécurité sur les updates
export const updateLessonAssets = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    description: v.optional(v.string()),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { chapterId, courseId, description, lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    // lessonn creation
    const lesson = await ctx.db.patch(lessonId, {
      description: description,
    });

    return lesson;
  },
});
export const updateAccess = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
    access: v.boolean(),
  },
  handler: async (ctx, { chapterId, courseId, lessonId, access }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    // lessonn creation
    const lesson = await ctx.db.patch(lessonId, {
      isFree: access,
    });

    return lesson;
  },
});

export const muxtData = query({
  args: {
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
  },
  handler: async (ctx, { lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    const muxtData = await ctx.db
      .query("muxData")
      .withIndex("by_lesson_id", (q) => q.eq("lessonId", lessonId))
      .unique();

    return muxtData;
  },
});

export const updateLessonVideo = mutation({
  args: {
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    chapterId: v.id("chapters"),
    assetId: v.string(),
    playback: v.optional(v.string()),
    duration: v.optional(v.number()),
    videoUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { lessonId, courseId, chapterId, assetId, playback, duration, videoUrl }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");
    const course = await ctx.db.get(courseId);

    if (course?._id !== courseId || course?.userId !== userId)
      throw new Error("Unauthorized");
    const chapter = await ctx.db.get(chapterId);

    if (chapter?._id !== chapterId) throw new Error("Unauthorized");

    const lesson = await ctx.db.get(lessonId);
    if (lesson && lesson?.chapterId !== chapterId)
      throw new Error("Unauthorized");
    await ctx.db.patch(lessonId, { duration: duration, videoUrl: videoUrl });
    const muxtData = await ctx.db
      .query("muxData")
      .withIndex("by_lesson_id", (q) => q.eq("lessonId", lessonId))
      .unique();
    if (!muxtData) {
      await ctx.db.insert("muxData", {
        lessonId,
        courseId,
        chapterId,
        assetId: assetId,
        playback: playback,
      });
      return lessonId;
    } else {
      await ctx.db.patch(muxtData._id, {
        assetId: assetId,
        playback: playback,
      });
      return lessonId;
    }
  },
});

export const publishLesson = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { chapterId, courseId, lessonId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const courseExist = await ctx.db.get(courseId);
    if (!courseExist || courseExist.userId !== userId)
      throw new Error("Unauthorized");

    const chapterExist = await ctx.db.get(chapterId);
    if (!chapterExist || chapterExist._id !== chapterId)
      throw new Error("Unauthorized");
    const lessonExist = await ctx.db.get(lessonId);
    if (lessonExist?._id === lessonId && lessonExist.courseId !== courseId)
      throw new Error("Unauthorized");

    const lesson = await ctx.db.patch(lessonId, { isPublished: true });

    return lesson;
  },
});

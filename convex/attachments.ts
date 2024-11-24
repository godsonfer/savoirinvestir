import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createAttachements = mutation({
  args: {
    url: v.string(),
    name: v.optional(v.string()),
    chapterId: v.optional(v.id("chapters")),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { url, name, chapterId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized");

    if (!["teacher", "admin"].includes(user.role))
      throw new Error("Unauthorized");

    const attachment = await ctx.db.insert("attachments", {
      name,
      chapterId,
      url,
      courseId,
    });

    return attachment;
  },
});

export const attachments = query({
  // todo  : Recuperer en fonction du type d'id si chapitre ou cours
  args: { courseId: v.id("courses"), chapterId: v.optional(v.id("chapters")) },
  handler: async (ctx, { courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_course_id", (q) => q.eq("courseId", courseId))
      .collect();

    return attachments;
  },
});

// TODO : Recuperer en fonction du type d'id
export const attachmmentById = query({
  args: { attachmentId: v.id("attachments"), courseId: v.id("courses") },
  handler: async (ctx, { attachmentId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const attachment = await ctx.db.get(attachmentId);
    if (!attachment) throw new Error("Fichier introuvable");
    if (attachment.courseId !== courseId)
      throw new Error("Fichier introuvable");
    return attachment;
  },
});

export const removeAttachment = mutation({
  args: {
    attachmentId: v.id("attachments"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { attachmentId, courseId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const attachment = await ctx.db.get(attachmentId);
    if (!attachment) throw new Error("Attachment not found");
    if (attachment.courseId !== courseId)
      throw new Error("Attachment not found");
    const rmAttachement = await ctx.db.delete(attachmentId);
    return rmAttachement;
  },
});

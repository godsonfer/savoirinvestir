import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) =>
  await ctx.db.get(userId);

/**
 * Check if the user is a member of a workspace.
 *
 * @throws {Error} if the user is not logged in
 * @returns {Promise<import("../../_generated/dataModel").Member | null>} the member document or null if no such member
 */
export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member) return null;
    return member;
  },
});

// get all members
export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member) return [];
    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();
    const members = [];
    for (const member of data) {
      const user = await populateUser(ctx, member.userId);
      if (user) {
        members.push({ ...member, user });
      }
    }
    return members;
  },
});
// get member by id
export const getById = query({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db.get(args.id);

    if (!member) return null;
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!currentMember) return null;

    const user = await populateUser(ctx, member.userId);
    if (!user) return null;
    return { ...member, user };
  },
});

//update et member

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("assistant"),
      v.literal("student"),
      v.literal("member"),
      v.literal("moderator"),
      v.literal("content_manager"),
      v.literal("communication_manager"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);
    if (!member || member.role === "admin") throw new Error("Unauthorized");
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!currentMember || currentMember.role !== "admin")
      throw new Error("Unauthorized");
    await ctx.db.patch(args.id, { role: args.role });
    return args.id;
  },
});

// remove
// todo:: la suppression doit être vérifier et laisser de trace
export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);

    if (!member) throw new Error("Unauthorized");
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!currentMember) throw new Error("Unauthorized");
    if (member.role === "admin") throw new Error("Admin cannot be removed");
    if (currentMember._id === args.id && currentMember.role === "admin")
      throw new Error("Can not remove self as admin");
    const [messages, reactions, conversations] = await Promise.all([
      // messages
      await ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      // reactions
      await ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      // conversations
      await ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id),
          ),
        )
        .collect(),
    ]);
    // remove attached messages, reactions, and conversations to the user
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    for (const conver of conversations) {
      await ctx.db.delete(conver._id);
    }
    ctx.db.delete(args.id);
    return args.id;
  },
});

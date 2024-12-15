import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get all channels for a given workspace, if the user is a member of it.
 *
 * @throws {Error} if the user is not logged in
 * @returns {Promise<import("../../_generated/dataModel").Channel[]>} channels
 */
export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member) {
      return [];
    }
    const channels = ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId),
      )
      .collect();
    return channels;
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.string(),
    type: v.optional(
      v.union(
        v.literal("audio"),
        v.literal("live"),
        v.literal("default"),
        v.literal("poll"),
        v.literal("post"),
        v.literal("board"),
        v.literal("course"),
      ),
    ),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.get(userId);
    if (!user || user?.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const parseName = args.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .toLocaleLowerCase();

    // const parseName = args.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const channelId = await ctx.db.insert("channels", {
      name: parseName,
      workspaceId: args.workspaceId,
      description: args.description,
      type: args.type,
      visibility: args.visibility,
      isNew: true,
      isPinned: false,
      isArchived: false,
      author: userId,
    });
    return channelId;
  },
});
// update channel
export const edit = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.string(),
    description: v.string(),
    type: v.optional(
      v.union(
        v.literal("audio"),
        v.literal("live"),
        v.literal("default"),
        v.literal("poll"),
        v.literal("post"),
        v.literal("board"),
        v.literal("course"),
      ),
    ),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const c = await ctx.db.get(args.channelId);
    if (!c) throw new Error("Channel not found");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", c.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const channel = await ctx.db.patch(args.channelId, {
      name: args.name,
      description: args.description,
    });
    return channel;
  },
});

//remove a channel

export const remove = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const c = await ctx.db.get(args.channelId);
    if (!c) throw new Error("Channel not found");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", c.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.channelId))
        .collect(),
    ]);
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    const channel = await ctx.db.delete(args.channelId);
    return channel;
  },
});
// get only channel using its ID

export const getById = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const channel = await ctx.db.get(args.channelId);
    if (!channel) {
      return null;
    }
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId),
      )
      .unique();
    if (!member) {
      return null;
    }
    return channel;
  },
});

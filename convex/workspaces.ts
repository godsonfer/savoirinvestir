import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghlijmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  return code;
};

/**
 * Crée un espace de travail
 * @param ctx - contexte de la requête
 * @param args - arguments de la requête
 * @returns - l'ID de l'espace de travail créé
 */
export const create = mutation({
  args: {
    name: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user?.role !== "admin") throw new Error("Unauthorized");
    const joinCode = generateCode();
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    // creation du premier membre
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });
    // insertion d'un nouveau salon
    await ctx.db.insert("channels", {
      name: "General",
      description: "Discussion générale",
      author: userId,
      visibility: "public",
      isNew: true,
      workspaceId,
    });
    /* 
      @Récupération du workspace créé pour renvoyer son id
     */
    // const workspace = await ctx.db.get(workspaceId);
    // return workspace;
    // // const workspace=  ctx.db.get( workspaceId);
    return workspaceId;
  },
});

/**
 * Collecte de tous les espaces de travail de l'utilisateur connecté
 *
 * @throws {Error} si l'utilisateur n'est pas connecté
 * @returns {Promise<import("../../_generated/dataModel").Workspace[]>} tableau des espaces de travail
 */

export const get = query({
  args: {},

  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }
    return workspaces;
  },
});

/**
 * Retourne un espace de travail par son ID
 *
 * @throws {Error} si l'utilisateur n'est pas connecté
 * @returns {Promise<import("../../_generated/dataModel").Workspace | null>} l'espace de travail ou null si non trouvé
 */
export const getById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) return null;

    return await ctx.db.get(args.id);
  },
});

// get workspace for non authorized user
export const getInfoById = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) return null;

    const workspace = await ctx.db.get(args.workspaceId);
    return { name: workspace?.name, isMember: !!member };
  },
});

/**
 * Mise à jour d'un espace de travail
 *
 * @throws {Error} si l'utilisateur n'est pas connecté
 * @throws {Error} si l'utilisateur n'est pas administrateur de l'espace de travail
 * @returns {Promise<string>} l'ID de l'espace de travail mis à jour
 */
export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (member === null || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    await ctx.db.patch(args.id, {
      name: args.name,
    });
    return args.id;
  },
});

/**
 * Supprime un espace de travail.
 *
 * @throws {Error} si l'utilisateur n'est pas connecté
 * @throws {Error} si l'utilisateur n'est pas administrateur de l'espace de travail
 * @returns {Promise<string>} l'ID de l'espace de travail supprimé
 */
export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (member === null || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    // supprimer les membres
    const [members, channels, conversations, messages, reactions] =
      await Promise.all([
        ctx.db
          .query("members")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
          .collect(),
        ctx.db
          .query("channels")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
          .collect(),
        ctx.db
          .query("conversations")
          .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.id))
          .collect(),
        ctx.db
          .query("messages")
          .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.id))
          .collect(),
        ctx.db
          .query("reactions")
          .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.id))
          .collect(),
      ]);
    // todo:: les suppressions ne doivent pas quitter la base de données
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// new join
/**
 * Defines a mutation function 'newJoin' that allows a user to join a workspace.
 * Throws an error if the user is unauthorized or not a member of the workspace.
 * Generates a unique join code for the user and updates the workspace with the code.
 * @returns The workspaceId of the joined workspace.
 */
export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }
    const joinCode = generateCode();
    await ctx.db.patch(args.workspaceId, {
      joinCode,
    });
    return args.workspaceId;
  },
});

export const join = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("Unauthorized");
    if (workspace.joinCode !== args.joinCode.toLowerCase())
      throw new Error("Code invalide ou expiré");

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      throw new Error("Membre actif déjà");
    }
    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace._id,
      role: "member",
      isNew: true,
    });
    return workspace._id;
  },
});

import { Doc, Id } from "./_generated/dataModel.d";
import { QueryCtx } from "./_generated/server.d";
import { v } from "convex/values";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
  return await ctx.db.get(memberId);
};

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">,
) => {
  return await ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
};
const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  return await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId),
    )
    .collect();

  if (messages.length === 0) {
    return { count: 0, image: undefined, timestamp: 0, name: "" };
  }
  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return { count: 0, image: undefined, timestamp: 0, name: "" };
  }
  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
  if (!lastMessageMember)
    if (!lastMessageMember) {
      return { count: 0, image: undefined, timestamp: 0, name: "" };
    }
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

export const create = mutation({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    body: v.string(),
    file: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) throw new Error("Unauthorized");

    let _conversationId = args.conversationId;

    // quand on repond dans une conversation 1:1
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      conversationId: _conversationId,
      body: args.body,
      file: args.file,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
    });
    return messageId;
  },
});

// update a message
export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
    // file: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);

    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || member._id !== message.memberId)
      throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      body: args.body,
      // file: args.file,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// get messages
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    let _conversationId = args.conversationId;

    // quand on repond dans une conversation 1:1
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error("Parent message not found");
      _conversationId = parentMessage.conversationId;
    }
    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId),
      )
      .order("desc")
      .paginate(args.paginationOpts);
    return {
      ...results,
      page: (
        await Promise.all(
          (await results).page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) return null;

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const file = message.file
              ? await ctx.storage.getUrl(message.file)
              : undefined;
            // count reactions

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });
            // combinaison des reactions de meme nature
            const dedupeReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value,
                );
                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId]),
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[],
            );
            // suppression de l'id du membre
            const reactionWithoutMemberIdProperty = dedupeReactions.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ memberId, ...rest }) => rest,
            );
            return {
              ...message,
              file,
              member,
              user,
              reactions: reactionWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
            };
          }),
        )
      ).filter((message) => message !== null),
    };
  },
});

// update a message
export const deleteMessage = mutation({
  args: {
    id: v.id("messages"),
    // TODO :: Ne pas supprimer mais archiver
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.id);

    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member || member._id !== message.memberId)
      throw new Error("Unauthorized");

    // await ctx.db.patch(args.id, {
    //   body: args.body,
    //   // file: args.file,
    //   updatedAt: Date.now(),
    // });
    await ctx.db.delete(args.id);

    return args.id;
  },
});

// get a message by it Id
export const getById = query({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.messageId);

    if (!message) return null;
    const currentMember = await getMember(ctx, message.workspaceId, userId);
    if (!currentMember) return null;

    const member = await populateMember(ctx, message.memberId);
    if (!member) return null;

    const user = await populateUser(ctx, userId);
    if (!user) return null;

    const reactions = await populateReactions(ctx, message._id);
    if (!reactions) return null;

    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      };
    });
    const dedupeReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value);
        if (existingReaction) {
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId]),
          );
        } else {
          acc.push({ ...reaction, memberIds: [reaction.memberId] });
        }
        return acc;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[],
    );
    const reactionWithoutMemberIdProperty = dedupeReactions.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ memberId, ...rest }) => rest,
    );
    return {
      ...message,
      file: message.file ? await ctx.storage.getUrl(message.file) : undefined,
      user,
      member,
      reactions: reactionWithoutMemberIdProperty,
    };
  },
});

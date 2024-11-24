import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createCategory = mutation({
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
    const course = await ctx.db.insert("categories", {
      title,
      userId,
    });

    return course;
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

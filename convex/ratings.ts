/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createCourseRating = mutation({
  args: {
    comment : v.string(),
    rating :  v.number(),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { comment, rating, courseId }) => {
    // Rechercher une entrée existante
    const userId =  await getAuthUserId(ctx);
    if(!userId) throw new Error("Unauthorized");
    const course =  await ctx.db.get(courseId);
    if(!course) throw new Error("Unauthorized");
    const newReview =  await ctx.db.insert("ratings", {
      comment,
      rating,
      courseId,
      userId,
    })
    return newReview
    }
}); 

export const removeRating = mutation({
  args: {
    ratingId: v.id("ratings"),
  },
  handler: async (ctx, { ratingId }) => {
    const userId =  await getAuthUserId(ctx);
    if(!userId) throw new Error("Unauthorized");
    const user =  await ctx.db.get(userId);
    if(!user) throw new Error("Unauthorized");
    const rating =  await ctx.db.get(ratingId);
    if(!rating) throw new Error("Unauthorized");
    if(rating.userId !== userId && user.role !== "admin") throw new Error("Unauthorized");
    await ctx.db.delete(ratingId);
    return ratingId
    }
});
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const purchaseCourse = mutation({
    args: {
        courseId: v.id("courses"),
    },
    handler: async (ctx, { courseId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        const course = await ctx.db.get(courseId);
        if (!course) throw new Error("Course not found");
        const isPurchased = 
        await ctx.db.query('purchases').withIndex ("by_user_id_course_id",  (q) => q.eq("userId", userId).eq("courseId", courseId)).first();

        if (isPurchased) throw new Error("Vous avez déjà acheté ce cours");
        
        const newPurchase = await ctx.db.insert('purchases', {
            userId,
            courseId,
            purchaseDate: Date.now(),
            status: "pending",
        });
        return newPurchase;
    }
})

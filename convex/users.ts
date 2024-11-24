import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// collect a user's data from the database
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

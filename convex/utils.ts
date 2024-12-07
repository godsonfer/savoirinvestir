import { QueryCtx, MutationCtx } from "./_generated/server"

export const getAuthUserId = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  return identity.subject
} 

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get latest 10 activity logs
export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("activityLog")
      .withIndex("by_createdAt")
      .order("desc")
      .take(10);
  },
});

// Internal helper — called from other mutations
export const add = mutation({
  args: {
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("activityLog", {
      message: args.message,
      type: args.type,
      createdAt: Date.now(),
    });
  },
});

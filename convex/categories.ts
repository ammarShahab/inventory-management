import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all categories
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

// Create a category
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Prevent duplicate category names
    const existing = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) throw new Error("Category already exists");

    return await ctx.db.insert("categories", {
      name: args.name,
      createdAt: Date.now(),
    });
  },
});

// Delete a category
export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

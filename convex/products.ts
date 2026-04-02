import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all products
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();

    // Attach category name to each product
    return await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return { ...product, categoryName: category?.name ?? "Unknown" };
      }),
    );
  },
});

// Create a product
export const create = mutation({
  args: {
    name: v.string(),
    categoryId: v.id("categories"),
    price: v.number(),
    stock: v.number(),
    minStockThreshold: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Auto-set status based on stock
    const status = args.stock === 0 ? "out_of_stock" : args.status;

    return await ctx.db.insert("products", {
      ...args,
      status,
      createdAt: Date.now(),
    });
  },
});

// Delete a product
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

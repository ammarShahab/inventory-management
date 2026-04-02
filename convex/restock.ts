import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper: calculate priority based on stock vs threshold
type Priority = "high" | "medium" | "low";
function getPriority(stock: number, threshold: number): Priority {
  if (threshold <= 0) return "high"; // Treat as critical if threshold is invalid
  const ratio = stock / threshold;
  if (ratio <= 0.25) return "high";
  if (ratio <= 0.6) return "medium";
  return "low";
}

// Get all restock queue items — ordered by stock ascending (lowest first)
export const getQueue = query({
  args: {},
  handler: async (ctx) => {
    const queue = await ctx.db.query("restockQueue").collect();
    return queue.sort((a, b) => a.currentStock - b.currentStock);
  },
});

// Add or update a product in the restock queue
export const upsert = mutation({
  args: {
    productId: v.id("products"),
    productName: v.string(),
    currentStock: v.number(),
    minStockThreshold: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("restockQueue")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();

    const priority = getPriority(args.currentStock, args.minStockThreshold);

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentStock: args.currentStock,
        priority,
      });
    } else {
      await ctx.db.insert("restockQueue", {
        ...args,
        priority,
        addedAt: Date.now(),
      });
    }
  },
});

// Remove from restock queue
export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("restockQueue")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();
    if (item) await ctx.db.delete(item._id);
  },
});

// Manually restock a product
export const restock = mutation({
  args: {
    productId: v.id("products"),
    addQuantity: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    const newStock = product.stock + args.addQuantity;
    const newStatus = newStock > 0 ? "active" : "out_of_stock";

    // Update product stock
    await ctx.db.patch(args.productId, {
      stock: newStock,
      status: newStatus,
    });

    // If stock is now above threshold — remove from queue
    if (newStock >= product.minStockThreshold) {
      const queueItem = await ctx.db
        .query("restockQueue")
        .withIndex("by_product", (q) => q.eq("productId", args.productId))
        .first();
      if (queueItem) await ctx.db.delete(queueItem._id);
    } else {
      // Still below threshold — update queue with new stock
      const priority = getPriority(newStock, product.minStockThreshold);
      const queueItem = await ctx.db
        .query("restockQueue")
        .withIndex("by_product", (q) => q.eq("productId", args.productId))
        .first();
      if (queueItem)
        await ctx.db.patch(queueItem._id, { currentStock: newStock, priority });
    }

    // Log the activity (format quantity with explicit sign to avoid "+-N")
    const sign = args.addQuantity >= 0 ? "+" : "-";
    const signedLabel = `${sign}${Math.abs(args.addQuantity)}`;

    await ctx.db.insert("activityLog", {
      message: `Stock updated for "${product.name}" (${signedLabel} units, now ${newStock})`,
      type: "stock",
      createdAt: Date.now(),
    });
  },
});

import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
  args: {
    todayStart: v.number(),
  },
  handler: async (ctx, args) => {
    const { todayStart } = args;

    const allOrders = await ctx.db.query("orders").collect();
    const allProducts = await ctx.db.query("products").collect();
    const restockQueue = await ctx.db.query("restockQueue").collect();
    const recentLogs = await ctx.db
      .query("activityLog")
      .withIndex("by_createdAt")
      .order("desc")
      .take(10);

    // ── Orders Today ──
    const ordersToday = allOrders.filter((o) => o.createdAt >= todayStart);

    // ── Revenue Today — all orders except cancelled ──
    const revenueToday = ordersToday
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const pendingOrders = allOrders.filter(
      (o) => o.status === "pending",
    ).length;

    const completedOrders = allOrders.filter(
      (o) => o.status === "delivered",
    ).length;

    const lowStockCount = restockQueue.length;
    const totalProducts = allProducts.length;

    const productSummary = allProducts
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8)
      .map((p) => ({
        id: p._id,
        name: p.name,
        stock: p.stock,
        minStockThreshold: p.minStockThreshold,
        status: p.status,
        isLow: p.stock < p.minStockThreshold,
      }));

    return {
      totalOrdersToday: ordersToday.length,
      revenueToday,
      pendingOrders,
      completedOrders,
      lowStockCount,
      totalProducts,
      productSummary,
      recentLogs,
    };
  },
});

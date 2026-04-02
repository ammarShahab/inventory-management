import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all orders — optionally filter by status
export const getAll = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status && args.status !== "all") {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("orders")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Create a new order
export const create = mutation({
  args: {
    customerName: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // ── Conflict Detection: duplicate products ──
    const productIds = args.items.map((i) => i.productId);
    const hasDuplicates = new Set(productIds).size !== productIds.length;
    if (hasDuplicates) {
      throw new Error("Duplicate products found in this order.");
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) throw new Error(`Product not found.`);

      // ── Conflict Detection: inactive product ──
      if (product.status === "out_of_stock") {
        throw new Error(`"${product.name}" is currently unavailable.`);
      }

      // ── Stock Handling: insufficient stock ──
      if (item.quantity > product.stock) {
        throw new Error(
          `Only ${product.stock} item(s) available in stock for "${product.name}".`,
        );
      }

      const newStock = product.stock - item.quantity;

      // ── Deduct stock ──
      await ctx.db.patch(item.productId, {
        stock: newStock,
        status: newStock === 0 ? "out_of_stock" : "active",
      });

      // ── Add to restock queue if below threshold ──
      if (newStock < product.minStockThreshold) {
        const ratio = newStock / product.minStockThreshold;
        const priority =
          ratio <= 0.25 ? "high" : ratio <= 0.6 ? "medium" : "low";

        const existing = await ctx.db
          .query("restockQueue")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, {
            currentStock: newStock,
            priority,
          });
        } else {
          await ctx.db.insert("restockQueue", {
            productId: item.productId,
            productName: product.name,
            currentStock: newStock,
            minStockThreshold: product.minStockThreshold,
            priority,
            addedAt: Date.now(),
          });

          // Log restock queue addition
          await ctx.db.insert("activityLog", {
            message: `Product "${product.name}" added to Restock Queue`,
            type: "restock",
            createdAt: Date.now(),
          });
        }
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // ── Insert order ──
    const orderId = await ctx.db.insert("orders", {
      customerName: args.customerName,
      items: orderItems,
      totalPrice,
      status: "pending",
      createdAt: Date.now(),
    });

    // ── Log the activity ──
    await ctx.db.insert("activityLog", {
      message: `Order #${orderId.slice(-6).toUpperCase()} created for "${args.customerName}"`,
      type: "order",
      createdAt: Date.now(),
    });

    return orderId;
  },
});

// Update order status
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, { status: args.status });

    await ctx.db.insert("activityLog", {
      message: `Order #${args.orderId.slice(-6).toUpperCase()} marked as ${args.status}`,
      type: "order",
      createdAt: Date.now(),
    });
  },
});

// Cancel order — restores stock
export const cancel = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === "cancelled")
      throw new Error("Order is already cancelled");
    if (order.status === "delivered")
      throw new Error("Cannot cancel a delivered order");

    // ── Restore stock for each item ──
    for (const item of order.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;

      const restoredStock = product.stock + item.quantity;
      await ctx.db.patch(item.productId, {
        stock: restoredStock,
        status: restoredStock > 0 ? "active" : "out_of_stock",
      });

      // Remove from restock queue if now above threshold
      if (restoredStock >= product.minStockThreshold) {
        const queueItem = await ctx.db
          .query("restockQueue")
          .withIndex("by_product", (q) => q.eq("productId", item.productId))
          .first();
        if (queueItem) await ctx.db.delete(queueItem._id);
      }
    }

    await ctx.db.patch(args.orderId, { status: "cancelled" });

    await ctx.db.insert("activityLog", {
      message: `Order #${args.orderId.slice(-6).toUpperCase()} was cancelled — stock restored`,
      type: "order",
      createdAt: Date.now(),
    });
  },
});

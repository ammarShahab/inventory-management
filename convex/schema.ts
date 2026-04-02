import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // BetterAuth requires these tables
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    userId: v.id("user"),
  })
    .index("by_token", ["token"])
    .index("by_user_id", ["userId"]),

  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.id("user"),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_identifier", ["identifier"]),

  categories: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }),

  products: defineTable({
    name: v.string(),
    categoryId: v.id("categories"),
    price: v.number(),
    stock: v.number(),
    minStockThreshold: v.number(),
    status: v.string(), // "active" | "out_of_stock"
    createdAt: v.number(),
  }).index("by_category", ["categoryId"]),

  orders: defineTable({
    customerName: v.string(),
    // Array of { productId, productName, quantity, unitPrice }
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      }),
    ),
    totalPrice: v.number(),
    status: v.string(), // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  restockQueue: defineTable({
    productId: v.id("products"),
    productName: v.string(),
    currentStock: v.number(),
    minStockThreshold: v.number(),
    priority: v.string(), // "high" | "medium" | "low"
    addedAt: v.number(),
  }).index("by_product", ["productId"]),

  activityLog: defineTable({
    message: v.string(),
    type: v.string(), // "order" | "stock" | "restock" | "product"
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});

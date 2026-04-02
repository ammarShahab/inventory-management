import z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),

  categoryId: z.string().min(1, "Please select a category"),

  price: z
    .number({ message: "Price must be a valid number" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can have maximum 2 decimal places"),

  stock: z
    .number({ message: "Stock must be a valid number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),

  minStockThreshold: z
    .number({ message: "Threshold must be a valid number" })
    .int("Threshold must be a whole number")
    .min(1, "Minimum threshold must be at least 1"),

  status: z.enum(["active", "out_of_stock"]),
});

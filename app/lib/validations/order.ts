import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  quantity: z.coerce
    .number({ message: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export const orderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name is too long"),
  items: z
    .array(orderItemSchema)
    .min(1, "Please add at least one product to the order"),
});

export type OrderFormValues = z.output<typeof orderSchema>;

"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Trash2 } from "lucide-react";

// import { orderSchema, type OrderFormValues } from "@/lib/validations/order";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { OrderFormValues, orderSchema } from "@/app/lib/validations/order";
import z from "zod";

export function OrderForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createOrder = useMutation(api.orders.create);
  const products = useQuery(api.products.getAll);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema) as Resolver<OrderFormValues>,
    defaultValues: {
      customerName: "",
      items: [{ productId: "", quantity: 1 }],
    },
  });

  // useFieldArray manages the dynamic product rows
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {
    formState: { isSubmitting },
  } = form;
  //   const watchedItems = watch("items");
  const watchedItems = useWatch({ control: form.control, name: "items" });

  // Auto-calculate total price from selected products + quantities
  const totalPrice = watchedItems.reduce((sum, item) => {
    const product = products?.find((p) => p._id === item.productId);
    return sum + (product?.price ?? 0) * (Number(item.quantity) || 0);
  }, 0);

  // Stock warning per row
  function getStockWarning(productId: string, quantity: number): string | null {
    const product = products?.find((p) => p._id === productId);
    if (!product) return null;
    if (product.status === "out_of_stock")
      return "This product is currently unavailable.";
    if (quantity > product.stock)
      return `Only ${product.stock} item(s) available in stock.`;
    return null;
  }

  // Duplicate product detection
  function isDuplicate(productId: string, currentIndex: number): boolean {
    return watchedItems.some(
      (item, idx) => idx !== currentIndex && item.productId === productId,
    );
  }

  async function onSubmit(values: z.infer<typeof orderSchema>) {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await createOrder({
        customerName: values.customerName,
        items: values.items.map((item) => ({
          productId: item.productId as Id<"products">,
          quantity: item.quantity,
        })),
      });

      setSuccessMessage("Order created successfully!");
      form.reset();
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create order",
      );
    }
  }

  // Only show active products in the dropdown
  const activeProducts = products?.filter((p) => p.status === "active") ?? [];

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">New Order</CardTitle>
        <CardDescription>Create an order for a customer</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Customer Name */}
            <Field>
              <FieldLabel>Customer Name</FieldLabel>
              <Input
                placeholder="e.g. John Doe"
                {...form.register("customerName")}
              />
              <FieldError>
                {form.formState.errors.customerName?.message}
              </FieldError>
            </Field>
          </FieldGroup>

          <Separator />

          {/* Dynamic Product Rows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Order Items</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: "", quantity: 1 })}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </div>

            {fields.map((field, index) => {
              const selectedProductId = watchedItems[index]?.productId;
              const quantity = Number(watchedItems[index]?.quantity);
              const stockWarning = getStockWarning(selectedProductId, quantity);
              const duplicate = isDuplicate(selectedProductId, index);

              return (
                <div
                  key={field.id}
                  className="space-y-2 p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    {/* Product Select */}
                    <div className="flex-1 space-y-1">
                      <FieldLabel>Product</FieldLabel>
                      <Select
                        value={watchedItems[index]?.productId ?? ""}
                        onValueChange={(val) =>
                          form.setValue(`items.${index}.productId`, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeProducts.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No active products
                            </SelectItem>
                          ) : (
                            activeProducts.map((p) => (
                              <SelectItem key={p._id} value={p._id}>
                                {p.name} — ${p.price.toFixed(2)} ({p.stock}{" "}
                                left)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FieldError>
                        {
                          form.formState.errors.items?.[index]?.productId
                            ?.message
                        }
                      </FieldError>
                    </div>
                    {/* Quantity Input */}
                    <div className="w-24 space-y-1">
                      <FieldLabel>Qty</FieldLabel>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...form.register(`items.${index}.quantity`)}
                      />
                      <FieldError>
                        {
                          form.formState.errors.items?.[index]?.quantity
                            ?.message
                        }
                      </FieldError>
                    </div>
                    {/* Remove Row */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-7 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}{" "}
                  </div>

                  {/* Stock Warning */}
                  {stockWarning && (
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      ⚠ {stockWarning}
                    </p>
                  )}

                  {/* Duplicate Warning */}
                  {duplicate && selectedProductId && (
                    <p className="text-xs font-medium text-destructive">
                      ✕ This product is already added to the order.
                    </p>
                  )}
                </div>
              );
            })}

            {/* Items array error */}
            {form.formState.errors.items?.root?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.items.root.message}
              </p>
            )}
          </div>

          <Separator />

          {/* Total Price */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold">Total Price</span>
            <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-sm font-medium text-destructive">
              {serverError}
            </p>
          )}

          {/* Success */}
          {successMessage && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              ✓ {successMessage}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

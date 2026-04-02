"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import z from "zod";
import { productSchema } from "@/app/lib/validations/product";
import { toast } from "sonner";

export function ProductForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const createProduct = useMutation(api.products.create);
  const categories = useQuery(api.categories.getAll);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      stock: 0,
      minStockThreshold: 5,
      status: "active",
    },
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = form;

  const stockValue = useWatch({ control: form.control, name: "stock" });
  const statusValue = useWatch({ control: form.control, name: "status" });

  useEffect(() => {
    if (Number(stockValue) === 0) {
      setValue("status", "out_of_stock");
    } else {
      setValue("status", "active");
    }
  }, [stockValue, setValue]);

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setServerError(null);
    try {
      await createProduct({
        ...values,
        categoryId: values.categoryId as Id<"categories">,
      });
      form.reset();
      toast.success("Product created successfully");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create product",
      );
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">New Product</CardTitle>
        <CardDescription>Add a product to your inventory</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            {/* Product Name */}
            <Field>
              <FieldLabel>Product Name</FieldLabel>
              <Input
                placeholder="e.g. iPhone 13, T-Shirt, Rice Bag"
                {...form.register("name")}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            {/* Category */}
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                onValueChange={(val) => form.setValue("categoryId", val)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {!categories || categories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No categories yet — create one first
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FieldError>
                {form.formState.errors.categoryId?.message}
              </FieldError>
            </Field>

            {/* Price */}
            <Field>
              <FieldLabel>Price ($)</FieldLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("price", { valueAsNumber: true })} // ✅ Fix
              />
              <FieldError>{form.formState.errors.price?.message}</FieldError>
            </Field>

            {/* Stock Quantity */}
            <Field>
              <FieldLabel>Stock Quantity</FieldLabel>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 100"
                {...form.register("stock", { valueAsNumber: true })} // ✅ Fix
              />
              <FieldError>{form.formState.errors.stock?.message}</FieldError>
            </Field>

            {/* Min Stock Threshold */}
            <Field>
              <FieldLabel>Minimum Stock Threshold</FieldLabel>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 5"
                {...form.register("minStockThreshold", { valueAsNumber: true })} // ✅ Fix
              />
              <FieldError>
                {form.formState.errors.minStockThreshold?.message}
              </FieldError>
            </Field>

            {/* Status */}
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={statusValue}
                onValueChange={(val: "active" | "out_of_stock") =>
                  form.setValue("status", val)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{form.formState.errors.status?.message}</FieldError>
            </Field>
          </FieldGroup>

          {serverError && (
            <p className="text-sm font-medium text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

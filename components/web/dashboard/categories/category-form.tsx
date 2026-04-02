"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { categorySchema } from "@/app/lib/validations/category";
import z from "zod";
import { toast } from "sonner";

export function CategoryForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const createCategory = useMutation(api.categories.create);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    setServerError(null);
    try {
      await createCategory({ name: values.name });
      form.reset();
      toast.success("Category created successfully");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">New Category</CardTitle>
        <CardDescription>
          Create a category to group your products
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel>Category Name</FieldLabel>
              <Input
                placeholder="e.g. Electronics, Grocery, Clothing"
                {...form.register("name")}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>
          </FieldGroup>

          {serverError && (
            <p className="text-sm font-medium text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

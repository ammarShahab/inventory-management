"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CategoryList() {
  const categories = useQuery(api.categories.getAll);
  const removeCategory = useMutation(api.categories.remove);

  if (!categories) {
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading categories...
      </p>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <Tag className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            No categories yet. Create one to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Categories ({categories.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                removeCategory({ id: category._id as Id<"categories"> })
              }
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

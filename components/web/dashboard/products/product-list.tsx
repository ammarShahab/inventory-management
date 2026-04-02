"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Trash2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductList() {
  const products = useQuery(api.products.getAll);
  const removeProduct = useMutation(api.products.remove);

  if (!products) {
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading products...
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <Package className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            No products yet. Add one to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Products ({products.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              {/* Left: Name + Category */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium truncate">
                  {product.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {product.categoryName}
                </span>
              </div>

              {/* Middle: Price + Stock */}
              <div className="flex flex-col items-center gap-0.5 px-4">
                <span className="text-sm font-semibold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Stock: {product.stock}
                </span>
              </div>

              {/* Right: Status Badge + Delete */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    product.status === "active" ? "default" : "destructive"
                  }
                  className="text-xs shrink-0"
                >
                  {product.status === "active" ? "Active" : "Out of Stock"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeProduct({ id: product._id as Id<"products"> })
                  }
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

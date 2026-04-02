"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RefreshCcw, PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function RestockQueue() {
  const queue = useQuery(api.restock.getQueue);
  const restockProduct = useMutation(api.restock.restock);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleRestock(productId: string) {
    const qty = quantities[productId];
    if (!qty || qty < 1) {
      setErrors((prev) => ({ ...prev, [productId]: "Enter a valid quantity" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [productId]: "" }));
    try {
      await restockProduct({
        productId: productId as Id<"products">,
        addQuantity: qty,
      });
      setQuantities((prev) => ({ ...prev, [productId]: 0 }));
    } catch (err: unknown) {
      setErrors((prev) => ({
        ...prev,
        [productId]: err instanceof Error ? err.message : "Restock failed",
      }));
    }
  }

  if (!queue) {
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading queue...
      </p>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <RefreshCcw className="w-5 h-5" />
          Restock Queue ({queue.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <PackageX className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              All products are well-stocked!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-xl bg-muted/30"
              >
                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{item.productName}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PRIORITY_STYLES[item.priority as keyof typeof PRIORITY_STYLES]}`}
                    >
                      {item.priority} priority
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Stock: {item.currentStock} / Threshold:{" "}
                    {item.minStockThreshold}
                  </p>
                </div>

                {/* Restock Input + Button */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className="w-20 h-8 text-sm"
                      value={quantities[item.productId] || ""}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.productId]: Number(e.target.value),
                        }))
                      }
                    />
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleRestock(item.productId)}
                    >
                      Restock
                    </Button>
                  </div>
                  {errors[item.productId] && (
                    <p className="text-xs text-destructive">
                      {errors[item.productId]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

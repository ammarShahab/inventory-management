import { AlertTriangle, CheckCircle } from "lucide-react";

interface ProductSummaryItemProps {
  name: string;
  stock: number;
  minStockThreshold: number;
  isLow: boolean;
  status: string;
}

export function ProductSummaryItem({
  name,
  stock,
  minStockThreshold,
  isLow,
  status,
}: ProductSummaryItemProps) {
  const isOutOfStock = status === "out_of_stock";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      {/* Product Name */}
      <div className="flex items-center gap-2 min-w-0">
        {isOutOfStock || isLow ? (
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
        )}
        <span className="text-sm font-medium truncate">{name}</span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-muted-foreground">{stock} left</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isOutOfStock
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : isLow
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : isLow ? "Low Stock" : "OK"}
        </span>
      </div>
    </div>
  );
}

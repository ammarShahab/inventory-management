import { ShoppingCart, Package, RefreshCcw, Activity } from "lucide-react";

const TYPE_CONFIG = {
  order: { icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
  stock: { icon: Package, color: "text-green-500", bg: "bg-green-500/10" },
  restock: {
    icon: RefreshCcw,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  product: { icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
};

interface ActivityLogItemProps {
  message: string;
  type: string;
  createdAt: number;
}

export function ActivityLogItem({
  message,
  type,
  createdAt,
}: ActivityLogItemProps) {
  const config =
    TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.product;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3">
      <div className={`${config.bg} p-1.5 rounded-md shrink-0 mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" · "}
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

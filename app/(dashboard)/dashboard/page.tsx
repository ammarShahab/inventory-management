"use client";

import { useMemo } from "react";
import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Package,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRequireAuth } from "@/app/hooks/useRequireAuth";
import { ActivityLogItem } from "@/components/web/dashboard/activity/activity-log-item";
import { ProductSummaryItem } from "@/components/web/dashboard/products/product-summary-item";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardPage() {
  const { session, isPending: authPending } = useRequireAuth("/login");

  // ✅ Calculate midnight in the USER's local timezone on the client
  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useQuery(api.dashboard.getStats, { todayStart });

  if (authPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  const STAT_CARDS = [
    {
      label: "Total Orders Today",
      value: stats?.totalOrdersToday ?? 0,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Completed Orders",
      value: stats?.completedOrders ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Revenue Today",
      value: `$${(stats?.revenueToday ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Low Stock Items",
      value: stats?.lowStockCount ?? 0,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, {session?.user.name}! Here&apos;s what&apos;s happening
          today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="border border-border rounded-xl p-5 bg-card flex items-center gap-4 hover:shadow-sm transition-shadow duration-150"
          >
            <div className={`${bg} p-2.5 rounded-lg shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {label}
              </p>
              {!stats ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded mt-0.5" />
              ) : (
                <p className="text-2xl font-bold mt-0.5">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Summary */}
        <div className="border border-border rounded-xl bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Product Summary</h2>
            <span className="text-xs text-muted-foreground">
              {stats?.totalProducts ?? 0} total
            </span>
          </div>
          <div className="px-5">
            {!stats ? (
              <div className="space-y-3 py-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : stats.productSummary.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No products yet. Add products to see summary here.
              </p>
            ) : (
              <ScrollArea className="h-64">
                <div className="py-2">
                  {stats.productSummary.map((product) => (
                    <ProductSummaryItem
                      key={product.id}
                      name={product.name}
                      stock={product.stock}
                      minStockThreshold={product.minStockThreshold}
                      isLow={product.isLow}
                      status={product.status}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="border border-border rounded-xl bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Activity</h2>
          </div>
          <div className="px-5">
            {!stats ? (
              <div className="space-y-3 py-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : stats.recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No activity yet. Actions will appear here.
              </p>
            ) : (
              <ScrollArea className="h-64">
                <div className="py-3 space-y-4">
                  {stats.recentLogs.map((log) => (
                    <ActivityLogItem
                      key={log._id}
                      message={log.message}
                      type={log.type}
                      createdAt={log.createdAt}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

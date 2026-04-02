"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ShoppingCart } from "lucide-react";

import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderList() {
  const [filterStatus, setFilterStatus] = useState("all");
  const orders = useQuery(api.orders.getAll, { status: filterStatus });
  const updateStatus = useMutation(api.orders.updateStatus);
  const cancelOrder = useMutation(api.orders.cancel);
  const [actionError, setActionError] = useState<Record<string, string>>({});

  async function handleStatusChange(orderId: string, status: string) {
    try {
      await updateStatus({ orderId: orderId as Id<"orders">, status });
    } catch (err: unknown) {
      setActionError((prev) => ({
        ...prev,
        [orderId]:
          err instanceof Error ? err.message : "Failed to update status",
      }));
    }
  }

  async function handleCancel(orderId: string) {
    try {
      await cancelOrder({ orderId: orderId as Id<"orders"> });
    } catch (err: unknown) {
      setActionError((prev) => ({
        ...prev,
        [orderId]:
          err instanceof Error ? err.message : "Failed to cancel order",
      }));
    }
  }

  if (!orders) {
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading orders...
      </p>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Orders ({orders.length})
        </CardTitle>

        {/* Filter by status */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-border rounded-xl p-4 space-y-3 hover:bg-muted/30 transition-colors"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{order._id.slice(-6).toUpperCase()} ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-bold">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-1 pl-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      • {item.productName} × {item.quantity} @ $
                      {item.unitPrice.toFixed(2)}
                    </p>
                  ))}
                </div>

                {/* Actions */}
                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {/* Status Update */}
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          handleStatusChange(order._id, val)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter((s) => s !== "cancelled").map(
                            (s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-xs capitalize"
                              >
                                {s}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>

                      {/* Cancel with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            Cancel Order
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel this order?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will cancel the order and restore stock for
                              all items. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Go Back</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancel(order._id)}
                            >
                              Yes, Cancel Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                {/* Per-order action error */}
                {actionError[order._id] && (
                  <p className="text-xs text-destructive">
                    {actionError[order._id]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

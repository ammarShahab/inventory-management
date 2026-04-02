import { OrderForm } from "@/components/web/dashboard/orders/order-form";
import { OrderList } from "@/components/web/dashboard/orders/order-list";

export default function OrdersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create and manage customer orders.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <OrderForm />
        <div className="w-full">
          <OrderList />
        </div>
      </div>
    </div>
  );
}

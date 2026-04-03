"use client";

import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Package,
} from "lucide-react";

import { useRequireAuth } from "@/app/hooks/useRequireAuth";

const STAT_CARDS = [
  {
    label: "Total Orders Today",
    value: "0",
    icon: ShoppingCart,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Pending Orders",
    value: "0",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Completed Orders",
    value: "0",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Revenue Today",
    value: "$0.00",
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Low Stock Items",
    value: "0",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    label: "Total Products",
    value: "0",
    icon: Package,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function DashboardPage() {
  // const { data: session, isPending } = authClient.useSession();
  // if (!isPending && !session) redirect("/login");
  // const router = useRouter();
  /* useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]); */

  const { session, isPending } = useRequireAuth("/login");
  // const { isPending } = useRequireAuth("/");

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }
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
              <p className="text-2xl font-bold mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Summary */}
        <div className="border border-border rounded-xl bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Product Summary</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground">
              No products yet. Add products to see summary here.
            </p>
          </div>
        </div>

        {/* Activity Log */}
        <div className="border border-border rounded-xl bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Activity</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground">
              No activity yet. Actions will appear here as you use the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

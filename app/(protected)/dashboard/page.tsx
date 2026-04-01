"use client";

import { redirect } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import SignoutBtn from "@/components/auth/signout-btn";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  // Optional: Client-side redirect if not authenticated
  if (!isPending && !session) {
    redirect("/login");
  }

  if (isPending) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {session?.user.name}!
            </p>
          </div>
          <SignoutBtn />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold">Total Products</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold">Pending Orders</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="font-semibold">Low Stock Alerts</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}

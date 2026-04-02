import { RestockQueue } from "@/components/web/dashboard/restock/restock-queue";
import { ActivityLog } from "@/components/web/dashboard/activity/activity-log";

export default function RestockPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Restock Queue</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage low-stock products and track system activity.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full">
          <RestockQueue />
        </div>
        <div className="w-full">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}

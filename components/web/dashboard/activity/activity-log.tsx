"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const TYPE_STYLES: Record<string, string> = {
  order: "bg-blue-500",
  stock: "bg-green-500",
  restock: "bg-yellow-500",
  product: "bg-purple-500",
};

export function ActivityLog() {
  const logs = useQuery(api.activityLog.getRecent);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-72">
          {!logs || logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity yet. Actions will appear here.
            </p>
          ) : (
            <div className="space-y-3 pr-2">
              {logs.map((log) => (
                <div key={log._id} className="flex items-start gap-3">
                  {/* Color dot by type */}
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${TYPE_STYLES[log.type] ?? "bg-muted"}`}
                  />
                  <div>
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

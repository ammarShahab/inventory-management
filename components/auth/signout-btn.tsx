"use client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignoutBtn() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged out successfully");
              router.push("/");
            },
            onError: (error) => {
              toast.error(error.error?.message || "Failed to logout");
            },
          },
        });
      }}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-gray-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
    >
      <LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
      <span className="hidden sm:inline">Sign Out</span>
    </Button>
  );
}

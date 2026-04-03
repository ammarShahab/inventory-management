// hooks/useRequireAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

export function useRequireAuth(redirectTo: string = "/login") {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log("useRequireAuth fired:", { isPending, session, redirectTo });
    if (!isPending && !session) {
      // console.log("Redirecting to:", redirectTo); // ← Which page triggers this?
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isPending, isAuthenticated: !!session };
}

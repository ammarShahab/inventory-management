import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  RefreshCcw,
  Boxes,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SignoutBtn from "@/components/auth/signout-btn";

export function SidebarContent() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NAV_ITEMS = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: Tag,
    },
    {
      label: "Products",
      href: "/dashboard/products",
      icon: Package,
    },

    {
      label: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: "Restock Queue",
      href: "/dashboard/restock",
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Boxes className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight leading-tight">
            Smart Inventory
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform duration-150",
                  !isActive && "group-hover:scale-110",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Signout */}
      <div className="px-3 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3">
          {/* Avatar circle with initials */}
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              {session?.user?.name?.charAt(0) ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <div className="px-1">
          <SignoutBtn />
        </div>
      </div>
    </div>
  );
}

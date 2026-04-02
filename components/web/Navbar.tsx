"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import SignoutBtn from "../auth/signout-btn";

export default function Navbar() {
  // ✅ Use Better Auth hook instead of useConvexAuth
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session;

  // Optional: Show loading state while checking auth
  if (isPending) {
    return (
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl" />
            <span className="font-semibold text-2xl tracking-tight">
              Nextify
            </span>
          </div>
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="font-semibold text-2xl tracking-tight text-gray-900">
              Nextify
            </span>
          </Link>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-violet-600 hover:after:w-full after:transition-all"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-violet-600 hover:after:w-full after:transition-all"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-violet-600 hover:after:w-full after:transition-all"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-violet-600 hover:after:w-full after:transition-all"
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-violet-600 hover:after:w-full after:transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Profile Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>

                {/* Sign Out Button */}
                <SignoutBtn />
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Link>

                {/* Sign Up Button */}
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

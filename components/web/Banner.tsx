"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Add to your globals.css:
//
// .glass {
//   backdrop-filter: blur(16px) saturate(180%);
//   -webkit-backdrop-filter: blur(16px) saturate(180%);
// }
// .mesh-gradient {
//   background:
//     radial-gradient(at 0% 0%, rgba(59,130,246,.15) 0px, transparent 50%),
//     radial-gradient(at 100% 0%, rgba(99,102,241,.15) 0px, transparent 50%),
//     radial-gradient(at 100% 100%, rgba(59,130,246,.10) 0px, transparent 50%),
//     radial-gradient(at 0% 100%, rgba(168,85,247,.10) 0px, transparent 50%);
// }
// .grid-pattern {
//   background-image:
//     linear-gradient(rgba(148,163,184,.03) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(148,163,184,.03) 1px, transparent 1px);
//   background-size: 32px 32px;
// }
// .shimmer { position: relative; overflow: hidden; }
// .shimmer::after {
//   content: '';
//   position: absolute; inset: 0;
//   background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
//   transform: translateX(-100%);
//   animation: shimmer 3s infinite;
// }
// @keyframes shimmer { 100% { transform: translateX(100%); } }
// .dashboard-glow {
//   box-shadow:
//     0 0 0 1px rgba(255,255,255,.05) inset,
//     0 1px 0 0 rgba(255,255,255,.1) inset,
//     0 -1px 0 0 rgba(0,0,0,.1) inset,
//     0 25px 50px -12px rgba(0,0,0,.25),
//     0 0 80px rgba(59,130,246,.15);
// }
//
// ─────────────────────────────────────────────────────────────────────────────
// Add to your tailwind.config.ts theme.extend:
//
// animation: {
//   float: 'float 6s ease-in-out infinite',
//   'float-delayed': 'float 6s ease-in-out infinite 2s',
//   glow: 'glow 2s ease-in-out infinite alternate',
// },
// keyframes: {
//   float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
//   glow: { '0%': { boxShadow: '0 0 20px rgba(59,130,246,.5)' }, '100%': { boxShadow: '0 0 40px rgba(99,102,241,.8)' } },
// },
//
// ─────────────────────────────────────────────────────────────────────────────
// Add to your layout.tsx <head> (or use next/font):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
// <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
// ─────────────────────────────────────────────────────────────────────────────

export default function BannerLanding() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const container = card.parentElement;
    if (!container) return;

    let ticking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;
          card.style.transform = `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(2000px) rotateY(-8deg) rotateX(3deg)";
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleParallax = (e: MouseEvent) => {
      const orbs = document.querySelectorAll<HTMLElement>(
        ".animate-float, .animate-float-delayed",
      );
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * speed * 10 - 5}px, ${y * speed * 10 - 5}px)`;
      });
    };
    document.addEventListener("mousemove", handleParallax);
    return () => document.removeEventListener("mousemove", handleParallax);
  }, []);

  return (
    <div className="bg-[#fafafb] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ── Background Elements ────────────────────────────────────────────── */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />

      {/* Floating Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-violet-400/15 to-blue-500/15 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      {/*  <nav className="relative z-50 border-b border-slate-200/60 bg-white/70 glass sticky top-0">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[72px]"> */}
      {/* Logo + Nav Links */}
      {/* <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <i className="ri-stack-line text-white text-xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-[22px] tracking-tight">
                    InvenFlow
                  </span>
                  <div className="text-[10px] font-semibold text-slate-500 tracking-[0.2em] -mt-1.5">
                    PRO
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 rounded-full p-1">
                {["Product", "Solutions", "Pricing", "Resources"].map(
                  (item, i) => (
                    <Link
                      key={item}
                      href="#"
                      className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                        i === 0
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      {item}
                    </Link>
                  ),
                )}
              </div>
            </div> */}

      {/* CTA Buttons */}
      {/* <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                <i className="ri-login-circle-line" />
                Sign in
              </button>
              <button className="group relative px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/25 hover:-translate-y-0.5">
                <span className="relative z-10 flex items-center gap-2">
                  Start free trial
                  <i className="ri-arrow-right-line group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div> */}
      {/*     </div>
        </div>
      </nav> */}

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <main className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-12 lg:pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* ── Left Content ──────────────────────────────────────────── */}
            <div className="relative">
              {/* Announcement Pill */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full group cursor-pointer hover:border-blue-300/70 transition-all">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full shadow-sm text-[11px] font-bold text-blue-700 tracking-wide">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  NEW
                </span>
                <span className="text-sm font-medium text-slate-700 pr-1">
                  Warehouse sync 2.0 — auto-reconcile stock in real-time
                </span>
                <i className="ri-arrow-right-s-line text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-[48px] leading-[1.05] tracking-[-0.03em] text-slate-900 xl:text-[64px]">
                Inventory control,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    perfectly synced
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-blue-200/60"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M0 8c60-6 120-6 180 0s120 6 180 0"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.5"
                    />
                  </svg>
                </span>{" "}
                across every channel.
              </h1>

              <p className="mt-6 text-[18px] leading-[1.7] text-slate-600 max-w-[540px]">
                Unified inventory, orders, and fulfillment in one fast, reliable
                workspace. Prevent stockouts, automate reorders, and ship faster
                — without the spreadsheet chaos.
              </p>

              {/* Feature Pills */}
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  {
                    icon: "ri-shield-flash-line",
                    color: "bg-blue-50",
                    iconColor: "text-blue-600",
                    label: "SOC 2 Compliant",
                  },
                  {
                    icon: "ri-flashlight-line",
                    color: "bg-emerald-50",
                    iconColor: "text-emerald-600",
                    label: "Live in 5 minutes",
                  },
                  {
                    icon: "ri-customer-service-2-line",
                    color: "bg-violet-50",
                    iconColor: "text-violet-600",
                    label: "24/7 Support",
                  },
                ].map(({ icon, color, iconColor, label }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-default"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <i className={`${icon} ${iconColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button className="group relative h-13 px-7 bg-slate-900 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/20 hover:-translate-y-1 active:translate-y-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2.5 h-full">
                    <span>Start free 14-day trial</span>
                    <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:rotate-45 transition-all">
                      <i className="ri-rocket-2-line text-sm" />
                    </div>
                  </span>
                </button>

                <button className="group h-13 px-7 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                  <span className="flex items-center justify-center gap-2.5 h-full text-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <i className="ri-play-circle-line text-slate-700 text-lg" />
                    </div>
                    Watch 90-sec demo
                  </span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-10 pt-8 border-t border-slate-200/80">
                <div className="flex items-center gap-6 flex-wrap">
                  <p className="text-xs font-bold text-slate-500 tracking-[0.15em] uppercase">
                    Trusted by 4,000+ teams at
                  </p>
                  <div className="flex items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                    {["acmé", "Northwind", "Globex", "Umbrella"].map(
                      (brand) => (
                        <span
                          key={brand}
                          className="font-display font-bold text-lg text-slate-700"
                        >
                          {brand}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Dashboard Preview ────────────────────────────────── */}
            <div className="relative lg:h-[720px] flex items-center">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-violet-600/10 rounded-[2.5rem] blur-3xl scale-110" />

              {/* Main Dashboard Card */}
              <div className="relative w-full group perspective-1000">
                <div
                  ref={cardRef}
                  className="relative dashboard-glow rounded-[2rem] overflow-hidden bg-white/80 glass border border-white/20 transition-transform duration-500 ease-out will-change-transform"
                  style={{
                    transform:
                      "perspective(2000px) rotateY(-8deg) rotateX(3deg)",
                  }}
                >
                  {/* Dashboard Chrome */}
                  <div className="h-14 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 flex items-center px-5 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner" />
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-inner" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-inner" />
                    </div>
                    <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                      <i className="ri-global-line" />
                      app.invenflow.com/dashboard
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse ml-1" />
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                          Live
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
                        NK
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-5 sm:p-7 bg-gradient-to-b from-white to-slate-50/50">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {/* Total Orders */}
                      <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform">
                              <i className="ri-shopping-bag-3-line text-white text-lg" />
                            </div>
                            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200">
                              <i className="ri-arrow-up-s-line" />
                              12.4%
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Total Orders
                          </p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-[28px] font-extrabold tracking-tight text-slate-900">
                              1,284
                            </p>
                            <p className="text-sm text-slate-500">today</p>
                          </div>
                          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[78%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Low Stock */}
                      <div className="group/card relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-4 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform">
                              <i className="ri-alert-line text-white text-lg" />
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded-lg border border-red-200 animate-pulse">
                              ACTION
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                            Low Stock Items
                          </p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-[28px] font-extrabold tracking-tight text-slate-900">
                              12
                            </p>
                            <p className="text-sm text-amber-700 font-medium">
                              need reorder
                            </p>
                          </div>
                          <div className="mt-3 flex -space-x-2">
                            {["SKU", "SKU", "+10"].map((s, i) => (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-lg bg-white border-2 border-amber-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-sm"
                              >
                                {s}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fulfillment */}
                      <div className="group/card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full" />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform">
                              <i className="ri-truck-line text-white text-lg" />
                            </div>
                            <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg">
                              <i className="ri-time-line" />
                              2.1h avg
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Fulfillment Rate
                          </p>
                          <div className="flex items-baseline gap-3">
                            <p className="text-[28px] font-extrabold tracking-tight text-slate-900">
                              94
                              <span className="text-[18px] text-slate-400">
                                %
                              </span>
                            </p>
                            <div className="flex-1">
                              <svg className="w-full h-8" viewBox="0 0 100 24">
                                <defs>
                                  <linearGradient
                                    id="lineGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                  >
                                    <stop
                                      offset="0%"
                                      style={{ stopColor: "#8b5cf6" }}
                                    />
                                    <stop
                                      offset="100%"
                                      style={{ stopColor: "#6366f1" }}
                                    />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M0 18 Q 20 8, 40 14 T 80 6 T 100 10"
                                  fill="none"
                                  stroke="url(#lineGrad)"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-5 gap-5">
                      {/* Orders Table */}
                      <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                              <i className="ri-list-check-2 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">
                                Recent Orders
                              </h3>
                              <p className="text-xs text-slate-500">
                                Updated 3s ago • Auto-sync enabled
                              </p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <i className="ri-more-2-fill text-slate-400" />
                          </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {/* Order: Acme Corp */}
                          <div className="group/item px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700 shadow-inner">
                                  AC
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                                  <i className="ri-shop-line text-[10px] text-slate-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900 truncate">
                                    Acme Corp • #48291
                                  </p>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                                    PRO
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <i className="ri-box-3-line" />
                                    23 items
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <i className="ri-map-pin-line" />
                                    WH-NY
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-400">
                                    2 min ago
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">
                                  $4,820
                                </p>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full border border-amber-200 mt-1">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                  Processing
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order: Northwind */}
                          <div className="group/item px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center font-bold text-emerald-700 shadow-inner">
                                  NW
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                                  <i className="ri-store-2-line text-[10px] text-slate-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900 truncate">
                                    Northwind Traders • #48290
                                  </p>
                                  <i className="ri-verified-badge-fill text-blue-500 text-sm" />
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <i className="ri-box-3-line" />8 items
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <i className="ri-map-pin-line" />
                                    WH-CA
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-400">
                                    7 min ago
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">
                                  $1,240
                                </p>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200 mt-1">
                                  <i className="ri-check-line" />
                                  Delivered
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order: Globex */}
                          <div className="group/item px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center font-bold text-violet-700 shadow-inner">
                                  GX
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                                  <i className="ri-global-line text-[10px] text-slate-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900 truncate">
                                    Globex Ltd • #48289
                                  </p>
                                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-md border border-violet-200">
                                    ENT
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <i className="ri-box-3-line" />
                                    41 items
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <i className="ri-map-pin-line" />
                                    WH-TX
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-400">
                                    14 min ago
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">
                                  $9,310
                                </p>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full border border-blue-200 mt-1">
                                  <i className="ri-truck-line" />
                                  Shipped
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">
                            Showing 3 of 47 orders
                          </span>
                          <button className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:gap-1.5 transition-all">
                            View all orders{" "}
                            <i className="ri-arrow-right-line" />
                          </button>
                        </div>
                      </div>

                      {/* Right Sidebar */}
                      <div className="lg:col-span-2 space-y-5">
                        {/* Stock Levels */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                <i className="ri-stack-line text-white text-sm" />
                              </div>
                              Stock Levels
                            </h3>
                            <span className="text-[11px] font-bold px-2.5 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
                              12 Critical
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {/* Item A-482 */}
                            <div className="group/stock cursor-pointer">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-[11px] font-bold text-slate-700">
                                    A-482
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      Wireless Mouse Pro
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      SKU • Electronics
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-amber-700">
                                  18 left
                                </span>
                              </div>
                              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-sm" />
                                <div className="absolute inset-0 shimmer opacity-30" />
                              </div>
                            </div>

                            {/* Item B-129 */}
                            <div className="group/stock cursor-pointer">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-mono text-[11px] font-bold text-slate-700">
                                    B-129
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      USB-C Hub 7-in-1
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      SKU • Accessories
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-700">
                                  142 left
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[71%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                              </div>
                            </div>

                            {/* Item C-901 */}
                            <div className="group/stock cursor-pointer">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-mono text-[11px] font-bold text-red-700 border border-red-200">
                                    C-901
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      Mech Keyboard RGB
                                    </p>
                                    <p className="text-[11px] text-red-600 font-medium">
                                      Critical • Reorder ASAP
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-red-700">
                                  3 left
                                </span>
                              </div>
                              <div className="relative h-2 bg-red-50 rounded-full overflow-hidden border border-red-100">
                                <div className="absolute inset-y-0 left-0 w-[3%] bg-gradient-to-r from-red-500 to-rose-600 rounded-full animate-pulse shadow-sm" />
                              </div>
                            </div>
                          </div>

                          <button className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <i className="ri-restart-line" />
                            Generate Purchase Orders
                          </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <button className="group p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all text-left">
                            <i className="ri-add-box-line text-2xl mb-2 block group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-sm">New Order</p>
                            <p className="text-[11px] text-blue-100 mt-0.5">
                              Create manually
                            </p>
                          </button>
                          <button className="group p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all text-left">
                            <i className="ri-bar-chart-box-line text-2xl mb-2 block text-slate-700 group-hover:scale-110 transition-transform" />
                            <p className="font-bold text-sm text-slate-900">
                              Analytics
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              View reports
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card: Channels */}
                <div className="absolute -right-6 top-24 hidden xl:block animate-float">
                  <div className="bg-white/90 glass backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-4 w-56 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
                        <i className="ri-check-double-line text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Synced just now
                        </p>
                        <p className="font-extrabold text-slate-900">
                          Shopify • Woo • Amazon
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[11px] font-medium text-emerald-700">
                            All channels live
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card: AI Suggestion */}
                <div className="absolute -left-8 bottom-20 hidden xl:block animate-float-delayed">
                  <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 w-48 border border-slate-700 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-sparkling-2-fill text-amber-400" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        AI Suggestion
                      </p>
                    </div>
                    <p className="font-bold text-sm leading-snug">
                      Reorder C-901 now to avoid stockout in{" "}
                      <span className="text-amber-400">2.3 days</span>
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-700 flex gap-2">
                      <button className="flex-1 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-100 transition">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700 transition">
                        Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Features ──────────────────────────────────────────── */}
          <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                gradient: "hover:from-blue-300 hover:to-indigo-200",
                iconGradient: "from-blue-500 to-indigo-600",
                shadow: "shadow-blue-500/20",
                icon: "ri-loop-right-line",
                title: "Real-time Sync",
                desc: "Bi-directional sync with Shopify, WooCommerce, Amazon, and 50+ platforms. Zero latency.",
              },
              {
                gradient: "hover:from-emerald-300 hover:to-teal-200",
                iconGradient: "from-emerald-500 to-teal-600",
                shadow: "shadow-emerald-500/20",
                icon: "ri-robot-2-line",
                title: "Smart Automation",
                desc: "Auto-create POs, route orders, and update tracking. Save 20+ hours weekly.",
              },
              {
                gradient: "hover:from-violet-300 hover:to-purple-200",
                iconGradient: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-500/20",
                icon: "ri-shield-keyhole-line",
                title: "Enterprise Security",
                desc: "SOC 2 Type II, GDPR, role-based access, and audit logs. Bank-grade encryption.",
              },
            ].map(({ gradient, iconGradient, shadow, icon, title, desc }) => (
              <div
                key={title}
                className={`group relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-slate-200 to-transparent ${gradient} transition-all duration-500`}
              >
                <div className="relative h-full bg-white rounded-[1.45rem] p-6 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg ${shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                  >
                    <i className={`${icon} text-white text-xl`} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer Bar ────────────────────────────────────────────────────── */}
      <div className="relative border-t border-slate-200/60 bg-white/50 glass backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <span>© 2025 InvenFlow, Inc.</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>99.99% Uptime • Avg response &lt; 120ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

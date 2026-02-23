"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Target,
    Zap,
    CheckSquare,
    Trophy,
    Settings,
    LogOut,
    Sparkles,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/components";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "لوحة القيادة" },
    { href: "/goals", icon: Target, label: "الأهداف" },
    { href: "/routines", icon: Zap, label: "العادات" },
    { href: "/tasks", icon: CheckSquare, label: "المهام" },
    { href: "/achievements", icon: Trophy, label: "الإنجازات" },
    { href: "/settings", icon: Settings, label: "الإعدادات" },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex h-screen w-72 flex-col border-l border-border bg-surface-0/50 backdrop-blur-xl transition-all duration-300", className)}>
            <div className="flex h-20 items-center px-6 border-b border-border/50">
                <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark"> Routine Master</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors outline-none",
                                isActive
                                    ? "text-primary dark:text-white"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <item.icon className={cn("relative z-10 h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-text-tertiary group-hover:text-primary")} />
                            <span className="relative z-10">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute left-4 h-2 w-2 rounded-full bg-primary shadow-glow"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="rounded-2xl border border-border/50 bg-surface-1 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-orange-500 shadow-md" />
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-semibold text-text-primary">ترقية الخطة</p>
                            <p className="truncate text-xs text-text-secondary">احصل على ميزات Pro</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-0 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-error transition-colors shadow-sm cursor-pointer h-auto"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>تسجيل الخروج</span>
                    </Button>
                </div>
            </div>
        </aside>
    );
}

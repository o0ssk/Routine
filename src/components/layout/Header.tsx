"use client";

import { useSession } from "next-auth/react";
import { User, Bell, Search, Settings, LogOut, Target, CheckCircle2, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SearchResult {
    tasks: any[];
    goals: any[];
    routines: any[];
    total: number;
}

export function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults(null);
            setShowSearch(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                    setShowSearch(true);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchItemClick = (type: string, id: string) => {
        setShowSearch(false);
        setSearchQuery("");
        router.push(`/${type}/${id}`);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setShowNotifications(false);
                setShowProfile(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/40 bg-surface-0/60 px-8 shadow-sm backdrop-blur-xl transition-all">
            <div className="flex items-center gap-6">
                <div className="hidden md:block">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary">
                        مرحباً، {session?.user?.name || "يا بطل"} 👋
                    </h2>
                    <p className="text-xs text-text-tertiary">لنحقق بعض الإنجازات اليوم</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block group dropdown-container">
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-tertiary group-focus-within:text-primary transition-colors">
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="بحث سريع..."
                        aria-label="بحث سريع"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchResults && setShowSearch(true)}
                        className="h-10 w-64 rounded-full border border-border bg-surface-1 pr-10 pl-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {showSearch && searchResults && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 w-80 bg-surface-0 border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                            >
                                {searchResults.total === 0 ? (
                                    <div className="p-4 text-center text-text-tertiary text-sm">
                                        لا توجد نتائج لـ "{searchQuery}"
                                    </div>
                                ) : (
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.tasks.length > 0 && (
                                            <div className="p-2">
                                                <p className="text-xs font-medium text-text-tertiary px-2 mb-1">المهام</p>
                                                {searchResults.tasks.map((task) => (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => handleSearchItemClick('tasks', task.id)}
                                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-text-primary hover:bg-surface-1 rounded-lg transition-colors text-right"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                                        <span className="truncate">{task.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.goals.length > 0 && (
                                            <div className="p-2 border-t border-border/50">
                                                <p className="text-xs font-medium text-text-tertiary px-2 mb-1">الأهداف</p>
                                                {searchResults.goals.map((goal) => (
                                                    <button
                                                        key={goal.id}
                                                        onClick={() => handleSearchItemClick('goals', goal.id)}
                                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-text-primary hover:bg-surface-1 rounded-lg transition-colors text-right"
                                                    >
                                                        <Target className="h-4 w-4 text-accent flex-shrink-0" />
                                                        <span className="truncate">{goal.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.routines.length > 0 && (
                                            <div className="p-2 border-t border-border/50">
                                                <p className="text-xs font-medium text-text-tertiary px-2 mb-1">العادات</p>
                                                {searchResults.routines.map((routine) => (
                                                    <button
                                                        key={routine.id}
                                                        onClick={() => handleSearchItemClick('routines', routine.id)}
                                                        className="w-full flex items-center gap-2 px-2 py-2 text-sm text-text-primary hover:bg-surface-1 rounded-lg transition-colors text-right"
                                                    >
                                                        <Zap className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                                                        <span className="truncate">{routine.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

                {/* Notifications Button */}
                <div className="relative dropdown-container">
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-secondary hover:text-primary rounded-full hover:bg-primary/5 relative"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowNotifications(!showNotifications);
                                setShowProfile(false);
                            }}
                            aria-label="الإشعارات"
                            aria-haspopup="true"
                            aria-expanded={showNotifications}
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error ring-2 ring-surface-0 animate-pulse" />
                        </Button>
                    </motion.div>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-80 bg-surface-0 border border-border rounded-2xl shadow-xl p-4 z-50"
                            >
                                <p className="text-sm font-medium text-text-primary mb-3">الإشعارات</p>
                                <div className="text-sm text-text-secondary text-center py-8">
                                    لا توجد إشعارات جديدة
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Avatar */}
                <div className="relative dropdown-container">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                        className="h-10 w-10 p-0.5 rounded-full ring-2 ring-border/50 overflow-hidden cursor-pointer hover:ring-primary transition-all shadow-sm"
                        role="button"
                        aria-label="قائمة الحساب"
                        aria-haspopup="true"
                        aria-expanded={showProfile}
                    >
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="User" className="h-full w-full object-cover rounded-full" />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </motion.div>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-48 bg-surface-0 border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                            >
                                <div className="p-3 border-b border-border">
                                    <p className="text-sm font-semibold text-text-primary truncate">{session?.user?.name}</p>
                                    <p className="text-xs text-text-tertiary truncate">{session?.user?.email}</p>
                                </div>
                                <div className="p-1">
                                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-1 rounded-xl transition-colors">
                                        <Settings className="h-4 w-4" />
                                        الإعدادات
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-xl transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        تسجيل الخروج
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

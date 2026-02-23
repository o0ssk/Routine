"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/components";
import { Trophy, Target, Zap, CheckCircle, Star, Medal, Crown, Flame, Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Achievement {
    id: string;
    type: string;
    title: string;
    description: string;
    icon: string;
    threshold: number;
    current: number;
    earned: boolean;
    progress: number;
}

interface Stats {
    completedTasks: number;
    completedGoals: number;
    totalRoutines: number;
    bestStreak: number;
    earnedCount: number;
    totalCount: number;
}

const iconMap: Record<string, any> = {
    CheckCircle,
    Target,
    Crown,
    Trophy,
    Star,
    Medal,
    Zap,
    Flame,
    Award,
    Fire: Flame,
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AchievementsView() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAchievements() {
            try {
                const res = await fetch('/api/achievements');
                if (!res.ok) {
                    throw new Error("Failed to fetch achievements");
                }
                const data = await res.json();
                setAchievements(data.achievements);
                setStats(data.stats);
            } catch (err) {
                setError("فشل تحميل الإنجازات");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchAchievements();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-error">
                {error}
            </div>
        );
    }

    const getIconColor = (type: string, earned: boolean) => {
        if (!earned) return "text-gray-400";
        switch (type) {
            case "tasks": return "text-emerald-500";
            case "goals": return "text-blue-500";
            case "routines": return "text-purple-500";
            case "streak": return "text-orange-500";
            default: return "text-amber-500";
        }
    };

    const getBgColor = (type: string, earned: boolean) => {
        if (!earned) return "bg-gray-100 dark:bg-surface-2";
        switch (type) {
            case "tasks": return "bg-emerald-500/10";
            case "goals": return "bg-blue-500/10";
            case "routines": return "bg-purple-500/10";
            case "streak": return "bg-orange-500/10";
            default: return "bg-amber-500/10";
        }
    };

    const getBorderColor = (type: string, earned: boolean) => {
        if (!earned) return "border-dashed border-gray-300 dark:border-white/10";
        switch (type) {
            case "tasks": return "border-emerald-500/20";
            case "goals": return "border-blue-500/20";
            case "routines": return "border-purple-500/20";
            case "streak": return "border-orange-500/20";
            default: return "border-amber-500/20";
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">لوحة الإنجازات</h1>
                    <p className="text-text-secondary mt-1">تابع تقدمك واحتفل بانتصاراتك الصغيرة.</p>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 md:grid-cols-4"
            >
                <motion.div variants={item}>
                    <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg shadow-indigo-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-100">المهام المنجزة</CardTitle>
                            <CheckCircle className="h-4 w-4 text-indigo-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.completedTasks || 0}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-surface-0 border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">الأهداف المحققة</CardTitle>
                            <Target className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats?.completedGoals || 0}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-surface-0 border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">أفضل استمرارية</CardTitle>
                            <Flame className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">{stats?.bestStreak || 0} يوم</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-surface-0 border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-text-secondary">الشارات المكتسبة</CardTitle>
                            <Trophy className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-text-primary">
                                {stats?.earnedCount || 0}/{stats?.totalCount || 0}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show">
                <Card className="border-none shadow-md bg-surface-0/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Medal className="h-5 w-5 text-accent" />
                            الشارات والجوائز
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {achievements.map((badge, index) => {
                                const Icon = iconMap[badge.icon] || Star;
                                const color = getIconColor(badge.type, badge.earned);
                                const bg = getBgColor(badge.type, badge.earned);
                                const border = getBorderColor(badge.type, badge.earned);

                                return (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center group cursor-default ${bg} ${border}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg ${badge.earned ? "bg-white dark:bg-surface-0 shadow-sm" : "bg-transparent opacity-50"}`}>
                                            <Icon className={`h-8 w-8 ${color}`} />
                                        </div>

                                        <h3 className={`font-bold text-lg mb-1 ${badge.earned ? "text-text-primary" : "text-text-tertiary"}`}>
                                            {badge.title}
                                        </h3>
                                        <p className="text-xs text-text-secondary leading-relaxed mb-3">
                                            {badge.description}
                                        </p>

                                        {/* Progress bar for unearned achievements */}
                                        {!badge.earned && (
                                            <div className="w-full space-y-1">
                                                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${badge.progress}%` }}
                                                        transition={{ duration: 1, delay: index * 0.1 }}
                                                        className="h-full bg-primary/50 rounded-full"
                                                    />
                                                </div>
                                                <p className="text-xs text-text-tertiary">
                                                    {badge.current}/{badge.threshold}
                                                </p>
                                            </div>
                                        )}

                                        {badge.earned && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

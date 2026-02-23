"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/components";
import { CheckCircle, Clock, Target, Trophy, ArrowUpRight, Plus, Activity, Filter, ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardData {
    tasksCount: number;
    tasksCompleted: number;
    activeGoals: number;
    routinesCompletedToday: number;
}

export default function DashboardView({ data, userName }: { data: DashboardData; userName: string }) {
    // Staggered animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                        صباح الخير، <span className="text-primary">{userName}</span> ☀️
                    </h1>
                    <p className="text-text-secondary mt-1 text-lg">
                        لديك <span className="font-semibold text-text-primary">{data.tasksCount - data.tasksCompleted} مهام</span> متبقية لهذا اليوم.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3"
                >
                    <Button variant="outline" className="gap-2 hidden sm:flex bg-surface-0">
                        <ArrowDownToLine className="h-4 w-4" />
                        تصدير
                    </Button>
                    <Button variant="outline" className="gap-2 hidden sm:flex bg-surface-0">
                        <Filter className="h-4 w-4" />
                        تصفية
                    </Button>
                    <Link href="/tasks/new">
                        <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                            <Plus className="ml-2 h-4 w-4" />
                            مهمة جديدة
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <StatsCard
                    title="المهام المنجزة"
                    value={`${data.tasksCompleted} / ${data.tasksCount}`}
                    subValue={`${data.tasksCount > 0 ? (data.tasksCompleted / data.tasksCount * 100).toFixed(0) : 0}% معدل الإنجاز`}
                    icon={CheckCircle}
                    color="text-secondary"
                    bg="bg-secondary/10"
                    trend="+12% من الأسبوع الماضي"
                />
                <StatsCard
                    title="عادات اليوم"
                    value={data.routinesCompletedToday}
                    subValue="عادات تم الالتزام بها"
                    icon={Clock}
                    color="text-primary"
                    bg="bg-primary/10"
                    trend="حافظ على الستريك!"
                />
                <StatsCard
                    title="الأهداف النشطة"
                    value={data.activeGoals}
                    subValue="أهداف قيد التنفيذ"
                    icon={Target}
                    color="text-accent"
                    bg="bg-accent/10"
                    trend="2 يقتربان من الموعد"
                />
                <StatsCard
                    title="نقاط الإنتاجية"
                    value="2,450"
                    subValue="مستوى متقدم (Elite)"
                    icon={Trophy}
                    color="text-yellow-500"
                    bg="bg-yellow-500/10"
                    trend="Top 5% هذا الشهر"
                />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Productivity Chart Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-4"
                >
                    <Card className="h-full border-none shadow-lg shadow-black/5 dark:shadow-black/20 bg-surface-0/80 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>الإنتاجية الأسبوعية</span>
                                <Button variant="ghost" size="sm" className="text-xs text-text-tertiary">عرض التفاصيل</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full flex items-end justify-between px-4 pb-4 pt-10 gap-2">
                                {/* Mock Chart Bars */}
                                {[40, 70, 30, 85, 50, 65, 90].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                                        <div className="relative w-full bg-surface-1 rounded-t-xl h-[200px] overflow-hidden">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                                className={`absolute bottom-0 w-full rounded-t-xl ${i === 6 ? 'bg-primary shadow-glow' : 'bg-primary/30 group-hover:bg-primary/50 transition-colors'}`}
                                            />
                                        </div>
                                        <span className="text-xs text-text-tertiary font-medium">
                                            {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Today's Focus / Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="col-span-3"
                >
                    <Card className="h-full border-none shadow-lg shadow-black/5 dark:shadow-black/20 bg-surface-0/80 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>تركيز اليوم</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Mock Tasks List */}
                                <div className="space-y-3">
                                    {[
                                        { title: "مراجعة تصميم لوحة التحكم", time: "10:00 ص", tag: "عمل", color: "bg-blue-500" },
                                        { title: "قراءة 20 صفحة", time: "05:00 م", tag: "تطوير", color: "bg-green-500" },
                                        { title: "تمرين رياضي", time: "07:00 م", tag: "صحة", color: "bg-orange-500" },
                                    ].map((task, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02, backgroundColor: "var(--surface-1)" }}
                                            className="flex items-center p-3 rounded-xl border border-border bg-surface-0 transition-colors cursor-pointer group"
                                        >
                                            <div className={`h-3 w-3 rounded-full ${task.color} ml-3 shadow-sm`} />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm text-text-primary group-hover:text-primary transition-colors">{task.title}</h4>
                                                <span className="text-xs text-text-tertiary">{task.time}</span>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded-md bg-surface-2 text-text-secondary">
                                                {task.tag}
                                            </div>
                                        </motion.div>
                                    ))}

                                    <div className="pt-4 flex justify-center">
                                        <Button variant="ghost" className="text-xs w-full border border-dashed border-border mb-2">
                                            <Plus className="h-3 w-3 ml-1" />
                                            إضافة مهمة سريعة
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, subValue, icon: Icon, color, bg, trend }: any) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div variants={item}>
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-surface-0 card-hover">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <p className="text-sm font-medium text-text-secondary">{title}</p>
                        <div className={`p-2 rounded-lg ${bg}`}>
                            <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                    </div>
                    <div className="space-y-1 mt-2">
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">{value}</h2>
                        <div className="flex items-center text-xs">
                            <span className="text-text-secondary ml-2">{subValue}</span>
                            {trend && <span className="text-emerald-500 font-medium flex items-center bg-emerald-500/10 px-1 rounded">{trend}</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Button, Badge, Checkbox } from "@/components/ui/components";
import { Plus, Zap, CheckCircle2, Flame, Sun, Moon, Calendar, Sparkles, Loader2, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Routine {
    id: string;
    title: string;
    description?: string | null;
    type: string; // 'morning', 'evening', 'daily', 'weekly', 'custom'
    time?: string | null;
    currentStreak: number;
    bestStreak: number;
    logs?: { id: string; date: string; completed: boolean }[];
}

interface RoutinesViewProps {
    routines: Routine[];
}

export default function RoutinesView({ routines: initialRoutines }: RoutinesViewProps) {
    const router = useRouter();
    const [routines, setRoutines] = useState(initialRoutines);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Map type to timeOfDay for display purposes
    const getTimeOfDay = (routine: Routine) => {
        if (routine.type === "morning") return "morning";
        if (routine.type === "evening") return "evening";
        return "anytime";
    };

    // Check if completed today based on logs
    const isCompletedToday = (routine: Routine) => {
        if (!routine.logs || routine.logs.length === 0) return false;
        const today = new Date().toISOString().split('T')[0];
        return routine.logs.some(log =>
            log.date.startsWith(today) && log.completed
        );
    };

    const sections = [
        {
            id: "morning",
            title: "روتين الصباح",
            icon: Sun,
            routines: routines.filter(r => getTimeOfDay(r) === "morning"),
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            id: "evening",
            title: "روتين المساء",
            icon: Moon,
            routines: routines.filter(r => getTimeOfDay(r) === "evening"),
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            id: "anytime",
            title: "طوال اليوم",
            icon: Zap,
            routines: routines.filter(r => getTimeOfDay(r) === "anytime"),
            color: "text-primary",
            bg: "bg-primary/10"
        },
    ];

    const handleToggle = async (routineId: string, currentlyCompleted: boolean) => {
        // Optimistic update
        setRoutines(prev => prev.map(r => {
            if (r.id === routineId) {
                const newLogs = currentlyCompleted
                    ? r.logs?.filter(l => !l.date.startsWith(new Date().toISOString().split('T')[0])) || []
                    : [...(r.logs || []), { id: 'temp', date: new Date().toISOString(), completed: true }];
                return {
                    ...r,
                    logs: newLogs,
                    currentStreak: currentlyCompleted ? Math.max(0, r.currentStreak - 1) : r.currentStreak + 1,
                };
            }
            return r;
        }));

        try {
            const res = await fetch(`/api/routines/${routineId}/log`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !currentlyCompleted }),
            });

            if (!res.ok) {
                throw new Error("Failed to log routine");
            }

            const data = await res.json();

            // Update with server response
            setRoutines(prev => prev.map(r => {
                if (r.id === routineId) {
                    return {
                        ...r,
                        currentStreak: data.currentStreak,
                        bestStreak: data.bestStreak,
                    };
                }
                return r;
            }));

            if (!currentlyCompleted) {
                setSuccess("تم تسجيل الإنجاز! 🎉");
                setTimeout(() => setSuccess(null), 2000);
            }

            router.refresh();
        } catch (err) {
            // Revert on error
            setRoutines(initialRoutines);
            setError("فشل تحديث العادة");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDelete = async (routineId: string) => {
        const routineToDelete = routines.find(r => r.id === routineId);
        if (!routineToDelete) return;

        // Optimistic update
        setRoutines(prev => prev.filter(r => r.id !== routineId));

        try {
            const res = await fetch(`/api/routines/${routineId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete routine");
            }

            setSuccess("تم حذف العادة");
            setTimeout(() => setSuccess(null), 2000);
            router.refresh();
        } catch (err) {
            // Revert on error
            setRoutines(prev => [...prev, routineToDelete]);
            setError("فشل حذف العادة");
            setTimeout(() => setError(null), 3000);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Toasts */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-error text-white px-4 py-2 rounded-lg shadow-lg"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight text-text-primary"
                    >
                        العادات
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary mt-1"
                    >
                        العادات الصغيرة تصنع فرقاً كبيراً.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/routines/new">
                        <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                            <Plus className="h-4 w-4" />
                            عادة جديدة
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
                {sections.map((section) => (
                    <motion.div
                        key={section.id}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                        }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-xl ${section.bg}`}>
                                <section.icon className={`h-5 w-5 ${section.color}`} />
                            </div>
                            <h2 className="font-bold text-lg text-text-primary">{section.title}</h2>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {section.routines.map((routine, i) => (
                                    <RoutineCard
                                        key={routine.id}
                                        routine={routine}
                                        index={i}
                                        isCompletedToday={isCompletedToday(routine)}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </AnimatePresence>
                            {section.routines.length === 0 && (
                                <Link href="/routines/new">
                                    <div className="p-8 border border-dashed border-border rounded-2xl text-center text-text-tertiary text-sm bg-surface-1/50 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                                        لا توجد عادات هنا - أضف عادة جديدة
                                    </div>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

function RoutineCard({
    routine,
    index,
    isCompletedToday,
    onToggle,
    onDelete
}: {
    routine: Routine;
    index: number;
    isCompletedToday: boolean;
    onToggle: (id: string, currentlyCompleted: boolean) => void;
    onDelete: (id: string) => void;
}) {
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggle = async () => {
        if (isToggling) return;
        setIsToggling(true);
        await onToggle(routine.id, isCompletedToday);
        setIsToggling(false);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        await onDelete(routine.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Card className={`border-none transition-all duration-300 ${isCompletedToday ? 'bg-primary/10 shadow-none ring-1 ring-primary/20' : 'bg-surface-0 shadow-sm hover:shadow-md card-hover'}`}>
                <CardContent className="p-4 flex items-center gap-4">
                    <motion.button
                        onClick={handleToggle}
                        disabled={isToggling}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isCompletedToday ? "إلغاء الإنجاز" : "إنجاز العادة"}
                        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isCompletedToday ? 'bg-primary border-primary text-white' : 'border-border text-transparent hover:border-primary hover:bg-primary/5'
                            }`}
                    >
                        {isToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: isCompletedToday ? 1 : 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </motion.div>
                        )}
                    </motion.button>

                    <div className="flex-1">
                        <h3 className={`font-semibold text-sm transition-colors ${isCompletedToday ? 'text-primary line-through opacity-70' : 'text-text-primary'}`}>
                            {routine.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <motion.div
                                animate={{ scale: isCompletedToday ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-md"
                            >
                                <Flame className="h-3 w-3 fill-current" />
                                <span>{routine.currentStreak} يوم</span>
                            </motion.div>
                            {routine.bestStreak > 0 && routine.bestStreak > routine.currentStreak && (
                                <span className="text-xs text-text-tertiary px-1.5 py-0.5 rounded-md bg-surface-2">
                                    أفضل: {routine.bestStreak}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Link href={`/routines/${routine.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-text-tertiary hover:text-primary" aria-label="تعديل">
                                <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-text-tertiary hover:text-error"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            aria-label="حذف"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>

                    {/* Success indicator */}
                    {isCompletedToday && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-primary"
                        >
                            <Sparkles className="h-5 w-5" />
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

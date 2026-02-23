"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Button, Badge } from "@/components/ui/components";
import { Plus, Target, Calendar, Trophy, ChevronRight, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Goal {
    id: string;
    title: string;
    description: string | null;
    status: string;
    progress: number;
    endDate: Date | null;
}

interface GoalsViewProps {
    goals: Goal[];
}

export default function GoalsView({ goals: initialGoals }: GoalsViewProps) {
    const router = useRouter();
    const [goals, setGoals] = useState(initialGoals);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleDelete = async (goalId: string) => {
        const goalToDelete = goals.find(g => g.id === goalId);
        if (!goalToDelete) return;

        // Optimistic update
        setGoals(prev => prev.filter(g => g.id !== goalId));

        try {
            const res = await fetch(`/api/goals/${goalId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete goal");
            }

            setSuccess("تم حذف الهدف بنجاح");
            setTimeout(() => setSuccess(null), 2000);
            router.refresh();
        } catch (err) {
            // Revert on error
            setGoals(prev => [...prev, goalToDelete]);
            setError("فشل حذف الهدف");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleUpdateProgress = async (goalId: string, progress: number) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        // Optimistic update
        setGoals(prev => prev.map(g =>
            g.id === goalId ? { ...g, progress, status: progress >= 100 ? 'completed' : g.status } : g
        ));

        try {
            const res = await fetch(`/api/goals/${goalId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    progress,
                    status: progress >= 100 ? 'completed' : 'in_progress'
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update goal");
            }

            if (progress >= 100) {
                setSuccess("🎉 مبروك! تم إنجاز الهدف");
                setTimeout(() => setSuccess(null), 3000);
            }

            router.refresh();
        } catch (err) {
            // Revert on error
            setGoals(prev => prev.map(g =>
                g.id === goalId ? goal : g
            ));
            setError("فشل تحديث الهدف");
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
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg"
                    >
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
                        الأهداف
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary mt-1"
                    >
                        تتبع تقدمك نحو أحلامك الكبيرة.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/goals/new">
                        <Button className="gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 bg-accent hover:bg-accent-dark text-white">
                            <Plus className="h-4 w-4" />
                            هدف جديد
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {goals.map((goal, i) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            index={i}
                            onDelete={handleDelete}
                            onUpdateProgress={handleUpdateProgress}
                        />
                    ))}
                </AnimatePresence>

                {goals.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full h-64 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-text-tertiary gap-4 bg-surface-1/30"
                    >
                        <div className="p-4 rounded-full bg-surface-2">
                            <Target className="h-8 w-8 text-text-tertiary" />
                        </div>
                        <p className="text-lg font-medium">لا توجد أهداف نشطة حالياً</p>
                        <Link href="/goals/new">
                            <Button variant="outline">ابدأ الآن</Button>
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

function GoalCard({
    goal,
    index,
    onDelete,
    onUpdateProgress
}: {
    goal: Goal;
    index: number;
    onDelete: (id: string) => void;
    onUpdateProgress: (id: string, progress: number) => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        await onDelete(goal.id);
    };

    const handleProgressClick = () => {
        // Simple increment by 10%
        const newProgress = Math.min(100, goal.progress + 10);
        onUpdateProgress(goal.id, newProgress);
    };

    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            whileHover={{ scale: 1.02 }}
            className="group"
        >
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-surface-0 card-hover overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Target className="h-32 w-32" />
                </div>

                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="p-2 rounded-xl bg-accent/10 w-fit">
                                <Target className="h-5 w-5 text-accent" />
                            </div>
                            <Badge variant={goal.status === 'completed' ? 'success' : 'outline'}>
                                {goal.status === 'completed' ? 'مكتمل' : 'نشط'}
                            </Badge>
                        </div>
                        <h3 className="font-bold text-xl leading-tight text-text-primary group-hover:text-accent transition-colors">
                            {goal.title}
                        </h3>
                        {goal.description && (
                            <p className="text-sm text-text-secondary line-clamp-2">
                                {goal.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 relative z-10">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-text-secondary">التقدم</span>
                            <span className="text-accent">{goal.progress}%</span>
                        </div>
                        <div
                            className="h-3 w-full bg-surface-2 rounded-full overflow-hidden cursor-pointer"
                            onClick={handleProgressClick}
                            title="انقر لزيادة التقدم"
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className="h-full bg-accent hover:bg-accent-light transition-colors relative"
                            >
                                {goal.progress < 100 && (
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                )}
                            </motion.div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm text-text-secondary relative z-10">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {goal.endDate ? (
                                <span>{format(new Date(goal.endDate), "d MMM yyyy", { locale: ar })}</span>
                            ) : (
                                <span>مفتوح</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={`/goals/${goal.id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-primary" aria-label="تعديل الهدف">
                                    <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-error"
                                aria-label="حذف الهدف"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                )}
                            </Button>
                            <Link href={`/goals/${goal.id}`} className="flex items-center gap-1 hover:text-accent transition-colors">
                                <span>التفاصيل</span>
                                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

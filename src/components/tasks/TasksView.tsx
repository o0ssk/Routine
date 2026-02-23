"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Button, Badge } from "@/components/ui/components";
import { Plus, Calendar, Circle, CheckCircle2, Clock, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: string;
    urgency: string;
    dueDate: Date | null;
}

interface TasksViewProps {
    tasks: Task[];
}

export default function TasksView({ tasks: initialTasks }: TasksViewProps) {
    const router = useRouter();
    const [tasks, setTasks] = useState(initialTasks);
    const [error, setError] = useState<string | null>(null);

    const sections = [
        {
            id: "urgent",
            title: "عاجل ومهم",
            tasks: tasks.filter(t => t.urgency === "urgent" && t.status !== "completed"),
            color: "text-red-500",
            bg: "bg-red-500/10",
            border: "border-red-500/20"
        },
        {
            id: "important",
            title: "مهم",
            tasks: tasks.filter(t => t.urgency === "important" && t.status !== "completed"),
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        },
        {
            id: "normal",
            title: "عادي",
            tasks: tasks.filter(t => t.urgency === "normal" && t.status !== "completed"),
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
    ];

    const handleComplete = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = task.status === "completed" ? "not_started" : "completed";

        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ));

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                throw new Error("Failed to update task");
            }

            router.refresh();
        } catch (err) {
            // Revert on error
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status: task.status } : t
            ));
            setError("فشل تحديث المهمة");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleDelete = async (taskId: string) => {
        const taskToDelete = tasks.find(t => t.id === taskId);
        if (!taskToDelete) return;

        // Optimistic update
        setTasks(prev => prev.filter(t => t.id !== taskId));

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete task");
            }

            router.refresh();
        } catch (err) {
            // Revert on error
            setTasks(prev => [...prev, taskToDelete]);
            setError("فشل حذف المهمة");
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

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Error Toast */}
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
            </AnimatePresence>

            <div className="flex items-center justify-between">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight text-text-primary"
                    >
                        المهام
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-text-secondary mt-1"
                    >
                        لديك {tasks.filter(t => t.status !== "completed").length} مهام نشطة. ركز على ما يهم.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/tasks/new">
                        <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                            <Plus className="h-4 w-4" />
                            مهمة جديدة
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-3 flex-1 items-start"
            >
                {sections.map((section) => (
                    <motion.div
                        key={section.id}
                        variants={item}
                        className={`space-y-4 rounded-3xl bg-surface-1/50 p-4 border ${section.border} h-full min-h-[500px]`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${section.bg.replace('/10', '')}`} />
                                <h2 className={`font-bold ${section.color}`}>{section.title}</h2>
                            </div>
                            <span className="text-xs font-mono bg-surface-2 px-2 py-1 rounded-lg text-text-secondary">
                                {section.tasks.length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {section.tasks.map((task, i) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={i}
                                        onComplete={handleComplete}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </AnimatePresence>

                            {section.tasks.length === 0 && (
                                <Link href="/tasks/new">
                                    <div className="h-32 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-text-tertiary gap-2 transition-colors hover:border-primary/30 hover:bg-primary/5 cursor-pointer group">
                                        <div className="p-3 rounded-full bg-surface-2 group-hover:bg-primary/10 transition-colors">
                                            <Plus className="h-5 w-5 text-text-tertiary group-hover:text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">إضافة مهمة سريعة</span>
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

function TaskCard({ task, index, onComplete, onDelete }: {
    task: Task;
    index: number;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const [isCompleting, setIsCompleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleComplete = async () => {
        if (isCompleting) return;
        setIsCompleting(true);
        await onComplete(task.id);
        setIsCompleting(false);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        await onDelete(task.id);
        // Don't set false - card will unmount
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, scale: isDeleting ? 0.9 : 1 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
        >
            <Card className="cursor-pointer border-none shadow-sm hover:shadow-md transition-all bg-surface-0 card-hover overflow-hidden relative">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.urgency === 'urgent' ? 'bg-red-500' :
                    task.urgency === 'important' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleComplete}
                            disabled={isCompleting}
                            aria-label={task.status === 'completed' ? "تم الإنجاز" : "إنجاز المهمة"}
                            className="mt-0.5 h-6 w-6 p-0 text-text-tertiary hover:text-primary transition-colors rounded-full hover:bg-primary/10"
                        >
                            {isCompleting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
                                />
                            ) : task.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <Circle className="h-5 w-5" />
                            )}
                        </Button>
                        <div className="space-y-1 flex-1">
                            <p className={`font-semibold text-sm leading-tight group-hover:text-primary transition-colors ${task.status === 'completed' ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
                                {task.title}
                            </p>
                            {task.description && (
                                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pl-1">
                        {task.dueDate ? (
                            <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' : 'bg-surface-2 text-text-secondary'
                                }`}>
                                <Clock className="h-3 w-3" />
                                <span>{format(new Date(task.dueDate), "d MMM", { locale: ar })}</span>
                            </div>
                        ) : (
                            <div />
                        )}

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Link href={`/tasks/${task.id}/edit`}>
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
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

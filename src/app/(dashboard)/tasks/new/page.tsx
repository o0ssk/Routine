"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Label, Textarea, Select } from "@/components/ui/components";
import { ArrowRight, Calendar, Flag, Tag, Save, Loader2, Sparkles } from "lucide-react";

export default function NewTaskPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("normal");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("يرجى إدخال عنوان المهمة");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    urgency: priority,
                    dueDate: dueDate || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || "فشل إنشاء المهمة");
            }

            router.push("/tasks");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg shadow-primary/20 text-white">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">مهمة جديدة</h1>
                        <p className="text-text-secondary">أضف مهمة جديدة إلى قائمة إنجازاتك.</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl bg-surface-0/80 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">عنوان المهمة</Label>
                                <Input
                                    id="title"
                                    placeholder="ما الذي تريد إنجازه؟"
                                    className="text-lg py-6"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">التفاصيل</Label>
                                <Textarea
                                    id="description"
                                    placeholder="أضف وصفاً أو ملاحظات إضافية..."
                                    className="min-h-[120px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>الأولوية</Label>
                                    <Select
                                        icon={<Flag className="h-4 w-4" />}
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="urgent">🔴 عاجل</option>
                                        <option value="important">🟡 مهم</option>
                                        <option value="normal">🟢 عادي</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>تاريخ الاستحقاق (اختياري)</Label>
                                    <Input
                                        type="date"
                                        icon={<Calendar className="h-4 w-4" />}
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1 gap-2 shadow-lg shadow-primary/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {loading ? "جاري الحفظ..." : "حفظ المهمة"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="flex-none"
                                    onClick={() => router.back()}
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

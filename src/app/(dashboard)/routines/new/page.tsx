"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Input, Button, Label, Textarea, Select } from "@/components/ui/components";
import { Zap, Clock, Repeat, Save, Loader2, Sparkles } from "lucide-react";

export default function NewRoutinePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("morning");
    const [frequency, setFrequency] = useState("daily");
    const [time, setTime] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("يرجى إدخال اسم العادة");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/routines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    type,
                    time: time || null,
                    repeatDays: frequency,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || "فشل إنشاء العادة");
            }

            router.push("/routines");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">عادة جديدة</h1>
                        <p className="text-text-secondary">ابنِ عادات إيجابية تدوم مدى الحياة.</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl bg-surface-0/80 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">اسم العادة</Label>
                                <Input
                                    id="title"
                                    placeholder="مثال: قراءة كتاب، ممارسة الرياضة..."
                                    className="text-lg py-6"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                    icon={<Sparkles className="h-5 w-5" />}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>التكرار</Label>
                                    <Select
                                        icon={<Repeat className="h-4 w-4" />}
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <option value="daily">يومياً</option>
                                        <option value="weekly">أسبوعياً</option>
                                        <option value="weekdays">أيام العمل</option>
                                        <option value="weekends">عطلة نهاية الأسبوع</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>وقت التنفيذ</Label>
                                    <Select
                                        icon={<Clock className="h-4 w-4" />}
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="morning">🌅 الصباح</option>
                                        <option value="afternoon">☀️ الظهيرة</option>
                                        <option value="evening">🌙 المساء</option>
                                        <option value="anytime">✨ أي وقت</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">الوقت المحدد (اختياري)</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    icon={<Clock className="h-4 w-4" />}
                                />
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1 gap-2 shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {loading ? "جاري الحفظ..." : "حفظ العادة"}
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

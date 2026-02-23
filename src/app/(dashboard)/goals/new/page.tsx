"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, Input, Button, Label, Textarea, Select } from "@/components/ui/components";
import { Target, Calendar, Save, Loader2, Trophy } from "lucide-react";

export default function NewGoalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [type, setType] = useState("short");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("يرجى إدخال اسم الهدف");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || null,
                    type,
                    endDate: targetDate || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || "فشل إنشاء الهدف");
            }

            router.push("/goals");
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
                    <div className="p-3 bg-gradient-to-br from-accent to-orange-500 rounded-2xl shadow-lg shadow-accent/20 text-white">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">هدف جديد</h1>
                        <p className="text-text-secondary">حدد وجهتك القادمة وحقق أحلامك.</p>
                    </div>
                </div>

                <Card className="border-none shadow-xl bg-surface-0/80 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">اسم الهدف</Label>
                                <Input
                                    id="title"
                                    placeholder="مثال: تعلم لغة جديدة، توفير مبلغ..."
                                    className="text-lg py-6"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                    icon={<Target className="h-5 w-5" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">وصف الهدف (اختياري)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="لماذا تريد تحقيق هذا الهدف؟"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>تاريخ التحقيق المتوقع</Label>
                                    <Input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        icon={<Calendar className="h-4 w-4" />}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>الفئة</Label>
                                    <Select>
                                        <option value="personal">شخصي</option>
                                        <option value="work">عمل</option>
                                        <option value="health">صحة</option>
                                        <option value="finance">مالية</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="flex-1 gap-2 shadow-lg shadow-accent/20 bg-accent hover:bg-accent-dark text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    {loading ? "جاري الحفظ..." : "حفظ الهدف"}
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

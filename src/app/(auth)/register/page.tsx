"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                const data = await res.json();
                alert(data.message || "فشل التسجيل"); // Simple alert for now, can be upgraded to toast
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
        >
            <Card variant="glass" className="overflow-hidden border-none shadow-2xl shadow-accent/10 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                <CardHeader className="text-center space-y-3 pb-2">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mb-2"
                    >
                        <div className="p-3 rounded-full bg-accent/10">
                            <Sparkles className="h-6 w-6 text-accent" />
                        </div>
                    </motion.div>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                        انضم إلينا
                    </CardTitle>
                    <p className="text-text-secondary text-sm">ابدأ رحلتك نحو الأفضل اليوم</p>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="name">الاسم الكامل</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="مثال: أحمد محمد"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                icon={<User className="h-4 w-4" />}
                                className="bg-surface-1/50 border-transparent focus:bg-surface-0 transition-colors"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                icon={<Mail className="h-4 w-4" />}
                                className="bg-surface-1/50 border-transparent focus:bg-surface-0 transition-colors"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                icon={<Lock className="h-4 w-4" />}
                                className="bg-surface-1/50 border-transparent focus:bg-surface-0 transition-colors"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                className="w-full text-base py-6 shadow-lg shadow-accent/25 hover:shadow-accent/40 bg-accent hover:bg-accent-dark text-white"
                                variant="default" // Using default but customized via className and global tokens
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        إنشاء الحساب <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center space-y-4 pt-2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/50"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-surface-0 px-2 text-text-tertiary">أو</span>
                                </div>
                            </div>

                            <div className="text-sm text-text-secondary">
                                لديك حساب بالفعل؟{" "}
                                <Link href="/login" className="font-semibold text-accent hover:text-primary transition-colors hover:underline">
                                    سجل دخولك
                                </Link>
                            </div>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

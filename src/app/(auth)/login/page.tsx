"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                // Fallback if toast isn't available, but attempting to use a premium notification pattern if possible
                console.error(result.error);
                alert("فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
            } else {
                router.push("/dashboard");
                router.refresh();
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
            <Card variant="glass" className="overflow-hidden border-none shadow-2xl shadow-primary/10 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <CardHeader className="text-center space-y-3 pb-2">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            مرحباً بك
                        </CardTitle>
                    </motion.div>
                    <p className="text-text-secondary text-sm">أدخل بياناتك للمتابعة إلى لوحة التحكم</p>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
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
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">كلمة المرور</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-primary hover:text-accent transition-colors font-medium"
                                    >
                                        نسيت كلمة المرور؟
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    icon={<Lock className="h-4 w-4" />}
                                    className="bg-surface-1/50 border-transparent focus:bg-surface-0 transition-colors"
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                type="submit"
                                className="w-full text-base py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                                variant="glow"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        تسجيل الدخول <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
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
                                ليس لديك حساب؟{" "}
                                <Link href="/register" className="font-semibold text-primary hover:text-accent transition-colors hover:underline">
                                    أنشئ حساباً الآن
                                </Link>
                            </div>
                        </motion.div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}

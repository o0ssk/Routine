"use client";

import Link from "next/link";
import { Button } from "@/components/ui/components";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background overflow-hidden relative">
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -50, 0],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[80px]"
            />

            <div className="relative z-10 text-center space-y-8 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="relative inline-block"
                >
                    <h1 className="text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-surface-2 to-background leading-none select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-0/80 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 shadow-xl"
                    >
                        <Compass className="h-16 w-16 text-primary mx-auto mb-2 animate-pulse" />
                    </motion.div>
                </motion.div>

                <div className="space-y-4 max-w-md mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-text-primary"
                    >
                        يبدو أنك ضللت الطريق
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-text-secondary"
                    >
                        الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لكن لا تقلق، يمكنك العودة دائماً إلى البداية.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/">
                        <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-full h-14 px-8 text-lg">
                            <Home className="h-5 w-5" />
                            العودة للرئيسية
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

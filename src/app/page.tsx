"use client";

import Link from "next/link";
import { Button } from "@/components/ui/components";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CheckCircle, LayoutDashboard, Target, Zap, Star, Shield, Smartphone, Globe } from "lucide-react";
import { useRef } from "react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-white overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <header className="px-6 lg:px-12 h-20 flex items-center justify-between fixed w-full z-50 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5 transition-all">
        <Link className="flex items-center gap-3 group" href="#">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-glow transition-transform group-hover:scale-105">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary-light transition-colors">Routine Master</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register">
            <Button className="rounded-full px-8 bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all font-bold">
              ابدأ مجاناً
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-light mb-4 shadow-glow">
              <Star className="h-4 w-4 fill-current" />
              <span>الإصدار الجديد 2.0 متاح الآن</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              نظم حياتك، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-accent animate-gradient-x">حقق المستحيل.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed">
              المنصة العربية الأولى لإدارة العادات، المهام، والأهداف الشخصية.
              تجربة مستخدم عالمية مصممة لزيادة إنتاجيتك 10x.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/register">
                <Button size="xl" className="h-14 px-10 text-lg rounded-full bg-primary hover:bg-primary-dark shadow-glow hover:shadow-primary/50 transition-all">
                  ابدأ رحلتك الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4 sm:mt-0">لا تتطلب بطاقة ائتمان • باقة مجانية للأبد</p>
            </div>
          </motion.div>

          {/* 3D App Interface Mockup */}
          <motion.div
            style={{ y: y1, rotateX: 20 }}
            initial={{ opacity: 0, scale: 0.8, rotateX: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 25 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 relative w-full max-w-6xl mx-auto perspective-1000"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-primary/20 overflow-hidden transform-style-3d rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>
              {/* Mockup Body Content Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 grid grid-cols-4 gap-6">
                <div className="col-span-1 h-full rounded-xl bg-white/5 border border-white/5" />
                <div className="col-span-3 h-full grid grid-rows-3 gap-6">
                  <div className="row-span-1 flex gap-6">
                    <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20" />
                    <div className="flex-1 rounded-xl bg-white/5 border border-white/5" />
                    <div className="flex-1 rounded-xl bg-white/5 border border-white/5" />
                  </div>
                  <div className="row-span-2 rounded-xl bg-white/5 border border-white/5" />
                </div>
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* Features Grid (Bento) */}
        <section className="w-full py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">كل ما تحتاجه <span className="text-secondary">للنجاح</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Feature 1 - Large */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all" />
                <div>
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">تخطيط استراتيجي للأهداف</h3>
                  <p className="text-gray-400 max-w-md">حول أحلامك الكبيرة إلى خطوات صغيرة قابلة للتنفيذ. تتبع تقدمك بدقة واحتفل بكل إنجاز.</p>
                </div>
                <div className="w-full h-32 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border border-white/5 mt-4 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-primary/40 w-1/2 rounded-r-xl" />
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-1 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group"
              >
                <Zap className="h-10 w-10 text-accent mb-4" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">تتبع العادات</h3>
                  <p className="text-gray-400">ابنِ عادات تدوم مع نظام الستريك المحفز.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center ${i < 4 ? 'bg-accent text-black font-bold' : 'bg-white/10'}`}>
                      {i < 4 ? <CheckCircle className="h-4 w-4" /> : null}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-1 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group"
              >
                <Globe className="h-10 w-10 text-secondary mb-4" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">متاح أينما كنت</h3>
                  <p className="text-gray-400">تزامن فوري بين جميع أجهزتك.</p>
                </div>
              </motion.div>

              {/* Feature 4 - Large */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group relative overflow-hidden"
              >
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-secondary/20 blur-[80px] rounded-full group-hover:bg-secondary/30 transition-all" />
                <div>
                  <Shield className="h-10 w-10 text-secondary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">خصوصية وأمان تام</h3>
                  <p className="text-gray-400 max-w-md">بياناتك مشفرة ومحمية. نحن نؤمن بأن خصوصيتك هي أولويتنا القصوى.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">هل أنت مستعد لتغيير حياتك؟</h2>
            <p className="text-xl text-gray-400">انضم إلى الآلاف من المستخدمين الذين يحققون أهدافهم يومياً.</p>
            <Link href="/register">
              <Button size="xl" className="h-16 px-12 text-xl rounded-full bg-white text-black hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300">
                ابدأ الآن - مجاناً
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/5 bg-[#020617] text-center text-gray-500 text-sm relative z-10">
        <p>© 2026 Routine Master. صممت بكل ❤️ لزيادة إنتاجيتك.</p>
      </footer>
    </div>
  );
}

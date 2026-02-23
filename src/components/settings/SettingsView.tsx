"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Switch, Separator } from "@/components/ui/components";
import { User, Bell, Shield, Moon, Sun, LogOut, Save, Trash2, Globe, Loader2, Upload, AlertTriangle, Check } from "lucide-react";
import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";

interface SettingsViewProps {
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
    initialSettings: {
        theme?: string;
        language?: string;
        emailNotifications?: boolean;
    };
}

export default function SettingsView({ user, initialSettings }: SettingsViewProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

    const [name, setName] = useState(user.name || "");
    const [notifications, setNotifications] = useState(initialSettings?.emailNotifications ?? true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [profileImage, setProfileImage] = useState(user.image);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim() || null,
                    emailNotifications: notifications,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to save settings");
            }

            setSuccess(language === 'ar' ? "تم حفظ التغييرات بنجاح" : "Settings saved successfully");
            setTimeout(() => setSuccess(null), 3000);
            router.refresh();
        } catch (err) {
            setError(language === 'ar' ? "فشل حفظ التغييرات" : "Failed to save settings");
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleThemeToggle = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    const handleLanguageChange = (newLang: 'ar' | 'en') => {
        setLanguage(newLang);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.text();
                throw new Error(data || "Failed to upload image");
            }

            const data = await res.json();
            setProfileImage(data.imageUrl);
            setSuccess(language === 'ar' ? "تم تحديث الصورة بنجاح" : "Avatar updated successfully");
            setTimeout(() => setSuccess(null), 3000);
            router.refresh();
        } catch (err: any) {
            setError(err.message || (language === 'ar' ? "فشل رفع الصورة" : "Failed to upload image"));
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const res = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirm: 'DELETE_MY_ACCOUNT' }),
            });

            if (!res.ok) {
                throw new Error("Failed to delete account");
            }

            // Sign out and redirect
            await signOut({ redirect: false });
            router.push('/');
        } catch (err) {
            setError(language === 'ar' ? "فشل حذف الحساب" : "Failed to delete account");
            setTimeout(() => setError(null), 3000);
            setIsDeleting(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Toasts */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <Check className="h-4 w-4" />
                        {success}
                    </motion.div>
                )}
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface-0 rounded-2xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-4"
                        >
                            <div className="flex items-center gap-3 text-error">
                                <AlertTriangle className="h-6 w-6" />
                                <h3 className="text-lg font-bold">
                                    {language === 'ar' ? 'تأكيد حذف الحساب' : 'Confirm Account Deletion'}
                                </h3>
                            </div>
                            <p className="text-text-secondary">
                                {language === 'ar'
                                    ? 'هل أنت متأكد أنك تريد حذف حسابك؟ سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.'
                                    : 'Are you sure you want to delete your account? All your data will be permanently deleted and this action cannot be undone.'}
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                >
                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 ml-2" />
                                    )}
                                    {isDeleting
                                        ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                                        : (language === 'ar' ? 'حذف نهائياً' : 'Delete Permanently')}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        {language === 'ar' ? 'الإعدادات' : 'Settings'}
                    </h1>
                    <p className="text-text-secondary mt-1">
                        {language === 'ar' ? 'إدارة حسابك وتفضيلات التطبيق.' : 'Manage your account and preferences.'}
                    </p>
                </div>
                <Button
                    type="button"
                    className="gap-2 shadow-lg shadow-primary/20"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {isSaving
                        ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                        : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
                </Button>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {/* Profile Section */}
                <motion.div variants={sectionVariants}>
                    <Card className="overflow-hidden bg-surface-0 border-none shadow-md">
                        <CardHeader className="bg-surface-1/50 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg">
                                    {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-lg shadow-primary/20">
                                    <div className="h-full w-full rounded-full bg-surface-0 flex items-center justify-center overflow-hidden">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-text-tertiary" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                        ) : (
                                            <Upload className="h-4 w-4 ml-2" />
                                        )}
                                        {isUploading
                                            ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...')
                                            : (language === 'ar' ? 'تغيير الصورة' : 'Change Photo')}
                                    </Button>
                                    <p className="text-xs text-text-tertiary">JPG, GIF or PNG. Max size 2MB</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        icon={<User className="h-4 w-4" />}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                                    <Input defaultValue={user.email || ""} disabled icon={<User className="h-4 w-4" />} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Appearance Section */}
                <motion.div variants={sectionVariants}>
                    <Card className="bg-surface-0 border-none shadow-md">
                        <CardHeader className="bg-surface-1/50 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    {resolvedTheme === 'dark' ? (
                                        <Moon className="h-5 w-5 text-indigo-500" />
                                    ) : (
                                        <Sun className="h-5 w-5 text-orange-500" />
                                    )}
                                </div>
                                <CardTitle className="text-lg">
                                    {language === 'ar' ? 'المظهر' : 'Appearance'}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-text-primary">
                                        {language === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}
                                    </Label>
                                    <p className="text-xs text-text-tertiary">
                                        {language === 'ar' ? 'استخدم ألوان داكنة لراحة العين.' : 'Use dark colors for eye comfort.'}
                                    </p>
                                </div>
                                <Switch
                                    checked={resolvedTheme === 'dark'}
                                    onCheckedChange={handleThemeToggle}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-text-primary">
                                        {language === 'ar' ? 'اللغة' : 'Language'}
                                    </Label>
                                    <p className="text-xs text-text-tertiary">
                                        {language === 'ar' ? 'لغة واجهة التطبيق.' : 'Interface language.'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={language === 'ar' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleLanguageChange('ar')}
                                        className="min-w-[80px]"
                                    >
                                        العربية
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={language === 'en' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleLanguageChange('en')}
                                        className="min-w-[80px]"
                                    >
                                        English
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Notifications Section */}
                <motion.div variants={sectionVariants}>
                    <Card className="bg-surface-0 border-none shadow-md">
                        <CardHeader className="bg-surface-1/50 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-500/10">
                                    <Bell className="h-5 w-5 text-yellow-500" />
                                </div>
                                <CardTitle className="text-lg">
                                    {language === 'ar' ? 'التنبيهات' : 'Notifications'}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-text-primary">
                                        {language === 'ar' ? 'تنبيهات البريد' : 'Email Notifications'}
                                    </Label>
                                    <p className="text-xs text-text-tertiary">
                                        {language === 'ar' ? 'الحصول على إشعارات عند حلول موعد المهام.' : 'Get notified when tasks are due.'}
                                    </p>
                                </div>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Danger Zone */}
                <motion.div variants={sectionVariants}>
                    <Card className="border-error/20 bg-error/5 shadow-none">
                        <CardHeader className="border-b border-error/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-error/10">
                                    <Shield className="h-5 w-5 text-error" />
                                </div>
                                <CardTitle className="text-lg text-error">
                                    {language === 'ar' ? 'منطقة الخطر' : 'Danger Zone'}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-text-primary">
                                        {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                                    </h4>
                                    <p className="text-xs text-text-secondary">
                                        {language === 'ar' ? 'إنهاء الجلسة الحالية.' : 'End your current session.'}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className="text-error hover:text-error hover:bg-error/10 border-error/20"
                                >
                                    <LogOut className="h-4 w-4 ml-2" />
                                    {language === 'ar' ? 'خروج' : 'Sign Out'}
                                </Button>
                            </div>
                            <Separator className="bg-error/10" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-text-primary">
                                        {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
                                    </h4>
                                    <p className="text-xs text-text-secondary">
                                        {language === 'ar' ? 'إزالة جميع بياناتك نهائياً.' : 'Permanently remove all your data.'}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <Trash2 className="h-4 w-4 ml-2" />
                                    {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </motion.div>
        </div>
    );
}
